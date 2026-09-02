import { laadStock, bloemType, type StockRow } from "@/lib/stock";
import { resterendeEmmers } from "@/lib/orders";
import PageHeader from "../components/PageHeader";
import BloemIcon from "../components/BloemIcon";

// Anders zou Next.js deze pagina bij de build statisch renderen, waardoor
// bestellingen via /api/order er niet meer in doorkomen.
export const dynamic = "force-dynamic";

const KLEUR_HEX: Record<string, string> = {
  rood: "#dc2626",
  rot: "#dc2626",
  roze: "#ec4899",
  wit: "#94a3b8",
  geel: "#eab308",
  paars: "#9333ea",
};

function Groep({ titel, rows }: { titel: string; rows: StockRow[] }) {
  if (rows.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">{titel}</p>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => {
          const resterend = resterendeEmmers(row.code);
          const afgeboekt = resterend < row.emmers;

          return (
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
                  Lengte {row.lengteCm} ·{" "}
                  {row.leeftijdDagen === 0
                    ? "vandaag binnen"
                    : `${row.leeftijdDagen} ${row.leeftijdDagen === 1 ? "dag" : "dagen"} oud`}
                </p>
                <p className="text-xs text-slate-500">Inkoop €{row.inkoopPerSteel.toFixed(2)} / steel</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{resterend}</p>
                <p className="text-xs text-slate-400">
                  emmers{afgeboekt ? ` (van ${row.emmers})` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function VoorraadPagina() {
  const { rows, rejected } = laadStock();
  const rozen = rows.filter((row) => bloemType(row.code) === "roos");
  const tulpen = rows.filter((row) => bloemType(row.code) === "tulp");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
      <PageHeader
        title="Voorraad"
        subtitle="Vandaag beschikbaar, na het opschonen van de FloriLink-export."
      />

      <Groep titel="Rozen" rows={rozen} />
      <Groep titel="Tulpen" rows={tulpen} />

      {rejected.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Genegeerd bij het opschonen
          </p>
          <ul className="flex flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            {rejected.map((item, i) => (
              <li key={i} className="text-xs text-amber-800">
                <span className="font-mono">{item.raw.split(";").slice(0, 2).join(" ")}</span>: {item.reden}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
