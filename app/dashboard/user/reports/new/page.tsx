import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CreateReportForm from "./create-report-form";

export default async function NewReportPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role?.toUpperCase() === "ADMIN") {
    redirect("/dashboard/admin");
  }

  const wasteTypes = await prisma.wasteType.findMany({
    orderBy: { id: "asc" },
  });
  const regions = await prisma.region.findMany({ orderBy: { id: "asc" } });

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
            User
          </p>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Create Report
          </h1>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Kembali
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <CreateReportForm
          userId={session.user.id}
          wasteTypes={wasteTypes}
          regions={regions}
        />
      </div>
    </main>
  );
}
