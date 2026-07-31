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
  // Users
  // =========================

  const adminPassword = await hash("admin123", 10);
  const userPassword = await hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrator",
      email: "admin@example.com",
      noHp: "081234567890",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "user@example.com",
      noHp: "081298765432",
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
      name: "Jakarta Pusat",
    },
  });

  const jakartaSelatan = await prisma.region.create({
    data: {
      name: "Jakarta Selatan",
    },
  });

  // =========================
  // Report 1
  // =========================

  const report1 = await prisma.wasteReport.create({
    data: {
      userId: user.id,
      wasteTypeId: organik.id,
      regionId: jakartaPusat.id,
      weight: 12.5,
      reportDate: new Date("2026-07-29"),
    },
  });

  await prisma.wastePhoto.create({
    data: {
      imageUrl: "/uploads/organik1.jpg",
      reportId: report1.id,
    },
  });

  // =========================
  // Report 2
  // =========================

  const report2 = await prisma.wasteReport.create({
    data: {
      userId: user.id,
      wasteTypeId: anorganik.id,
      regionId: jakartaSelatan.id,
      weight: 7.2,
      reportDate: new Date("2026-07-30"),
    },
  });

  await prisma.wastePhoto.create({
    data: {
      imageUrl: "/uploads/plastik.jpg",
      reportId: report2.id,
    },
  });

  // =========================
  // Report 3
  // =========================

  const report3 = await prisma.wasteReport.create({
    data: {
      userId: user.id,
      wasteTypeId: b3.id,
      regionId: jakartaPusat.id,
      weight: 2.1,
      reportDate: new Date("2026-07-31"),
    },
  });

  await prisma.wastePhoto.create({
    data: {
      imageUrl: "/uploads/baterai.jpg",
      reportId: report3.id,
    },
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