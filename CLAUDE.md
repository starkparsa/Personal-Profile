# Personal Profile

Vaibhav Parasa's personal site: experience/skills/projects + a blog, built with Astro,
deployed to GitHub Pages via GitHub Actions, and content-edited through Decap CMS at
`/admin` (git-backed, no code editing required). Full setup/editing instructions are in
[README.md](README.md).

## Stack

- **Astro 7** (static output), content stored as Markdown via the Content Layer API
- Hand-written CSS (no framework) — dark, monospace-accented "ML engineer" design system
  in `src/styles/global.css` (CSS custom properties for the palette)
- **Decap CMS** mounted at `public/admin/` — `github` backend via a Cloudflare Worker OAuth
  proxy (see README for the one-time setup)
- Deploys to **GitHub Pages** (project site at `/Personal-Profile`) via
  `.github/workflows/deploy.yml` using `withastro/action`

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

Node.js must be on `PATH`. On this machine it's installed at `C:\Program Files\nodejs` —
if a shell doesn't have it on `PATH`, prepend it manually. `.claude/launch.json` +
`.claude/dev.cmd` wrap this for the Browser-pane preview tool.

```bash
npm run dev      # local dev server at /Personal-Profile/ base path
npm run build    # static build to dist/ — run this to verify changes before committing
npm run preview  # serve the production build locally
```

## Content model — where things live

| Content | File(s) |
|---|---|
| Name, tagline, bio, skills, social links, résumé path | `src/data/site.json` |
| Work experience (one entry per role) | `src/content/experience/*.md` (frontmatter: company, role, location, startDate, endDate, order) |
| Projects | `src/content/projects/*.md` (frontmatter: title, description, tags, githubUrl, liveUrl, status, featured, date) |
| Blog posts | `src/content/blog/*.md` (frontmatter: title, description, date, tags, draft) |
| Résumé PDF | `public/resume.pdf` |
| Collection schemas | `src/content.config.ts` (Zod schemas — keep in sync with `public/admin/config.yml` fields) |

**Important:** `src/content.config.ts` (Astro's Content Layer API, Astro 6+) — not the
legacy `src/content/config.ts`. If you add/rename a frontmatter field, update it in three
places: the Zod schema here, `public/admin/config.yml`'s matching collection fields, and
any component reading `entry.data.*`.

## Base-path links

The site deploys under `/Personal-Profile` (a GitHub Pages *project* site, not a
`<user>.github.io` root site). Every internal `href` — nav, footer, resume links, blog
links, favicon — must go through `withBase()` from `src/utils/paths.ts` rather than a bare
`/path`. External links (GitHub, LinkedIn, mailto) do not need this. If this repo is ever
renamed to `starkparsa.github.io`, drop `base` from `astro.config.mjs` and remove the
`withBase()` wrapping (or leave it — it degrades to a no-op when `base` is `/`).

## Design system

Dark-first, single teal accent (`--accent: #2dd4bf`), JetBrains Mono for
headings/labels/nav, Inter for body copy. Reusable primitives in `global.css`: `.section`,
`.section-label`, `.card`, `.pill`, `.btn` / `.btn-accent`. Prefer these over new ad-hoc
classes when building new sections.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Content collections (Content Layer API)](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Deploying to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Decap CMS configuration](https://decapcms.org/docs/configuration-options/)
