import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { conditionShort } from "@/lib/format";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const ids: unknown = body?.ids;
  if (!Array.isArray(ids) || ids.length === 0 || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const cards = await prisma.card.findMany({
    where: { id: { in: ids as string[] }, status: "AVAILABLE" },
  });
  if (cards.length === 0) {
    return NextResponse.json(
      { error: "None of the cards in your cart are still available." },
      { status: 400 },
    );
  }

  const origin =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { error: "Checkout isn't configured yet (missing Stripe key)." },
      { status: 500 },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: cards.map((card) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: card.priceCents,
          product_data: {
            name: card.name,
            description: `${card.setName} · #${card.cardNumber} · ${conditionShort(card)}`,
          },
        },
      })),
      metadata: { cardIds: cards.map((c) => c.id).join(",") },
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json(
      { error: "Couldn't start checkout. Please try again." },
      { status: 500 },
    );
  }
}
