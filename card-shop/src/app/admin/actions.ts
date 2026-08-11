"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ADMIN_COOKIE, createSessionToken, verifySessionToken } from "@/lib/auth";

async function requireAdmin() {
  const store = await cookies();
  const ok = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  if (!ok) redirect("/admin/login");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !timingSafeEqual(password, expected)) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

function dollarsToCents(value: FormDataEntryValue | null): number | null {
  const n = Number(String(value ?? "").replace(/[$,]/g, ""));
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

async function filesToImages(formData: FormData) {
  const images: { mimeType: string; data: string }[] = [];
  for (const entry of formData.getAll("photos")) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    if (!entry.type.startsWith("image/")) continue;
    const buffer = Buffer.from(await entry.arrayBuffer());
    images.push({ mimeType: entry.type, data: buffer.toString("base64") });
  }
  return images;
}

export async function saveCard(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const conditionType = formData.get("conditionType") === "GRADED" ? "GRADED" : "RAW";
  const priceCents = dollarsToCents(formData.get("price"));
  const costCents = dollarsToCents(formData.get("cost")) ?? 0;

  const name = String(formData.get("name") ?? "").trim();
  const setName = String(formData.get("setName") ?? "").trim();
  if (!name || !setName || priceCents === null) {
    throw new Error("Name, set, and a valid price are required.");
  }

  const data = {
    name,
    setName,
    cardNumber: String(formData.get("cardNumber") ?? "").trim(),
    rarity: String(formData.get("rarity") ?? "").trim() || "Unspecified",
    conditionType,
    rawCondition: conditionType === "RAW" ? String(formData.get("rawCondition") ?? "NM") : null,
    grader: conditionType === "GRADED" ? String(formData.get("grader") ?? "PSA") : null,
    grade: conditionType === "GRADED" ? String(formData.get("grade") ?? "").trim() : null,
    priceCents,
    costCents,
    description: String(formData.get("description") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
  };

  const newImages = await filesToImages(formData);
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();

  let cardId = id;
  if (id) {
    await prisma.card.update({ where: { id }, data });
  } else {
    const created = await prisma.card.create({ data });
    cardId = created.id;
  }

  if (newImages.length > 0 || imageUrl) {
    const existing = await prisma.cardImage.count({ where: { cardId } });
    let order = existing;
    for (const img of newImages) {
      await prisma.cardImage.create({
        data: { cardId, mimeType: img.mimeType, data: img.data, sortOrder: order++ },
      });
    }
    if (imageUrl) {
      await prisma.cardImage.create({
        data: { cardId, mimeType: "image/*", url: imageUrl, sortOrder: order++ },
      });
    }
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteCard(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.card.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function deleteImage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("imageId") ?? "");
  const cardId = String(formData.get("cardId") ?? "");
  if (id) await prisma.cardImage.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect(`/admin/cards/${cardId}/edit`);
}

export async function markSold(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const card = await prisma.card.findUnique({ where: { id } });
  if (!card) redirect("/admin");
  const soldPriceCents = dollarsToCents(formData.get("soldPrice")) ?? card.priceCents;
  await prisma.card.update({
    where: { id },
    data: { status: "SOLD", soldPriceCents, soldAt: new Date() },
  });
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function markAvailable(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) {
    await prisma.card.update({
      where: { id },
      data: { status: "AVAILABLE", soldPriceCents: null, soldAt: null },
    });
  }
  revalidatePath("/", "layout");
  redirect("/admin");
}
