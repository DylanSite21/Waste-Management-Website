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
      setError("Email atau password yang Anda masukkan salah.");
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

    router.push(callbackUrl);
  }

  return (
    <main className="login-page">
      {/* Brand Panel */}
      <section className="login-brand">
        <div className="brand-content">
          <div className="brand-logo">
            <div className="brand-logo-mark">WM</div>

            <div>
              <strong>Waste Management</strong>
              <span>Enterprise Platform</span>
            </div>
          </div>

          <div className="brand-message">
            <span className="brand-badge">ENVIRONMENTAL MANAGEMENT SYSTEM</span>

            <h1>
              Kelola lingkungan
              <br />
              <span>lebih terstruktur.</span>
            </h1>

            <p>
              Platform terintegrasi untuk mengelola data, laporan, wilayah, dan
              aktivitas pengelolaan sampah secara efisien.
            </p>
          </div>

          <div className="brand-footer">
            <span>© 2026 Waste Management</span>
            <span>Enterprise System</span>
          </div>
        </div>
      </section>

      {/* Login Panel */}
      <section className="login-panel">
        <div className="login-container">
          <div className="mobile-brand">
            <div className="brand-logo-mark">WM</div>

            <div>
              <strong>Waste Management</strong>
              <span>Enterprise Platform</span>
            </div>
          </div>

          <div className="login-header">
            <span className="login-eyebrow">SECURE ACCESS</span>

            <h2>Selamat datang kembali</h2>

            <p>
              Masukkan kredensial Anda untuk mengakses sistem pengelolaan
              sampah.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error" role="alert">
                <div className="error-icon">!</div>

                <div>
                  <strong>Gagal masuk</strong>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="form-field">
              <label htmlFor="email">Email</label>

              <div className="input-wrapper">
                <span className="input-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <div className="field-header">
                <label htmlFor="password">Password</label>

                <Link href="/forgot-password">Lupa password?</Link>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>
                </span>

                <input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>atau</span>
          </div>

          <div className="register-link">
            <span>Belum memiliki akun?</span>
            <Link href="/register">Daftar sekarang</Link>
          </div>

          <div className="security-note">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M12 3 5 6v5c0 4.5 2.9 8.2 7 10 4.1-1.8 7-5.5 7-10V6l-7-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>

            <span>Koneksi Anda diamankan dan data akun dilindungi.</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="login-loading">
          <span className="spinner" />
          Memuat...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
