// import { prisma } from "@/lib/db";
// import { hash } from "bcryptjs";

// async function main() {
//   console.log("🌱 Seeding Admin...");

//   const hashedPassword = await hash("admin123", 10);

//   const admin = await prisma.user.upsert({
//     where: {
//       email: "admin@example.com",
//     },
//     update: {},
//     create: {
//       name: "Administrator",
//       email: "admin@example.com",
//       password: hashedPassword,
//       role: "ADMIN",
//     },
//   });

//   console.log("✅ Admin berhasil dibuat:");
//   console.log(admin);
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });

// ============================================================

import { prisma } from "@/lib/db";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // =========================
  // User
  // =========================

  const adminPassword = await hash("admin123", 10);
  const userPassword = await hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "user@example.com",
      password: userPassword,
      role: "USER",
    },
  });

  // =========================
  // Waste Types
  // =========================

  const organik = await prisma.wasteType.create({
    data: {
      name: "Organik",
    },
  });

  const anorganik = await prisma.wasteType.create({
    data: {
      name: "Anorganik",
    },
  });

  const b3 = await prisma.wasteType.create({
    data: {
      name: "B3",
    },
  });

  // =========================
  // Regions
  // =========================

  const jakartaPusat = await prisma.region.create({
    data: {
      province: "DKI Jakarta",
      city: "Jakarta Pusat",
      district: "Gambir",
    },
  });

  const jakartaSelatan = await prisma.region.create({
    data: {
      province: "DKI Jakarta",
      city: "Jakarta Selatan",
      district: "Kebayoran Baru",
    },
  });

  // =========================
  // Waste Reports
  // =========================

  await prisma.wasteReport.createMany({
    data: [
      {
        userId: user.id,
        wasteTypeId: organik.id,
        regionId: jakartaPusat.id,
        image: "/uploads/organik1.jpg",
        weight: 12.5,
        description: "Sampah daun dan sisa makanan",
        status: "PENDING",
      },
      {
        userId: user.id,
        wasteTypeId: anorganik.id,
        regionId: jakartaSelatan.id,
        image: "/uploads/plastik.jpg",
        weight: 7.2,
        description: "Botol plastik dan kaleng",
        status: "PROCESSED",
      },
      {
        userId: user.id,
        wasteTypeId: b3.id,
        regionId: jakartaPusat.id,
        image: "/uploads/baterai.jpg",
        weight: 2.1,
        description: "Baterai bekas",
        status: "COMPLETED",
      },
    ],
  });

  console.log("✅ Database berhasil di-seed.");
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