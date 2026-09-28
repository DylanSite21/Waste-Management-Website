"use client";

import Image from "next/image";
import { useState } from "react";

type DashboardReport = {
  id: string;
  date: string;
  userName: string;
  regionName: string;
  photoUrl: string | null;
  wasteTypes: string[];
  weight: number;
};

export default function AdminReportsTable({
  reports,
}: {
  reports: DashboardReport[];
}) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const regions = [
    ...new Set(reports.map((report) => report.regionName)),
  ].sort();
  const normalizedSearch = search.trim().toLocaleLowerCase("id-ID");
  const filteredReports = reports.filter((report) => {
    const matchesRegion = region === "all" || report.regionName === region;
    const searchableText = [
      report.userName,
      report.regionName,
      ...report.wasteTypes,
    ]
      .join(" ")
      .toLocaleLowerCase("id-ID");

    return matchesRegion && searchableText.includes(normalizedSearch);
  });

  return (
    <>
      <div className="flex flex-col gap-3 border-b border-[#e7ece8] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <label className="block sm:max-w-sm sm:flex-1">
          <span className="sr-only">
            Cari laporan berdasarkan pengguna atau jenis sampah
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari pengguna atau jenis sampah"
            className="w-full rounded-md border border-[#cfdad2] bg-white px-3 py-2.5 text-sm text-[#18241f] outline-none placeholder:text-[#89978e] focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-[#5a6a62]">
          <span>Wilayah</span>
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="min-w-36 rounded-md border border-[#cfdad2] bg-white px-3 py-2.5 text-sm text-[#18241f] outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
          >
            <option value="all">Semua wilayah</option>
            {regions.map((regionName) => (
              <option key={regionName} value={regionName}>
                {regionName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p
        aria-live="polite"
        className="px-4 pt-3 text-xs text-[#728178] sm:px-5"
      >
        Menampilkan {filteredReports.length} dari {reports.length} laporan
        terbaru
      </p>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-[#728178]">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">
                Pelapor
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Jenis sampah
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Wilayah
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Berat
              </th>
              <th scope="col" className="px-5 py-3 font-semibold">
                Tanggal
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr
                key={report.id}
                className="border-t border-[#e7ece8] text-[#43534a] transition-colors hover:bg-[#f7faf7]"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {report.photoUrl ? (
                      <Image
                        src={report.photoUrl}
                        alt="Foto laporan"
                        width={40}
                        height={40}
                        className="size-10 rounded-md object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="grid size-10 place-items-center rounded-md bg-[#edf4ef] text-xs font-bold text-emerald-800"
                      >
                        {report.userName.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="font-medium text-[#24332b]">
                      {report.userName}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  {report.wasteTypes.join(", ") || "Belum dikategorikan"}
                </td>
                <td className="px-5 py-3.5">{report.regionName}</td>
                <td className="px-5 py-3.5 font-medium tabular-nums">
                  {report.weight.toLocaleString("id-ID")} kg
                </td>
                <td className="px-5 py-3.5">
                  {new Date(report.date).toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#e7ece8] md:hidden">
        {filteredReports.map((report) => (
          <article key={report.id} className="flex gap-3 px-4 py-4">
            {report.photoUrl ? (
              <Image
                src={report.photoUrl}
                alt="Foto laporan"
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-md object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid size-14 shrink-0 place-items-center rounded-md bg-[#edf4ef] text-sm font-bold text-emerald-800"
              >
                {report.userName.slice(0, 1).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="truncate text-sm font-semibold text-[#24332b]">
                  {report.userName}
                </h3>
                <span className="text-xs text-[#728178]">
                  {new Date(report.date).toLocaleDateString("id-ID", {
                    dateStyle: "medium",
                  })}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-[#5a6a62]">
                {report.wasteTypes.join(", ") || "Belum dikategorikan"}
              </p>
              <p className="mt-2 text-xs text-[#728178]">
                {report.regionName} <span aria-hidden="true">·</span>{" "}
                <span className="font-semibold text-[#43534a]">
                  {report.weight.toLocaleString("id-ID")} kg
                </span>
              </p>
            </div>
          </article>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <p className="px-5 py-10 text-center text-sm text-[#728178]">
          {reports.length === 0
            ? "Belum ada laporan yang tercatat."
            : "Tidak ada laporan yang cocok dengan pencarian."}
        </p>
      )}
    </>
  );
}
