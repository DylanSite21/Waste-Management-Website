"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import "../../../../globals.css";
import styles from "../style.module.css";
import Image from "next/image";

export default function CreateReportForm({
  userId,
  wasteTypes,
  regions,
}: {
  userId: string;
  wasteTypes: Array<{ id: string; name: string }>;
  regions: Array<{ id: string; name: string }>;
}) {
  const router = useRouter();
  const [wasteTypeId, setWasteTypeId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("wasteTypeId", wasteTypeId);
    formData.append("regionId", regionId);
    formData.append("weight", weight);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    const response = await fetch("/api/reports", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Laporan gagal disimpan.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className={`{w-min} ${styles.form}`}>
      {error ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
      <select
        value={wasteTypeId}
        onChange={(e) => setWasteTypeId(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 text-black"
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
        className="w-full rounded-lg border px-3 py-2 text-black"
        required
      >
        <option value="">Pilih wilayah</option>
        {regions.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <input
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Berat (kg)"
        type="number"
        step="0.01"
        className="w-full rounded-lg border px-3 py-2 text-black"
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
        className="w-full rounded-lg border px-3 py-2 text-black"
      />

      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Preview gambar"
          className="h-48 w-full rounded-lg object-cover"
          width={192}
          height={192}
        />
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-white"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
      </button>
    </form>
  );
}
