import type { CardFilters } from "@/lib/cards";

const CONDITION_OPTIONS = [
  ["", "Any condition"],
  ["NM", "Raw — Near Mint"],
  ["LP", "Raw — Lightly Played"],
  ["MP", "Raw — Moderately Played"],
  ["GRADED", "Graded — any"],
  ["PSA", "Graded — PSA"],
  ["CGC", "Graded — CGC"],
  ["BGS", "Graded — BGS"],
];

const SORT_OPTIONS = [
  ["newest", "Newest first"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
];

const selectClass =
  "w-full rounded-lg border border-navy-600 bg-navy-800 px-3 py-2.5 text-sm text-ink-100 focus:border-gold-400 focus:outline-none";

export function FilterBar({
  filters,
  sets,
  rarities,
}: {
  filters: CardFilters;
  sets: string[];
  rarities: string[];
}) {
  return (
    <form
      method="GET"
      action="/cards"
      className="rounded-xl border border-navy-700/60 bg-navy-900 p-4"
    >
      <div className="flex flex-col gap-3">
        <input
          type="search"
          name="q"
          defaultValue={filters.q ?? ""}
          placeholder="Search by name, set, or number…"
          className={selectClass}
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <select name="set" defaultValue={filters.set ?? ""} className={selectClass}>
            <option value="">Any set</option>
            {sets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select name="rarity" defaultValue={filters.rarity ?? ""} className={selectClass}>
            <option value="">Any rarity</option>
            {rarities.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select name="condition" defaultValue={filters.condition ?? ""} className={selectClass}>
            {CONDITION_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select name="sort" defaultValue={filters.sort ?? "newest"} className={selectClass}>
            {SORT_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2">
            <input
              type="number"
              name="min"
              min={0}
              step="0.01"
              defaultValue={filters.min ?? ""}
              placeholder="Min $"
              className={selectClass}
            />
            <span className="text-ink-500">–</span>
            <input
              type="number"
              name="max"
              min={0}
              step="0.01"
              defaultValue={filters.max ?? ""}
              placeholder="Max $"
              className={selectClass}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-gold-400 px-5 py-2.5 text-sm font-bold text-navy-950 transition hover:bg-gold-300"
            >
              Apply
            </button>
            <a
              href="/cards"
              className="rounded-lg border border-navy-600 px-4 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-navy-800"
            >
              Reset
            </a>
          </div>
        </div>
      </div>
    </form>
  );
}
