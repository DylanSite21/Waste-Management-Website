import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, string> = {};

  if (body.name) data.name = body.name;
  if (body.email) data.email = body.email;
  if (body.role) data.role = body.role;
  if (body.password) {
    data.password = await bcrypt.hash(body.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  return NextResponse.json(user);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.$transaction(async (tx) => {
    await tx.wasteReport.deleteMany({ where: { userId: id } });
    await tx.user.delete({ where: { id } });
  });

  return NextResponse.json({ success: true });
}
