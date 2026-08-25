"use client";

import { useState } from "react";

type Status = "idle" | "bezig" | "besteld" | "uitverkocht";

export default function BestelKnop({ code, emmers }: { code: string; emmers: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const [aantal, setAantal] = useState(1);

  async function bestel() {
    setStatus("bezig");
    const response = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, aantalEmmers: aantal }),
    });
    setStatus(response.ok ? "besteld" : "uitverkocht");
  }

  if (status === "besteld") {
    return <span className="text-sm font-medium text-green-700">Bestelling ontvangen ✓</span>;
  }

  if (status === "uitverkocht") {
    return <span className="text-sm font-medium text-red-700">Helaas, net uitverkocht</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={aantal}
        onChange={(e) => setAantal(Number(e.target.value))}
        className="rounded border border-gray-300 px-2 py-1 text-sm"
        aria-label="Aantal emmers"
      >
        {Array.from({ length: emmers }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button
        onClick={bestel}
        disabled={status === "bezig"}
        className="rounded bg-slate-900 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {status === "bezig" ? "..." : "Bestellen"}
      </button>
    </div>
  );
}
