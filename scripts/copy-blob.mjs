#!/usr/bin/env node
/**
 * Copy an existing Vercel Blob to a new pathname.
 * Useful for renaming or for forcing a fresh URL (cache-bust).
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=... node scripts/copy-blob.mjs <fromUrl> <toPathname> [--delete]
 */
import { copy, del } from '@vercel/blob'

const args = process.argv.slice(2)
const from = args[0]
const to = args[1]
const deleteSource = args.includes('--delete')

if (!from || !to) {
  console.error('Usage: node scripts/copy-blob.mjs <fromUrl> <toPathname> [--delete]')
  process.exit(1)
}

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN')
  process.exit(1)
}

console.log('Copying...')
console.log('  from :', from)
console.log('  to   :', to)

const result = await copy(from, to, {
  access: 'public',
  token,
  addRandomSuffix: false,
  allowOverwrite: true,
})

console.log()
console.log('Copied.')
console.log('  URL :', result.url)

if (deleteSource) {
  console.log()
  console.log('Deleting source...')
  await del(from, { token })
  console.log('Source deleted.')
}
