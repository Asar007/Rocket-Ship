// Notify search engines (Bing, Yandex, Seznam, Naver, ...) that the site's
// pages may have changed, via the IndexNow protocol. Runs after the build so
// every production deploy gets crawled sooner instead of waiting for the
// engines to re-discover pages on their own.
//
// URLs are read from the built sitemap.xml, so this stays in sync as pages
// are added/removed — no list to maintain here. The IndexNow key is auto-
// discovered from the public/ key file, so there's nothing to hardcode.
//
// Gating: only pings on Vercel production deploys (VERCEL_ENV=production) or
// when INDEXNOW=1 is set for a manual local run. Skips otherwise so local
// `npm run build` iterations and preview deploys don't spam the API. A failed
// ping never fails the build.
import fs from 'node:fs'
import path from 'node:path'

const ENDPOINT = 'https://api.indexnow.org/indexnow' // fans out to all engines

function skip(reason) {
  console.log(`indexnow: skipped — ${reason}`)
  process.exit(0)
}

// Only ping on real production deploys, or when explicitly forced locally.
const isVercelProd = process.env.VERCEL_ENV === 'production'
const isForced = process.env.INDEXNOW === '1'
if (!isVercelProd && !isForced) {
  skip('not a production deploy (set INDEXNOW=1 to force locally)')
}

// Locate the built sitemap (dist after build; public as a fallback).
const sitemapPath = ['dist/sitemap.xml', 'public/sitemap.xml'].find((p) =>
  fs.existsSync(p),
)
if (!sitemapPath) skip('no sitemap.xml found')

const xml = fs.readFileSync(sitemapPath, 'utf8')
const urlList = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(
  (m) => m[1],
)
if (urlList.length === 0) skip('sitemap had no <loc> URLs')

// Host is whatever the sitemap URLs point at.
const host = new URL(urlList[0]).host

// Auto-discover the IndexNow key: a public/ *.txt whose name (sans .txt) is a
// 32-char hex string and whose content is exactly that key.
function findKey() {
  for (const f of fs.readdirSync('public')) {
    const m = f.match(/^([a-f0-9]{8,128})\.txt$/i)
    if (!m) continue
    const content = fs.readFileSync(path.join('public', f), 'utf8').trim()
    if (content === m[1]) return { key: m[1], file: f }
  }
  return null
}

const found = findKey()
if (!found) skip('no IndexNow key file found in public/')

const body = {
  host,
  key: found.key,
  keyLocation: `https://${host}/${found.file}`,
  urlList,
}

try {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
  // 200 = accepted, 202 = accepted (queued). Anything else is informational
  // only — we never fail the build over a ping.
  if (res.ok) {
    console.log(
      `indexnow: submitted ${urlList.length} URL(s) for ${host} (HTTP ${res.status})`,
    )
  } else {
    console.warn(
      `indexnow: endpoint returned HTTP ${res.status} — pages still deployed, ping is best-effort`,
    )
  }
} catch (err) {
  console.warn(`indexnow: ping failed (${err.message}) — build unaffected`)
}

process.exit(0)
