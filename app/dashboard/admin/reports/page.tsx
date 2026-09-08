import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import Image from "next/image";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ReportStatusActions from "./report-status-actions";

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const reports = await prisma.wasteReport.findMany({
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

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Admin
          </p>

          <h1 className="text-2xl font-semibold text-zinc-900">
            Manage Reports
          </h1>
        </div>

        <Link
          href="/dashboard/admin"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Kembali
        </Link>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Gambar</th>
                <th className="px-3 py-3">Jenis</th>
                <th className="px-3 py-3">Wilayah</th>
                <th className="px-3 py-3">Berat</th>
                <th className="px-3 py-3">Tanggal</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-zinc-500"
                  >
                    Tidak ada laporan.
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  // Total berat semua jenis sampah
                  // dalam satu laporan
                  const totalWeight = report.items.reduce(
                    (total, item) => total + Number(item.weight),
                    0,
                  );

                  return (
                    <tr key={report.id} className="border-b border-zinc-100">
                      {/* User */}
                      <td className="px-3 py-3">{report.user?.name ?? "-"}</td>

                      {/* Gambar */}
                      <td className="px-3 py-3">
                        {report.photo?.imageUrl ? (
                          <Image
                            src={report.photo.imageUrl}
                            alt="Gambar laporan"
                            className="h-25 w-25 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-25 w-25 items-center justify-center rounded-lg bg-zinc-200 text-xs text-zinc-500">
                            Tidak ada gambar
                          </div>
                        )}
                      </td>

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
                      <td className="px-3 py-3">
                        {report.region?.name ?? "-"}
                      </td>

                      {/* Total Berat */}
                      <td className="px-3 py-3">
                        {totalWeight.toLocaleString("id-ID")} Kg
                      </td>

                      {/* Tanggal */}
                      <td className="px-3 py-3">
                        {new Date(report.reportDate).toLocaleDateString(
                          "id-ID",
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <ReportStatusActions
                          reportId={report.id}
                          status={report.status}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
