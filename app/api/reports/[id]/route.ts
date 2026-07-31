import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const report = await prisma.wasteReport.update({
    where: { id },
    data: {
      status: body.status,
      weight: Number(body.weight),
      description: body.description ?? "",
    },
  });

  return NextResponse.json(report);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.wasteReport.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
