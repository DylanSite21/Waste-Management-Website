import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const region = await prisma.region.update({
    where: { id },
    data: { name: body.name.trim() },
  });

  return NextResponse.json(region);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const reportCount = await prisma.wasteReport.count({ where: { regionId: id } });
  if (reportCount > 0) {
    return NextResponse.json(
      { error: "Wilayah tidak dapat dihapus karena masih memiliki laporan." },
      { status: 409 },
    );
  }

  await prisma.region.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
