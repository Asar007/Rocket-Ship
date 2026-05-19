import { Head } from 'vite-react-ssg'

const SITE = 'https://rocket-ship-plum.vercel.app'

/**
 * Per-page <head> tags, serialized into the prerendered HTML by
 * vite-react-ssg. Global tags (og:image, og:site_name, twitter:card,
 * JSON-LD) stay in index.html; this overrides the page-specific ones.
 */
export default function Seo({ title, description, path = '/' }) {
  const url = `${SITE}${path}`
  const full = `${title} · Madras Swastic Engineers`
  return (
    <Head>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
    </Head>
  )
}
