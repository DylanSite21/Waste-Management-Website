"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateRegionForm() {
  const router = useRouter();
  const [name, setName] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch("/api/regions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 md:grid-cols-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama wilayah"
        className="rounded-lg border px-3 py-2"
        required
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
