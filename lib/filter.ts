import { bloemType, laadStock, type BloemType, type StockRow } from "./stock";
import { berekenPrijs, type PrijsResultaat } from "./pricing";
import type { Klant } from "./klanten";

/**
 * Wat Sander vandaag kiest voor een klant — dit is bewust géén vast onderdeel
 * van de klant (zie klanten.ts): dezelfde klant kan morgen iets anders vragen.
 * `lengte` en `maxLeeftijdDagen` zijn optioneel omdat niet elke klant daar
 * altijd iets over zegt.
 */
export interface FilterKeuze {
  type: BloemType;
  lengte?: number;
  maxLeeftijdDagen?: number;
}

export function voldoetAanFilter(row: StockRow, type: BloemType, filter: FilterKeuze): boolean {
  if (type !== filter.type) return false;
  if (filter.lengte !== undefined && row.lengteCm !== filter.lengte) return false;
  if (filter.maxLeeftijdDagen !== undefined && row.leeftijdDagen > filter.maxLeeftijdDagen) return false;
  return true;
}

export function filterBeschrijvingNl(filter: FilterKeuze): string {
  const delen = [filter.type === "roos" ? "rozen" : "tulpen"];
  if (filter.lengte !== undefined) delen.push(`lengte ${filter.lengte}`);
  if (filter.maxLeeftijdDagen !== undefined) delen.push(`niet ouder dan ${filter.maxLeeftijdDagen} dagen`);
  return delen.join(", ");
}

export function filterBeschrijvingDe(filter: FilterKeuze): string {
  const delen = [filter.type === "roos" ? "Rosen" : "Tulpen"];
  if (filter.lengte !== undefined) delen.push(`Länge ${filter.lengte}`);
  if (filter.maxLeeftijdDagen !== undefined) delen.push(`nicht älter als ${filter.maxLeeftijdDagen} Tage`);
  return delen.join(", ");
}

export interface AanbiedingRegel {
  row: StockRow;
  prijs: PrijsResultaat;
}

export interface Aanbieding {
  klant: Klant;
  filter: FilterKeuze;
  regels: AanbiedingRegel[];
}

export function bouwAanbieding(klant: Klant, filter: FilterKeuze): Aanbieding {
  const { rows } = laadStock();

  const regels = rows
    .filter((row) => voldoetAanFilter(row, bloemType(row.code), filter))
    .map((row) => ({
      row,
      prijs: berekenPrijs({ row, margePerEmmer: klant.margePerEmmer, eenheid: klant.eenheid }),
    }))
    .sort((a, b) => a.row.artikel.localeCompare(b.row.artikel));

  return { klant, filter, regels };
}
