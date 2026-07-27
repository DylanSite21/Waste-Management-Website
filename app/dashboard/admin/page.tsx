import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import LogoutButton from "@/app/components/LogoutButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

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
  let reports: Array<any> = [];

  try {
    totalUsers = await prisma.user.count();
    totalReports = await prisma.wasteReport.count();
    totalRegions = await prisma.region.count();

    const aggregateResult = await prisma.wasteReport.aggregate({
      _sum: {
        weight: true,
      },
    });

    totalWeight = Number(aggregateResult._sum.weight ?? 0);

    reports = await prisma.wasteReport.findMany({
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
    console.error("Admin dashboard data unavailable:", error);
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
            Selamat datang, {session.user.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Anda melihat seluruh data sistem dan laporan pengguna.
          </p>
        </div>
        <LogoutButton />
      </div>

      <section>
        <div>
          <h2>Total Laporan</h2>
          <p>{totalReports}</p>
        </div>

        <div>
          <h2>Total Pengguna</h2>
          <p>{totalUsers}</p>
        </div>

        <div>
          <h2>Daerah</h2>
          <p>{totalRegions}</p>
        </div>

        <div>
          <h2>Total Berat</h2>
          <p>{totalWeight} Kg</p>
        </div>
      </section>

      <section>
        <h2>Laporan Terbaru</h2>
        <div>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>User</th>
                <th>Jenis</th>
                <th>Wilayah</th>
                <th>Berat</th>
                <th>Status</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7}>Tidak ada data laporan.</td>
                </tr>
              ) : (
                reports.map((report: any, index: number) => (
                  <tr key={report.id}>
                    <td>{index + 1}</td>
                    <td>{report.user?.name ?? "-"}</td>
                    <td>{report.wasteType?.name ?? "-"}</td>
                    <td>{report.region?.city ?? "-"}</td>
                    <td>{Number(report.weight)} Kg</td>
                    <td>{report.status}</td>
                    <td>
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
