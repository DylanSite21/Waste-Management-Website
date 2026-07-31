import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const region = await prisma.region.update({
    where: { id: Number(id) },
    data: {
      province: body.province,
      city: body.city,
      district: body.district ?? null,
    },
  });

  return NextResponse.json(region);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.wasteReport.deleteMany({ where: { regionId: Number(id) } });
  await prisma.region.delete({ where: { id: Number(id) } });

  return NextResponse.json({ success: true });
}
