import Link from "next/link";
import { prisma } from "@/lib/db";
import { money, conditionShort, formatDate } from "@/lib/format";
import { markSold, markAvailable, deleteCard } from "./actions";

export const dynamic = "force-dynamic";

function StatTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-navy-700/60 bg-navy-900 p-4">
      <p className="text-xs font-medium tracking-wide text-ink-500 uppercase">{label}</p>
      <p className={`mt-1 text-xl font-bold ${accent ? "text-gold-300" : "text-ink-100"}`}>
        {value}
      </p>
    </div>
  );
}

export default async function AdminDashboard() {
  const cards = await prisma.card.findMany({
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  const available = cards.filter((c) => c.status === "AVAILABLE");
  const sold = cards.filter((c) => c.status === "SOLD");

  const inventoryValue = available.reduce((s, c) => s + c.priceCents, 0);
  const inventoryCost = available.reduce((s, c) => s + c.costCents, 0);
  const revenue = sold.reduce((s, c) => s + (c.soldPriceCents ?? 0), 0);
  const soldCost = sold.reduce((s, c) => s + c.costCents, 0);
  const profit = revenue - soldCost;

  return (
    <div className="flex flex-col gap-8">
      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatTile label="Listed cards" value={String(available.length)} />
        <StatTile label="Inventory value" value={money(inventoryValue)} />
        <StatTile label="Cards sold" value={String(sold.length)} />
        <StatTile label="Revenue" value={money(revenue)} />
        <StatTile label="Profit" value={money(profit)} accent />
      </section>

      {/* Inventory */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-ink-100">Inventory</h2>
        {cards.length === 0 ? (
          <p className="rounded-xl border border-navy-700/60 bg-navy-900 p-8 text-center text-ink-400">
            No cards yet.{" "}
            <Link href="/admin/cards/new" className="text-gold-400 hover:underline">
              Add your first card →
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-navy-700/60 bg-navy-900">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-700/60 text-xs tracking-wide text-ink-500 uppercase">
                  <th className="p-3">Card</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Cost</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cards.map((card) => (
                  <tr key={card.id} className="border-b border-navy-800 last:border-0">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        {card.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/api/images/${card.images[0].id}`}
                            alt=""
                            className="h-12 w-9 rounded object-cover"
                          />
                        ) : (
                          <div className="h-12 w-9 rounded bg-navy-800" />
                        )}
                        <div>
                          <Link
                            href={`/cards/${card.id}`}
                            className="font-semibold text-ink-100 hover:text-gold-300"
                          >
                            {card.name}
                            {card.featured && <span className="ml-1.5 text-gold-400">★</span>}
                          </Link>
                          <p className="text-xs text-ink-500">
                            {card.setName} · #{card.cardNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-ink-300">{conditionShort(card)}</td>
                    <td className="p-3 font-semibold text-ink-100">{money(card.priceCents)}</td>
                    <td className="p-3 text-ink-300">{money(card.costCents)}</td>
                    <td className="p-3">
                      {card.status === "SOLD" ? (
                        <span className="font-semibold text-red-400">
                          Sold {money(card.soldPriceCents ?? 0)}
                        </span>
                      ) : (
                        <span className="text-emerald-400">Available</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/cards/${card.id}/edit`}
                          className="rounded-md border border-navy-600 px-2.5 py-1.5 text-xs font-medium text-ink-300 hover:bg-navy-800"
                        >
                          Edit
                        </Link>
                        {card.status === "AVAILABLE" ? (
                          <form action={markSold} className="flex items-center gap-1.5">
                            <input type="hidden" name="id" value={card.id} />
                            <input
                              type="number"
                              name="soldPrice"
                              step="0.01"
                              min={0}
                              placeholder={(card.priceCents / 100).toFixed(2)}
                              className="w-20 rounded-md border border-navy-600 bg-navy-800 px-2 py-1.5 text-xs text-ink-100 focus:border-gold-400 focus:outline-none"
                            />
                            <button className="rounded-md bg-gold-500/20 px-2.5 py-1.5 text-xs font-semibold text-gold-300 hover:bg-gold-500/30">
                              Mark sold
                            </button>
                          </form>
                        ) : (
                          <form action={markAvailable}>
                            <input type="hidden" name="id" value={card.id} />
                            <button className="rounded-md border border-navy-600 px-2.5 py-1.5 text-xs font-medium text-ink-300 hover:bg-navy-800">
                              Relist
                            </button>
                          </form>
                        )}
                        <form action={deleteCard}>
                          <input type="hidden" name="id" value={card.id} />
                          <button className="rounded-md px-2 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10">
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Profit tracker */}
      <section>
        <h2 className="mb-3 text-lg font-bold text-ink-100">Profit tracker</h2>
        {sold.length === 0 ? (
          <p className="rounded-xl border border-navy-700/60 bg-navy-900 p-8 text-center text-ink-400">
            Nothing sold yet — profits will show up here.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-navy-700/60 bg-navy-900">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-700/60 text-xs tracking-wide text-ink-500 uppercase">
                  <th className="p-3">Card</th>
                  <th className="p-3">Sold on</th>
                  <th className="p-3">Paid</th>
                  <th className="p-3">Sold for</th>
                  <th className="p-3">Profit</th>
                </tr>
              </thead>
              <tbody>
                {sold.map((card) => {
                  const p = (card.soldPriceCents ?? 0) - card.costCents;
                  return (
                    <tr key={card.id} className="border-b border-navy-800 last:border-0">
                      <td className="p-3">
                        <p className="font-semibold text-ink-100">{card.name}</p>
                        <p className="text-xs text-ink-500">
                          {card.setName} · {conditionShort(card)}
                        </p>
                      </td>
                      <td className="p-3 text-ink-300">{formatDate(card.soldAt)}</td>
                      <td className="p-3 text-ink-300">{money(card.costCents)}</td>
                      <td className="p-3 text-ink-100">{money(card.soldPriceCents ?? 0)}</td>
                      <td
                        className={`p-3 font-bold ${p >= 0 ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {p >= 0 ? "+" : "−"}
                        {money(Math.abs(p))}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-navy-800/50">
                  <td className="p-3 font-bold text-ink-100" colSpan={2}>
                    Totals
                  </td>
                  <td className="p-3 font-bold text-ink-100">{money(soldCost)}</td>
                  <td className="p-3 font-bold text-ink-100">{money(revenue)}</td>
                  <td
                    className={`p-3 font-bold ${profit >= 0 ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {profit >= 0 ? "+" : "−"}
                    {money(Math.abs(profit))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
