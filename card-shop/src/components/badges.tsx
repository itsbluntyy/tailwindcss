import { conditionShort, type CardConditionInfo } from "@/lib/format";

export function ConditionBadge({ card }: { card: CardConditionInfo }) {
  const graded = card.conditionType === "GRADED";
  return (
    <span
      className={
        graded
          ? "inline-flex items-center rounded-md border border-gold-500/50 bg-gold-500/10 px-1.5 py-0.5 text-xs font-semibold text-gold-300"
          : "inline-flex items-center rounded-md border border-navy-600 bg-navy-800 px-1.5 py-0.5 text-xs font-medium text-ink-300"
      }
    >
      {conditionShort(card)}
    </span>
  );
}

export function RarityBadge({ rarity }: { rarity: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-navy-700/70 px-1.5 py-0.5 text-xs font-medium text-ink-300">
      {rarity}
    </span>
  );
}

export function SoldBadge() {
  return (
    <span className="inline-flex items-center rounded-md bg-red-500/15 px-1.5 py-0.5 text-xs font-semibold text-red-400">
      Sold
    </span>
  );
}
