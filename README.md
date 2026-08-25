# Aanbiedingsportaal

Praktijkcase van Nodient: een mobiel aanbiedingsportaal voor Van Rooij Bloemen BV.
Sander kiest een klant, de pagina toont de bijpassende voorraad met prijs, en er is
een kant-en-klaar Duits WhatsApp-bericht om erbij te sturen.

Het denkwerk (probleem, keuzes, de 3 vragen, AI-gebruik) staat in [DENKEN.md](./DENKEN.md).

## Aan de praat krijgen

```bash
npm install
npm run dev
```

Open <http://localhost:3000> — daar staan links naar de twee cases:

- **Hoffmann** (Keulen): <http://localhost:3000/aanbieding/hoffmann> — rozen, lengte 50
- **Krüger** (Bremen): <http://localhost:3000/aanbieding/kruger> — tulpen, niet ouder dan 3 dagen

Geen `.env`, database of inlog nodig.

Om de Duitse WhatsApp-teksten opnieuw te genereren (bv. na een prijswijziging):

```bash
npx tsx scripts/genereer-berichten.ts
```

De laatste output staat ook in [output-whatsapp-berichten.txt](./output-whatsapp-berichten.txt).

## Waar de prijslogica staat

Alles wat met prijs, filtering en data-cleaning te maken heeft, staat in `/lib` — bewust
losgekoppeld van de pagina's, want "die regels gaan veranderen":

| Bestand | Verantwoordelijkheid |
|---|---|
| [`lib/stock.ts`](./lib/stock.ts) | CSV inlezen, dedupliceren, ongeldige regels uitsluiten, leeftijd berekenen |
| [`lib/pricing.ts`](./lib/pricing.ts) | De prijsformule uit Sanders mail (Bijlage B), als pure functie |
| [`lib/klanten.ts`](./lib/klanten.ts) | Per klant: filter, marge-afspraak, eenheid (steel/bos), taal |
| [`lib/filter.ts`](./lib/filter.ts) | Combineert voorraad + klantfilter + prijs tot een aanbieding |
| [`lib/orders.ts`](./lib/orders.ts) | Simpele voorraadafboeking bij bestellen (zie vraag 2 in DENKEN.md) |
| [`lib/whatsapp.ts`](./lib/whatsapp.ts) | Genereert de Duitse berichttekst |

**Een nieuwe klant toevoegen** (bv. volgende maand, met een eigen prijsafspraak) betekent:
een nieuwe entry in `lib/klanten.ts` — geen andere code hoeft aangepast te worden.

## Wat er bewust simpel is gehouden

- Geen database — de voorraad komt uit `data/voorraad-29-05.csv`, klanten staan hardcoded in `lib/klanten.ts`.
- Geen inlog of beheerscherm.
- Foto's zijn een grijs vlak.
- De bestel-flow (`lib/orders.ts`) houdt voorraad in het geheugen van de server bij — genoeg om
  het principe te laten werken (zie vraag 2), maar reset bij een herstart en is niet
  concurrency-safe op productieschaal. Zie DENKEN.md voor wat daar met meer tijd bij zou moeten.

## Live

_Vercel-link volgt hier na deployment._
