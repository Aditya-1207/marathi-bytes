/**
 * Bakes per-post OG/Twitter share-preview tags into static HTML files under
 * `dist/public/post/<slug>/index.html`. Runs after `vite build`.
 *
 * Why this exists at all: social scrapers (WhatsApp, Facebook, Twitter/X)
 * fetch a URL's raw HTML and read its <meta> tags — they do not execute
 * JavaScript. `useDocumentMeta` (client/src/hooks/use-document-meta.ts)
 * updates the DOM correctly for a live browser session, but a scraper never
 * runs that code, so without this script every shared post link would
 * preview as the generic homepage (`client/index.html`'s static defaults).
 * See spec/spec.md Phase 5, task 4.
 *
 * Mechanism: GitHub Pages 301-redirects a request for `/post/<slug>` (no
 * trailing slash) to `/post/<slug>/` when that directory exists, then serves
 * its `index.html` — this is the same directory-index behaviour static site
 * generators like Jekyll/Hugo rely on for "pretty URLs", confirmed against
 * GitHub Pages' documented behaviour. `postUrl()` in `client/src/lib/seo.ts`
 * already returns the trailing-slash form, so og:url/canonical never
 * actually needs that redirect hop — only a direct fetch of `/post/<slug>`
 * (no slash) does, and that's one hop scrapers and browsers both follow.
 *
 * Each output file is a full copy of the built `index.html` — same hashed
 * script/link tags — with only the meta tag *values* swapped, via targeted
 * string replacement rather than a DOM/HTML parser dependency: the exact tag
 * shapes are ones this project writes in `client/index.html` and Vite is
 * confirmed to pass meta content through unmodified, so this stays simple
 * and has no new dependency, consistent with the mission's "no server to
 * babysit" — this is a build-time script, not a runtime one.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parsePosts } from '../client/src/lib/posts';
import { SITE_BASE_PATH, SITE_NAME, absoluteUrl, postUrl, truncate } from '../client/src/lib/seo';
import { readAllContentFiles } from './read-content-files';

const DIST_DIR = path.resolve(import.meta.dirname, '..', 'dist', 'public');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setMetaByProperty(html: string, property: string, content: string): string {
  const re = new RegExp(`(<meta property="${property}" content=")[^"]*(")`, 'i');
  if (!re.test(html)) throw new Error(`Template is missing <meta property="${property}"> — check client/index.html`);
  return html.replace(re, `$1${escapeAttr(content)}$2`);
}

function setMetaByName(html: string, name: string, content: string): string {
  const re = new RegExp(`(<meta name="${name}" content=")[^"]*(")`, 'i');
  if (!re.test(html)) throw new Error(`Template is missing <meta name="${name}"> — check client/index.html`);
  return html.replace(re, `$1${escapeAttr(content)}$2`);
}

function setCanonical(html: string, href: string): string {
  const re = /(<link rel="canonical" href=")[^"]*(")/i;
  if (!re.test(html)) throw new Error('Template is missing <link rel="canonical"> — check client/index.html');
  return html.replace(re, `$1${escapeAttr(href)}$2`);
}

function setTitle(html: string, title: string): string {
  return html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`);
}

function insertPublishedTime(html: string, isoDate: string): string {
  return html.replace(
    /(<meta property="og:type" content="article" \/>)/,
    `$1\n    <meta property="article:published_time" content="${escapeAttr(isoDate)}" />`,
  );
}

function main() {
  if (!existsSync(TEMPLATE_PATH)) {
    throw new Error(`${TEMPLATE_PATH} not found — run "vite build" before this script.`);
  }

  const template = readFileSync(TEMPLATE_PATH, 'utf-8');
  const posts = parsePosts(readAllContentFiles(), SITE_BASE_PATH);

  for (const post of posts) {
    const description = truncate(post.excerpt);
    const image = absoluteUrl(post.thumbnail);
    const url = postUrl(post.id);
    const publishedTime = new Date(post.date).toISOString();

    let html = template;
    html = setTitle(html, `${post.title} — ${SITE_NAME}`);
    html = setMetaByName(html, 'description', description);
    html = setMetaByProperty(html, 'og:title', post.title);
    html = setMetaByProperty(html, 'og:description', description);
    html = setMetaByProperty(html, 'og:type', 'article');
    html = insertPublishedTime(html, publishedTime);
    html = setMetaByProperty(html, 'og:url', url);
    html = setMetaByProperty(html, 'og:image', image);
    html = setMetaByName(html, 'twitter:title', post.title);
    html = setMetaByName(html, 'twitter:description', description);
    html = setMetaByName(html, 'twitter:image', image);
    html = setCanonical(html, url);

    const outDir = path.join(DIST_DIR, 'post', post.id);
    mkdirSync(outDir, { recursive: true });
    writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');
  }

  console.log(`Prerendered ${posts.length} post${posts.length === 1 ? '' : 's'} with per-post share previews.`);
}

main();
