"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
export default function CreateRewardForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pointCost, setPointCost] = useState("");
  const [stock, setStock] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/rewards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, pointCost, stock }),
    });
    if (response.ok) {
      setName("");
      setDescription("");
      setPointCost("");
      setStock("");
      router.refresh();
    }
  }
  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama hadiah"
        className="rounded-lg border px-3 py-2"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Deskripsi"
        className="rounded-lg border px-3 py-2"
      />
      <input
        required
        min="1"
        type="number"
        value={pointCost}
        onChange={(e) => setPointCost(e.target.value)}
        placeholder="Biaya poin"
        className="rounded-lg border px-3 py-2"
      />
      <input
        required
        min="0"
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stok"
        className="rounded-lg border px-3 py-2"
      />
      <button className="rounded-lg bg-zinc-900 px-4 py-2 text-white md:col-span-4">
        Tambah hadiah
      </button>
    </form>
  );
}
