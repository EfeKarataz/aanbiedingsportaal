# Aanbiedingsportaal

Praktijkcase van Nodient: een mobiel aanbiedingsportaal voor Van Rooij Bloemen BV.
Sander kiest op `/sander` een klant en een filter (soort, lengte, max leeftijd); daar
komt een link naar de klantpagina én de Duitse WhatsApp-tekst uit.

Het denkwerk (probleem, keuzes, de 3 vragen, AI-gebruik) staat in [DENKEN.md](./DENKEN.md).

## Live, geen installatie nodig

Het portaal staat live op Vercel. Niets lokaal installeren nodig om het te proberen,
gewoon de link openen (werkt ook op een telefoon, zoals Sander het zou gebruiken):

- **Sander-kant** (klant + filter kiezen): <https://aanbiedingsportaal.vercel.app/sander>
- **Hoffmann** (Keulen): <https://aanbiedingsportaal.vercel.app/aanbieding/hoffmann?type=roos&lengte=50>, rozen, lengte 50
- **Krüger** (Bremen): <https://aanbiedingsportaal.vercel.app/aanbieding/kruger?type=tulp&maxLeeftijdDagen=3>, tulpen, niet ouder dan 3 dagen
- **Voorraad** (volledig, ongefilterd overzicht, met wat er bij het opschonen is genegeerd en waarom): <https://aanbiedingsportaal.vercel.app/voorraad>

## Lokaal draaien (optioneel)

Alleen nodig als je in de code wilt kijken of iets wilt aanpassen; voor het bekijken van
het portaal zelf is dit niet nodig, zie hierboven.

```bash
npm install
npm run dev
```

Open <http://localhost:3000/sander>, kies een klant en filter, en de pagina genereert de
klantlink en het WhatsApp-bericht. Dezelfde routes als hierboven werken ook lokaal, op
`localhost:3000` in plaats van het Vercel-domein.

Geen `.env`, database of inlog nodig.

`/sander` genereert de WhatsApp-tekst al live voor elk filter dat je kiest. Het losse
script hieronder doet hetzelfde, maar dan voor precies de twee verplichte cases uit de
opdracht (Hoffmann rozen/50, Krüger tulpen/3 dagen) in één keer, zodat de output ervan
als apart, controleerbaar bestand in de repo staat:

```bash
npx tsx scripts/genereer-berichten.ts
```

De laatste output staat ook in [output-whatsapp-berichten.txt](./output-whatsapp-berichten.txt).

## Waar de prijslogica staat

Alles wat met prijs, filtering en data-cleaning te maken heeft, staat in `/lib`, bewust
losgekoppeld van de pagina's, want "die regels gaan veranderen":

| Bestand | Verantwoordelijkheid |
|---|---|
| [`lib/stock.ts`](./lib/stock.ts) | CSV inlezen, dedupliceren, ongeldige prijzen en 0-voorraad uitsluiten, lengte normaliseren ("L50"/"50 cm" → 50), leeftijd berekenen |
| [`lib/pricing.ts`](./lib/pricing.ts) | De prijsformule uit Sanders mail (Bijlage B), als pure functie |
| [`lib/klanten.ts`](./lib/klanten.ts) | Per klant: marge-afspraak, eenheid (steel/bos), taal. Blijvende afspraken, geen dagelijkse keuze |
| [`lib/filter.ts`](./lib/filter.ts) | Het filter dat Sander per keer kiest (soort/lengte/max leeftijd) en combineert dat met voorraad en prijs tot een aanbieding |
| [`lib/querySearchParams.ts`](./lib/querySearchParams.ts) | Zet dat filter om naar en uit de URL-querystring, gebruikt door zowel `/sander` als `/aanbieding/[klant]` |
| [`lib/orders.ts`](./lib/orders.ts) | Simpele voorraadafboeking bij bestellen (zie vraag 2 in DENKEN.md) |
| [`lib/whatsapp.ts`](./lib/whatsapp.ts) | Genereert de Duitse berichttekst |

**Belangrijk onderscheid:** het filter (wat een klant vandaag vraagt) ligt niet vast per
klant, dat kiest Sander elke keer opnieuw op `/sander`. Alleen de blijvende afspraken
(marge, eenheid, taal) horen bij de klant. **Een nieuwe klant toevoegen** (bv. volgende
maand, met een eigen prijsafspraak) betekent: een nieuwe entry in `lib/klanten.ts`, geen
andere code hoeft aangepast te worden.

## Wat er bewust simpel is gehouden

- Geen database: de voorraad komt uit `data/voorraad-29-05.csv`, klanten staan hardcoded in `lib/klanten.ts`.
- Geen inlog of beheerscherm.
- Foto's zijn een neutraal icoon in plaats van een echte productfoto.
- De bestel-flow (`lib/orders.ts`) houdt voorraad in het geheugen van de server bij, genoeg om
  het principe te laten werken (zie vraag 2), maar reset bij een herstart en is niet
  concurrency-safe op productieschaal. Zie DENKEN.md voor wat daar met meer tijd bij zou moeten.
