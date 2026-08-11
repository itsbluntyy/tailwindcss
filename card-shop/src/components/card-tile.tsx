import Link from "next/link";
import { money } from "@/lib/format";
import { ConditionBadge, RarityBadge, SoldBadge } from "./badges";

export type CardTileData = {
  id: string;
  name: string;
  setName: string;
  cardNumber: string;
  rarity: string;
  conditionType: string;
  rawCondition: string | null;
  grader: string | null;
  grade: string | null;
  priceCents: number;
  status: string;
  images: { id: string }[];
};

export function CardTile({ card }: { card: CardTileData }) {
  const sold = card.status === "SOLD";
  const image = card.images[0];

  return (
    <Link
      href={`/cards/${card.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-navy-700/60 bg-navy-900 transition hover:border-gold-500/40 hover:shadow-lg hover:shadow-gold-500/5"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-navy-800">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/images/${image.id}`}
            alt={card.name}
            className={`h-full w-full object-cover transition duration-300 group-hover:scale-[1.03] ${sold ? "opacity-50" : ""}`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-500">No photo</div>
        )}
        {sold && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-navy-950/80 py-1.5 text-center text-sm font-bold tracking-widest text-red-400 uppercase">
            Sold
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-sm leading-snug font-semibold text-ink-100">{card.name}</p>
        <p className="text-xs text-ink-400">
          {card.setName} · #{card.cardNumber}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <ConditionBadge card={card} />
          <RarityBadge rarity={card.rarity} />
          {sold && <SoldBadge />}
        </div>
        <p className="mt-auto pt-1.5 text-base font-bold text-gold-300">{money(card.priceCents)}</p>
      </div>
    </Link>
  );
}
