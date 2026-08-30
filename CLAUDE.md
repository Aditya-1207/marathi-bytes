# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Before planning new work, also read `spec/mission.md` (why this project exists and what it's for), `spec/spec.md` (the current roadmap — required vs. good-to-have), and `spec/tech-stack.md` (what's actually load-bearing vs. unused scaffold). This file covers *how the code works*; those cover *why* and *what's next*.

## Commands

```
npm install       # install dependencies
npm run dev        # start dev server (Vite middleware + Express) on PORT env var, default 5000
npm run build       # vite build (client) + esbuild bundle of server/index-prod.ts into dist/index.js
npm start           # run the production build (requires npm run build first)
npm run check        # tsc --noEmit type-check across client/server/shared
npm run db:push      # drizzle-kit push — pushes shared/schema.ts to DATABASE_URL (schema is currently unused by the app; see below)
```

There is no test suite/framework configured in this repo.

## Architecture

This is a **client-rendered SPA blog**, not a traditional full-stack app, despite the Express scaffold. It was originally scaffolded on Replit (see `.replit`, the `@replit/vite-plugin-*` devDependencies).

**Content model — this is the core thing to understand:**
Posts are markdown files with YAML frontmatter under `client/src/content/{poetry,articles,ukhane}/*.md`. `client/src/lib/content.ts` loads *all* of them at build/bundle time via `import.meta.glob(..., { eager: true })` — there is no runtime fetch, no CMS API, no database read. Frontmatter is parsed with `js-yaml` (not a hand-rolled parser — it must stay a real YAML parser since content can come from the CMS below, which emits multi-line YAML lists). The filename (minus `.md`) becomes the post's URL slug (`/post/<slug>`); the containing folder becomes its category. A fourth `instagram` category once existed in the loader without any route or nav entry; it was removed in Phase 3 — social media is a link out from this site, never a feed pulled in (see `spec/spec.md` Phase 3 for the reasoning).

**Routing (`client/src/App.tsx`)** uses `wouter`, client-side only: `/`, `/category/:category`, `/post/:id`, `/search`, `/tag/:tag`, `/about`.

Search and tag browsing are backed by `client/src/lib/search.ts`, which builds a small in-memory index once (memoized) over the eagerly-loaded corpus rather than re-scanning on every keystroke. Three details there are load-bearing rather than incidental:

- `normalizeText()` applies `.normalize('NFC')` before comparing — the same Devanagari grapheme can be stored precomposed or as base + combining mark depending on its source, and without this a visually identical query silently fails to match.
- `decodeRouteParam()` finishes the percent-decoding wouter's `decodeURI` deliberately leaves half-done for reserved characters.
- Every field is also matched against a phonetic Latin transliteration from `client/src/lib/transliterate.ts` (`devanagariToLatin`), not just the original Devanagari. **This is not optional polish** — every post published through Decap gets its slug from `{{slug}}` in `config.yml`, generated straight from the (Devanagari) title with no romanization, so a real post's title, slug, tags, and body are entirely Devanagari. Without the transliteration pass there would be no Latin text in a new post for a Latin query to match at all. The transliteration is deliberately casual/phonetic (e.g. both ट and त map to `t`) rather than strict IAST, and does not model schwa deletion — so it favors extra matches over missed ones, and a query that needs a mid-word vowel elided (e.g. "chehra" for चेहरा, which transliterates to "chehara") may not hit. The four legacy posts with hand-typed Latin filenames (`aai.md`, `premaachi-bhavna.md`, …) predate the CMS and matched before this existed; every post since needs the transliteration path.

`Header` takes no props — it reads `CATEGORIES` itself and performs its own search navigation, so a new page just renders `<Header />`. `TagPill` is a `<Link>`, not a click handler, so every tag on the site navigates by construction. `PostGrid` (card grid + pagination + empty state) and `SiteFooter` are shared by the home, category, search, and tag pages.

Categories are defined once in `client/src/lib/categories.ts` (`CATEGORIES`, plus a `getCategory(id)` lookup) and consumed by both the pages and `content.ts` — adding or renaming a category is a single edit there. Social links are centralized the same way in `client/src/lib/social.ts`, read by both `Header.tsx` and `SocialMediaSection.tsx`.

**Content authoring via Decap CMS:** `client/public/admin/` (`config.yml` + `index.html`) is a Decap CMS instance that gives non-technical editors a web form to create/edit posts, which commits directly to the `client/src/content/*` folders via the GitHub API (`backend.repo: Aditya-1207/marathi-bytes`, branch `main`). `local_backend: true` lets you test the CMS without OAuth by running `npx decap-server` alongside `npm run dev`, then visiting `/admin/index.html` (note: in dev mode, `/admin/` without the filename 404s — see server note below; this isn't an issue in the production static build).

**Server (`server/`)** is mostly inert:
- `app.ts` — shared Express app, request logger, and the `server.listen(...)` call. `reusePort` is conditioned on `process.platform !== "win32"` because it's a Linux-only socket option that throws `ENOTSUP` on Windows.
- `index-dev.ts` — mounts Vite in middleware mode with `appType: "custom"`, which disables Vite's automatic directory→`index.html` resolution (so `/admin/` needs the explicit `/admin/index.html` path in dev; static hosting doesn't have this issue).
- `index-prod.ts` — just `express.static(dist/public)` with an SPA fallback to `index.html`.
- `routes.ts` — empty scaffold (no routes registered).
- `storage.ts` — in-memory `MemStorage` implementing a `users` CRUD interface; unused.
- `shared/schema.ts` + `drizzle.config.ts` — Drizzle ORM schema for a Postgres `users` table; scaffolded but nothing in the app calls it.

None of the above server/db/auth machinery is load-bearing for the blog itself — the site is fully static content once built, so it's a valid target for static hosting (e.g. GitHub Pages) with the Express server dropped entirely.

**UI:** shadcn/ui (`"new-york"` style, configured in `components.json`) + Tailwind CSS 3. Shared primitives live in `client/src/components/ui`; page-level composed components live directly in `client/src/components`. `design_guidelines.md` documents the intended typography, spacing, and component specs (Devanagari + Latin type pairing, card/carousel/pill specs, etc.) — consult it before changing layout or visual design.

**Path aliases** (`tsconfig.json` / `vite.config.ts`): `@/*` → `client/src/*`, `@shared/*` → `shared/*`, `@assets/*` → `attached_assets/*`.
