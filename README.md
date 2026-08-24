# Personal Profile

Vaibhav Parasa's personal site — experience, skills, projects, and a blog. Built with
[Astro](https://astro.build), hosted for free on GitHub Pages, and editable through a
[Decap CMS](https://decapcms.org) admin panel at `/admin` — no code editing required for
day-to-day updates.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:4321/Personal-Profile/` (the site is configured for a GitHub Pages
*project* site — see `astro.config.mjs`).

```bash
npm run build    # static build to dist/
npm run preview  # preview the production build locally
```

## Editing content without touching code

All content lives in plain files that the CMS edits for you:

| What | Where |
|---|---|
| Name, tagline, bio, skills, social links, résumé | `src/data/site.json` |
| Work experience | `src/content/experience/*.md` |
| Projects | `src/content/projects/*.md` |
| Blog posts | `src/content/blog/*.md` |
| Résumé PDF | `public/resume.pdf` |

You can edit these files directly, **or** — the intended workflow — log into `/admin` on
the deployed site and use the form-based editor. Every save there commits straight to
`main` and GitHub Actions automatically rebuilds and redeploys the site.

### One-time setup to enable `/admin` editing

`/admin` needs a GitHub OAuth App plus a tiny token-exchange proxy, because GitHub Pages
only serves static files and can't complete an OAuth handshake itself. This is a one-time,
free setup:

1. **Register a GitHub OAuth App**
   GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Homepage URL: `https://starkparsa.github.io/Personal-Profile/`
   - Authorization callback URL: `https://<your-worker-subdomain>.workers.dev/callback`
     (fill this in after step 2, then come back and update it)
   - Save the generated **Client ID** and **Client Secret**.

2. **Deploy the OAuth proxy to Cloudflare Workers (free tier)**
   Use [ottmartens/decap-cms-github-oauth-provider-cloudflare](https://github.com/ottmartens/decap-cms-github-oauth-provider-cloudflare):
   - Fork/clone it, deploy with `wrangler deploy` (free Cloudflare account).
   - Set `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET` as Worker secrets from step 1.
   - Note the deployed Worker URL (e.g. `https://decap-oauth.<you>.workers.dev`).

3. **Point the CMS at your Worker**
   Edit `public/admin/config.yml` and replace the placeholder `base_url` with your real
   Worker URL from step 2, then commit and push.

4. **Enable GitHub Pages**
   Repo → Settings → Pages → Source: **GitHub Actions**. Push to `main` (or re-run the
   `deploy.yml` workflow) to trigger the first deploy.

5. Visit `https://starkparsa.github.io/Personal-Profile/admin/`, log in with GitHub, and
   start editing.

**Testing the CMS locally without OAuth**, to check the forms/collections before wiring
step 1–3:

```bash
npx decap-server
```

then open `http://localhost:4321/Personal-Profile/admin/#/` in another terminal running
`npm run dev` — the config's `local_backend: true` lets Decap talk to your local git repo
directly instead of GitHub.

## Deployment

`.github/workflows/deploy.yml` builds the site with `withastro/action` and deploys to
GitHub Pages on every push to `main`. No manual deploy step — CMS saves and direct pushes
both trigger it automatically.

## Project structure

```
public/
  admin/            # Decap CMS (index.html + config.yml)
  resume.pdf         # Downloadable résumé
src/
  content.config.ts  # Content collection schemas (experience, projects, blog)
  content/            # Markdown content, one file per entry
  data/site.json       # Bio, skills, social links, résumé path
  components/, layouts/, pages/
```

## Known follow-ups

- Project entries currently link to the GitHub profile (`github.com/starkparsa`) rather
  than per-project repos — update `githubUrl` in each `src/content/projects/*.md` file
  (or via the CMS) once those repos are public/named.
- Consider renaming this repo to `starkparsa.github.io` for a root-domain URL instead of
  `/Personal-Profile` — update `astro.config.mjs`'s `base` (or remove it) if you do.
