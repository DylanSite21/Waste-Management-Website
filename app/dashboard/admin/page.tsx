import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

import LogoutButton from "@/app/components/LogoutButton";
import AdminReportsTable from "@/app/dashboard/admin/admin-reports-table";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

type ReportRow = {
  id: string;
  reportDate: Date;
  user: { name: string };
  region: { name: string };
  photo: { imageUrl: string } | null;
  items: Array<{
    id: string;
    weight: number | { toString(): string };
    wasteType: { name: string };
  }>;
};

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  let totalUsers = 0;
  let totalReports = 0;
  let totalRegions = 0;
  let totalWeight = 0;
  let reports: ReportRow[] = [];

  try {
    // =========================
    // Total Users
    // =========================
    totalUsers = await prisma.user.count();

    // =========================
    // Total Reports
    // =========================
    totalReports = await prisma.wasteReport.count();

    // =========================
    // Total Regions
    // =========================
    totalRegions = await prisma.region.count();

    // =========================
    // Total Weight
    // =========================
    const aggregateResult = await prisma.wasteReportItem.aggregate({
      _sum: {
        weight: true,
      },
    });

    totalWeight = Number(aggregateResult._sum.weight ?? 0);

    // =========================
    // Latest Reports
    // =========================
    reports = await prisma.wasteReport.findMany({
      take: 5,
      orderBy: {
        reportDate: "desc",
      },
      include: {
        user: true,
        region: true,
        photo: true,
        items: {
          include: {
            wasteType: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Admin dashboard data unavailable:", error);
  }

  const dashboardReports = reports.map((report) => ({
    id: report.id,
    date: report.reportDate.toISOString(),
    userName: report.user.name,
    regionName: report.region.name,
    photoUrl: report.photo?.imageUrl ?? null,
    wasteTypes: report.items.map((item) => item.wasteType.name),
    weight: report.items.reduce(
      (total, item) => total + Number(item.weight),
      0,
    ),
  }));

  const metrics = [
    { label: "Total laporan", value: totalReports, accent: "bg-emerald-600" },
    { label: "Pengguna terdaftar", value: totalUsers, accent: "bg-sky-600" },
    {
      label: "Wilayah operasional",
      value: totalRegions,
      accent: "bg-amber-500",
    },
    {
      label: "Sampah terkumpul",
      value: `${totalWeight.toLocaleString("id-ID")} kg`,
      accent: "bg-rose-500",
    },
  ];

  const adminModules = [
    {
      title: "Pengguna",
      description: "Kelola akun dan akses pengguna",
      href: "/dashboard/admin/users",
      code: "01",
    },
    {
      title: "Jenis sampah",
      description: "Atur kategori dan klasifikasi sampah",
      href: "/dashboard/admin/waste-types",
      code: "02",
    },
    {
      title: "Wilayah",
      description: "Kelola cakupan wilayah operasional",
      href: "/dashboard/admin/regions",
      code: "03",
    },
    {
      title: "Laporan",
      description: "Tinjau dan tindak lanjuti laporan masuk",
      href: "/dashboard/admin/reports",
      code: "04",
    },
    {
      title: "Statistik",
      description: "Lihat performa dan tren pengelolaan",
      href: "/dashboard/admin/statistics",
      code: "05",
    },
    {
      title: "Hadiah & penukaran",
      description: "Atur katalog hadiah dan transaksi poin",
      href: "/dashboard/admin/rewards",
      code: "06",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7f5] px-4 py-5 text-[#18241f] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-[#dce4de] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
              Ruang kendali / Administrasi
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Selamat datang, {session.user.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#5a6a62]">
              Pantau aktivitas pengelolaan sampah dan kelola operasi dari satu
              tempat.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <span className="text-sm text-[#5a6a62]">Akses administrator</span>
            <LogoutButton />
          </div>
        </header>

        <section
          aria-label="Ringkasan operasional"
          className="grid grid-cols-2 gap-3 py-6 lg:grid-cols-4 lg:gap-4 lg:py-8"
        >
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="relative min-h-32 overflow-hidden rounded-lg border border-[#dce4de] bg-white p-4 sm:p-5"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-1 ${metric.accent}`}
              />
              <p className="text-xs font-medium leading-5 text-[#5a6a62] sm:text-sm">
                {metric.label}
              </p>
              <p className="mt-3 break-words text-2xl font-semibold tabular-nums sm:text-3xl">
                {metric.value}
              </p>
            </article>
          ))}
        </section>

        <section aria-labelledby="admin-tools-title" className="pb-7">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#728178]">
                Operasi
              </p>
              <h2 id="admin-tools-title" className="mt-1 text-lg font-semibold">
                Akses pengelolaan
              </h2>
            </div>
            <span className="hidden text-sm text-[#728178] sm:inline">
              6 area kerja
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {adminModules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="group flex min-h-24 items-center gap-4 rounded-lg border border-[#dce4de] bg-white px-4 py-4 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-700 hover:shadow-[0_8px_24px_-18px_rgba(24,36,31,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#edf4ef] text-xs font-bold tabular-nums text-emerald-900 transition group-hover:bg-emerald-800 group-hover:text-white">
                  {module.code}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#24332b]">
                    {module.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#728178]">
                    {module.description}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto text-lg text-[#9ba9a0] transition group-hover:translate-x-1 group-hover:text-emerald-800"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="latest-reports-title"
          className="overflow-hidden rounded-lg border border-[#dce4de] bg-white"
        >
          <div className="flex flex-col gap-1 border-b border-[#e7ece8] px-4 py-4 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#728178]">
              Aktivitas terbaru
            </p>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="latest-reports-title" className="text-lg font-semibold">
                Laporan masuk
              </h2>
              <Link
                href="/dashboard/admin/reports"
                className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              >
                Buka semua laporan <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <AdminReportsTable reports={dashboardReports} />
        </section>
      </div>
    </main>
  );
}
