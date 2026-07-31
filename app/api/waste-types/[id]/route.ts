import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const wasteType = await prisma.wasteType.update({
    where: { id: Number(id) },
    data: { name: body.name },
  });

  return NextResponse.json(wasteType);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.wasteReport.deleteMany({ where: { wasteTypeId: Number(id) } });
  await prisma.wasteType.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
