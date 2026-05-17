/**
 * Capsule frame cleanup pipeline.
 *  1. De-duplicate exact consecutive frames (ezgif GIF padding).
 *  2. Build a perfect palindrome loop: assembled -> fully-exploded ->
 *     (same frames reversed) -> assembled. This drops the unresolved
 *     tail (~190-240, which never reassembles) and guarantees a
 *     seamless, perfectly symmetric reassembly + loop.
 *  3. Mask the bottom-right "Veo" watermark with the mirrored
 *     bottom-left background corner (symmetric vignette -> seamless).
 *
 * Source of truth: /images (untouched original).
 * Output: /public/capsule (regenerated, sequentially numbered).
 */
import sharp from 'sharp'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, rmSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const SRC = 'images'
const OUT = 'public/capsule'
const APEX_TARGET = 150 // original frame nearest the fullest exploded view

// Watermark cover box + mirrored source patch (1920x1080 frames).
const WM = { left: 1736, top: 992, width: 184, height: 88 }
const PATCH = { left: 0, top: 992, width: 184, height: 88 }

const files = readdirSync(SRC)
  .filter((f) => /^ezgif-frame-\d+\.jpg$/.test(f))
  .sort()

// 1a. de-dupe by exact file content (drops byte-identical GIF padding)
const deduped = []
let lastHash = null
for (const f of files) {
  const buf = readFileSync(join(SRC, f))
  const h = createHash('sha1').update(buf).digest('hex')
  if (h !== lastHash) {
    deduped.push(f)
    lastHash = h
  }
}

// 1b. perceptual de-dupe: GIF re-encoding leaves frames that look
// identical but differ by a few JPEG bytes (so 1a misses them). Compare
// a 96x54 grayscale signature against the last KEPT frame and drop the
// candidate if it has not visibly moved. Comparing to the last *kept*
// frame (not the immediate predecessor) lets slow exploded-view motion
// accumulate and survive, while genuinely stuck frames never accumulate
// and are removed.
const PERCEPTUAL_THRESHOLD = 0.35 // mean per-pixel delta (0..255)
const sig = (f) =>
  sharp(join(SRC, f))
    .grayscale()
    .resize(96, 54, { fit: 'fill' })
    .raw()
    .toBuffer()
const cleaned = []
let lastSig = null
for (const f of deduped) {
  const s = await sig(f)
  if (lastSig) {
    let acc = 0
    for (let i = 0; i < s.length; i++) acc += Math.abs(s[i] - lastSig[i])
    if (acc / s.length < PERCEPTUAL_THRESHOLD) continue
  }
  cleaned.push(f)
  lastSig = s
}

// 2. apex = cleaned frame whose original number is closest to APEX_TARGET
const num = (f) => parseInt(f.match(/(\d+)/)[1], 10)
let apex = 0
for (let i = 0; i < cleaned.length; i++) {
  if (
    Math.abs(num(cleaned[i]) - APEX_TARGET) <
    Math.abs(num(cleaned[apex]) - APEX_TARGET)
  )
    apex = i
}
// Desktop = disassembly ONLY (assembled -> fully-exploded apex). The
// scroll maps the whole span onto this range so the capsule comes apart
// and stays apart — it must NOT reassemble. (No reversed/loop tail.)
const sequence = cleaned.slice(0, apex + 1)
const forward = sequence

// 3. regenerate output
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const patchBuf = await sharp(join(SRC, cleaned[apex]))
  .extract(PATCH)
  .flop()
  .toBuffer()

let i = 1
for (const f of sequence) {
  const name = `ezgif-frame-${String(i).padStart(3, '0')}.jpg`
  // The final (fully-exploded) frame is the held resting state, so its
  // softness/GIF speckle is the most visible. Give just that frame a
  // mild unsharp pass (no denoise — keeps rivets/seams) at slightly
  // higher quality. All other frames are untouched.
  const isLast = i === sequence.length
  let pipe = sharp(join(SRC, f)).composite([
    { input: patchBuf, left: WM.left, top: WM.top },
  ])
  if (isLast) pipe = pipe.sharpen({ sigma: 0.9, m1: 0.5, m2: 2.4 })
  await pipe
    // Near-lossless re-encode: the watermark composite forces a re-save,
    // so use q95 + full 4:4:4 chroma to avoid adding a visible second
    // generation of JPEG/chroma loss on top of the original source.
    .jpeg({
      quality: isLast ? 96 : 95,
      chromaSubsampling: '4:4:4',
      mozjpeg: true,
    })
    .toFile(join(OUT, name))
  i++
}

// --- mobile set: forward only (assembled → exploded), every 2nd frame,
//     960px wide WebP. ~80% lighter for phones. ---
const OUT_SM = 'public/capsule-sm'
rmSync(OUT_SM, { recursive: true, force: true })
mkdirSync(OUT_SM, { recursive: true })

const mobileSrc = []
for (let k = 0; k < forward.length; k += 2) mobileSrc.push(forward[k])
const lastFwd = forward[forward.length - 1]
if (mobileSrc[mobileSrc.length - 1] !== lastFwd) mobileSrc.push(lastFwd)

let m = 1
for (const f of mobileSrc) {
  const name = `ezgif-frame-${String(m).padStart(3, '0')}.webp`
  await sharp(join(SRC, f))
    .composite([{ input: patchBuf, left: WM.left, top: WM.top }])
    .resize({ width: 960 })
    .webp({ quality: 85 })
    .toFile(join(OUT_SM, name))
  m++
}

console.log(
  `source ${files.length} -> exact-deduped ${deduped.length} -> ` +
    `perceptual-cleaned ${cleaned.length} -> apex@orig${num(cleaned[apex])} -> ` +
    `desktop disassembly ${sequence.length} -> mobile ${mobileSrc.length} frames`,
)
