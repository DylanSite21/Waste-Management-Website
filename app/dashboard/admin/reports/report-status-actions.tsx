"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportStatusActions({
  reportId,
  status,
}: {
  reportId: string;
  status: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function updateStatus(nextStatus: "VERIFIED" | "REJECTED") {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status !== "PENDING") {
    return (
      <span className={status === "VERIFIED" ? "text-emerald-700" : "text-rose-700"}>
        {status === "VERIFIED" ? "Terverifikasi" : "Ditolak"}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => updateStatus("VERIFIED")}
        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        Verifikasi
      </button>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() => updateStatus("REJECTED")}
        className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 disabled:opacity-50"
      >
        Tolak
      </button>
    </div>
  );
}
