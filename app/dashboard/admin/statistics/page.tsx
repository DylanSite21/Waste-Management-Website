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

  const totalUsers = await prisma.user.count();
  const totalReports = await prisma.wasteReport.count();
  const totalRegions = await prisma.region.count();
  const totalWeight = await prisma.wasteReport.aggregate({
    _sum: { weight: true },
  });

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total User</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalUsers}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Laporan</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalReports}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Region</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalRegions}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Berat</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {Number(totalWeight._sum.weight ?? 0)} Kg
          </p>
        </div>
      </div>
    </main>
  );
}
