"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import "../form.css";

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
    <main>
      <div>
        <form onSubmit={handleSubmit}>
          <p>Daftar</p>
          <h1>Buat akun baru</h1>
          <p>Daftarkan diri Anda untuk mengakses dashboard sistem.</p>
          {error ? <div>{error}</div> : null}

          <div>
            <label htmlFor="name">Nama lengkap</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

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

          <div>
            <label htmlFor="confirmPassword">Konfirmasi password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Daftar"}
          </button>

          <p>
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
