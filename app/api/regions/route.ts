import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const regions = await prisma.region.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(regions);
}

export async function POST(request: Request) {
  const body = await request.json();
  const region = await prisma.region.create({
    data: {
      province: body.province,
      city: body.city,
      district: body.district ?? null,
    },
  });

  return NextResponse.json(region, { status: 201 });
}
