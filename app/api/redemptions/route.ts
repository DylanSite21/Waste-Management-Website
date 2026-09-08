import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where = session.user.role?.toUpperCase() === "ADMIN" ? {} : { userId: session.user.id };
  const redemptions = await prisma.redemption.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { reward: true, user: { select: { name: true, email: true } } },
  });
  return NextResponse.json(redemptions);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { rewardId } = await request.json();

  const reward = await prisma.reward.findUnique({ where: { id: rewardId } });
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!reward || !user || !reward.isActive || reward.stock < 1) {
    return NextResponse.json({ error: "Hadiah tidak tersedia." }, { status: 400 });
  }
  if (user.pointsBalance < reward.pointCost) {
    return NextResponse.json({ error: "Saldo poin tidak cukup." }, { status: 400 });
  }

  const redemption = await prisma.redemption.create({
    data: { userId: user.id, rewardId: reward.id, pointsUsed: reward.pointCost },
    include: { reward: true },
  });
  return NextResponse.json(redemption, { status: 201 });
}
