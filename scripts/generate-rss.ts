/**
 * Writes `dist/public/rss.xml`, an RSS 2.0 feed over every post, so a reader
 * can follow new work without checking the site. Runs after `vite build`.
 * See spec/spec.md Phase 7, task 2.
 *
 * `<description>` carries the excerpt (a short, safe summary) rather than the
 * full post body. The content here is currently plain-paragraph Markdown;
 * rendering it correctly as `<content:encoded>` HTML would need a real
 * Markdown→HTML pass (react-markdown's underlying remark/rehype toolchain
 * isn't a declared dependency of this project, just a transitive one of
 * react-markdown) — deliberately left out rather than added on an
 * undeclared, version-fragile dependency. A full-text feed is a reasonable
 * future enhancement if wanted; this version is a correct, conventional
 * summary feed.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parsePosts } from '../client/src/lib/posts';
import { SITE_BASE_PATH, SITE_NAME, SITE_URL, postUrl } from '../client/src/lib/seo';
import { readAllContentFiles } from './read-content-files';

const DIST_DIR = path.resolve(import.meta.dirname, '..', 'dist', 'public');
const FEED_PATH = path.join(DIST_DIR, 'rss.xml');
const FEED_URL = `${SITE_URL}rss.xml`;
const SITE_DESCRIPTION =
  'प्राजक्तप्रभा - A creative blog showcasing Marathi poetry, dance, and cultural expression.';

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function main() {
  const posts = parsePosts(readAllContentFiles(), SITE_BASE_PATH);
  const now = new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = postUrl(post.id);
      const pubDate = new Date(post.date).toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(post.categoryLabel)}</category>
      <description>${escapeXml(post.excerpt)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>mr</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${escapeXml(FEED_URL)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  mkdirSync(DIST_DIR, { recursive: true });
  writeFileSync(FEED_PATH, xml, 'utf-8');
  console.log(`Wrote rss.xml with ${posts.length} item${posts.length === 1 ? '' : 's'}.`);
}

main();
