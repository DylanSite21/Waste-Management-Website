"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CreateWasteTypeForm() {
  const router = useRouter();
  const [name, setName] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    await fetch("/api/waste-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setName("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama waste type"
        className="flex-1 rounded-lg border px-3 py-2"
        required
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-white"
      >
        Tambah
      </button>
    </form>
  );
}
