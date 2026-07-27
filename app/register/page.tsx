"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Gagal membuat akun. Coba lagi nanti.");
        setIsSubmitting(false);
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(error);
      setError("Gagal membuat akun. Coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
          Daftar
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
          Buat akun baru
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Daftarkan diri Anda untuk mengakses dashboard sistem.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div>
            <label
              className="mb-1 block text-sm font-medium text-zinc-700"
              htmlFor="name"
            >
              Nama lengkap
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-0 focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-zinc-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-0 focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-zinc-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-0 focus:border-zinc-900"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-zinc-700"
              htmlFor="confirmPassword"
            >
              Konfirmasi password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-0 focus:border-zinc-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-emerald-600 hover:underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
