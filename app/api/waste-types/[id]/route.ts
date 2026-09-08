import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const wasteType = await prisma.wasteType.update({
    where: { id },
    data: { name: body.name.trim(), pointPerKg: Number(body.pointPerKg) },
  });

  return NextResponse.json(wasteType);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const itemCount = await prisma.wasteReportItem.count({ where: { wasteTypeId: id } });
  if (itemCount > 0) {
    return NextResponse.json(
      { error: "Jenis sampah tidak dapat dihapus karena sudah dipakai laporan." },
      { status: 409 },
    );
  }

  await prisma.wasteType.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
