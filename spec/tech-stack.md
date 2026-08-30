# Tech Stack

What's actually running this project, why each piece is here, and — importantly — what's present but **not** currently load-bearing. That distinction matters: several pieces below were scaffolded by the original Replit template and are not part of how the site actually works today. See [spec.md](./spec.md) for the plan to prune the unused ones.

## Build & language

| Tool | Role |
|---|---|
| **Vite 5** | Dev server + client build. Client root is `client/`, output goes to `dist/public`. |
| **TypeScript 5.6** | Used across client, server, and shared code (`tsc --noEmit` via `npm run check`; no separate linter is configured). |
| **esbuild** | Bundles the production server entry (`server/index-prod.ts`) into `dist/index.js`. |

## Frontend (this is the actual product)

| Tool | Role |
|---|---|
| **React 18** | UI library. |
| **wouter** | Client-side routing — small, hook-based, no server-rendering support. |
| **Tailwind CSS 3 + shadcn/ui** (`"new-york"` style, Radix UI primitives underneath) | Styling and component primitives. Configured via `components.json`; design tokens and spacing conventions documented in `design_guidelines.md`. |
| **Framer Motion** | Animation (card hover, transitions). |
| **react-markdown** | Renders post body Markdown to HTML on `PostPage`. |
| **lucide-react** / **react-icons** | Icon sets. |
| **js-yaml** | Parses YAML frontmatter in content files — deliberately a real YAML parser (not hand-rolled) so it correctly handles both simple inline frontmatter and the multi-line list style the CMS writes. |
| **@tanstack/react-query** | Installed and wired up (`QueryClientProvider` in `App.tsx`), but **currently unused** — there are no `useQuery`/`useMutation` calls anywhere in the client, because there's no runtime API to query against. |

## Content model

Content is **not** stored in a database. It's Markdown files with YAML frontmatter under `client/src/content/{poetry,articles,ukhane}/*.md`, loaded eagerly at build time via Vite's `import.meta.glob` (see `client/src/lib/content.ts`) and compiled directly into the JS bundle. There is no content API and no runtime fetch for posts. The category list itself lives in `client/src/lib/categories.ts`, which both the loader and the UI read.

**No social media integration.** There is no Instagram/YouTube/Facebook API client, widget, embed script, or access token anywhere in this project, and by decision there should not be — see `spec/spec.md` Phase 3. Social platforms are linked to from `client/src/lib/social.ts` and nothing more; that keeps the site free of third-party JS, tracking cookies, and expiring credentials, all of which `mission.md` rules out.

## Content authoring

**Decap CMS** (`client/public/admin/`) — a git-backed headless CMS. It gives a non-technical author a web form that commits Markdown files with correct frontmatter directly to this repo via the GitHub API, so the content model above stays the single source of truth. Configured for the `Aditya-1207/marathi-bytes` repo, `main` branch; supports local testing without OAuth via `local_backend: true` + `npx decap-server`.

**Production auth** — a Cloudflare Worker (`oauth-proxy/`, deployed separately from the main site) proxies GitHub's OAuth token exchange, since the client secret can't live in the browser. The author logs in with a dedicated GitHub account through GitHub's own screen (not Google sign-in — see `spec.md` Phase 2 for why). See `oauth-proxy/README.md` for deployment and `AUTHORING.md` for the author-facing walkthrough.

## Backend (present, not load-bearing)

These exist because the project was scaffolded from a generic Replit full-stack template. Nothing in the current app actually depends on them — the site is fully static once built:

- **Express 4** — `server/` only serves Vite's dev middleware (dev) or the static build output (prod). `server/routes.ts` registers zero routes.
- **Drizzle ORM + `@neondatabase/serverless`** — a `users` table is defined in `shared/schema.ts`; nothing reads or writes it.
- **Passport (local strategy) + express-session + connect-pg-simple + memorystore** — auth scaffolding with no login flow wired to it anywhere.

## Original scaffold origin

- **Replit** — `.replit`, and the `@replit/vite-plugin-cartographer` / `@replit/vite-plugin-dev-banner` / `@replit/vite-plugin-runtime-error-modal` devDependencies are Replit's AI-agent dev tooling. They're harmless in a non-Replit environment (they no-op outside a Replit container) but are a strong signal of where this codebase came from.

## Tooling notes worth knowing

- **cross-env** was added so `npm run dev` / `npm run start`'s inline `NODE_ENV=...` syntax works on Windows (`cmd.exe` doesn't understand POSIX-style env var prefixes).
- `server.listen(...)` in `server/app.ts` conditionally omits `reusePort` on `win32` — that option is Linux-only and throws `ENOTSUP` on Windows.

## Package manager & runtime

- **npm** (not yarn/pnpm — `package-lock.json` is the lockfile in use).
- **Node.js** — no `.nvmrc`/`engines` field pins a version; developed against Node 24.

## Hosting

**Decided: GitHub Pages**, deployed via GitHub Actions from this repo, at the default project URL:

```
https://Aditya-1207.github.io/marathi-bytes/
```

No custom domain for now — free, zero DNS setup, and a custom domain can be attached later without changing the deploy mechanism. See `spec.md` Phase 1 for the remaining setup tasks (base path, workflow, SPA deep-link handling).
