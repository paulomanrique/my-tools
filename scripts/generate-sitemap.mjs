import fs from 'node:fs'
import path from 'node:path'

const siteUrl = 'https://tools.paulo.dev'
const locales = ['en', 'pt', 'es', 'it', 'de', 'nl', 'ja', 'zh', 'ko', 'ar', 'ru', 'sr']
const tools = ['youtube-thumbnail-grabber', 'image-converter', 'dns-propagation-check']

const urls = [
  ...locales.flatMap((locale) => [
    `/${locale}`,
    ...tools.map((tool) => `/${locale}/tool/${tool}`),
  ]),
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${siteUrl}${url}</loc>
  </url>`,
  )
  .join('\n')}
</urlset>
`

fs.mkdirSync(path.join(process.cwd(), 'public'), { recursive: true })
fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml)
