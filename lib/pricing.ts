import type { StockRow } from "./stock";

export type PrijsEenheid = "steel" | "bos";

export interface PrijsInput {
  row: StockRow;
  margePerEmmer: number;
  eenheid: PrijsEenheid;
}

export interface PrijsResultaat {
  eenheid: PrijsEenheid;
  bedrag: number; // afgerond, in euro
}

const VEILING_OPSLAG_PER_EMMER = 0.5;

/**
 * Leeftijdskorting per steel, letterlijk uit Bijlage B: twee losse regels,
 * elk met een eigen totaalbedrag. "Een week of ouder" vervangt de
 * "ouder dan drie dagen"-regel, de kortingen stapelen niet op tot 3 cent.
 */
function leeftijdskorting(leeftijdDagen: number): number {
  if (leeftijdDagen >= 7) return 0.02;
  if (leeftijdDagen > 3) return 0.01;
  return 0;
}

function stelenPerEmmer(row: StockRow): number {
  return row.stelenPerBos * row.bossenPerEmmer;
}

/**
 * Rond naar boven af op hele centen, zoals Sander vraagt ("anders krijg je
 * van die rare bedragen"). De kleine epsilon compenseert afrondingsfouten
 * van floating point (bv. 0.1 + 0.2 * 10 wordt intern 245.00000000000003
 * i.p.v. 245), zonder echte fractionele centen te maskeren.
 */
function rondNaarBovenOpCenten(bedrag: number): number {
  const EPSILON = 1e-9;
  return Math.ceil(bedrag * 100 - EPSILON) / 100;
}

export function berekenPrijs({ row, margePerEmmer, eenheid }: PrijsInput): PrijsResultaat {
  const perEmmer = stelenPerEmmer(row);
  const prijsPerSteel =
    row.inkoopPerSteel +
    VEILING_OPSLAG_PER_EMMER / perEmmer +
    margePerEmmer / perEmmer -
    leeftijdskorting(row.leeftijdDagen);

  const onafgerond = eenheid === "bos" ? prijsPerSteel * row.stelenPerBos : prijsPerSteel;

  return { eenheid, bedrag: rondNaarBovenOpCenten(onafgerond) };
}

export function formatEuro(bedrag: number): string {
  return `€${bedrag.toFixed(2).replace(".", ",")}`;
}
