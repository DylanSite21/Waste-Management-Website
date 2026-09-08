import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import CreateRewardForm from "./create-reward-form";
import RewardActions from "./reward-actions";

export default async function AdminRewardsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role?.toUpperCase() !== "ADMIN") redirect("/dashboard");
  const [rewards, redemptions] = await Promise.all([
    prisma.reward.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.redemption.findMany({
      where: { status: "PENDING" },
      include: { reward: true, user: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);
  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Admin
            </p>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Kelola Hadiah
            </h1>
          </div>
          <Link
            href="/dashboard/admin"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
          >
            Kembali
          </Link>
        </div>
        <section className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold">Tambah hadiah</h2>
          <CreateRewardForm />
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2">Nama</th>
                  <th className="px-3 py-2">Poin</th>
                  <th className="px-3 py-2">Stok</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map((reward) => (
                  <tr key={reward.id} className="border-b">
                    <td className="px-3 py-3">{reward.name}</td>
                    <td className="px-3 py-3">{reward.pointCost}</td>
                    <td className="px-3 py-3">{reward.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Pengajuan penukaran</h2>
          <div className="mt-3 space-y-2">
            {redemptions.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Tidak ada pengajuan tertunda.
              </p>
            ) : (
              redemptions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b py-3 text-sm"
                >
                  <span>
                    {item.user.name} · {item.reward.name} · {item.pointsUsed}{" "}
                    poin
                  </span>
                  <RewardActions id={item.id} />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
