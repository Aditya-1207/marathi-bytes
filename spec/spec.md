# Specification & Roadmap

This document tracks what the project needs next, in service of [mission.md](./mission.md).

**How it's organized.** Work is grouped into **phases**. Each phase delivers one distinct piece of functionality and is worth shipping on its own — you should be able to stop after any phase and have left the project in a coherent state. Within a phase, each **task** has a single purpose and is sized to land as roughly one commit (a guideline, not a rule).

Each phase is labelled with a tier:

- **Core** — the mission is not actually fulfilled without it. These are half-built or missing pieces that block a stated goal in `mission.md`.
- **Polish** — real improvements grounded in gaps observed in this codebase, not speculative features. Valuable, but the mission stands without them.

Anything not listed here should be checked against `mission.md`'s non-goals before being added to any phase.

## Current state

The site is a client-rendered React SPA. Content is authored as Markdown with YAML frontmatter under `client/src/content/{poetry,articles,ukhane,instagram}/` and compiled into the JS bundle at build time — there is no runtime database or API. A Decap CMS instance at `/admin` gives the author a web form for creating and editing posts; it is verified working end-to-end, but only against a local git backend. See `CLAUDE.md` for full architecture detail.

Two gaps define everything below: **nothing is deployed to a public URL**, and **the self-service authoring flow only works when someone runs the local test proxy by hand** — which is the opposite of the mission's core promise.

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

## Phase 2 — Production authoring · Core

**Functionality served:** the author can publish a new poem herself, from a browser, with no terminal and no help. This is the single most load-bearing promise in `mission.md`.

Today `client/public/admin/config.yml` runs with `local_backend: true`, meaning the CMS only works when someone runs `npx decap-server` alongside the dev server. The GitHub backend it points at has no OAuth path.

**Decision (2026-08-20):** the author (Aditya's wife) will use a dedicated GitHub account, tied to a dedicated Gmail kept separate from her personal one, and log in through GitHub's own screen — not a "Sign in with Google" button. The alternative (Netlify Identity + Git Gateway, which does offer literal Google sign-in) was ruled out to avoid depending on a second hosting platform just for auth. See `AUTHORING.md` for what she'll actually see.

**Tasks**

1. **Register a GitHub OAuth App** for the production domain. Purpose: give Decap a real identity to authenticate the author against the `Aditya-1207/marathi-bytes` repo. *(Manual step — needs a human in the GitHub UI; instructions in `oauth-proxy/README.md`.)*
2. **Deploy the auth proxy.** Purpose: Decap's GitHub backend needs a small server-side token exchange; built as a Cloudflare Worker in `oauth-proxy/` — this is the one piece that cannot be static. *(Code written; deploying it needs a Cloudflare account — see `oauth-proxy/README.md`.)*
3. **Point the CMS at the proxy.** Purpose: update `config.yml` with the proxy's `base_url`/`auth_endpoint`. *(Done in `config.yml`, but the placeholder `base_url` needs the real `workers.dev` URL once task 2 is deployed.)*
4. **Confirm `local_backend` behaviour is correct for both modes.** Purpose: make sure local testing still works without the local flag hijacking the production login. *(Confirmed: Decap only engages the local proxy when the CMS is loaded from `localhost`, so `local_backend: true` is inert in production — no code change needed, documented in `config.yml`.)*
5. **Add the author as a repo collaborator.** Purpose: Decap commits using the author's own OAuth token, so her GitHub account needs push access to this repo. *(Manual step — Settings → Collaborators; see `oauth-proxy/README.md`.)*
6. **Walk a full publish cycle in production.** Purpose: log in at `/admin`, create a post, edit it, confirm the commit lands on `main` and the change appears on the live site after deploy — end-to-end proof, not component-level confidence.
7. **Write a short authoring guide for the author.** Purpose: a non-developer needs to know the URL, the login step, and what "wait for it to appear" means; without this the flow is technically working but practically unusable. *(Done — `AUTHORING.md`.)*

**Done when:** the author publishes a post start to finish without anyone else touching a terminal.

---

## Phase 3 — One source of truth for content structure · Core

**Functionality served:** the site's notion of "what categories exist" lives in one place, so adding or renaming one is a single edit rather than a hunt.

The `categories` array (id / name / label) is currently hand-duplicated across **four** pages — `HomePage.tsx`, `CategoryPage.tsx`, `PostPage.tsx`, and `AboutPage.tsx` — while `client/src/lib/content.ts` separately maintains its own `CATEGORY_LABELS` and `CATEGORY_DEFAULT_THUMBNAILS` maps. That's six places encoding the same fact. Separately, `content.ts` fully supports an `instagram` category that no navigation, route, or CMS collection references, and whose content folder holds only a `README.md`.

**Tasks**

1. **Decide the `instagram` category's fate.** Purpose: either it's part of the content plan (and needs a route, nav entry, and CMS collection) or it isn't (and the loader support should go). A half-wired category is a permanent source of confusion — resolve it before centralizing, so the shared list encodes a real answer.
2. **Create the shared category module.** Purpose: one exported definition — id, display name, Devanagari label, default thumbnail — that both the UI and `content.ts` consume.
3. **Migrate the four pages to import it.** Purpose: delete the duplicated literals from `HomePage`, `CategoryPage`, `PostPage`, and `AboutPage`.
4. **Migrate `content.ts` to it.** Purpose: fold `CATEGORY_LABELS` and `CATEGORY_DEFAULT_THUMBNAILS` into the shared definition so the loader and the UI can't drift.
5. **Act on the Phase-3-task-1 decision.** Purpose: either wire `instagram` in properly (route + nav + CMS collection) or remove it from the loader, the label/thumbnail maps, and the content folder.

**Done when:** adding a category is one file edit, and `grep` for a category label returns one definition.

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

**Tasks**

1. **Compress the existing images.** Purpose: convert to WebP (or JPEG) at a sensible max dimension and update any references; this is the bulk of the win, available immediately.
2. **Fix the intake path.** Purpose: keep new uploads from re-inflating page weight — either add a build-time image transform, or document a compress-before-upload step in the authoring guide from Phase 2. Prefer the automatic option; the mission says the author shouldn't have to manage technical steps.

**Done when:** no image in `blog-images/` is over a few hundred KB, and a new CMS upload doesn't reintroduce a multi-megabyte file.

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
