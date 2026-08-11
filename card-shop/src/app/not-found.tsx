import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-ink-100">Card not found</h1>
      <p className="mt-3 text-ink-400">That page doesn&apos;t exist — maybe the card sold and was removed.</p>
      <Link
        href="/cards"
        className="mt-6 inline-block rounded-xl bg-gold-400 px-6 py-3 font-bold text-navy-950 transition hover:bg-gold-300"
      >
        Browse available cards
      </Link>
    </div>
  );
}
