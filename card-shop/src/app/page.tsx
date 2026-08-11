import Link from "next/link";
import { prisma } from "@/lib/db";
import { CardTile } from "@/components/card-tile";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, recent] = await Promise.all([
    prisma.card.findMany({
      where: { featured: true, status: "AVAILABLE" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.card.findMany({
      where: { status: "AVAILABLE" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-navy-700/60 bg-gradient-to-b from-navy-900 to-navy-950">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="text-sm font-semibold tracking-widest text-gold-400 uppercase">
            Pokémon singles &amp; graded slabs
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl leading-tight font-bold text-ink-100 sm:text-5xl">
            Collect with confidence.
          </h1>
          <p className="mt-4 max-w-xl text-base text-ink-400 sm:text-lg">
            Every card photographed front and back, described honestly, and shipped in a
            protective sleeve within two business days.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/cards"
              className="rounded-xl bg-gold-400 px-6 py-3 text-base font-bold text-navy-950 transition hover:bg-gold-300"
            >
              Browse all cards
            </Link>
            <Link
              href="/cards?condition=GRADED"
              className="rounded-xl border border-navy-600 px-6 py-3 text-base font-medium text-ink-300 transition hover:bg-navy-800"
            >
              Shop graded slabs
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-12">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-bold text-ink-100">Featured cards</h2>
            <Link href="/cards" className="text-sm font-medium text-gold-400 hover:text-gold-300">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {featured.map((card) => (
              <CardTile key={card.id} card={card} />
            ))}
          </div>
        </section>
      )}

      {/* Recent listings */}
      <section className="mx-auto max-w-6xl px-4 pt-12">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-ink-100">Recent listings</h2>
          <Link href="/cards" className="text-sm font-medium text-gold-400 hover:text-gold-300">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="rounded-xl border border-navy-700/60 bg-navy-900 p-8 text-center text-ink-400">
            No cards listed yet. Check back soon!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {recent.map((card) => (
              <CardTile key={card.id} card={card} />
            ))}
          </div>
        )}
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="grid gap-4 rounded-2xl border border-navy-700/60 bg-navy-900 p-6 sm:grid-cols-3">
          {[
            ["Accurate grading", "Raw cards graded conservatively — NM means NM."],
            ["Secure packaging", "Sleeved, top-loaded, and shipped in rigid mailers."],
            ["Safe checkout", "Payments handled by Stripe. Card details never touch our servers."],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="font-semibold text-gold-300">{title}</p>
              <p className="mt-1 text-sm text-ink-400">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
