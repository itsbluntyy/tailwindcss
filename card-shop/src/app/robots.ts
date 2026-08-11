import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        // Card photos are served from /api/images and must stay crawlable so
        // they can appear in Google Images and product results.
        allow: ["/", "/api/images/"],
        disallow: ["/admin", "/api/", "/cart", "/checkout"],
      },
    ],
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
