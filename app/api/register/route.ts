import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, noHp, password } = await request.json();

    if (!name || !email || !noHp || !password) {
      return NextResponse.json(
        { message: "Nama, email, nomor HP, dan password wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toString().trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    await prisma.user.create({
      data: {
        name: name.toString().trim(),
        email: normalizedEmail,
        noHp: noHp.toString().trim(),
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Akun berhasil dibuat." }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal membuat akun." },
      { status: 500 }
    );
  }
}
