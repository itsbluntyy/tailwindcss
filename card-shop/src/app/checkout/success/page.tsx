import Link from "next/link";
import { getStripe, fulfillCards } from "@/lib/stripe";
import { ClearCart } from "./clear-cart";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let paid = false;
  if (session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      if (session.payment_status === "paid") {
        paid = true;
        // Fallback fulfillment in case the webhook isn't configured; safe to
        // run twice because fulfillCards is idempotent.
        const cardIds = session.metadata?.cardIds?.split(",").filter(Boolean) ?? [];
        if (cardIds.length > 0) await fulfillCards(cardIds);
      }
    } catch {
      // Fall through to the "couldn't verify" message below.
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      {paid ? (
        <>
          <ClearCart />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/15 text-3xl">
            ✓
          </div>
          <h1 className="mt-5 text-2xl font-bold text-ink-100">Order confirmed — thank you!</h1>
          <p className="mt-3 text-ink-400">
            Your payment went through. Your cards will be carefully packed and shipped within 2
            business days. Stripe has emailed you a receipt.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-ink-100">We couldn&apos;t verify your payment</h1>
          <p className="mt-3 text-ink-400">
            If you completed checkout, don&apos;t worry — your order went through and you&apos;ll
            have a receipt from Stripe. Otherwise, your cart is untouched.
          </p>
        </>
      )}
      <Link
        href="/cards"
        className="mt-8 inline-block rounded-xl bg-gold-400 px-6 py-3 font-bold text-navy-950 transition hover:bg-gold-300"
      >
        Keep browsing
      </Link>
    </div>
  );
}
