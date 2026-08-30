import { KLANTEN } from "@/lib/klanten";
import { bouwAanbieding, filterBeschrijvingNl } from "@/lib/filter";
import { genereerWhatsappBericht } from "@/lib/whatsapp";
import { parseFilterUitSearchParams, filterAlsQuery } from "@/lib/querySearchParams";

function eersteWaarde(waarde: string | string[] | undefined): string | undefined {
  return Array.isArray(waarde) ? waarde[0] : waarde;
}

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
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-4">
      <header>
        <h1 className="text-xl font-semibold">Aanbieding maken</h1>
        <p className="text-sm text-gray-500">Kies een klant en een filter — dit is Sanders kant van het portaal.</p>
      </header>

      <form method="get" className="flex flex-col gap-3 rounded border border-gray-200 p-4">
        <label className="flex flex-col gap-1 text-sm">
          Klant
          <select name="klant" defaultValue={klantSlug ?? ""} className="rounded border border-gray-300 p-2" required>
            <option value="" disabled>
              Kies een klant
            </option>
            {Object.values(KLANTEN).map((k) => (
              <option key={k.slug} value={k.slug}>
                {k.naam} ({k.plaats})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Bloemsoort
          <select name="type" defaultValue={filter?.type ?? ""} className="rounded border border-gray-300 p-2" required>
            <option value="" disabled>
              Kies een soort
            </option>
            <option value="roos">Rozen</option>
            <option value="tulp">Tulpen</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Lengte (optioneel)
          <input
            name="lengte"
            type="number"
            defaultValue={filter?.lengte ?? ""}
            className="rounded border border-gray-300 p-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Niet ouder dan (dagen, optioneel)
          <input
            name="maxLeeftijdDagen"
            type="number"
            defaultValue={filter?.maxLeeftijdDagen ?? ""}
            className="rounded border border-gray-300 p-2"
          />
        </label>

        <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white">
          Genereer aanbieding
        </button>
      </form>

      {filter === null && (klantSlug || sp.type) && (
        <p className="text-sm text-red-700">Ongeldig filter — kies een klant en een bloemsoort.</p>
      )}

      {resultaat && (
        <div className="flex flex-col gap-2 rounded border border-gray-200 p-4">
          <p className="text-sm text-gray-500">
            {filterBeschrijvingNl(filter!)} · {resultaat.aantalRegels} artikel(en) gevonden
          </p>
          <p className="text-sm text-gray-500">Link voor de klant:</p>
          <a href={resultaat.link} className="break-all text-blue-700 underline">
            {resultaat.link}
          </a>
          <p className="text-sm text-gray-500">WhatsApp-tekst (Duits):</p>
          <pre className="whitespace-pre-wrap rounded bg-gray-50 p-3 text-sm">{resultaat.bericht}</pre>
        </div>
      )}
    </main>
  );
}
