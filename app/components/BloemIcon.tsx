/** Neutrale placeholder in plaats van een productfoto (zie DENKEN.md: "foto's zijn een grijs vlak"). */
export default function BloemIcon({ kleurHex }: { kleurHex?: string }) {
  return (
    <div className="flex h-16 w-16 flex-none items-center justify-center rounded-xl bg-slate-100">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v18M6 8c0 3.5 2.5 5 6 5s6-1.5 6-5"
          stroke={kleurHex ?? "#94a3b8"}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="6" r="2.4" fill={kleurHex ?? "#94a3b8"} opacity="0.5" />
      </svg>
    </div>
  );
}
