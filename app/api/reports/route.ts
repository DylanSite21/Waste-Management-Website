import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const reports = await prisma.wasteReport.findMany({
    orderBy: { reportDate: "desc" },
    include: {
      user: true,
      region: true,
      photo: true,
      items: { include: { wasteType: true } },
    },
  });

  return NextResponse.json(reports);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  let image = "";
  let regionId = "";
  let items: Array<{ wasteTypeId: string; weight: number }> = [];

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const file = formData.get("image");

    if (file && typeof file !== "string" && file instanceof File) {
      const extension = path.extname(file.name) || ".jpg";
      const filename = `${randomUUID()}${extension}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("images")
        .upload(filename, file, { contentType: file.type });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return NextResponse.json(
          { error: "Gagal mengunggah gambar." },
          { status: 500 }
        );
      }

      const { data } = supabaseAdmin.storage
        .from("images")
        .getPublicUrl(filename);
      image = data.publicUrl;
    }

    regionId = formData.get("regionId")?.toString() ?? "";
    items = [{
      wasteTypeId: formData.get("wasteTypeId")?.toString() ?? "",
      weight: Number(formData.get("weight")?.toString()),
    }];
  } else {
    const body = await request.json();
    regionId = body.regionId;
    items = Array.isArray(body.items)
      ? body.items.map((item: { wasteTypeId: string; weight: number }) => ({
          wasteTypeId: item.wasteTypeId,
          weight: Number(item.weight),
        }))
      : [{ wasteTypeId: body.wasteTypeId, weight: Number(body.weight) }];
  }

  if (
    !regionId ||
    items.length === 0 ||
    items.some((item) => !item.wasteTypeId || !Number.isFinite(item.weight) || item.weight <= 0)
  ) {
    return NextResponse.json({ error: "Data laporan tidak valid." }, { status: 400 });
  }

  const report = await prisma.wasteReport.create({
    data: {
      userId: session.user.id,
      regionId,
      status: "PENDING",
      items: { create: items },
      ...(image ? { photo: { create: { imageUrl: image } } } : {}),
    },
    include: { items: true, photo: true },
  });

  return NextResponse.json(report, { status: 201 });
}
