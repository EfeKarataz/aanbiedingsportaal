import Link from "next/link";
import { notFound } from "next/navigation";
import { vindKlant } from "@/lib/klanten";
import { bouwAanbieding } from "@/lib/filter";
import { formatEuro } from "@/lib/pricing";
import { parseFilterUitSearchParams } from "@/lib/querySearchParams";
import BestelKnop from "../BestelKnop";
import BloemIcon from "../../components/BloemIcon";

const KLEUR_HEX: Record<string, string> = {
  rood: "#dc2626",
  rot: "#dc2626",
  roze: "#ec4899",
  wit: "#94a3b8",
  geel: "#eab308",
  paars: "#9333ea",
};

export default async function AanbiedingPagina({ params, searchParams }: PageProps<"/aanbieding/[klant]">) {
  const { klant: slug } = await params;
  const klant = vindKlant(slug);
  if (!klant) notFound();

  const filter = parseFilterUitSearchParams(await searchParams);
  if (!filter) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-6">
        <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
          Er is nog geen filter gekozen voor {klant.naam}. Ga naar{" "}
          <Link href={`/sander?klant=${klant.slug}`} className="text-emerald-700 underline">
            /sander
          </Link>{" "}
          om een aanbieding samen te stellen.
        </p>
      </main>
    );
  }

  const { regels } = bouwAanbieding(klant, filter);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-6">
      <header className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Van Rooij Bloemen</p>
          <h1 className="text-xl font-semibold text-slate-900">{klant.naam}</h1>
          <p className="text-sm text-slate-500">{klant.plaats}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
          {klant.naam.slice(0, 2).toUpperCase()}
        </div>
      </header>

      {regels.length === 0 && (
        <p className="rounded-xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
          Vandaag niets passend op voorraad. Sander neemt contact op zodra er weer wat is.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {regels.map(({ row, prijs }) => (
          <li
            key={row.code}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <BloemIcon kleurHex={KLEUR_HEX[row.kleur]} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900">
                {row.artikel} <span className="font-normal text-slate-400">({row.kleur})</span>
              </p>
              <p className="text-xs text-slate-500">
                Lengte {row.lengteCm} · {row.emmers} emmers op voorraad
              </p>
              <p className="mt-0.5 font-semibold text-emerald-700">
                {formatEuro(prijs.bedrag)}{" "}
                <span className="text-xs font-normal text-slate-400">/ {prijs.eenheid === "bos" ? "bos" : "steel"}</span>
              </p>
            </div>
            <BestelKnop code={row.code} emmers={row.emmers} />
          </li>
        ))}
      </ul>
    </main>
  );
}
