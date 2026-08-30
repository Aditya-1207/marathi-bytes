/**
 * Recompresses every image in a `blog-images`-shaped directory, in place,
 * keeping the same filename and extension. Used two ways:
 *
 * 1. As part of the build pipeline (see package.json / deploy.yml), pointed
 *    at `dist/public/blog-images` after `vite build`. This is what keeps a
 *    raw multi-MB photo the author uploads through Decap's media widget from
 *    ever reaching a reader at full size — it never touches the git-tracked
 *    source file, only the build output, so there's nothing for her to do
 *    and nothing that could corrupt authored content.
 * 2. As a one-off, pointed at `client/public/blog-images` directly, to clean
 *    up the images already sitting in the repo (spec/spec.md Phase 6, task 2).
 *
 * Same filename/extension in, same filename/extension out — deliberately.
 * Converting to WebP would be a bigger win, but every reference to these
 * files (post frontmatter, `categories.ts`'s default thumbnails, the
 * homepage's hardcoded images) is a plain string with an extension; renaming
 * on the way out would mean either rewriting authored content automatically
 * (surprising, and content the CMS itself failed to keep in sync once
 * already — see the Phase-6 notes in spec/spec.md) or breaking those
 * references. Lossy PNG (palette mode) and re-encoded JPEG both achieve most
 * of the same size win without that tradeoff.
 */
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const MAX_DIMENSION = 1600;
const PNG_QUALITY = 60;
const JPEG_QUALITY = 78;
const WEBP_QUALITY = 78;
/**
 * Below this, skip entirely — both so a genuinely small image isn't
 * pointlessly re-encoded, and, more importantly, so this step is idempotent.
 * It runs on every single build, including ones that touch no images at all;
 * without a threshold comfortably above what this script's own output looks
 * like (currently ~330-570KB for the source photos), every build would
 * re-compress the already-compressed result from the last one — a lossy
 * pass on top of a lossy pass, forever, for zero size benefit. 700KB sits
 * above that range but well below a typical raw upload (a phone photo is
 * usually several MB), so it still reliably catches what task 3 exists for.
 */
const SKIP_UNDER_BYTES = 700 * 1024;

async function optimizeFile(filePath: string): Promise<void> {
  const ext = path.extname(filePath).toLowerCase();
  const before = statSync(filePath).size;
  if (before <= SKIP_UNDER_BYTES) return;

  const pipeline = sharp(filePath).resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  });

  let buffer: Buffer;
  if (ext === '.png') {
    buffer = await pipeline.png({ quality: PNG_QUALITY, palette: true, compressionLevel: 9 }).toBuffer();
  } else if (ext === '.jpg' || ext === '.jpeg') {
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true }).toBuffer();
  } else if (ext === '.webp') {
    buffer = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
  } else {
    return; // unrecognized type (svg, gif, …) — leave untouched
  }

  // Only replace if re-encoding actually helped; a small/already-optimized
  // image can come back slightly larger, and there's no reason to keep it.
  if (buffer.length >= before) return;

  writeFileSync(filePath, buffer);
  const beforeKB = (before / 1024).toFixed(0);
  const afterKB = (buffer.length / 1024).toFixed(0);
  const pct = (100 * (1 - buffer.length / before)).toFixed(0);
  console.log(`  ${path.basename(filePath)}: ${beforeKB}KB → ${afterKB}KB (-${pct}%)`);
}

async function main() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    throw new Error('Usage: tsx scripts/optimize-images.ts <directory>');
  }

  const dir = path.resolve(targetDir);
  console.log(`Optimizing images in ${dir}`);

  for (const filename of readdirSync(dir)) {
    await optimizeFile(path.join(dir, filename));
  }
}

main();
