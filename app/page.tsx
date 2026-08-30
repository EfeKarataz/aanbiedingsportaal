import Link from "next/link";
import PageHeader from "./components/PageHeader";

function VoorbeeldKaart({
  href,
  naam,
  plaats,
  beschrijving,
}: {
  href: string;
  naam: string;
  plaats: string;
  beschrijving: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <div>
        <p className="font-medium text-slate-900">
          {naam} <span className="font-normal text-slate-400">· {plaats}</span>
        </p>
        <p className="text-sm text-slate-500">{beschrijving}</p>
      </div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="flex-none text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-600"
        aria-hidden
      >
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
      <PageHeader title="Aanbiedingsportaal" subtitle="Dagelijkse aanbieding per klant, in een paar klikken." />

      <Link
        href="/sander"
        className="flex items-center justify-between rounded-xl bg-emerald-600 p-4 font-medium text-white shadow-sm transition hover:bg-emerald-700"
      >
        Nieuwe aanbieding maken
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Voorbeelden uit de case</p>
        <VoorbeeldKaart
          href="/aanbieding/hoffmann?type=roos&lengte=50"
          naam="Hoffmann"
          plaats="Keulen"
          beschrijving="Rozen, lengte 50"
        />
        <VoorbeeldKaart
          href="/aanbieding/kruger?type=tulp&maxLeeftijdDagen=3"
          naam="Krüger"
          plaats="Bremen"
          beschrijving="Tulpen, niet ouder dan 3 dagen"
        />
      </div>
    </main>
  );
}
