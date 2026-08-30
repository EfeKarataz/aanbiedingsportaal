import { KLANTEN } from "../lib/klanten";
import { bouwAanbieding, type FilterKeuze } from "../lib/filter";
import { genereerWhatsappBericht } from "../lib/whatsapp";

const CASES: { klantSlug: string; filter: FilterKeuze }[] = [
  { klantSlug: "hoffmann", filter: { type: "roos", lengte: 50 } },
  { klantSlug: "kruger", filter: { type: "tulp", maxLeeftijdDagen: 3 } },
];

for (const { klantSlug, filter } of CASES) {
  const klant = KLANTEN[klantSlug];
  const aanbieding = bouwAanbieding(klant, filter);
  const query = new URLSearchParams();
  query.set("type", filter.type);
  if (filter.lengte !== undefined) query.set("lengte", String(filter.lengte));
  if (filter.maxLeeftijdDagen !== undefined) query.set("maxLeeftijdDagen", String(filter.maxLeeftijdDagen));
  const url = `https://aanbiedingsportaal.vercel.app/aanbieding/${klant.slug}?${query.toString()}`;

  console.log(`\n=== ${klant.naam} (${klant.plaats}) ===\n`);
  console.log(`Link: ${url}\n`);
  console.log(genereerWhatsappBericht(aanbieding, url));
}
