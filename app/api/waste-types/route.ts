import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const wasteTypes = await prisma.wasteType.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(wasteTypes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const wasteType = await prisma.wasteType.create({ data: { name: body.name } });
  return NextResponse.json(wasteType, { status: 201 });
}
