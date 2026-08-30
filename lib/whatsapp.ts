import { formatEuro } from "./pricing";
import { filterBeschrijvingDe, type Aanbieding } from "./filter";

/** Duitse eenheid voor een prijs-per-stuk ("€0,12 / Stiel"), altijd enkelvoud. */
function eenheidWoord(eenheid: "steel" | "bos"): string {
  return eenheid === "bos" ? "Bund" : "Stiel";
}

/**
 * Kleurnamen in de bron zijn Nederlands. "rot" (bij Red Naomi) is zelf al
 * Duits — waarschijnlijk een export-inconsistentie in de bron, toevallig
 * ook het juiste Duitse woord voor "rood".
 */
const KLEUR_NL_NAAR_DE: Record<string, string> = {
  rood: "rot",
  rot: "rot",
  roze: "rosa",
  wit: "weiß",
  geel: "gelb",
  paars: "lila",
};

function kleurDe(kleur: string): string {
  return KLEUR_NL_NAAR_DE[kleur] ?? kleur;
}

/**
 * Genereert de Duitse WhatsApp-tekst die Sander bij de link stuurt.
 * Eén regel per artikel, prijs in de eenheid die deze klant gewend is
 * (Hoffmann per bos, anderen per steel — zie klanten.ts).
 */
export function genereerWhatsappBericht(aanbieding: Aanbieding, portaalUrl: string): string {
  const { klant, filter, regels } = aanbieding;
  const beschrijvingDe = filterBeschrijvingDe(filter);

  if (regels.length === 0) {
    return [
      `Hallo ${klant.naam},`,
      `heute leider nichts Passendes auf Lager (${beschrijvingDe}).`,
      `Ich melde mich, sobald wieder etwas da ist.`,
      `Sander`,
    ].join("\n");
  }

  const regelsTekst = regels
    .map(({ row, prijs }) => {
      const eenheid = eenheidWoord(prijs.eenheid);
      return `- ${row.artikel} (${kleurDe(row.kleur)}, Länge ${row.lengteCm}): ${formatEuro(prijs.bedrag)} / ${eenheid}`;
    })
    .join("\n");

  return [
    `Hallo ${klant.naam},`,
    `heutiges Angebot (${beschrijvingDe}):`,
    regelsTekst,
    ``,
    `Alles ansehen und bestellen: ${portaalUrl}`,
    `Sander`,
  ].join("\n");
}
