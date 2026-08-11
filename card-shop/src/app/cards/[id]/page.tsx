import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { money, conditionLong } from "@/lib/format";
import { ImageGallery } from "@/components/image-gallery";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { RarityBadge, SoldBadge } from "@/components/badges";

export const dynamic = "force-dynamic";

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!card) notFound();

  const sold = card.status === "SOLD";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/cards" className="text-sm text-ink-400 hover:text-ink-100">
        ← Back to all cards
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <ImageGallery images={card.images} alt={card.name} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <RarityBadge rarity={card.rarity} />
            {sold && <SoldBadge />}
          </div>
          <h1 className="mt-2 text-2xl font-bold text-ink-100 sm:text-3xl">{card.name}</h1>
          <p className="mt-1 text-ink-400">
            {card.setName} · #{card.cardNumber}
          </p>

          <div className="mt-5 rounded-xl border border-navy-700/60 bg-navy-900 p-4">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-ink-500">Condition</dt>
                <dd className="mt-0.5 font-semibold text-ink-100">{conditionLong(card)}</dd>
              </div>
              <div>
                <dt className="text-ink-500">Set</dt>
                <dd className="mt-0.5 font-semibold text-ink-100">{card.setName}</dd>
              </div>
              <div>
                <dt className="text-ink-500">Card number</dt>
                <dd className="mt-0.5 font-semibold text-ink-100">#{card.cardNumber}</dd>
              </div>
              <div>
                <dt className="text-ink-500">Rarity</dt>
                <dd className="mt-0.5 font-semibold text-ink-100">{card.rarity}</dd>
              </div>
            </dl>
          </div>

          {card.description && (
            <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-ink-300">
              {card.description}
            </p>
          )}

          <p className="mt-6 text-3xl font-bold text-gold-300">{money(card.priceCents)}</p>

          <div className="mt-4">
            <AddToCartButton cardId={card.id} sold={sold} />
          </div>

          <p className="mt-4 text-xs text-ink-500">
            Ships sleeved and top-loaded in a rigid mailer within 2 business days. Secure
            payment via Stripe.
          </p>
        </div>
      </div>
    </div>
  );
}
