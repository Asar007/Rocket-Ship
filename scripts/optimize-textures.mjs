/**
 * One-off: re-encode the self-hosted Earth textures to 2K WebP.
 * 4096x2048 originals (~7.7 MB total) -> 2048x1024 WebP (~1.5 MB),
 * visually identical at the Hero canvas size. Clouds keeps alpha.
 *
 * Run: node scripts/optimize-textures.mjs
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'textures')

const jobs = [
  { in: '2_no_clouds_4k.jpg', out: '2_no_clouds_2k.webp', alpha: false },
  { in: 'elev_bump_4k.jpg', out: 'elev_bump_2k.webp', alpha: false },
  { in: 'water_4k.png', out: 'water_2k.webp', alpha: false },
  { in: 'fair_clouds_4k.png', out: 'fair_clouds_2k.webp', alpha: true },
]

for (const j of jobs) {
  const info = await sharp(join(dir, j.in))
    .resize(2048, 1024, { fit: 'fill' })
    .webp({ quality: 82, alphaQuality: j.alpha ? 90 : 100, effort: 5 })
    .toFile(join(dir, j.out))
  console.log(`${j.in} -> ${j.out}  ${(info.size / 1024).toFixed(0)} KB`)
}
