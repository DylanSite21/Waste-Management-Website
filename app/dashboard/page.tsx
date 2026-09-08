import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

import LogoutButton from "@/app/components/LogoutButton";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

type ReportRow = {
  id: string;
  reportDate: Date;
  status: string;
  region: { name: string };
  photo: { imageUrl: string } | null;
  items: Array<{ id: string; weight: number | { toString(): string }; wasteType: { name: string } }>;
};

type PointTransactionRow = {
  id: string;
  type: string;
  points: number;
  description: string | null;
  createdAt: Date;
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toUpperCase() === "ADMIN") {
    redirect("/dashboard/admin");
  }

  const userId = session.user.id;

  let totalReports = 0;
  let totalWeight = 0;
  let pointsBalance = 0;
  let transactions: PointTransactionRow[] = [];
  let reports: ReportRow[] = [];

  try {
    // =========================
    // Total Reports
    // =========================

    totalReports = await prisma.wasteReport.count({
      where: {
        userId,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pointsBalance: true },
    });
    pointsBalance = user?.pointsBalance ?? 0;
    transactions = await prisma.pointTransaction.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // =========================
    // Total Weight
    // =========================

    const aggregateResult = await prisma.wasteReportItem.aggregate({
      where: {
        report: {
          userId,
        },
      },
      _sum: {
        weight: true,
      },
    });

    totalWeight = Number(aggregateResult._sum.weight ?? 0);

    // =========================
    // Latest Reports
    // =========================

    reports = await prisma.wasteReport.findMany({
      where: {
        userId,
      },
      take: 5,
      orderBy: {
        reportDate: "desc",
      },
      include: {
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
    console.error("Dashboard data unavailable:", error);
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            User Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            Selamat datang, {session.user.name}
          </h1>

          <p className="mt-1 text-sm text-zinc-600">
            Anda melihat laporan yang telah Anda kirim.
          </p>
        </div>

        <LogoutButton />
      </div>

      {/* Statistics */}
      <section className="grid gap-4 md:grid-cols-3">
        {/* Total Laporan */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Laporan</h2>

          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalReports}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <h2 className="text-sm font-medium text-emerald-800">Saldo Poin</h2>
          <p className="mt-2 text-3xl font-semibold text-emerald-950">
            {pointsBalance.toLocaleString("id-ID")}
          </p>
          <a href="/dashboard/user/rewards" className="mt-2 inline-block text-sm font-semibold text-emerald-700">
            Lihat katalog hadiah
          </a>
        </div>

        {/* Total Berat */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Berat</h2>

          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalWeight.toLocaleString("id-ID")} Kg
          </p>
        </div>
      </section>

      {/* Reports */}
      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Laporan Saya</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-3 py-2">No</th>
                <th className="px-3 py-2">Gambar</th>
                <th className="px-3 py-2">Jenis</th>
                <th className="px-3 py-2">Wilayah</th>
                <th className="px-3 py-2">Berat</th>
                <th className="px-3 py-2">Tanggal</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-zinc-500"
                  >
                    Tidak ada data laporan.
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => {
                  // Total berat dari semua jenis sampah
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
                          <img
                            src={report.photo.imageUrl}
                            alt="Gambar laporan"
                            className="h-[100px] w-[100px] rounded-lg object-cover"
                          />
                        ) : (
                          <div className="text-zinc-400">Tidak ada gambar</div>
                        )}
                      </td>
                      <td className="px-3 py-3 font-medium">{report.status}</td>

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

                      {/* Berat */}
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

      <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Transaksi Poin Terbaru</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead><tr className="border-b border-zinc-200 text-zinc-500"><th className="px-3 py-2">Jenis</th><th className="px-3 py-2">Poin</th><th className="px-3 py-2">Keterangan</th><th className="px-3 py-2">Tanggal</th></tr></thead>
            <tbody>
              {transactions.length === 0 ? <tr><td colSpan={4} className="px-3 py-6 text-center text-zinc-500">Belum ada transaksi.</td></tr> : transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-zinc-100"><td className="px-3 py-3">{transaction.type}</td><td className="px-3 py-3">{transaction.type === "REDEEM" ? "-" : "+"}{transaction.points}</td><td className="px-3 py-3">{transaction.description ?? "-"}</td><td className="px-3 py-3">{new Date(transaction.createdAt).toLocaleDateString("id-ID")}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
