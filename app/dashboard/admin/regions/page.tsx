import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CreateRegionForm from "./create-region-form";

export default async function AdminRegionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const regions = await prisma.region.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Admin
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Kelola Region
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
        <h2 className="text-lg font-semibold text-zinc-900">Tambah Region</h2>
        <CreateRegionForm />

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Provinsi</th>
                <th className="px-3 py-2">Kota</th>
                <th className="px-3 py-2">Distrik</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region.id} className="border-b border-zinc-100">
                  <td className="px-3 py-3">{region.id}</td>
                  <td className="px-3 py-3">{region.province}</td>
                  <td className="px-3 py-3">{region.city}</td>
                  <td className="px-3 py-3">{region.district ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
