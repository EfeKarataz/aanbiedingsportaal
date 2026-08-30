import { KLANTEN } from "@/lib/klanten";
import { bouwAanbieding, filterBeschrijvingNl } from "@/lib/filter";
import { genereerWhatsappBericht } from "@/lib/whatsapp";
import { parseFilterUitSearchParams, filterAlsQuery } from "@/lib/querySearchParams";
import PageHeader from "../components/PageHeader";
import CopyKnop from "./CopyKnop";

function eersteWaarde(waarde: string | string[] | undefined): string | undefined {
  return Array.isArray(waarde) ? waarde[0] : waarde;
}

const veldClass =
  "rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-slate-700";

export default async function SanderPagina({ searchParams }: PageProps<"/sander">) {
  const sp = await searchParams;
  const klantSlug = eersteWaarde(sp.klant);
  const klant = klantSlug ? KLANTEN[klantSlug] : undefined;
  const filter = parseFilterUitSearchParams(sp);

  const resultaat =
    klant && filter
      ? (() => {
          const aanbieding = bouwAanbieding(klant, filter);
          const link = `/aanbieding/${klant.slug}?${filterAlsQuery(filter)}`;
          const bericht = genereerWhatsappBericht(
            aanbieding,
            `https://aanbiedingsportaal.vercel.app${link}`
          );
          return { link, bericht, aantalRegels: aanbieding.regels.length };
        })()
      : null;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 p-6">
      <PageHeader title="Aanbieding maken" subtitle="Kies een klant en een filter. Dit is Sanders kant van het portaal." />

      <form
        method="get"
        className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <label className={labelClass}>
          Klant
          <select name="klant" defaultValue={klantSlug ?? ""} className={veldClass} required>
            <option value="" disabled>
              Kies een klant
            </option>
            {Object.values(KLANTEN).map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.naam} · {k.plaats}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Bloemsoort
          <select name="type" defaultValue={filter?.type ?? ""} className={veldClass} required>
            <option value="" disabled>
              Kies een soort
            </option>
            <option value="roos">Rozen</option>
            <option value="tulp">Tulpen</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className={labelClass}>
            Lengte
            <input
              name="lengte"
              type="number"
              placeholder="optioneel"
              defaultValue={filter?.lengte ?? ""}
              className={veldClass}
            />
          </label>

          <label className={labelClass}>
            Max. leeftijd (dagen)
            <input
              name="maxLeeftijdDagen"
              type="number"
              placeholder="optioneel"
              defaultValue={filter?.maxLeeftijdDagen ?? ""}
              className={veldClass}
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
        >
          Genereer aanbieding
        </button>
      </form>

      {filter === null && (klantSlug || sp.type) && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          Ongeldig filter. Kies een klant en een bloemsoort.
        </p>
      )}

      {resultaat && (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-900">{filterBeschrijvingNl(filter!)}</p>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              {resultaat.aantalRegels} artikel{resultaat.aantalRegels === 1 ? "" : "en"}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">Link voor de klant</p>
            <a
              href={resultaat.link}
              className="truncate rounded-lg bg-slate-50 px-3 py-2 text-sm text-emerald-700 underline decoration-emerald-300 underline-offset-2"
            >
              {resultaat.link}
            </a>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-slate-400 uppercase">WhatsApp-tekst (Duits)</p>
              <CopyKnop tekst={resultaat.bericht} />
            </div>
            <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {resultaat.bericht}
            </pre>
          </div>
        </div>
      )}
    </main>
  );
}
