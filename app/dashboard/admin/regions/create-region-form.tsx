"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateRegionForm() {
  const router = useRouter();
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch("/api/regions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ province, city, district }),
    });

    setProvince("");
    setCity("");
    setDistrict("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-3">
      <input
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        placeholder="Provinsi"
        className="rounded-lg border px-3 py-2"
        required
      />
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Kota"
        className="rounded-lg border px-3 py-2"
        required
      />
      <input
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        placeholder="Distrik"
        className="rounded-lg border px-3 py-2"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-white md:col-span-3"
      >
        Tambah Region
      </button>
    </form>
  );
}
