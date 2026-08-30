import type { PrijsEenheid } from "./pricing";

const STANDAARD_MARGE_PER_EMMER = 4;

/**
 * Een klant-entry bevat alleen de blijvende afspraken (marge, eenheid, taal) —
 * niet wat hij vandaag wil zien. Dat laatste kiest Sander per keer op /sander
 * (zie lib/filter.ts). Een nieuwe klant met een eigen prijsafspraak volgende
 * maand = een nieuwe entry hier (zie vraag 3 in DENKEN.md) — geen database of
 * beheerscherm nodig voor deze schaal.
 */
export interface Klant {
  slug: string;
  naam: string;
  plaats: string;
  taal: "de";
  margePerEmmer: number;
  eenheid: PrijsEenheid;
}

export const KLANTEN: Record<string, Klant> = {
  hoffmann: {
    slug: "hoffmann",
    naam: "Hoffmann",
    plaats: "Keulen",
    taal: "de",
    margePerEmmer: 3, // "Hoffmann neemt veel af, die doe ik op 3" (Bijlage B)
    eenheid: "bos", // "Hoffmann wil het altijd per bos zien" (Bijlage B)
  },
  kruger: {
    slug: "kruger",
    naam: "Krüger",
    plaats: "Bremen",
    taal: "de",
    margePerEmmer: STANDAARD_MARGE_PER_EMMER,
    eenheid: "steel",
  },
};

export function vindKlant(slug: string): Klant | undefined {
  return KLANTEN[slug];
}
