import Stripe from "stripe";

// Lazily constructed so the app can build/run (browsing, admin) even before a
// Stripe key is configured — only checkout actually needs it.
let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to your environment to enable checkout.");
  }
  if (!stripeClient) stripeClient = new Stripe(key);
  return stripeClient;
}

/**
 * Marks the given cards as sold at their listed price. Idempotent: cards
 * already sold are left untouched, so the success page and the webhook can
 * both call this safely.
 */
export async function fulfillCards(cardIds: string[]) {
  const { prisma } = await import("./db");
  for (const id of cardIds) {
    const card = await prisma.card.findUnique({ where: { id } });
    if (!card || card.status === "SOLD") continue;
    await prisma.card.update({
      where: { id },
      data: {
        status: "SOLD",
        soldPriceCents: card.priceCents,
        soldAt: new Date(),
      },
    });
  }
}
