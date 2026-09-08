"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RedeemButton({ rewardId }: { rewardId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function redeem() {
    setBusy(true);
    try {
      const response = await fetch("/api/redemptions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rewardId }) });
      if (response.ok) router.refresh();
      else alert((await response.json()).error ?? "Penukaran gagal.");
    } finally { setBusy(false); }
  }
  return <button type="button" onClick={redeem} disabled={busy} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Memproses..." : "Tukar poin"}</button>;
}
