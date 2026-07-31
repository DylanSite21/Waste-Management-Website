import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CreateWasteTypeForm from "./create-waste-type-form";

export default async function AdminWasteTypesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const wasteTypes = await prisma.wasteType.findMany({
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
            Kelola Waste Type
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
        <h2 className="text-lg font-semibold text-zinc-900">
          Tambah Waste Type
        </h2>
        <CreateWasteTypeForm />

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-zinc-700">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-500">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Nama</th>
              </tr>
            </thead>
            <tbody>
              {wasteTypes.map((item) => (
                <tr key={item.id} className="border-b border-zinc-100">
                  <td className="px-3 py-3">{item.id}</td>
                  <td className="px-3 py-3">{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
