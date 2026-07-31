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
            Anda memiliki akses penuh untuk mengelola sistem.
          </p>
        </div>
        <LogoutButton />
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Laporan</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalReports}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Pengguna</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalUsers}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Daerah</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalRegions}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-zinc-500">Total Berat</h2>
          <p className="mt-2 text-3xl font-semibold text-zinc-900">
            {totalWeight} Kg
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
        </div>
      </section>

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
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                    <td className="px-3 py-3">{report.user?.name ?? "-"}</td>
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
