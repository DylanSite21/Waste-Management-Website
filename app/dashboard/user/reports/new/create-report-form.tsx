"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "../style.module.css";

export default function CreateReportForm({
  userId,
  wasteTypes,
  regions,
}: {
  userId: string;
  wasteTypes: Array<{ id: number; name: string }>;
  regions: Array<{ id: number; city: string; province: string }>;
}) {
  const router = useRouter();
  const [wasteTypeId, setWasteTypeId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("wasteTypeId", wasteTypeId);
    formData.append("regionId", regionId);
    formData.append("weight", weight);
    formData.append("description", description);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const response = await fetch("/api/reports", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      router.push("/dashboard");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`{w-min} ${styles.form}`}>
      <select
        value={wasteTypeId}
        onChange={(e) => setWasteTypeId(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
        required
      >
        <option value="">Pilih jenis sampah</option>
        {wasteTypes.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={regionId}
        onChange={(e) => setRegionId(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
        required
      >
        <option value="">Pilih wilayah</option>
        {regions.map((item) => (
          <option key={item.id} value={item.id}>
            {item.city} - {item.province}
          </option>
        ))}
      </select>

      <input
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Berat (kg)"
        type="number"
        step="0.01"
        className="w-full rounded-lg border px-3 py-2"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          setSelectedFile(file);
          setPreviewUrl(file ? URL.createObjectURL(file) : "");
        }}
        className="w-full rounded-lg border px-3 py-2"
      />

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview gambar"
          className="h-48 w-full rounded-lg object-cover"
        />
      ) : null}

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Deskripsi"
        className="w-full rounded-lg border px-3 py-2"
        rows={4}
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-white"
      >
        Simpan Laporan
      </button>
    </form>
  );
}
