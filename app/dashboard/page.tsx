import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const totalUsers = await prisma.user.count();

  const totalReports = await prisma.wasteReport.count();

  const totalRegions = await prisma.region.count();

  const totalWeight = await prisma.wasteReport.aggregate({
    _sum: {
      weight: true,
    },
  });

  const reports = await prisma.wasteReport.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      wasteType: true,
      region: true,
    },
  });

  return (
    <main>
      <h1>Waste Management Dashboard</h1>

      <p>Welcome, Administrator</p>

      <section>
        <div>
          <h2>Total Reports</h2>
          <p>{totalReports}</p>
        </div>

        <div>
          <h2>Total Users</h2>
          <p>{totalUsers}</p>
        </div>

        <div>
          <h2>Regions</h2>
          <p>{totalRegions}</p>
        </div>

        <div>
          <h2>Total Waste</h2>
          <p>{Number(totalWeight._sum.weight ?? 0)} Kg</p>
        </div>
      </section>

      <section>
        <h2>Recent Reports</h2>

        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>User</th>
              <th>Type</th>
              <th>Region</th>
              <th>Weight</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7}>No reports available.</td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <tr key={report.id}>
                  <td>{index + 1}</td>

                  <td>{report.user.name}</td>

                  <td>{report.wasteType.name}</td>

                  <td>{report.region.city}</td>

                  <td>{Number(report.weight)} Kg</td>

                  <td>{report.status}</td>

                  <td>{report.createdAt.toLocaleDateString("id-ID")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
