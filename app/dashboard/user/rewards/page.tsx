import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import RedeemButton from "./redeem-button";

export default async function UserRewardsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role?.toUpperCase() === "ADMIN")
    redirect("/dashboard/admin");
  const [user, rewards, redemptions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { pointsBalance: true },
    }),
    prisma.reward.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.redemption.findMany({
      where: { userId: session.user.id },
      include: { reward: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);
  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              User
            </p>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Katalog Hadiah
            </h1>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium"
          >
            Kembali
          </Link>
        </div>
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm text-emerald-800">Saldo poin saat ini</p>
          <p className="mt-1 text-3xl font-semibold text-emerald-950">
            {(user?.pointsBalance ?? 0).toLocaleString("id-ID")}
          </p>
        </div>
        <section className="grid gap-4 md:grid-cols-3">
          {rewards.map((reward) => (
            <article
              key={reward.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <h2 className="font-semibold text-zinc-900">{reward.name}</h2>
              <p className="mt-2 min-h-10 text-sm text-zinc-600">
                {reward.description}
              </p>
              <p className="mt-4 text-lg font-semibold text-emerald-700">
                {reward.pointCost.toLocaleString("id-ID")} poin
              </p>
              <p className="mt-1 text-sm text-zinc-500">Stok: {reward.stock}</p>
              <div className="mt-4">
                {reward.stock > 0 ? (
                  <RedeemButton rewardId={reward.id} />
                ) : (
                  <span className="text-sm text-rose-700">Stok habis</span>
                )}
              </div>
            </article>
          ))}
        </section>
        <section className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="text-lg font-semibold">Riwayat Penukaran</h2>
          <div className="mt-3 space-y-2">
            {redemptions.length === 0 ? (
              <p className="text-sm text-zinc-500">Belum ada penukaran.</p>
            ) : (
              redemptions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-zinc-100 py-3 text-sm"
                >
                  <span>{item.reward.name}</span>
                  <span className="text-zinc-500">
                    {item.status} · {item.pointsUsed} poin
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
