#!/usr/bin/env node
/**
 * Compress a PNG/JPG with sharp. Preserves transparency for PNGs.
 *
 * Usage: node scripts/compress-image.mjs <input> [output] [maxWidth]
 */
import sharp from 'sharp'
import { statSync } from 'node:fs'
import { resolve, extname } from 'node:path'

const [, , inputArg, outputArg, maxWidthArg] = process.argv

if (!inputArg) {
  console.error('Usage: node scripts/compress-image.mjs <input> [output] [maxWidth]')
  process.exit(1)
}

const input = resolve(inputArg)
const output = resolve(outputArg ?? input.replace(extname(input), `.compressed${extname(input)}`))
const maxWidth = maxWidthArg ? parseInt(maxWidthArg, 10) : 512

const before = statSync(input).size
const meta = await sharp(input).metadata()
console.log('Input :', input)
console.log('  size       :', (before / 1024).toFixed(1), 'KB')
console.log('  dimensions :', meta.width, '×', meta.height)
console.log('  format     :', meta.format)
console.log()

const isPng = (meta.format || '').toLowerCase() === 'png'

const pipeline = sharp(input).resize({
  width: Math.min(maxWidth, meta.width ?? maxWidth),
  withoutEnlargement: true,
  fit: 'inside',
})

if (isPng) {
  // PNG with palette + quality keeps transparency while shrinking aggressively.
  pipeline.png({ palette: true, quality: 80, compressionLevel: 9, effort: 10 })
} else {
  pipeline.jpeg({ quality: 80, mozjpeg: true })
}

// If output === input, write to a temp file first so we don't truncate the source.
const tmp = output === input ? `${output}.tmp` : output
await pipeline.toFile(tmp)

if (tmp !== output) {
  const { renameSync } = await import('node:fs')
  renameSync(tmp, output)
}

const after = statSync(output).size
const newMeta = await sharp(output).metadata()
console.log('Output:', output)
console.log('  size       :', (after / 1024).toFixed(1), 'KB')
console.log('  dimensions :', newMeta.width, '×', newMeta.height)
console.log()
console.log(`Saved ${((1 - after / before) * 100).toFixed(0)}% — ${(before / 1024).toFixed(1)} KB → ${(after / 1024).toFixed(1)} KB`)
