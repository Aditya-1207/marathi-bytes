# Specification & Roadmap

This document tracks what the project needs next, in service of [mission.md](./mission.md).

**How it's organized.** Work is grouped into **phases**. Each phase delivers one distinct piece of functionality and is worth shipping on its own — you should be able to stop after any phase and have left the project in a coherent state. Within a phase, each **task** has a single purpose and is sized to land as roughly one commit (a guideline, not a rule).

Each phase is labelled with a tier:

- **Core** — the mission is not actually fulfilled without it. These are half-built or missing pieces that block a stated goal in `mission.md`.
- **Polish** — real improvements grounded in gaps observed in this codebase, not speculative features. Valuable, but the mission stands without them.

Anything not listed here should be checked against `mission.md`'s non-goals before being added to any phase.

## Current state

The site is a client-rendered React SPA, live at https://Aditya-1207.github.io/marathi-bytes/. Content is authored as Markdown with YAML frontmatter under `client/src/content/{poetry,articles,ukhane}/` and compiled into the JS bundle at build time — there is no runtime database or API. A Decap CMS instance at `/admin` gives the author a web form for creating and editing posts, authenticated in production via a GitHub OAuth App and a Cloudflare Worker proxy (`oauth-proxy/`) — verified end-to-end with a real published post. See `CLAUDE.md` for full architecture detail.

Phases 1, 2 and 3 are done: the site is public, the author can self-publish from a browser with no terminal and no help, and the category list lives in one module. The remaining gaps are the ones covered in Phases 4 onward below.

## Phase overview

| # | Phase | Tier | Delivers |
|---|---|---|---|
| 1 | Public deployment | Core | The site exists at a URL a reader can visit |
| 2 | Production authoring | Core | She can publish on her own, from a browser |
| 3 | One source of truth for content structure | Core | Categories can't silently disagree across pages |
| 4 | Working search and tag browsing | Core | Nothing in the reader UI 404s |
| 5 | Per-post share previews | Core | A shared poem previews as that poem |
| 6 | Lighter pages | Polish | Fast to load, cheap to host, stays that way |
| 7 | Reader conveniences | Polish | Reading time, and a way to follow new work |
| 8 | Prune unused scaffolding | Polish | The codebase reads as what it actually is |

**Sequencing notes.** Phase 2 depends on Phase 1 (the OAuth app and CMS config need a real production URL to authorize against). Phase 3 is deliberately placed before Phase 4 — Phase 4 adds new pages that would otherwise become the fifth and sixth hand-copies of the category list. Phase 8 depends on Phase 1 confirming static hosting as the long-term direction. Everything else is independent.

---

## Phase 1 — Public deployment · Core · ✅ Done

Live at https://Aditya-1207.github.io/marathi-bytes/.

**Functionality served:** the site is reachable at a public URL. Until this exists, no reader-facing part of the mission is real, and Phase 2 has nothing to authorize against.

Today `vite.config.ts` sets no `base` path and there is no deploy workflow, so nothing is live.

**Tasks**

1. **Choose the hosting target and record the decision.** Purpose: settle on a host that satisfies the mission's "costs nothing to keep running, no server to babysit" — GitHub Pages is the natural fit given content is already static and the repo is already on GitHub. Note the choice and its URL in `spec/tech-stack.md`.
2. **Configure the build for that target.** Purpose: set `base` in `vite.config.ts` to match the host's URL path so asset URLs resolve correctly once deployed.
3. **Add the deploy workflow.** Purpose: build on push to `main` and publish the output, so deployment is automatic and not a step anyone has to remember.
4. **Handle SPA deep links on the host.** Purpose: `wouter` routes like `/post/<slug>` are client-side only; a static host must serve `index.html` for unknown paths, or a shared post link opens to a 404 on refresh.
5. **Verify the live site.** Purpose: confirm every route, all content, and all images load correctly from the public URL — not just from `npm run dev`.

**Done when:** a reader can open the public URL, navigate to any post, refresh the page, and see it render.

---

## Phase 2 — Production authoring · Core · ✅ Done

**Functionality served:** the author can publish a new poem herself, from a browser, with no terminal and no help. This is the single most load-bearing promise in `mission.md`.

Decap CMS at `/admin` now authenticates in production via a GitHub OAuth App and a Cloudflare Worker proxy (`oauth-proxy/`, deployed at `https://marathibytes-decap-oauth.kulkarni-aditya12.workers.dev`). The author has her own GitHub account with push access to `Aditya-1207/marathi-bytes` and has published a real post end-to-end: logged in at `/admin`, created and published a poem, the commit landed on `main`, the deploy workflow rebuilt the site, and the post appeared live.

**Decision (2026-08-20):** the author (Aditya's wife) will use a dedicated GitHub account, tied to a dedicated Gmail kept separate from her personal one, and log in through GitHub's own screen — not a "Sign in with Google" button. The alternative (Netlify Identity + Git Gateway, which does offer literal Google sign-in) was ruled out to avoid depending on a second hosting platform just for auth. See `AUTHORING.md` for what she'll actually see.

**Tasks**

1. **Register a GitHub OAuth App** for the production domain. Purpose: give Decap a real identity to authenticate the author against the `Aditya-1207/marathi-bytes` repo. *(Done — `MarathiBytes CMS` OAuth App registered, callback URL points at the Worker.)*
2. **Deploy the auth proxy.** Purpose: Decap's GitHub backend needs a small server-side token exchange; built as a Cloudflare Worker in `oauth-proxy/` — this is the one piece that cannot be static. *(Done — deployed as `marathibytes-decap-oauth` on the `kulkarni-aditya12.workers.dev` subdomain, with `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, and `OAUTH_STATE_SECRET` set as Worker secrets.)*
3. **Point the CMS at the proxy.** Purpose: update `config.yml` with the proxy's `base_url`/`auth_endpoint`. *(Done — `base_url` set to the real Worker URL and merged to `main`.)*
4. **Confirm `local_backend` behaviour is correct for both modes.** Purpose: make sure local testing still works without the local flag hijacking the production login. *(Confirmed: Decap only engages the local proxy when the CMS is loaded from `localhost`, so `local_backend: true` is inert in production — no code change needed, documented in `config.yml`.)*
5. **Add the author as a repo collaborator.** Purpose: Decap commits using the author's own OAuth token, so her GitHub account needs push access to this repo. *(Done — added via Settings → Collaborators, invite accepted.)*
6. **Walk a full publish cycle in production.** Purpose: log in at `/admin`, create a post, edit it, confirm the commit lands on `main` and the change appears on the live site after deploy — end-to-end proof, not component-level confidence. *(Done — verified with a real published poem.)*
7. **Write a short authoring guide for the author.** Purpose: a non-developer needs to know the URL, the login step, and what "wait for it to appear" means; without this the flow is technically working but practically unusable. *(Done — `AUTHORING.md`.)*

**Done when:** the author publishes a post start to finish without anyone else touching a terminal. ✅ Confirmed 2026-08-30.

---

## Phase 3 — One source of truth for content structure · Core · ✅ Done

**Functionality served:** the site's notion of "what categories exist" lives in one place, so adding or renaming one is a single edit rather than a hunt.

The `categories` array (id / name / label) was hand-duplicated across **four** pages — `HomePage.tsx`, `CategoryPage.tsx`, `PostPage.tsx`, and `AboutPage.tsx` — while `client/src/lib/content.ts` separately maintained its own `CATEGORY_LABELS` and `CATEGORY_DEFAULT_THUMBNAILS` maps: six places encoding the same fact. All six now read `client/src/lib/categories.ts`. Separately, `content.ts` supported an `instagram` category that no navigation, route, or CMS collection referenced, and whose content folder held only a `README.md` — resolved by the decision below.

**Decision (2026-08-30): the `instagram` category is removed, and social media stays a link out, never a feed pulled in.**

The audit found three unrelated half-built pieces, none of them working:

- The `instagram` category contributed **zero posts by construction** — its folder held only `README.md`, which the loader explicitly skips. It cost a glob, an `ALL_FILES` row, and a `CATEGORIES` entry whose `inNav: false` flag existed solely to describe this one broken case.
- `HomePage.tsx` hardcoded three carousel slides whose "View on Instagram →" buttons pointed at `instagram.com/p/example1..3` — placeholder URLs that 404.
- `Header.tsx` and `SocialMediaSection.tsx` each hand-maintained their own copy of the platform list, and every URL was a bare platform homepage. No real profile URL existed anywhere in the repo, so the header's *"Follow me on Instagram and YouTube"* dropped readers on Instagram's logged-out page.

Mirroring an actual Instagram feed was rejected on mission grounds. Every viable route violates a stated non-goal: the Graph API (Basic Display shut down Dec 2024) needs a Business account and 60-day token refresh — *"no server to babysit"*; third-party widgets add tracking cookies and a recurring bill — *"no analytics-driven growth loops"*; official post embeds ship ~1MB of Instagram JS plus an iframe per post and turn into broken grey boxes when a post is deleted. **Instagram is a destination for readers who find a poem here, not a data source for this site.**

A curated, author-owned highlights grid — image, caption and permalink stored in the repo via a Decap *file* collection, rendered as plain lazy `<img>` tags with no runtime fetch — remains the only sustainable way to put Instagram content on-page. It is deliberately **not** scheduled: it must follow Phase 6 (otherwise every highlight is a multi-megabyte phone upload, re-creating the exact problem Phase 6 exists to fix), and it is only worth building if the author will reliably keep it current. A stale grid reads worse than no grid.

**Tasks**

1. **Decide the `instagram` category's fate.** *(Done — removed; see the decision above.)*
2. **Create the shared category module.** Purpose: one exported definition — id, display name, Devanagari label, default thumbnail — that both the UI and `content.ts` consume. *(Done — `client/src/lib/categories.ts`.)*
3. **Migrate the four pages to import it.** *(Done — `HomePage`, `CategoryPage`, `PostPage`, and `AboutPage` all import `CATEGORIES`.)*
4. **Migrate `content.ts` to it.** *(Done — `CATEGORY_LABELS` and `CATEGORY_DEFAULT_THUMBNAILS` folded into the shared definition, read via `getCategory()`.)*
5. **Act on the Phase-3-task-1 decision.** *(Done — dropped the `instagram` glob and `ALL_FILES` row from `content.ts`, the `CATEGORIES` entry, and the `client/src/content/instagram/` folder. With no `false` case left, `inNav` and `NAV_CATEGORIES` were removed too and the five call sites now import `CATEGORIES` directly.)*
6. **Give social links the same treatment.** Purpose: the platform list was duplicated across `Header.tsx` and `SocialMediaSection.tsx` — the same drift problem, one file over. *(Done — `client/src/lib/social.ts` is the single source; both components render from it.)*
7. **Stop the carousel promising posts that don't exist.** Purpose: a reader-visible 404 undercuts the mission's "beautiful, dignified" standard. *(Done — the `instagramLink` field is gone from `HeroCarousel.tsx` and both slide lists; the carousel is now visual-only. Repointing it at real `/post/<slug>` links, or driving it from the latest posts, is a reasonable future improvement.)*

**Done when:** adding a category is one file edit, and `grep` for a category label returns one definition. ✅ `npm run check` and `npm run build` both pass.

**Carried forward:** the three `url` values in `client/src/lib/social.ts` are still platform homepages rather than the author's real profiles, and the entry for any platform she doesn't actually use should be deleted. Both are now a one-line edit each in that one file — but until they're made, the social links remain cosmetic.

---

## Phase 4 — Working search and tag browsing · Core

**Functionality served:** a reader can find a piece by searching or by following a tag, and every control in the UI leads somewhere real.

Today `HomePage`, `CategoryPage`, `PostPage`, and `AboutPage` all navigate to `/search?q=…`, and the first three also navigate to `/tag/:tag` — **neither route exists in `App.tsx`**, so both 404. A visibly broken feature undercuts the "beautiful, dignified" standard the mission sets. The data is already there: `tags` is a real frontmatter field and a CMS list widget on every collection.

**Tasks**

1. **Decide: build or remove.** Purpose: implement both routes, or strip the handlers and the UI that promise them. Given tags are already authored and searching a small corpus is cheap client-side, building is the recommended path — but a deliberate removal beats a lingering 404.
2. **Add the `/search` route and results page.** Purpose: filter the eagerly-loaded posts on title, excerpt, body, and tags, and render matches with the existing post-card component. Devanagari input must match correctly — this is not an ASCII-only search.
3. **Add the `/tag/:tag` route and listing page.** Purpose: show every post carrying a tag, reusing the category-listing layout.
4. **Handle the empty and missing cases.** Purpose: a search with no hits, and a tag with no posts, need a real empty state rather than a blank page.
5. **Make the tag affordance consistent.** Purpose: tags render in several places; ensure they all link to the new route so none stay decorative.

**Done when:** searching from the header and clicking any tag both land on a working page, in Devanagari and Latin alike.

---

## Phase 5 — Per-post share previews · Core

**Functionality served:** when a reader shares a poem to WhatsApp or Facebook, the preview shows *that poem* — its title, its excerpt, its image.

`PostPage` offers Facebook, Twitter, and WhatsApp share buttons, but `client/index.html` carries a single static `og:title` and `og:description` for the entire site, with **no `og:image` and no `og:url` at all**. Every shared link therefore previews as the generic homepage. This directly contradicts "share it in a way that actually represents that poem" in `mission.md`.

**Tasks**

1. **Add per-route document metadata.** Purpose: a small mechanism to set `<title>` and OG/Twitter meta tags from route data, applied at minimum to the post route.
2. **Feed post frontmatter into the tags.** Purpose: map title, excerpt, thumbnail, and canonical URL onto `og:title`, `og:description`, `og:image`, `og:url`, and the Twitter card equivalents.
3. **Fill in the site-level defaults.** Purpose: give `index.html` a proper `og:image` and `og:url` so the homepage and category pages preview well too.
4. **Address the crawler limitation.** Purpose: social scrapers do not execute JavaScript, so client-injected tags are invisible to them. Decide and implement the fix — prerendering post routes at build time is the smallest option that actually works for a static host. Without this task the previous three are cosmetic.
5. **Verify with a real scraper.** Purpose: check a live post URL through a social preview debugger; a local DOM inspection proves nothing about what Facebook sees.

**Done when:** pasting a post URL into WhatsApp shows that post's title and image.

---

## Phase 6 — Lighter pages · Polish

**Functionality served:** the site loads fast on a phone and stays cheap to host, even as the author keeps adding images.

`client/public/blog-images/` currently holds six PNGs between 1.3MB and 2.0MB each — roughly 9MB for what are used as thumbnails. Decap's media widget uploads straight into that folder at whatever size and format the author's phone produces, so this recurs on its own unless the intake path changes too.

Two findings from the Phase 3 audit sharpen this:

- **`attached_assets/generated_images/` and `client/public/blog-images/` are byte-identical duplicates** of the same six PNGs — the same ~9.7MB stored twice in the repo, under two path aliases (`@assets/*` and the public folder). The homepage imports its carousel and portrait images from `attached_assets/`, while content frontmatter references `/blog-images/`.
- **The homepage alone ships ~4.7MB** of that: three carousel slides (1.3MB + 1.7MB + 1.7MB) plus the 1.6MB `about_section_portrait.png`. A `npm run build` confirms all four land in `dist/public/assets/` uncompressed, dwarfing the 462KB JS bundle.

**Tasks**

1. **De-duplicate the two image folders.** Purpose: pick one home for these six files and repoint the other set of references, so compression work happens once and the repo stops carrying two copies.
2. **Compress the existing images.** Purpose: convert to WebP (or JPEG) at a sensible max dimension and update any references; this is the bulk of the win, available immediately.
3. **Fix the intake path.** Purpose: keep new uploads from re-inflating page weight — either add a build-time image transform, or document a compress-before-upload step in the authoring guide from Phase 2. Prefer the automatic option; the mission says the author shouldn't have to manage technical steps.

**Done when:** no image in `blog-images/` is over a few hundred KB, the same file isn't stored in two places, and a new CMS upload doesn't reintroduce a multi-megabyte file.

---

## Phase 7 — Reader conveniences · Polish

**Functionality served:** two small things readers expect, both already backed by data the site has.

**Tasks**

1. **Show a reading-time estimate.** Purpose: `design_guidelines.md` already specifies this in the post metadata bar and `PostPage.tsx` doesn't implement it — closing an agreed design gap. Compute from word count client-side; count Devanagari words correctly rather than assuming whitespace-delimited Latin.
2. **Generate an RSS feed.** Purpose: let readers follow new poetry and articles without checking back. Posts are already structured and dated, so this is a build-time transform over the same content the site loads.
3. **Link the feed from the site.** Purpose: an unadvertised feed is an unused feed — add the `<link rel="alternate">` tag and a visible entry point.

**Done when:** a post shows its reading time, and a feed reader can subscribe to new work.

---

## Phase 8 — Prune unused scaffolding · Polish

**Functionality served:** the repo reads as the static content site it actually is, so future work isn't spent tracing machinery nothing calls.

`server/routes.ts` (empty), `server/storage.ts` (unused `MemStorage`), `shared/schema.ts` + Drizzle, Passport, and `express-session` are all present with nothing calling them — no routes are registered, and there are no `useQuery`/`useMutation` calls anywhere in the client despite TanStack Query being wired up in `App.tsx`. This phase should wait until Phase 1 has confirmed static hosting is the long-term direction.

**Tasks**

1. **Remove the dead server modules.** Purpose: delete `server/routes.ts` and `server/storage.ts` and their wiring.
2. **Remove the database layer.** Purpose: delete `shared/schema.ts` and `drizzle.config.ts`, drop the Drizzle dependency and the `db:push` script — there is no database and the mission says there shouldn't be.
3. **Remove the auth dependencies.** Purpose: drop Passport and `express-session` and any config referencing them; authoring is authenticated by GitHub OAuth in Phase 2, not by the app.
4. **Re-evaluate TanStack Query.** Purpose: it's wired into `App.tsx` but nothing queries anything — keep it only if a concrete use is in view, otherwise remove the provider too.
5. **Update the docs.** Purpose: bring `CLAUDE.md` and `spec/tech-stack.md` in line with what remains, so the next contributor's mental model matches the code.

**Done when:** `npm run check` passes, the site builds and deploys unchanged, and nothing in the repo describes machinery that isn't there.

---

## Explicitly out of scope

Per `mission.md`'s non-goals: multi-author support, comments, monetization or ads, and turning this into a general-purpose CMS product are not on this roadmap. If any of these becomes genuinely needed, that starts as a mission-level conversation, not a spec addition.
