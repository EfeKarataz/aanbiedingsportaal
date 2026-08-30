import { laadStock } from "./stock";

/**
 * In-memory voorraadstand, first-come-first-served bij bestellen.
 *
 * Dit is het antwoord op vraag 2 (Hoffmann en Krüger die allebei een
 * aanbieding met dezelfde emmers krijgen): de eerste bestelling die
 * binnenkomt boekt direct af, een tweede bestelling op dezelfde partij
 * krijgt te horen dat het (deels) niet meer beschikbaar is, in plaats van
 * dat beide een toezegging krijgen die niet waargemaakt kan worden.
 *
 * Bewuste beperking: dit is een module-level Map, geen database of
 * transactie-log. Voor deze case (één proces, geen gelijktijdige requests op
 * schaal) is dat genoeg om het principe te tonen; bij een herstart van de
 * server reset de voorraad naar de CSV-waarden. Zie DENKEN.md voor wat er
 * met meer tijd bij zou moeten (echte opslag, atomic decrement, reservering
 * met timeout in plaats van direct afboeken).
 */
let voorraad: Map<string, number> | null = null;

function voorraadKaart(): Map<string, number> {
  if (!voorraad) {
    const { rows } = laadStock();
    voorraad = new Map(rows.map((row) => [row.code, row.emmers]));
  }
  return voorraad;
}

export function resterendeEmmers(code: string): number {
  return voorraadKaart().get(code) ?? 0;
}

export interface BestelResultaat {
  success: boolean;
  resterend: number;
  reden?: string;
}

export function plaatsBestelling(code: string, aantalEmmers: number): BestelResultaat {
  const kaart = voorraadKaart();
  const beschikbaar = kaart.get(code) ?? 0;

  if (aantalEmmers <= 0) {
    return { success: false, resterend: beschikbaar, reden: "ongeldig aantal" };
  }

  if (aantalEmmers > beschikbaar) {
    return { success: false, resterend: beschikbaar, reden: "niet genoeg voorraad meer" };
  }

  kaart.set(code, beschikbaar - aantalEmmers);
  return { success: true, resterend: beschikbaar - aantalEmmers };
}
