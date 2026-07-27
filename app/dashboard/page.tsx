import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import LogoutButton from "@/app/components/LogoutButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
  let reports: Array<any> = [];

  try {
    totalReports = await prisma.wasteReport.count({
      where: { userId },
    });

    const aggregateResult = await prisma.wasteReport.aggregate({
      where: { userId },
      _sum: {
        weight: true,
      },
    });

    totalWeight = Number(aggregateResult._sum.weight ?? 0);

    reports = await prisma.wasteReport.findMany({
      where: { userId },
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        wasteType: true,
        region: true,
      },
    });
  } catch (error) {
    console.error("Dashboard data unavailable:", error);
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
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

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Laporan</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalReports}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Berat</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalWeight} Kg
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Laporan Saya</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-3 py-2">No</th>
                <th className="px-3 py-2">Jenis</th>
                <th className="px-3 py-2">Wilayah</th>
                <th className="px-3 py-2">Berat</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Tanggal</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-4 text-center text-zinc-500"
                  >
                    Tidak ada data laporan.
                  </td>
                </tr>
              ) : (
                reports.map((report: any, index: number) => (
                  <tr key={report.id} className="border-b border-zinc-100">
                    <td className="px-3 py-3">{index + 1}</td>
                    <td className="px-3 py-3">
                      {report.wasteType?.name ?? "-"}
                    </td>
                    <td className="px-3 py-3">{report.region?.city ?? "-"}</td>
                    <td className="px-3 py-3">{Number(report.weight)} Kg</td>
                    <td className="px-3 py-3">{report.status}</td>
                    <td className="px-3 py-3">
                      {new Date(report.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
