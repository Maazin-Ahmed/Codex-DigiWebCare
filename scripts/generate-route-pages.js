import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { serviceCatalog } from '../src/content.js'
import { canonicalOrigin, canonicalPathFor, getPageMetadata, pageMetadata } from '../src/seo.js'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = resolve(projectRoot, 'dist')
const template = readFileSync(resolve(distRoot, 'index.html'), 'utf8')
const socialImage = `${canonicalOrigin}/brand/digicare-web-logo.svg`
const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const replaceTag = (html, pattern, replacement) => {
  if (!pattern.test(html)) throw new Error(`Expected metadata tag was not found: ${pattern}`)
  return html.replace(pattern, replacement)
}

function buildRouteHtml(route, service) {
  const metadata = getPageMetadata(route, service)
  const canonicalUrl = `${canonicalOrigin}${canonicalPathFor(route)}`
  const robotsValue = metadata.noindex ? 'noindex, follow' : 'index, follow'
  let html = template

  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${escapeHtml(metadata.title)}</title>`)
  html = replaceTag(html, /<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonicalUrl}" />`)
  html = replaceTag(html, /<meta\b(?=[^>]*\bname="description")[^>]*>/s, `<meta name="description" content="${escapeHtml(metadata.description)}" />`)
  html = replaceTag(html, /<meta name="robots"[^>]*>/, `<meta name="robots" content="${robotsValue}" />`)
  html = replaceTag(html, /<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`)
  html = replaceTag(html, /<meta\b(?=[^>]*\bproperty="og:description")[^>]*>/s, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`)
  html = replaceTag(html, /<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonicalUrl}" />`)
  html = replaceTag(html, /<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${socialImage}" />`)
  html = replaceTag(html, /<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`)
  html = replaceTag(html, /<meta\b(?=[^>]*\bname="twitter:description")[^>]*>/s, `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`)
  html = replaceTag(html, /<meta name="twitter:image"[^>]*>/, `<meta name="twitter:image" content="${socialImage}" />`)

  return html
}

const routes = [
  ...Object.entries(pageMetadata)
    .filter(([, metadata]) => !metadata.noindex)
    .map(([route]) => ({ route, service: null })),
  ...serviceCatalog.map((service) => ({ route: `/${service.slug}`, service })),
]

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(({ route }) => `  <url><loc>${canonicalOrigin}${canonicalPathFor(route)}</loc></url>`),
  '</urlset>',
  '',
].join('\n')

for (const { route, service } of routes) {
  const outputPath = route === '/'
    ? resolve(distRoot, 'index.html')
    : resolve(distRoot, route.slice(1), 'index.html')
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, buildRouteHtml(route, service))
}

const paymentPath = resolve(distRoot, 'payment', 'index.html')
mkdirSync(dirname(paymentPath), { recursive: true })
writeFileSync(paymentPath, buildRouteHtml('/payment', null))
writeFileSync(resolve(distRoot, 'sitemap.xml'), sitemap)
writeFileSync(resolve(projectRoot, 'public', 'sitemap.xml'), sitemap)

console.log(`Generated route metadata for ${routes.length} indexable routes and /payment.`)
