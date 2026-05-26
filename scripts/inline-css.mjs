// Inline the app's CSS into each prerendered HTML file so the browser
// doesn't have to make a round-trip for /assets/app-*.css before first
// paint. Runs after `vite-react-ssg build`.
//
// The CSS bundle is small (~11 KB) and the same on every page, so we
// trade ~11 KB of HTML inflation per page for ~150 ms of saved render-
// blocking latency on first visit. Repeat-visit cost is zero (the SW
// caches the HTML so no extra bytes go over the wire).
import fs from 'node:fs'
import path from 'node:path'

const DIST = 'dist'
const ASSETS = path.join(DIST, 'assets')

if (!fs.existsSync(ASSETS)) {
  console.error('inline-css: dist/assets not found — run after vite build')
  process.exit(1)
}

// Find the single app CSS chunk (we set cssCodeSplit defaults so all
// component CSS bundles into one file).
const cssFiles = fs
  .readdirSync(ASSETS)
  .filter((f) => f.endsWith('.css'))
  .map((f) => ({ name: f, path: path.join(ASSETS, f) }))

if (cssFiles.length === 0) {
  console.log('inline-css: no css files to inline')
  process.exit(0)
}

// Collect CSS content keyed by filename
const cssByName = new Map()
for (const { name, path: p } of cssFiles) {
  cssByName.set(name, fs.readFileSync(p, 'utf8'))
}

// Walk every .html in dist/ and inline matching CSS
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.isFile() && entry.name.endsWith('.html')) inline(full)
  }
}

let touched = 0
function inline(htmlPath) {
  let html = fs.readFileSync(htmlPath, 'utf8')
  let changed = false

  for (const [name, css] of cssByName) {
    // Match <link rel="stylesheet" ... href=".../<name>" ...>
    const re = new RegExp(
      `<link[^>]*rel=["\\\']stylesheet["\\\'][^>]*href=["\\\'][^"\\\']*${name.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      )}["\\\'][^>]*\\/?>`,
      'g',
    )
    if (!re.test(html)) continue
    html = html.replace(re, '')
    html = html.replace('</head>', `<style>${css}</style></head>`)
    changed = true
  }

  if (changed) {
    fs.writeFileSync(htmlPath, html)
    touched += 1
  }
}

walk(DIST)
console.log(
  `inline-css: inlined ${cssFiles.length} stylesheet(s) into ${touched} html file(s)`,
)
