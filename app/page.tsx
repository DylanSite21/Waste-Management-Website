"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./landing.module.css";

const snapshots = {
  "30 hari": {
    diverted: "18,6 t",
    rate: "72,4%",
    reports: "1.284",
    bars: [34, 49, 42, 62, 56, 74, 68, 88, 70, 94, 78, 100],
  },
  Kuartal: {
    diverted: "54,2 t",
    rate: "68,9%",
    reports: "3.762",
    bars: [48, 38, 60, 52, 72, 65, 83, 69, 88, 76, 94, 100],
  },
  Tahun: {
    diverted: "208 t",
    rate: "66,1%",
    reports: "14.906",
    bars: [30, 43, 37, 55, 50, 69, 61, 73, 68, 86, 79, 100],
  },
};

const activity = [
  {
    type: "Organik",
    place: "Pasar Cempaka",
    time: "08:42",
    status: "Terjadwal",
  },
  {
    type: "Anorganik",
    place: "Kawasan Menteng",
    time: "08:16",
    status: "Diangkut",
  },
  {
    type: "B3 Rumah Tangga",
    place: "RW 04, Kebayoran",
    time: "07:58",
    status: "Ditinjau",
  },
];

const sampleTransactions = [
  {
    id: "t1",
    type: "EARN",
    points: 120,
    description: "Laporan organik disetujui",
    date: "12/9/2026",
  },
  {
    id: "t2",
    type: "EARN",
    points: 80,
    description: "Laporan plastik disetujui",
    date: "9/9/2026",
  },
  {
    id: "t3",
    type: "REDEEM",
    points: 200,
    description: "Tukar voucher belanja",
    date: "3/9/2026",
  },
];

const statusClass: Record<string, string> = {
  Diangkut: "bg-emerald-50 text-emerald-700",
  Terjadwal: "bg-sky-50 text-sky-700",
  Ditinjau: "bg-amber-50 text-amber-700",
};

export default function Home() {
  const [period, setPeriod] = useState<keyof typeof snapshots>("30 hari");
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [menuOpen, setMenuOpen] = useState(false);
  const snapshot = snapshots[period];
  const visibleActivity =
    activeFilter === "Semua"
      ? activity
      : activity.filter((item) => item.status === activeFilter);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="Waste Management Platform, beranda"
        >
          <span className={styles.brandMark}>W</span>
          <span>
            Waste Management Platform<span className={styles.brandDot}>.</span>
          </span>
        </Link>
        <button
          className={styles.menuToggle}
          type="button"
          aria-label={menuOpen ? "Tutup navigasi" : "Buka navigasi"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
        <nav
          className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}
          aria-label="Navigasi utama"
        >
          <a href="#platform" onClick={() => setMenuOpen(false)}>
            Platform
          </a>
          <a href="#impact" onClick={() => setMenuOpen(false)}>
            Dampak
          </a>
          <a href="#activity" onClick={() => setMenuOpen(false)}>
            Aktivitas
          </a>
          <Link className={styles.mobileLogin} href="/login">
            Masuk
          </Link>
        </nav>
        <div className={styles.headerActions}>
          <Link className={styles.loginLink} href="/login">
            Masuk
          </Link>
          <Link className={styles.headerCta} href="/register">
            Mulai sekarang <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </header>

      <section className={styles.hero} id="platform">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            <span className={styles.liveDot} /> Waste management,{" "}
            <em>made visible.</em>
          </div>
          <h1>
            Ubah alur sampah jadi <em>aksi nyata.</em>
          </h1>
          <p className={styles.heroText}>
            Satu ruang kerja untuk pelaporan, pengangkutan, dan dampak
            lingkungan yang bisa diukur.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryCta} href="/register">
              Bangun operasimu <span aria-hidden="true">↗</span>
            </Link>
            <a className={styles.textCta} href="#impact">
              <span className={styles.playIcon}>↓</span> Lihat dampak
            </a>
          </div>
          <div className={styles.trustLine}>
            <div className={styles.avatarStack} aria-hidden="true">
              <span>DK</span>
              <span>AS</span>
              <span>MR</span>
            </div>
            <p>
              <strong>Dirancang untuk tim lapangan</strong>
              <br />
              dan pengelola kawasan
            </p>
          </div>
        </div>

        <div
          className={styles.dashboardWrap}
          aria-label="Pratinjau dashboard Sirkula"
        >
          <div className="rounded-2xl bg-zinc-50 p-4 text-left">
            {/* Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  User Dashboard
                </p>
                <h2 className="mt-1 text-lg font-semibold text-zinc-900">
                  Selamat datang, Rani
                </h2>
                <p className="mt-0.5 text-xs text-zinc-600">
                  Anda melihat laporan yang telah Anda kirim.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-500">
                  DATA CONTOH
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                  onClick={() =>
                    setPeriod(
                      period === "30 hari"
                        ? "Kuartal"
                        : period === "Kuartal"
                          ? "Tahun"
                          : "30 hari",
                    )
                  }
                  aria-label={`Periode saat ini ${period}, klik untuk ganti periode`}
                >
                  {period} <span aria-hidden="true">⌄</span>
                </button>
                <span className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">
                  Tambah Laporan
                </span>
              </div>
            </div>

            {/* Statistik */}
            <section className="grid gap-3 sm:grid-cols-3" id="impact">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-medium text-zinc-500">
                  Total Laporan
                </h3>
                <p className="mt-1 text-2xl font-semibold text-zinc-900">
                  {snapshot.reports}
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                <h3 className="text-xs font-medium text-emerald-800">
                  Saldo Poin
                </h3>
                <p className="mt-1 text-2xl font-semibold text-emerald-950">
                  1.250
                </p>
                <span className="mt-1 inline-block text-xs font-semibold text-emerald-700">
                  Lihat katalog hadiah
                </span>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-medium text-zinc-500">
                  Total Berat
                </h3>
                <p className="mt-1 text-2xl font-semibold text-zinc-900">
                  {snapshot.diverted}
                </p>
              </div>
            </section>

            {/* Laporan Saya */}
            <section
              className="mt-4 rounded-2xl bg-white p-4 shadow-sm"
              id="activity"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-zinc-900">
                  Laporan Saya
                </h3>
                <div
                  className="flex gap-1"
                  aria-label="Filter status aktivitas"
                >
                  {["Semua", "Terjadwal", "Diangkut", "Ditinjau"].map(
                    (filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setActiveFilter(filter)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          activeFilter === filter
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                        }`}
                      >
                        {filter}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-xs text-zinc-700">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="px-3 py-2">No</th>
                      <th className="px-3 py-2">Wilayah</th>
                      <th className="px-3 py-2">Jenis</th>
                      <th className="px-3 py-2">Waktu</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleActivity.length ? (
                      visibleActivity.map((item, index) => (
                        <tr
                          key={item.place}
                          className="border-b border-zinc-100"
                        >
                          <td className="px-3 py-2.5">{index + 1}</td>
                          <td className="px-3 py-2.5 font-medium text-zinc-900">
                            {item.place}
                          </td>
                          <td className="px-3 py-2.5">{item.type}</td>
                          <td className="px-3 py-2.5">{item.time}</td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`rounded-full px-2 py-0.5 font-semibold ${
                                statusClass[item.status] ??
                                "bg-zinc-100 text-zinc-600"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-5 text-center text-zinc-500"
                        >
                          Tidak ada laporan dengan status ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Transaksi Poin */}
            <section className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-zinc-900">
                Transaksi Poin Terbaru
              </h3>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-xs text-zinc-700">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-500">
                      <th className="px-3 py-2">Jenis</th>
                      <th className="px-3 py-2">Poin</th>
                      <th className="px-3 py-2">Keterangan</th>
                      <th className="px-3 py-2">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleTransactions.map((t) => (
                      <tr key={t.id} className="border-b border-zinc-100">
                        <td className="px-3 py-2.5">{t.type}</td>
                        <td className="px-3 py-2.5">
                          {t.type === "REDEEM" ? "-" : "+"}
                          {t.points}
                        </td>
                        <td className="px-3 py-2.5">{t.description}</td>
                        <td className="px-3 py-2.5">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className={styles.floatingNote}>
            <span>↗</span>
            <div>
              <strong>Jejak yang terukur</strong>
              <small>Setiap laporan punya tindak lanjut</small>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.lowerBand}>
        <div>
          <span className={styles.sectionTag}>SATU SISTEM, LEBIH TERARAH</span>
          <h2>
            Dari laporan pertama
            <br />
            sampai hasil yang terlihat.
          </h2>
        </div>
        <p>
          Hubungkan warga, tim operasional, dan pengelola dalam alur kerja yang
          transparan. Lebih sedikit yang terlewat, lebih banyak yang bisa
          dipulihkan.
        </p>
        <Link
          href="/register"
          aria-label="Daftar untuk mulai menggunakan Waste Management Platform"
          className={styles.roundCta}
        >
          ↗
        </Link>
      </section>
      <footer className={styles.footer}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>S</span>
          <span>
            Waste Management Platform<span className={styles.brandDot}>.</span>
          </span>
        </Link>
        <span>Operasi yang lebih sirkular dimulai dari data yang tepat.</span>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
