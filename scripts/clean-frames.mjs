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

// 1. de-dupe by exact file content
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

// 2. apex = deduped frame whose original number is closest to APEX_TARGET
const num = (f) => parseInt(f.match(/(\d+)/)[1], 10)
let apex = 0
for (let i = 0; i < deduped.length; i++) {
  if (
    Math.abs(num(deduped[i]) - APEX_TARGET) <
    Math.abs(num(deduped[apex]) - APEX_TARGET)
  )
    apex = i
}
const forward = deduped.slice(0, apex + 1)
const back = forward.slice(1, -1).reverse() // reassembly = reversed forward
const sequence = [...forward, ...back]

// 3. regenerate output
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const patchBuf = await sharp(join(SRC, deduped[apex]))
  .extract(PATCH)
  .flop()
  .toBuffer()

let i = 1
for (const f of sequence) {
  const name = `ezgif-frame-${String(i).padStart(3, '0')}.jpg`
  await sharp(join(SRC, f))
    .composite([{ input: patchBuf, left: WM.left, top: WM.top }])
    .jpeg({ quality: 84, mozjpeg: true })
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
    .webp({ quality: 72 })
    .toFile(join(OUT_SM, name))
  m++
}

console.log(
  `source ${files.length} -> deduped ${deduped.length} -> ` +
    `apex@orig${num(deduped[apex])} -> desktop loop ${sequence.length} -> ` +
    `mobile ${mobileSrc.length} frames`,
)
