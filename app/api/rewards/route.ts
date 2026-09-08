import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const rewards = await prisma.reward.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rewards);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role?.toUpperCase() !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const reward = await prisma.reward.create({
    data: {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      pointCost: Number(body.pointCost),
      stock: Number(body.stock),
    },
  });
  return NextResponse.json(reward, { status: 201 });
}
