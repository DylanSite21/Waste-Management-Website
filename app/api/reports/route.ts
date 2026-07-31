import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const reports = await prisma.wasteReport.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      wasteType: true,
      region: true,
    },
  });

  return NextResponse.json(reports);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let image = "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("image");

    if (file && typeof file !== "string" && file instanceof File) {
      const bytes = await file.arrayBuffer();
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const extension = path.extname(file.name) || ".jpg";
      const filename = `${randomUUID()}${extension}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, Buffer.from(bytes));
      image = `/uploads/${filename}`;
    }

    const report = await prisma.wasteReport.create({
      data: {
        userId: formData.get("userId")?.toString() ?? "",
        wasteTypeId: Number(formData.get("wasteTypeId")?.toString()),
        regionId: Number(formData.get("regionId")?.toString()),
        image,
        weight: Number(formData.get("weight")?.toString()),
        description: formData.get("description")?.toString() ?? "",
        status: "PENDING",
      },
    });

    return NextResponse.json(report, { status: 201 });
  }

  const body = await request.json();
  const report = await prisma.wasteReport.create({
    data: {
      userId: body.userId,
      wasteTypeId: Number(body.wasteTypeId),
      regionId: Number(body.regionId),
      image: body.image ?? "",
      weight: Number(body.weight),
      description: body.description ?? "",
      status: body.status ?? "PENDING",
    },
  });

  return NextResponse.json(report, { status: 201 });
}
