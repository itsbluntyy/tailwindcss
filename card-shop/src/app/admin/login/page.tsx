import { login } from "../actions";

export const metadata = { title: "Admin login" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-bold text-ink-100">Admin login</h1>
      <p className="mt-1 text-sm text-ink-400">Enter the admin password to manage listings.</p>

      <form action={login} className="mt-6 flex flex-col gap-3">
        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            Wrong password — try again.
          </p>
        )}
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Password"
          className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-3 text-ink-100 focus:border-gold-400 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-gold-400 px-5 py-3 font-bold text-navy-950 transition hover:bg-gold-300"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
