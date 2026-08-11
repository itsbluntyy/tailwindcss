export function money(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export const RAW_CONDITIONS: Record<string, string> = {
  NM: "Near Mint",
  LP: "Lightly Played",
  MP: "Moderately Played",
};

export type CardConditionInfo = {
  conditionType: string;
  rawCondition: string | null;
  grader: string | null;
  grade: string | null;
};

/** Short label, e.g. "PSA 10" or "NM". */
export function conditionShort(card: CardConditionInfo): string {
  if (card.conditionType === "GRADED") {
    return `${card.grader ?? ""} ${card.grade ?? ""}`.trim();
  }
  return card.rawCondition ?? "Raw";
}

/** Long label, e.g. "Graded — PSA 10" or "Raw — Near Mint". */
export function conditionLong(card: CardConditionInfo): string {
  if (card.conditionType === "GRADED") {
    return `Graded — ${conditionShort(card)}`;
  }
  return `Raw — ${RAW_CONDITIONS[card.rawCondition ?? ""] ?? card.rawCondition ?? "Ungraded"}`;
}

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
