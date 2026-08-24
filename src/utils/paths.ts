/**
 * Prefixes an absolute internal path (e.g. "/projects", "/resume.pdf") with the
 * site's configured base path, so links work whether the site deploys at the
 * domain root or under a GitHub Pages project subpath (e.g. /Personal-Profile).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
