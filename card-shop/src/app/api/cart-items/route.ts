import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const ids: unknown = body?.ids;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const cards = await prisma.card.findMany({
    where: { id: { in: ids as string[] } },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  // Preserve the order the user added them in.
  const byId = new Map(cards.map((c) => [c.id, c]));
  const items = (ids as string[])
    .map((id) => byId.get(id))
    .filter((c) => c !== undefined)
    .map((c) => ({
      id: c.id,
      name: c.name,
      setName: c.setName,
      cardNumber: c.cardNumber,
      conditionType: c.conditionType,
      rawCondition: c.rawCondition,
      grader: c.grader,
      grade: c.grade,
      priceCents: c.priceCents,
      status: c.status,
      imageId: c.images[0]?.id ?? null,
    }));

  return NextResponse.json({ items });
}
