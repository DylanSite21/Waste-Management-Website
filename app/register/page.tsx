"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import "../form.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
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
          noHp: noHp.trim(),
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
    <main className="register-page">
      {/* =========================
          BRAND PANEL
      ========================= */}

      <section className="register-brand">
        <div className="register-brand-content">
          <div className="brand-logo">
            <div className="brand-logo-mark">WM</div>

            <div>
              <strong>Waste Management</strong>
              <span>Enterprise Platform</span>
            </div>
          </div>

          <div className="register-brand-message">
            <span className="brand-badge">ENVIRONMENTAL MANAGEMENT SYSTEM</span>

            <h1>
              Mulai kelola
              <br />
              <span>lebih terstruktur.</span>
            </h1>

            <p>
              Buat akun untuk mengakses sistem pengelolaan sampah dan memantau
              aktivitas secara terintegrasi.
            </p>

            <div className="register-features">
              <div>
                <span className="feature-check">✓</span>
                <span>Dashboard terintegrasi</span>
              </div>

              <div>
                <span className="feature-check">✓</span>
                <span>Manajemen laporan sampah</span>
              </div>

              <div>
                <span className="feature-check">✓</span>
                <span>Data tersimpan secara aman</span>
              </div>
            </div>
          </div>

          <div className="brand-footer">
            <span>© 2026 Waste Management</span>
            <span>Enterprise System</span>
          </div>
        </div>
      </section>

      {/* =========================
          REGISTER PANEL
      ========================= */}

      <section className="register-panel">
        <div className="register-container">
          {/* Mobile Brand */}

          <div className="mobile-brand">
            <div className="brand-logo-mark">WM</div>

            <div>
              <strong>Waste Management</strong>
              <span>Enterprise Platform</span>
            </div>
          </div>

          <div className="register-header">
            <span className="login-eyebrow">ACCOUNT REGISTRATION</span>

            <h2>Buat akun baru</h2>

            <p>
              Lengkapi informasi berikut untuk membuat akun dan mulai
              menggunakan sistem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Error */}

            {error && (
              <div className="login-error" role="alert">
                <div className="error-icon">!</div>

                <div>
                  <strong>Gagal membuat akun</strong>

                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Nama */}

            <div className="form-field">
              <label htmlFor="name">Nama lengkap</label>

              <div className="input-wrapper">
                <span className="input-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="8" r="3.5" />
                    <path d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5" />
                  </svg>
                </span>

                <input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            {/* Nomor HP */}

            <div className="form-field">
              <label htmlFor="noHp">Nomor HP</label>

              <div className="input-wrapper">
                <span className="input-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="7" y="3" width="10" height="18" rx="2" />

                    <path d="M10 6h4" />
                    <path d="M11 18h2" />
                  </svg>
                </span>

                <input
                  id="noHp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={noHp}
                  onChange={(event) => setNoHp(event.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Email */}

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

            {/* Password */}

            <div className="form-field">
              <label htmlFor="password">Password</label>

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
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}

            <div className="form-field">
              <label htmlFor="confirmPassword">Konfirmasi password</label>

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
                    <path d="m9 15 2 2 4-4" />
                  </svg>
                </span>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Button */}

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Membuat akun...
                </>
              ) : (
                <>
                  Buat Akun
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
            <span>Sudah memiliki akun?</span>

            <Link href="/login">Masuk sekarang</Link>
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

            <span>
              Informasi akun Anda dilindungi dan diproses secara aman.
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
