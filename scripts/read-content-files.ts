import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { CATEGORIES } from '../client/src/lib/categories';
import type { CategoryFiles } from '../client/src/lib/posts';

const CONTENT_ROOT = path.resolve(import.meta.dirname, '..', 'client', 'src', 'content');

/**
 * The Node-side equivalent of `content.ts`'s `import.meta.glob` calls, for
 * the build scripts (prerender, RSS) that run as plain Node after `vite
 * build`, outside any Vite runtime. Reuses `CATEGORIES` from
 * `client/src/lib/categories.ts` rather than hardcoding the category id list
 * a third time — the same category folders `content.ts` reads.
 */
export function readAllContentFiles(): CategoryFiles[] {
  return CATEGORIES.map(({ id: category }) => {
    const dir = path.join(CONTENT_ROOT, category);
    const files: Record<string, string> = {};

    for (const filename of readdirSync(dir)) {
      if (!filename.endsWith('.md')) continue;
      files[path.join(dir, filename)] = readFileSync(path.join(dir, filename), 'utf-8');
    }

    return { category, files };
  });
}
