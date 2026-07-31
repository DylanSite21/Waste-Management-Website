import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const reports = await prisma.wasteReport.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      wasteType: true,
      region: true,
    },
  });

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
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

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="overflow-x-auto">
          <table style={{ width: "max-content" }}>
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Gambar</th>
                <th className="px-3 py-2">Jenis</th>
                <th className="px-3 py-2">Wilayah</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Berat</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-zinc-100">
                  <td className="px-3 py-3">{report.user?.name ?? "-"}</td>
                  <td className="px-3 py-3">
                    {report.image ? (
                      <img
                        src={report.image}
                        alt="Gambar laporan"
                        className="h-16 w-16 rounded-lg object-cover"
                        style={{ width: "100px", aspectRatio: "1/1" }}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-zinc-200"></div>
                    )}
                  </td>
                  <td className="px-3 py-3">{report.wasteType?.name ?? "-"}</td>
                  <td className="px-3 py-3">{report.region?.city ?? "-"}</td>
                  <td className="px-3 py-3">{report.status}</td>
                  <td className="px-3 py-3">{Number(report.weight)} Kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
