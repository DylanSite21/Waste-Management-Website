"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../form.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
    router.push(callbackUrl);
  }

  return (
    <main>
      <div>
        <form onSubmit={handleSubmit}>
          <p>Masuk</p>
          <h1>Waste Management</h1>
          <h2>Selamat datang kembali</h2>
          <p>Masukkan email dan password Anda untuk mengakses sistem.</p>
          {error ? <div>{error}</div> : null}

          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Masuk"}
          </button>
          <p>
            Belum punya akun? <Link href="/register">Daftar sekarang</Link>
          </p>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Memuat...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
