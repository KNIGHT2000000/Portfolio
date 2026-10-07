/**
 * Resolves internal URLs respecting Astro's base configuration.
 * Handles both root deployments ('/') and GitHub repository sub-paths ('/portfolio/').
 */
export function resolveUrl(path: string): string {
  if (!path) return '';
  // External or absolute protocol links
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:')) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${cleanBase}${cleanPath}`;
}
