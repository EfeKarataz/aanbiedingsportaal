import type { BloemType } from "./stock";
import type { FilterKeuze } from "./filter";

type SearchParams = Record<string, string | string[] | undefined>;

function eersteWaarde(waarde: string | string[] | undefined): string | undefined {
  return Array.isArray(waarde) ? waarde[0] : waarde;
}

/** Leest een FilterKeuze uit de querystring van /aanbieding/[klant] of /sander. */
export function parseFilterUitSearchParams(sp: SearchParams): FilterKeuze | null {
  const type = eersteWaarde(sp.type);
  if (type !== "roos" && type !== "tulp") return null;

  const lengteRaw = eersteWaarde(sp.lengte);
  const maxLeeftijdRaw = eersteWaarde(sp.maxLeeftijdDagen);

  const lengte = lengteRaw ? Number(lengteRaw) : undefined;
  const maxLeeftijdDagen = maxLeeftijdRaw ? Number(maxLeeftijdRaw) : undefined;

  if (lengte !== undefined && !Number.isFinite(lengte)) return null;
  if (maxLeeftijdDagen !== undefined && !Number.isFinite(maxLeeftijdDagen)) return null;

  return { type: type as BloemType, lengte, maxLeeftijdDagen };
}

export function filterAlsQuery(filter: FilterKeuze): string {
  const query = new URLSearchParams();
  query.set("type", filter.type);
  if (filter.lengte !== undefined) query.set("lengte", String(filter.lengte));
  if (filter.maxLeeftijdDagen !== undefined) query.set("maxLeeftijdDagen", String(filter.maxLeeftijdDagen));
  return query.toString();
}
