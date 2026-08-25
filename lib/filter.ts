import { bloemType, laadStock, type StockRow } from "./stock";
import { berekenPrijs, type PrijsResultaat } from "./pricing";
import type { Klant } from "./klanten";

export interface AanbiedingRegel {
  row: StockRow;
  prijs: PrijsResultaat;
}

export interface Aanbieding {
  klant: Klant;
  regels: AanbiedingRegel[];
}

export function bouwAanbieding(klant: Klant): Aanbieding {
  const { rows } = laadStock();

  const regels = rows
    .filter((row) => klant.filter(row, bloemType(row.code)))
    .map((row) => ({
      row,
      prijs: berekenPrijs({ row, margePerEmmer: klant.margePerEmmer, eenheid: klant.eenheid }),
    }))
    .sort((a, b) => a.row.artikel.localeCompare(b.row.artikel));

  return { klant, regels };
}
