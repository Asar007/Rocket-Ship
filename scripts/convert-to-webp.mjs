// One-time WebP conversion for the heaviest assets.
// Run with: node scripts/convert-to-webp.mjs
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const tasks = [
  // [ source, quality, lossless? ]
  ['public/about-hero.png', 90, false],
  ['public/textures/fair_clouds_4k.png', 82, false],
  ['public/textures/water_4k.png', 80, false],
  ['public/textures/2_no_clouds_4k.jpg', 85, false],
  ['public/textures/elev_bump_4k.jpg', 80, false],
]

// Also convert all project PNGs (high quality for photos)
const projectsDir = 'src/assets/projects'
for (const file of fs.readdirSync(projectsDir)) {
  if (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg')) {
    tasks.push([path.join(projectsDir, file), 88, false])
  }
}

let totalBefore = 0
let totalAfter = 0

for (const [src, quality, lossless] of tasks) {
  if (!fs.existsSync(src)) {
    console.log(`SKIP (not found): ${src}`)
    continue
  }
  const dst = src.replace(/\.(png|jpe?g)$/i, '.webp')
  const beforeBytes = fs.statSync(src).size

  await sharp(src)
    .webp({ quality, lossless, effort: 6 })
    .toFile(dst)

  const afterBytes = fs.statSync(dst).size
  totalBefore += beforeBytes
  totalAfter += afterBytes
  const pct = (((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1)
  const fmt = (b) =>
    b > 1024 * 1024
      ? `${(b / 1024 / 1024).toFixed(2)} MB`
      : `${(b / 1024).toFixed(0)} KB`
  console.log(`${src.padEnd(48)} ${fmt(beforeBytes).padStart(10)} -> ${fmt(afterBytes).padStart(10)}  (-${pct}%)`)
}

const fmtTotal = (b) => `${(b / 1024 / 1024).toFixed(2)} MB`
console.log('---')
console.log(
  `TOTAL: ${fmtTotal(totalBefore)} -> ${fmtTotal(totalAfter)}  (-${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`
)
