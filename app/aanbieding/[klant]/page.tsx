import { notFound } from "next/navigation";
import { vindKlant } from "@/lib/klanten";
import { bouwAanbieding } from "@/lib/filter";
import { formatEuro } from "@/lib/pricing";
import BestelKnop from "../BestelKnop";

export default async function AanbiedingPagina({ params }: PageProps<"/aanbieding/[klant]">) {
  const { klant: slug } = await params;
  const klant = vindKlant(slug);
  if (!klant) notFound();

  const { regels } = bouwAanbieding(klant);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-4 p-4">
      <header>
        <p className="text-sm text-gray-500">Van Rooij Bloemen · aanbieding voor</p>
        <h1 className="text-2xl font-semibold">
          {klant.naam} <span className="text-gray-400">— {klant.plaats}</span>
        </h1>
        <p className="text-sm text-gray-500">{klant.filterBeschrijving}</p>
      </header>

      {regels.length === 0 && (
        <p className="rounded border border-gray-200 p-4 text-gray-600">
          Vandaag niets passend op voorraad. Sander neemt contact op zodra er weer wat is.
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {regels.map(({ row, prijs }) => (
          <li key={row.code} className="flex items-center gap-3 rounded border border-gray-200 p-3">
            <div className="h-16 w-16 flex-none rounded bg-gray-200" aria-hidden />
            <div className="flex-1">
              <p className="font-medium">
                {row.artikel} <span className="text-gray-400">({row.kleur})</span>
              </p>
              <p className="text-sm text-gray-500">Lengte {row.lengteCm} · {row.emmers} emmers op voorraad</p>
              <p className="font-semibold">
                {formatEuro(prijs.bedrag)} / {prijs.eenheid === "bos" ? "bos" : "steel"}
              </p>
            </div>
            <BestelKnop code={row.code} emmers={row.emmers} />
          </li>
        ))}
      </ul>
    </main>
  );
}
