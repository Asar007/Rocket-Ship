#!/usr/bin/env node
/**
 * Upload a file to Vercel Blob storage.
 *
 * Requires a BLOB_READ_WRITE_TOKEN from your Vercel project.
 * Get it at: https://vercel.com/<team>/<project>/stores → your Blob store → Settings → Tokens
 *
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxx node scripts/upload-to-blob.mjs <file> [destination]
 *
 * On Windows PowerShell:
 *   $env:BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxx"; node scripts/upload-to-blob.mjs <file>
 */
import { put } from '@vercel/blob'
import { readFile, statSync } from 'node:fs'
import { promises as fs } from 'node:fs'
import { basename, resolve } from 'node:path'

const [, , inputArg, destArg] = process.argv

if (!inputArg) {
  console.error('Usage: node scripts/upload-to-blob.mjs <file> [destination-path]')
  process.exit(1)
}

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('Missing BLOB_READ_WRITE_TOKEN env var.')
  console.error('Get it from Vercel → Storage → your Blob store → Settings → Tokens.')
  process.exit(1)
}

const input = resolve(inputArg)
const destination = destArg ?? basename(input)

console.log('Uploading...')
console.log('  file        :', input)
console.log('  destination :', destination)

const data = await fs.readFile(input)
const stat = await fs.stat(input)
console.log('  size        :', (stat.size / 1024 / 1024).toFixed(2), 'MB')

const blob = await put(destination, data, {
  access: 'public',
  contentType: 'video/mp4',
  token,
  // Keep the destination filename stable so we don't have to keep updating <video src>
  addRandomSuffix: false,
})

console.log()
console.log('Uploaded.')
console.log('  URL       :', blob.url)
console.log('  pathname  :', blob.pathname)
console.log()
console.log('Next step: paste this URL into src/sections/AboutVideo.jsx <video src="...">')
