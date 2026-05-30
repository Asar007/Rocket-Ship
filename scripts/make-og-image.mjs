// Generate the 1200x630 social share image (Open Graph / Twitter card) from
// the existing About hero, with a dark gradient and brand text overlaid so
// WhatsApp/LinkedIn/X show a proper preview card instead of a tiny favicon.
//
// One-off / regenerate-on-demand:  node scripts/make-og-image.mjs
// Output: public/og-image.jpg  (target < 200 KB)
import sharp from 'sharp'

const W = 1200
const H = 630
const SRC = 'public/about-hero-2400.webp'
const OUT = 'public/og-image.jpg'

// Text + gradient overlay as SVG, composited on top of the photo.
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#04070d" stop-opacity="0.15"/>
      <stop offset="55%" stop-color="#04070d" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#04070d" stop-opacity="0.92"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#shade)"/>
  <text x="64" y="436" font-family="Arial, Helvetica, sans-serif" font-size="22"
        letter-spacing="3" font-weight="700" fill="#7dd3fc">
    ISRO GAGANYAAN FABRICATION PARTNER  ·  SINCE 2009
  </text>
  <text x="62" y="506" font-family="Arial, Helvetica, sans-serif" font-size="68"
        font-weight="800" fill="#ffffff">
    Madras Swastic Engineers
  </text>
  <text x="64" y="556" font-family="Arial, Helvetica, sans-serif" font-size="30"
        font-weight="500" fill="#e2e8f0">
    Heavy Fabrication for Space, Energy &amp; Industry
  </text>
</svg>`)

await sharp(SRC)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(OUT)

const { size } = await sharp(OUT).metadata().then(() =>
  import('node:fs').then((fs) => fs.statSync(OUT)),
)
console.log(`make-og-image: wrote ${OUT} (${(size / 1024).toFixed(0)} KB, ${W}x${H})`)
