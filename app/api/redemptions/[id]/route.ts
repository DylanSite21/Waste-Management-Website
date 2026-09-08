import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role?.toUpperCase() !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { status } = await request.json();
  if (status !== "APPROVED" && status !== "REJECTED") return NextResponse.json({ error: "Status tidak valid." }, { status: 400 });

  const redemption = await prisma.redemption.findUnique({ where: { id }, include: { reward: true } });
  if (!redemption || redemption.status !== "PENDING") return NextResponse.json({ error: "Pengajuan tidak tersedia." }, { status: 409 });
  if (status === "REJECTED") {
    return NextResponse.json(await prisma.redemption.update({ where: { id }, data: { status } }));
  }

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({ where: { id: redemption.userId } });
      const reward = await transaction.reward.findUnique({ where: { id: redemption.rewardId } });
      if (!user || !reward || reward.stock < 1 || user.pointsBalance < redemption.pointsUsed) throw new Error("Saldo atau stok berubah.");
      const updated = await transaction.redemption.update({ where: { id }, data: { status: "COMPLETED", processedAt: new Date() } });
      await transaction.pointTransaction.create({ data: { userId: user.id, type: "REDEEM", points: redemption.pointsUsed, description: `Tukar poin untuk ${reward.name}`, redemptionId: id } });
      await transaction.user.update({ where: { id: user.id }, data: { pointsBalance: { decrement: redemption.pointsUsed } } });
      await transaction.reward.update({ where: { id: reward.id }, data: { stock: { decrement: 1 } } });
      return updated;
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Gagal memproses pengajuan." }, { status: 409 });
  }
}
