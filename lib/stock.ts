import fs from "fs";
import path from "path";

export type BloemType = "roos" | "tulp";

export interface StockRow {
  code: string;
  artikel: string;
  lengteCm: number;
  kleur: string;
  stelenPerBos: number;
  bossenPerEmmer: number;
  emmers: number;
  inkoopPerSteel: number;
  datum: string; // dd-mm
  leeftijdDagen: number;
}

export interface RejectedRow {
  raw: string;
  reden: string;
}

/**
 * Referentiedatum voor "leeftijd" is de dag van de export zelf (29-05-2026),
 * niet de systeemdatum: de export is een momentopname uit het verleden.
 */
const REFERENTIEDATUM = { dag: 29, maand: 5 };

function parseDatum(raw: string): number {
  const [dagStr, maandStr] = raw.trim().split("-");
  const dag = Number(dagStr);
  const maand = Number(maandStr);
  const dagVanJaar = (m: number, d: number) => m * 31 + d; // binnen dezelfde maand-buren voldoende voor deze case
  return dagVanJaar(REFERENTIEDATUM.maand, REFERENTIEDATUM.dag) - dagVanJaar(maand, dag);
}

/** Lengte kan als "50", "L50" of "50 cm" genoteerd zijn; normaliseer naar het numerieke deel. */
function parseLengte(raw: string): number {
  const match = raw.match(/\d+/);
  if (!match) throw new Error(`Kan lengte niet lezen: "${raw}"`);
  return Number(match[0]);
}

function parseGetal(raw: string): number {
  return Number(raw.trim().replace(",", "."));
}

export function leesRuweStockCsv(): string[][] {
  const bestand = path.join(process.cwd(), "data", "voorraad-29-05.csv");
  const inhoud = fs.readFileSync(bestand, "utf-8");
  return inhoud
    .split(/\r?\n/)
    .filter((regel) => regel.trim().length > 0)
    .slice(1) // header
    .map((regel) => regel.split(";"));
}

/**
 * Leest en cleant de voorraad-export. Regels met een datakwaliteitsprobleem
 * waar niet blind naar gegokt kan worden (bv. een onmogelijke inkoopprijs)
 * worden uitgesloten en gerapporteerd via `rejected`, niet gecorrigeerd.
 */
export function laadStock(): { rows: StockRow[]; rejected: RejectedRow[] } {
  const ruwe = leesRuweStockCsv();
  const rows: StockRow[] = [];
  const rejected: RejectedRow[] = [];
  const geziene = new Set<string>();

  for (const kolommen of ruwe) {
    const [code, artikel, lengte, kleur, stelenPerBos, bossenPerEmmer, emmers, inkoopPerSteel, datum] = kolommen;
    const raw = kolommen.join(";");

    const sleutel = raw;
    if (geziene.has(sleutel)) {
      rejected.push({ raw, reden: "duplicaat van een eerdere regel" });
      continue;
    }
    geziene.add(sleutel);

    const emmersGetal = parseGetal(emmers);
    if (emmersGetal <= 0) {
      rejected.push({ raw, reden: "geen voorraad (0 emmers)" });
      continue;
    }

    const inkoop = parseGetal(inkoopPerSteel);
    // Een geldige inkoopprijs per steel ligt in de praktijk tussen de paar
    // cent en een paar euro. "13" (i.p.v. "0,13") is duidelijk een tikfout
    // in de bron, maar welk cijfer eraf moet is gokken, dus uitsluiten.
    if (inkoop <= 0 || inkoop >= 5) {
      rejected.push({ raw, reden: `onmogelijke inkoopprijs per steel (${inkoopPerSteel})` });
      continue;
    }

    rows.push({
      code,
      artikel,
      lengteCm: parseLengte(lengte),
      kleur,
      stelenPerBos: parseGetal(stelenPerBos),
      bossenPerEmmer: parseGetal(bossenPerEmmer),
      emmers: emmersGetal,
      inkoopPerSteel: inkoop,
      datum,
      leeftijdDagen: parseDatum(datum),
    });
  }

  return { rows, rejected };
}

export function bloemType(code: string): BloemType {
  return code.startsWith("RS") ? "roos" : "tulp";
}
