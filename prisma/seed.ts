import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Seeding Admin...");

  const hashedPassword = await hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin berhasil dibuat:");
  console.log(admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });