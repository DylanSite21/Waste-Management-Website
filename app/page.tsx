import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Waste Management
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
          Kelola akun Anda untuk mengakses dashboard
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Masuk atau buat akun baru untuk mulai melaporkan dan mengelola sampah.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-lg bg-zinc-900 px-4 py-3 text-center font-medium text-white transition hover:bg-zinc-700"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-lg border border-zinc-300 px-4 py-3 text-center font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            Daftar akun
          </Link>
        </div>
      </div>
    </main>
  );
}
