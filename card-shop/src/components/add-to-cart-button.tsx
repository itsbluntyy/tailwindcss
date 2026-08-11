"use client";

import Link from "next/link";
import { useCart } from "./cart-context";

export function AddToCartButton({ cardId, sold }: { cardId: string; sold: boolean }) {
  const cart = useCart();
  const inCart = cart.has(cardId);

  if (sold) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-xl bg-navy-700 px-6 py-3.5 text-base font-semibold text-ink-500"
      >
        Sold out
      </button>
    );
  }

  if (inCart) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/cart"
          className="flex-1 rounded-xl bg-gold-400 px-6 py-3.5 text-center text-base font-bold text-navy-950 transition hover:bg-gold-300"
        >
          View cart &amp; checkout
        </Link>
        <button
          onClick={() => cart.remove(cardId)}
          className="rounded-xl border border-navy-600 px-6 py-3.5 text-base font-medium text-ink-300 transition hover:bg-navy-800"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => cart.add(cardId)}
      className="w-full rounded-xl bg-gold-400 px-6 py-3.5 text-base font-bold text-navy-950 transition hover:bg-gold-300"
    >
      Add to cart
    </button>
  );
}
