"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

export function Navbar() {
  const { ids, ready } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-navy-700/60 bg-navy-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gold-400 text-sm font-bold text-gold-400">
            V
          </span>
          <span className="text-lg font-semibold tracking-tight text-ink-100">
            The Card Vault
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/cards"
            className="rounded-lg px-3 py-2 text-sm font-medium text-ink-300 hover:bg-navy-800 hover:text-ink-100"
          >
            Browse
          </Link>
          <Link
            href="/cart"
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-ink-300 hover:bg-navy-800 hover:text-ink-100"
          >
            <span className="flex items-center gap-1.5">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <span className="hidden sm:inline">Cart</span>
            </span>
            {ready && ids.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-navy-950">
                {ids.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
