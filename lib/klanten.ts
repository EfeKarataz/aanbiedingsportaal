import type { BloemType, StockRow } from "./stock";
import type { PrijsEenheid } from "./pricing";

const STANDAARD_MARGE_PER_EMMER = 4;

export interface Klant {
  slug: string;
  naam: string;
  plaats: string;
  taal: "de";
  margePerEmmer: number;
  eenheid: PrijsEenheid;
  /** Wat deze klant vandaag wil zien — bepaalt de filtering van de voorraad. */
  filter: (row: StockRow, bloemType: BloemType) => boolean;
  /** Nederlandse beschrijving, voor de portaalpagina (Sanders kant). */
  filterBeschrijving: string;
  /** Duitse beschrijving, voor het WhatsApp-bericht aan de klant. */
  filterBeschrijvingDe: string;
}

/**
 * Eén entry per klant. Een nieuwe klant met een eigen prijsafspraak
 * volgende maand = een nieuwe entry hier (zie vraag 3 in DENKEN.md) —
 * geen database of beheerscherm nodig voor deze schaal.
 */
export const KLANTEN: Record<string, Klant> = {
  hoffmann: {
    slug: "hoffmann",
    naam: "Hoffmann",
    plaats: "Keulen",
    taal: "de",
    margePerEmmer: 3, // "Hoffmann neemt veel af, die doe ik op 3" (Bijlage B)
    eenheid: "bos", // "Hoffmann wil het altijd per bos zien" (Bijlage B)
    filter: (row, type) => type === "roos" && row.lengteCm === 50,
    filterBeschrijving: "rozen, lengte 50",
    filterBeschrijvingDe: "Rosen, Länge 50",
  },
  kruger: {
    slug: "kruger",
    naam: "Krüger",
    plaats: "Bremen",
    taal: "de",
    margePerEmmer: STANDAARD_MARGE_PER_EMMER,
    eenheid: "steel",
    filter: (row, type) => type === "tulp" && row.leeftijdDagen <= 3,
    filterBeschrijving: "tulpen, niet ouder dan 3 dagen",
    filterBeschrijvingDe: "Tulpen, nicht älter als 3 Tage",
  },
};

export function vindKlant(slug: string): Klant | undefined {
  return KLANTEN[slug];
}
