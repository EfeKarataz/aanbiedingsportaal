"use client";

import { useState } from "react";

export default function CopyKnop({ tekst }: { tekst: string }) {
  const [gekopieerd, setGekopieerd] = useState(false);

  async function kopieer() {
    await navigator.clipboard.writeText(tekst);
    setGekopieerd(true);
    setTimeout(() => setGekopieerd(false), 2000);
  }

  return (
    <button
      onClick={kopieer}
      type="button"
      className="self-start rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
    >
      {gekopieerd ? "Gekopieerd ✓" : "Kopieer bericht"}
    </button>
  );
}
