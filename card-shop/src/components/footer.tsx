import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-navy-700/60 bg-navy-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center text-sm text-ink-400 sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-medium text-ink-300">The Card Vault</p>
          <p className="mt-1">Pokémon singles &amp; graded slabs. Carefully packed, quickly shipped.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cards" className="hover:text-ink-100">
            Browse cards
          </Link>
          <Link href="/admin" className="hover:text-ink-100">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
