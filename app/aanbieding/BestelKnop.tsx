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
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Besteld
      </span>
    );
  }

  if (status === "uitverkocht") {
    return (
      <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">Net uitverkocht</span>
    );
  }

  return (
    <div className="flex flex-none items-center gap-1.5">
      <select
        value={aantal}
        onChange={(e) => setAantal(Number(e.target.value))}
        className="rounded-md border border-slate-300 bg-white px-1.5 py-1.5 text-sm text-slate-700"
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
        className="flex items-center justify-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {status === "bezig" ? (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
          "Bestellen"
        )}
      </button>
    </div>
  );
}
