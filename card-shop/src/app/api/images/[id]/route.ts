import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await prisma.cardImage.findUnique({ where: { id } });
  if (!image) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (image.url) {
    return NextResponse.redirect(image.url, 302);
  }
  if (!image.data) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(Buffer.from(image.data, "base64"), {
    headers: {
      "Content-Type": image.mimeType,
      // Image content never changes for a given id, so cache aggressively.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
