/**
 * Absolute base URL of the deployed site, used for canonical URLs, the
 * sitemap, Open Graph images, and structured data. Set NEXT_PUBLIC_SITE_URL
 * in production (e.g. https://your-shop.vercel.app); falls back to the URL
 * Vercel provides, then localhost for development.
 */
export function siteUrl(): string {
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
  return explicit.replace(/\/+$/, "");
}
