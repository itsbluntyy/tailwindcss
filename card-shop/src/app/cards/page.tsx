import { prisma } from "@/lib/db";
import {
  buildCardWhere,
  cardOrderBy,
  distinctSetsAndRarities,
  type CardFilters,
} from "@/lib/cards";
import { CardTile } from "@/components/card-tile";
import { FilterBar } from "@/components/filter-bar";

export const dynamic = "force-dynamic";

export const metadata = { title: "Browse cards" };

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filters: CardFilters = {
    q: typeof params.q === "string" ? params.q : undefined,
    set: typeof params.set === "string" ? params.set : undefined,
    rarity: typeof params.rarity === "string" ? params.rarity : undefined,
    condition: typeof params.condition === "string" ? params.condition : undefined,
    min: typeof params.min === "string" ? params.min : undefined,
    max: typeof params.max === "string" ? params.max : undefined,
    sort: typeof params.sort === "string" ? params.sort : undefined,
  };

  const [{ sets, rarities }, cards] = await Promise.all([
    distinctSetsAndRarities(),
    prisma.card.findMany({
      where: buildCardWhere(filters),
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: [{ status: "asc" }, ...cardOrderBy(filters.sort)],
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-5 text-2xl font-bold text-ink-100">Browse cards</h1>

      <FilterBar filters={filters} sets={sets} rarities={rarities} />

      <p className="mt-5 mb-3 text-sm text-ink-400">
        {cards.length} {cards.length === 1 ? "card" : "cards"}
      </p>

      {cards.length === 0 ? (
        <p className="rounded-xl border border-navy-700/60 bg-navy-900 p-10 text-center text-ink-400">
          No cards match those filters. Try widening your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <CardTile key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
