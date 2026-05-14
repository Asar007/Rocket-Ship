#!/usr/bin/env node
/**
 * Compress a video to a web-friendly H.264/AAC MP4 with faststart.
 * Usage: node scripts/compress-video.mjs <input> [output]
 */
import { execFileSync } from 'node:child_process'
import { statSync, renameSync } from 'node:fs'
import { resolve, basename, dirname, join } from 'node:path'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'

const [, , inputArg, outputArg] = process.argv

if (!inputArg) {
  console.error('Usage: node scripts/compress-video.mjs <input> [output]')
  process.exit(1)
}

const input = resolve(inputArg)
const output =
  outputArg !== undefined
    ? resolve(outputArg)
    : join(dirname(input), basename(input, '.mp4') + '.compressed.mp4')

const before = statSync(input).size

console.log('Encoding...')
console.log('  ffmpeg :', ffmpegInstaller.path)
console.log('  input  :', input, `(${(before / 1024 / 1024).toFixed(1)} MB)`)
console.log('  output :', output)

execFileSync(
  ffmpegInstaller.path,
  [
    '-y',
    '-i', input,
    '-c:v', 'libx264',
    '-preset', 'medium',
    '-crf', '24',
    '-vf', "scale='min(1280,iw)':-2",
    '-c:a', 'aac',
    '-b:a', '96k',
    '-movflags', '+faststart',
    output,
  ],
  { stdio: 'inherit' },
)

const after = statSync(output).size
const saving = (1 - after / before) * 100

console.log()
console.log(`Compressed: ${(before / 1024 / 1024).toFixed(1)} MB → ${(after / 1024 / 1024).toFixed(1)} MB (${saving.toFixed(0)}% smaller)`)
