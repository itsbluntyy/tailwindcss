import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, fulfillCards } from "@/lib/stripe";

// Optional but recommended for production: marks cards sold the moment Stripe
// confirms payment, even if the buyer never returns to the success page.
// Configure the endpoint in the Stripe dashboard and set STRIPE_WEBHOOK_SECRET.
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return new NextResponse("Webhook not configured", { status: 501 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = await getStripe().webhooks.constructEventAsync(payload, signature, secret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const cardIds = session.metadata?.cardIds?.split(",").filter(Boolean) ?? [];
    if (cardIds.length > 0 && session.payment_status === "paid") {
      await fulfillCards(cardIds);
    }
  }

  return NextResponse.json({ received: true });
}
