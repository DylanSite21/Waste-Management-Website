import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminStatisticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  // =========================
  // Basic Statistics
  // =========================

  const totalUsers = await prisma.user.count();

  const totalReports = await prisma.wasteReport.count();

  const totalRegions = await prisma.region.count();

  // =========================
  // Total Weight
  // =========================

  const totalWeightResult = await prisma.wasteReportItem.aggregate({
    _sum: {
      weight: true,
    },
  });

  const totalWeight = Number(totalWeightResult._sum.weight ?? 0);

  // =========================
  // Waste Type Statistics
  // =========================

  const wasteTypes = await prisma.wasteType.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      items: {
        select: {
          weight: true,
        },
      },
    },
  });

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Admin
          </p>

          <h1 className="text-2xl font-semibold text-zinc-900">
            View Statistics
          </h1>
        </div>

        <Link
          href="/dashboard/admin"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Kembali
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Total User */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total User</h2>

          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalUsers}
          </p>
        </div>

        {/* Total Laporan */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Laporan</h2>

          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalReports}
          </p>
        </div>

        {/* Total Region */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Region</h2>

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
      </div>

      {/* Waste Type Statistics */}
      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">
          Statistik Jenis Sampah
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-3 py-3">No</th>
                <th className="px-3 py-3">Jenis Sampah</th>
                <th className="px-3 py-3">Jumlah Item</th>
                <th className="px-3 py-3">Total Berat</th>
              </tr>
            </thead>

            <tbody>
              {wasteTypes.map((wasteType, index) => {
                const totalWasteTypeWeight = wasteType.items.reduce(
                  (total, item) => total + Number(item.weight),
                  0,
                );

                return (
                  <tr key={wasteType.id} className="border-b border-zinc-100">
                    <td className="px-3 py-3">{index + 1}</td>

                    <td className="px-3 py-3 font-medium text-zinc-900">
                      {wasteType.name}
                    </td>

                    <td className="px-3 py-3">{wasteType.items.length}</td>

                    <td className="px-3 py-3">
                      {totalWasteTypeWeight.toLocaleString("id-ID")} Kg
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
