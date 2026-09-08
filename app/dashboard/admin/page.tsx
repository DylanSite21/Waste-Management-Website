import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Image from "next/image";

import LogoutButton from "@/app/components/LogoutButton";
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

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            Selamat datang, {session.user.name}
          </h1>

          <p className="mt-1 text-sm text-zinc-600">
            Anda memiliki akses penuh untuk mengelola sistem.
          </p>
        </div>

        <LogoutButton />
      </div>

      {/* Statistics */}
      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Total Laporan */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Laporan</h2>

          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalReports}
          </p>
        </div>

        {/* Total Pengguna */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Pengguna</h2>

          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalUsers}
          </p>
        </div>

        {/* Total Wilayah */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Daerah</h2>

          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalRegions}
          </p>
        </div>

        {/* Total Berat */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Berat</h2>

          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalWeight.toLocaleString("id-ID")} Kg
          </p>
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Menu Admin</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <a
            href="/dashboard/admin/users"
            className="rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50"
          >
            CRUD User
          </a>
          <a
            href="/dashboard/admin/waste-types"
            className="rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50"
          >
            CRUD Waste Type
          </a>
          <a
            href="/dashboard/admin/regions"
            className="rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50"
          >
            CRUD Region
          </a>
          <a
            href="/dashboard/admin/reports"
            className="rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50"
          >
            Manage Reports
          </a>
          <a
            href="/dashboard/admin/statistics"
            className="rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50"
          >
            View Statistics
          </a>
          <a
            href="/dashboard/admin/rewards"
            className="rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50"
          >
            Kelola Hadiah & Penukaran
          </a>
        </div>
      </section>

      {/* Latest Reports */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Laporan Terbaru</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-3 py-2">No</th>
                <th className="px-3 py-2">Gambar</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Jenis</th>
                <th className="px-3 py-2">Wilayah</th>
                <th className="px-3 py-2">Berat</th>
                <th className="px-3 py-2">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-6 text-center text-zinc-500"
                  >
                    Tidak ada data laporan.
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => {
                  // Hitung total berat dari semua WasteReportItem
                  const totalReportWeight = report.items.reduce(
                    (total: number, item) => total + Number(item.weight),
                    0,
                  );

                  return (
                    <tr key={report.id} className="border-b border-zinc-100">
                      {/* No */}
                      <td className="px-3 py-3">{index + 1}</td>

                      {/* Gambar */}
                      <td className="px-3 py-3">
                        {report.photo?.imageUrl ? (
                          <Image
                            src={report.photo.imageUrl}
                            alt="Gambar laporan"
                            className="rounded-lg object-cover"
                          />
                        ) : (
                          <div className="text-zinc-400">Tidak ada gambar</div>
                        )}
                      </td>

                      {/* User */}
                      <td className="px-3 py-3">{report.user.name}</td>

                      {/* Jenis Sampah */}
                      <td className="px-3 py-3">
                        {report.items.length > 0 ? (
                          <div className="space-y-1">
                            {report.items.map((item) => (
                              <div key={item.id}>{item.wasteType.name}</div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-400">Tidak ada</span>
                        )}
                      </td>

                      {/* Wilayah */}
                      <td className="px-3 py-3">{report.region.name}</td>

                      {/* Total Berat */}
                      <td className="px-3 py-3">
                        {totalReportWeight.toLocaleString("id-ID")} Kg
                      </td>

                      {/* Tanggal */}
                      <td className="px-3 py-3">
                        {new Date(report.reportDate).toLocaleDateString(
                          "id-ID",
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
