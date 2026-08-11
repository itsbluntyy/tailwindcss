import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const cards = await prisma.card.findMany({
    where: { status: "AVAILABLE" },
    select: { id: true, updatedAt: true },
    orderBy: { createdAt: "desc" },
  });

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/cards`, changeFrequency: "daily", priority: 0.9 },
    ...cards.map((card) => ({
      url: `${base}/cards/${card.id}`,
      lastModified: card.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
