// Seeds the database with 10 example cards (2 already sold, so the profit
// tracker has data). Run with: npm run db:seed
//
// Works against the local SQLite file by default, or against Turso when
// TURSO_DATABASE_URL / TURSO_AUTH_TOKEN are set — handy for seeding production.
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const prisma = process.env.TURSO_DATABASE_URL
  ? new PrismaClient({
      adapter: new PrismaLibSQL({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    })
  : new PrismaClient();

// Generates a card-shaped SVG placeholder so the shop looks real before you
// upload actual photos. Each card gets a color themed to the Pokémon.
function placeholderSvg(name: string, setName: string, accent: string, label: string): string {
  const initial = name.replace(/[^A-Za-z]/g, "").charAt(0).toUpperCase() || "?";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}"/>
      <stop offset="1" stop-color="#0b1220"/>
    </linearGradient>
  </defs>
  <rect width="300" height="420" rx="14" fill="url(#bg)"/>
  <rect x="10" y="10" width="280" height="400" rx="10" fill="none" stroke="#d4a437" stroke-width="3"/>
  <circle cx="150" cy="165" r="64" fill="#0b1220" opacity="0.55"/>
  <text x="150" y="192" text-anchor="middle" font-family="Georgia, serif" font-size="78" fill="#e5ba4d">${initial}</text>
  <text x="150" y="290" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="19" font-weight="bold" fill="#eef1f8">${name}</text>
  <text x="150" y="316" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#c3cadb">${setName}</text>
  <text x="150" y="385" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="3" fill="#97a1ba">${label}</text>
</svg>`;
  return Buffer.from(svg).toString("base64");
}

type SeedCard = {
  name: string;
  setName: string;
  cardNumber: string;
  rarity: string;
  conditionType: "RAW" | "GRADED";
  rawCondition?: "NM" | "LP" | "MP";
  grader?: "PSA" | "CGC" | "BGS";
  grade?: string;
  priceCents: number;
  costCents: number;
  description: string;
  featured?: boolean;
  accent: string;
  sold?: { priceCents: number; daysAgo: number };
};

const cards: SeedCard[] = [
  {
    name: "Charizard ex",
    setName: "Obsidian Flames",
    cardNumber: "223/197",
    rarity: "Special Illustration Rare",
    conditionType: "GRADED",
    grader: "PSA",
    grade: "10",
    priceCents: 34999,
    costCents: 22000,
    description:
      "PSA 10 GEM MINT. The chase card of Obsidian Flames with stunning artwork. Ships fully insured in a slab-safe mailer.",
    featured: true,
    accent: "#d2622a",
  },
  {
    name: "Pikachu",
    setName: "151",
    cardNumber: "173/165",
    rarity: "Special Illustration Rare",
    conditionType: "RAW",
    rawCondition: "NM",
    priceCents: 8999,
    costCents: 5500,
    description:
      "Pack-fresh, sleeved immediately after pulling. Excellent centering with clean edges and surface.",
    featured: true,
    accent: "#c9a227",
  },
  {
    name: "Umbreon VMAX (Alt Art)",
    setName: "Evolving Skies",
    cardNumber: "215/203",
    rarity: "Ultra Rare",
    conditionType: "GRADED",
    grader: "CGC",
    grade: "9.5",
    priceCents: 64999,
    costCents: 50000,
    description:
      "The \"Moonbreon\" — the most sought-after modern Pokémon card. CGC 9.5 Gem Mint with a clean case.",
    featured: true,
    accent: "#5a4a8a",
  },
  {
    name: "Rayquaza VMAX (Alt Art)",
    setName: "Evolving Skies",
    cardNumber: "218/203",
    rarity: "Ultra Rare",
    conditionType: "GRADED",
    grader: "BGS",
    grade: "9",
    priceCents: 29999,
    costCents: 24000,
    description: "BGS 9 MINT with strong subgrades. Iconic sky-serpent artwork by Yuka Morii.",
    featured: true,
    accent: "#2e7d5b",
  },
  {
    name: "Giratina V (Alt Art)",
    setName: "Lost Origin",
    cardNumber: "186/196",
    rarity: "Ultra Rare",
    conditionType: "RAW",
    rawCondition: "NM",
    priceCents: 9499,
    costCents: 7000,
    description: "Beautiful distortion-world alt art. Near mint — no visible flaws under bright light.",
    accent: "#3a4a7a",
  },
  {
    name: "Gengar VMAX (Alt Art)",
    setName: "Fusion Strike",
    cardNumber: "271/264",
    rarity: "Ultra Rare",
    conditionType: "RAW",
    rawCondition: "LP",
    priceCents: 12999,
    costCents: 9000,
    description:
      "Lightly played: one small whitening spot on the back bottom edge, pictured. Front is clean.",
    accent: "#6b3fa0",
  },
  {
    name: "Mew ex",
    setName: "151",
    cardNumber: "205/165",
    rarity: "Ultra Rare",
    conditionType: "RAW",
    rawCondition: "NM",
    priceCents: 2499,
    costCents: 1200,
    description: "Full-art Mew ex from the 151 set. Pulled, sleeved, and stored in a binder.",
    accent: "#b0568d",
  },
  {
    name: "Blastoise",
    setName: "Base Set",
    cardNumber: "2/102",
    rarity: "Holo Rare",
    conditionType: "RAW",
    rawCondition: "MP",
    priceCents: 7999,
    costCents: 4500,
    description:
      "Unlimited Base Set Blastoise. Moderate play: edge wear and light scratches in the holo, no creases. A great binder copy of a classic.",
    accent: "#2a6db0",
  },
  {
    name: "Iono",
    setName: "Paldea Evolved",
    cardNumber: "269/193",
    rarity: "Hyper Rare",
    conditionType: "RAW",
    rawCondition: "NM",
    priceCents: 11000,
    costCents: 6000,
    description: "Gold-foil Iono, the fan-favorite trainer of Paldea Evolved.",
    accent: "#8a4ab0",
    sold: { priceCents: 11000, daysAgo: 12 },
  },
  {
    name: "Lugia V (Alt Art)",
    setName: "Silver Tempest",
    cardNumber: "186/195",
    rarity: "Ultra Rare",
    conditionType: "GRADED",
    grader: "PSA",
    grade: "9",
    priceCents: 18000,
    costCents: 14000,
    description: "PSA 9 MINT Lugia alt art soaring over the storm.",
    accent: "#4a6d8a",
    sold: { priceCents: 18000, daysAgo: 4 },
  },
];

async function main() {
  const existing = await prisma.card.count();
  if (existing > 0) {
    console.log(`Database already has ${existing} cards — skipping seed.`);
    return;
  }

  for (const c of cards) {
    const soldAt = c.sold
      ? new Date(Date.now() - c.sold.daysAgo * 24 * 60 * 60 * 1000)
      : null;
    await prisma.card.create({
      data: {
        name: c.name,
        setName: c.setName,
        cardNumber: c.cardNumber,
        rarity: c.rarity,
        conditionType: c.conditionType,
        rawCondition: c.rawCondition ?? null,
        grader: c.grader ?? null,
        grade: c.grade ?? null,
        priceCents: c.priceCents,
        costCents: c.costCents,
        description: c.description,
        featured: c.featured ?? false,
        status: c.sold ? "SOLD" : "AVAILABLE",
        soldPriceCents: c.sold?.priceCents ?? null,
        soldAt,
        images: {
          create: [
            {
              mimeType: "image/svg+xml",
              data: placeholderSvg(c.name, c.setName, c.accent, "FRONT"),
              sortOrder: 0,
            },
            {
              mimeType: "image/svg+xml",
              data: placeholderSvg(c.name, c.setName, c.accent, "BACK"),
              sortOrder: 1,
            },
          ],
        },
      },
    });
    console.log(`Seeded: ${c.name} (${c.setName})`);
  }
  console.log("Done — 10 cards seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
