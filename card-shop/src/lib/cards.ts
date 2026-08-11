import { prisma } from "./db";
import type { Prisma } from "@prisma/client";

export type CardFilters = {
  q?: string;
  set?: string;
  rarity?: string;
  condition?: string; // NM | LP | MP | GRADED | PSA | CGC | BGS
  min?: string;
  max?: string;
  sort?: string; // newest | price-asc | price-desc
};

export function buildCardWhere(f: CardFilters): Prisma.CardWhereInput {
  const where: Prisma.CardWhereInput = {};
  const and: Prisma.CardWhereInput[] = [];

  if (f.q) {
    and.push({
      OR: [
        { name: { contains: f.q } },
        { setName: { contains: f.q } },
        { cardNumber: { contains: f.q } },
      ],
    });
  }
  if (f.set) and.push({ setName: f.set });
  if (f.rarity) and.push({ rarity: f.rarity });

  if (f.condition) {
    if (f.condition === "GRADED") {
      and.push({ conditionType: "GRADED" });
    } else if (["PSA", "CGC", "BGS"].includes(f.condition)) {
      and.push({ conditionType: "GRADED", grader: f.condition });
    } else {
      and.push({ conditionType: "RAW", rawCondition: f.condition });
    }
  }

  const min = Number(f.min);
  const max = Number(f.max);
  if (f.min && !Number.isNaN(min)) and.push({ priceCents: { gte: Math.round(min * 100) } });
  if (f.max && !Number.isNaN(max)) and.push({ priceCents: { lte: Math.round(max * 100) } });

  if (and.length) where.AND = and;
  return where;
}

export function cardOrderBy(sort?: string): Prisma.CardOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ priceCents: "asc" }];
    case "price-desc":
      return [{ priceCents: "desc" }];
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function distinctSetsAndRarities() {
  const [sets, rarities] = await Promise.all([
    prisma.card.findMany({ distinct: ["setName"], select: { setName: true }, orderBy: { setName: "asc" } }),
    prisma.card.findMany({ distinct: ["rarity"], select: { rarity: true }, orderBy: { rarity: "asc" } }),
  ]);
  return {
    sets: sets.map((s) => s.setName),
    rarities: rarities.map((r) => r.rarity),
  };
}

export const cardWithImages = {
  images: { orderBy: { sortOrder: "asc" as const } },
};
