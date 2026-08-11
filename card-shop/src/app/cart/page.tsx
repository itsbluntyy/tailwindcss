"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-context";
import { money, conditionShort } from "@/lib/format";

type CartItem = {
  id: string;
  name: string;
  setName: string;
  cardNumber: string;
  conditionType: string;
  rawCondition: string | null;
  grader: string | null;
  grade: string | null;
  priceCents: number;
  status: string;
  imageId: string | null;
};

export default function CartPage() {
  const cart = useCart();
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cart.ready) return;
    if (cart.ids.length === 0) {
      setItems([]);
      return;
    }
    fetch("/api/cart-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: cart.ids }),
    })
      .then((r) => r.json())
      .then((data) => setItems(data.items))
      .catch(() => setError("Couldn't load your cart. Please refresh."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.ready, cart.ids.join(",")]);

  const available = (items ?? []).filter((i) => i.status === "AVAILABLE");
  const unavailable = (items ?? []).filter((i) => i.status !== "AVAILABLE");
  const subtotal = available.reduce((sum, i) => sum + i.priceCents, 0);

  async function checkout() {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: available.map((i) => i.id) }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink-100">Your cart</h1>

      {!cart.ready || items === null ? (
        <p className="text-ink-400">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-navy-700/60 bg-navy-900 p-10 text-center">
          <p className="text-ink-400">Your cart is empty.</p>
          <Link
            href="/cards"
            className="mt-4 inline-block rounded-xl bg-gold-400 px-6 py-3 font-bold text-navy-950 transition hover:bg-gold-300"
          >
            Browse cards
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {unavailable.length > 0 && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {unavailable.length === 1 ? "One card in your cart is" : "Some cards in your cart are"}{" "}
              no longer available and won&apos;t be included at checkout.
            </div>
          )}

          {items.map((item) => {
            const gone = item.status !== "AVAILABLE";
            return (
              <div
                key={item.id}
                className={`flex items-center gap-4 rounded-xl border border-navy-700/60 bg-navy-900 p-3 ${gone ? "opacity-60" : ""}`}
              >
                <Link href={`/cards/${item.id}`} className="shrink-0">
                  {item.imageId ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/images/${item.imageId}`}
                      alt={item.name}
                      className="h-20 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-16 items-center justify-center rounded-lg bg-navy-800 text-xs text-ink-500">
                      —
                    </div>
                  )}
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/cards/${item.id}`}
                    className="block truncate font-semibold text-ink-100 hover:text-gold-300"
                  >
                    {item.name}
                  </Link>
                  <p className="truncate text-sm text-ink-400">
                    {item.setName} · #{item.cardNumber} · {conditionShort(item)}
                  </p>
                  {gone && <p className="text-sm font-medium text-red-400">No longer available</p>}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold text-gold-300">{money(item.priceCents)}</span>
                  <button
                    onClick={() => cart.remove(item.id)}
                    className="text-xs text-ink-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="mt-2 rounded-xl border border-navy-700/60 bg-navy-900 p-4">
            <div className="flex items-center justify-between">
              <span className="text-ink-300">Subtotal ({available.length} items)</span>
              <span className="text-xl font-bold text-ink-100">{money(subtotal)}</span>
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <button
              onClick={checkout}
              disabled={checkingOut || available.length === 0}
              className="mt-4 w-full rounded-xl bg-gold-400 px-6 py-3.5 text-base font-bold text-navy-950 transition hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkingOut ? "Redirecting to Stripe…" : "Checkout with Stripe"}
            </button>
            <p className="mt-3 text-center text-xs text-ink-500">
              You&apos;ll be redirected to Stripe&apos;s secure checkout to pay by card.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
