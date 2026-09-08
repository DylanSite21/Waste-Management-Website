"use client";

import { useRouter } from "next/navigation";
export default function RewardActions({ id }: { id: string }) {
  const router = useRouter();
  async function update(status: "APPROVED" | "REJECTED") {
    const response = await fetch(`/api/redemptions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) router.refresh();
    else alert((await response.json()).error ?? "Gagal memproses.");
  }
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => update("APPROVED")}
        className="text-emerald-700"
      >
        Setujui
      </button>
      <button
        type="button"
        onClick={() => update("REJECTED")}
        className="text-rose-700"
      >
        Tolak
      </button>
    </div>
  );
}
