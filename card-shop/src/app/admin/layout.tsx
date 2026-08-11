import Link from "next/link";
import { logout } from "./actions";

export const metadata = { title: "Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-navy-700/60 pb-4">
        <h1 className="text-xl font-bold text-gold-300">Admin</h1>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 font-medium text-ink-300 hover:bg-navy-800 hover:text-ink-100"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/cards/new"
            className="rounded-lg bg-gold-400 px-3 py-2 font-bold text-navy-950 transition hover:bg-gold-300"
          >
            + Add card
          </Link>
          <form action={logout}>
            <button className="rounded-lg px-3 py-2 font-medium text-ink-400 hover:bg-navy-800 hover:text-ink-100">
              Log out
            </button>
          </form>
        </nav>
      </div>
      {children}
    </div>
  );
}
