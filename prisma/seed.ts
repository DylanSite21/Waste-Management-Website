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
import { Prisma } from "@/app/generated/prisma/client";

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
      name: "Dylan",
      email: "user@example.com",
      noHp: "081298765432",
      password: userPassword,
      role: "USER",
    },
  });

  // =========================
  // Waste Types (dengan poin per kg)
  // =========================

  const organik = await prisma.wasteType.create({
    data: {
      name: "Organik",
      pointPerKg: 5,
    },
  });

  const anorganik = await prisma.wasteType.create({
    data: {
      name: "Anorganik",
      pointPerKg: 10,
    },
  });

  const b3 = await prisma.wasteType.create({
    data: {
      name: "B3",
      pointPerKg: 20,
    },
  });

  const pointRateByWasteTypeId: Record<string, Prisma.Decimal> = {
    [organik.id]: organik.pointPerKg,
    [anorganik.id]: anorganik.pointPerKg,
    [b3.id]: b3.pointPerKg,
  };

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

  // Helper: hitung total poin dari daftar item (weight x pointPerKg), dibulatkan ke bawah
  function calculatePoints(items: { wasteTypeId: string; weight: number }[]) {
    const total = items.reduce((sum, item) => {
      const rate = pointRateByWasteTypeId[item.wasteTypeId];
      return sum + item.weight * Number(rate);
    }, 0);
    return Math.floor(total);
  }

  // Helper: buat laporan, verifikasi, lalu catat PointTransaction (EARN)
  // dan update saldo poin user — meniru alur asli di aplikasi.
  async function createVerifiedReportWithPoints(params: {
    userId: string;
    regionId: string;
    reportDate: Date;
    items: { wasteTypeId: string; weight: number }[];
    photoUrl: string;
  }) {
    const report = await prisma.wasteReport.create({
      data: {
        userId: params.userId,
        regionId: params.regionId,
        reportDate: params.reportDate,
        status: "VERIFIED",
        items: {
          create: params.items.map((item) => ({
            wasteTypeId: item.wasteTypeId,
            weight: item.weight,
          })),
        },
      },
    });

    await prisma.wastePhoto.create({
      data: {
        imageUrl: params.photoUrl,
        reportId: report.id,
      },
    });

    const points = calculatePoints(params.items);

    await prisma.$transaction([
      prisma.pointTransaction.create({
        data: {
          userId: params.userId,
          type: "EARN",
          points,
          description: `Poin dari laporan ${report.id}`,
          reportId: report.id,
        },
      }),
      prisma.user.update({
        where: { id: params.userId },
        data: { pointsBalance: { increment: points } },
      }),
    ]);

    return { report, points };
  }

  // =========================
  // Report 1
  // =========================

  await createVerifiedReportWithPoints({
    userId: user.id,
    regionId: jakartaPusat.id,
    reportDate: new Date("2026-07-29"),
    items: [
      { wasteTypeId: organik.id, weight: 12.5 },
      { wasteTypeId: anorganik.id, weight: 5.2 },
    ],
    photoUrl: "/uploads/organik1.jpg",
  });

  // =========================
  // Report 2
  // =========================

  await createVerifiedReportWithPoints({
    userId: user.id,
    regionId: jakartaSelatan.id,
    reportDate: new Date("2026-07-30"),
    items: [
      { wasteTypeId: anorganik.id, weight: 7.2 },
      { wasteTypeId: b3.id, weight: 1.5 },
    ],
    photoUrl: "/uploads/plastik.jpg",
  });

  // =========================
  // Report 3
  // =========================

  await createVerifiedReportWithPoints({
    userId: user.id,
    regionId: jakartaPusat.id,
    reportDate: new Date("2026-07-31"),
    items: [
      { wasteTypeId: b3.id, weight: 2.1 },
      { wasteTypeId: organik.id, weight: 3.8 },
    ],
    photoUrl: "/uploads/baterai.jpg",
  });

  // =========================
  // Rewards (katalog hadiah)
  // =========================

  const rewardPulsa = await prisma.reward.create({
    data: {
      name: "Pulsa Rp10.000",
      description: "Voucher pulsa semua operator",
      pointCost: 100,
      stock: 50,
    },
  });

  await prisma.reward.create({
    data: {
      name: "Tumbler ramah lingkungan",
      description: "Tumbler stainless steel 500ml",
      pointCost: 300,
      stock: 20,
    },
  });

  await prisma.reward.create({
    data: {
      name: "Voucher belanja Rp25.000",
      description: "Voucher belanja di toko rekanan",
      pointCost: 250,
      stock: 15,
    },
  });

  // =========================
  // Contoh Redemption (poin milik user sudah cukup dari 3 laporan di atas)
  // =========================

  const currentUser = await prisma.user.findUniqueOrThrow({
    where: { id: user.id },
  });

  if (currentUser.pointsBalance >= rewardPulsa.pointCost) {
    const redemption = await prisma.redemption.create({
      data: {
        userId: user.id,
        rewardId: rewardPulsa.id,
        pointsUsed: rewardPulsa.pointCost,
        status: "COMPLETED",
        processedAt: new Date(),
      },
    });

    await prisma.$transaction([
      prisma.pointTransaction.create({
        data: {
          userId: user.id,
          type: "REDEEM",
          points: rewardPulsa.pointCost,
          description: `Tukar poin untuk ${rewardPulsa.name}`,
          redemptionId: redemption.id,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { pointsBalance: { decrement: rewardPulsa.pointCost } },
      }),
      prisma.reward.update({
        where: { id: rewardPulsa.id },
        data: { stock: { decrement: 1 } },
      }),
    ]);
  }

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