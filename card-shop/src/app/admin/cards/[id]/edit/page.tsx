import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { CardForm } from "@/components/card-form";
import { deleteImage } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit card" };

export default async function EditCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await prisma.card.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!card) notFound();

  return (
    <div>
      <h2 className="mb-5 text-lg font-bold text-ink-100">Edit: {card.name}</h2>

      {card.images.length > 0 && (
        <div className="mb-6 max-w-2xl rounded-xl border border-navy-700/60 bg-navy-900 p-4">
          <p className="mb-3 text-sm font-medium text-ink-300">Current photos</p>
          <div className="flex flex-wrap gap-3">
            {card.images.map((img) => (
              <div key={img.id} className="flex flex-col items-center gap-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/images/${img.id}`}
                  alt=""
                  className="h-28 w-21 rounded-lg border border-navy-700 object-cover"
                />
                <form action={deleteImage}>
                  <input type="hidden" name="imageId" value={img.id} />
                  <input type="hidden" name="cardId" value={card.id} />
                  <button className="text-xs text-red-400 hover:underline">Remove</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      <CardForm card={card} />
    </div>
  );
}
