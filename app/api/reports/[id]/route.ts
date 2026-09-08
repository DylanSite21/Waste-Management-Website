import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role?.toUpperCase() !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const status = body.status;

  if (!["PENDING", "VERIFIED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Status laporan tidak valid." }, { status: 400 });
  }

  const report = await prisma.wasteReport.findUnique({
    where: { id },
    include: { items: { include: { wasteType: true } }, pointTransaction: true },
  });

  if (!report) {
    return NextResponse.json({ error: "Laporan tidak ditemukan." }, { status: 404 });
  }

  if (report.pointTransaction && status !== "VERIFIED") {
    return NextResponse.json(
      { error: "Laporan yang sudah diverifikasi tidak dapat dibatalkan." },
      { status: 409 },
    );
  }

  const points = Math.floor(
    report.items.reduce(
      (total, item) => total + Number(item.weight) * Number(item.wasteType.pointPerKg),
      0,
    ),
  );

  const updatedReport = await prisma.$transaction(async (transaction) => {
    const updated = await transaction.wasteReport.update({
      where: { id },
      data: { status },
    });

    if (status === "VERIFIED" && !report.pointTransaction) {
      await transaction.pointTransaction.create({
        data: {
          userId: report.userId,
          type: "EARN",
          points,
          description: `Poin dari laporan ${report.id}`,
          reportId: report.id,
        },
      });
      await transaction.user.update({
        where: { id: report.userId },
        data: { pointsBalance: { increment: points } },
      });
    }

    return updated;
  });

  return NextResponse.json({ ...updatedReport, points: status === "VERIFIED" ? points : 0 });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role?.toUpperCase() !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await prisma.wasteReport.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
