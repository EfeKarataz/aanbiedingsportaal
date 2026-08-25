# Denken

## Het echte probleem

Het probleem is niet "Sander heeft geen app". Het is dat de Duitse klanten de bestaande
webshop niet vertrouwen — vaste prijs ongeacht volume, ooit zo ingericht en nooit meer
aangeraakt — waardoor ze liever bellen. Bellen kost Sander vijf tot vijftien minuten per
aanbieding omdat hij zelf, regel voor regel, een prijs moet uitrekenen die klopt met
afspraken die alleen in zijn hoofd zitten (leeftijdskorting, klantmarge, eenheid per klant).
De screenshot-plus-WhatsApp-aanpak maakt het erger: geen foto, geen klikbare regel, dus
de klant belt sowieso terug om te bestellen.

Het echte probleem is dus tweeledig: (1) de prijsberekening zit vast in Sanders hoofd in
plaats van in een systeem dat elke ochtend hetzelfde en foutloos rekent, en (2) er is geen
kanaal waarin een klant zelf kan bestellen zonder terug te bellen. Een portaal lost dat op
door Sanders eigen rekenregels expliciet en herbruikbaar te maken, en door de klant een
pagina te geven waar hij direct op kan klikken.

## Wat ik bouw

Eén aanbiedingspagina per klant (`/aanbieding/hoffmann`, `/aanbieding/kruger`) die de
voorraad-export leest, opschoont, filtert op wat deze klant vraagt, en de prijs berekent
volgens Sanders regels (Bijlage B) — inclusief zijn klantspecifieke afspraken (Hoffmann:
marge 3 i.p.v. 4, prijs per bos i.p.v. per steel). Elke regel heeft een bestelknop die de
voorraad direct afboekt. Daarnaast een generator voor het Duitse WhatsApp-bericht dat
Sander erbij stuurt.

## Wat ik bewust weglaat

- **Koppeling met FloriLink en echt versturen via WhatsApp** — expliciet buiten scope.
- **Database, login, beheerscherm** — dummy/config-data is voor deze schaal genoeg (zie vraag 3).
- **Foto's** — een grijs vlak, zoals gevraagd.
- **Robuuste concurrency/transacties** voor de bestel-flow — een in-memory voorraadstand
  laat het principe zien (zie vraag 2), maar is geen productie-oplossing.
- **Notificatie naar Sander bij een bestelling** — in een echt product zou hij een seintje
  moeten krijgen; voor deze demo is de bevestiging op de pagina genoeg.
- **Duitse vertaling van de artikelnamen** (Athena, Freedom, …) — dat zijn kwekersnamen,
  die blijven in de handel altijd ongewijzigd, ook internationaal.

## De drie vragen

**1. De data klopt niet overal.**
- *Duplicaat* (RS4412 Athena, twee identieke regels): stilletjes dedupliceren. Geen
  informatie verloren, geen aanname nodig.
- *Onmogelijke inkoopprijs* (RS4471 Explorer: "13" i.p.v. bv. "0,13"): uitsluiten van de
  aanbieding, niet corrigeren. Ik kan raden dat er een komma ontbreekt, maar het is geld —
  fout gokken is duurder dan een artikel één ochtend niet aanbieden. Dit zou in het echt
  naar Sander gelogd moeten worden om te bevestigen.
- *Partij van acht dagen oud* (RS4490 Athena Royal): gewoon meenemen, met de "week of
  ouder"-korting (−2 ct/steel) uit Bijlage B. De hele reden dat die korting bestaat is dat
  oude voorraad wél weg moet, alleen goedkoper — uitsluiten zou tegen Sanders eigen regel
  ingaan.
- *Lengte die net naast het filter valt* (RS4418 "L50", RS4501 "50 cm" vs. "50" elders):
  lengte normaliseren (het cijfer eruit halen) vóór het filteren, zodat deze wél meetellen.
  Een te strikte string-match zou hier omzet laten liggen op verse voorraad — een gemiste
  match kost meer dan een iets ruimer filter.

**2. De voorraad is eindig.** Als Hoffmann en Krüger allebei een aanbieding met dezelfde
emmers krijgen en allebei bestellen, wint in mijn opzet wie het eerst op "Bestellen" drukt:
de voorraad wordt direct afgeboekt, de tweede bestelling op diezelfde partij krijgt meteen
een "helaas, net uitverkocht" in plaats van een toezegging die niet waargemaakt kan worden.
Dat is beter dan de huidige situatie (twee keer "ja" zeggen aan de telefoon en er dan één
moeten terugbellen), maar niet waterdicht: de voorraadstand leeft alleen in het geheugen van
één serverproces en reset bij een herstart. Met meer tijd zou dit een echte reservering
worden (bv. 15 minuten vasthouden i.p.v. direct afboeken, zodat een klant de tijd heeft om
te bestellen) én, belangrijker, een live koppeling met FloriLink — zonder die koppeling kan
een telefonische bestelling elders de voorraad al hebben leeggehaald zonder dat dit systeem
het weet.

**3. Een nieuwe klant met een eigen prijsafspraak.** Die voert Sander niet zelf in — dat
doet een developer, in `lib/klanten.ts` (naam, filter, marge-afspraak, eenheid, taal), gevolgd
door een deploy. Dat voelt omslachtig, maar bij "één klant per maand erbij" is dat goedkoper
dan een beheerscherm bouwen dat verder niemand gebruikt. Zodra dit vaker dan maandelijks
gebeurt, of Sander het zelf zou moeten kunnen zonder een developer erbij te halen, is dat
het moment om er een klein scherm voor te bouwen — dat is dan ook precies de trigger voor
"we hebben nu toch een database nodig".

## AI-gebruik

Ik heb Claude gebruikt om de Next.js-scaffold, de prijs-/filterlogica, de pagina en de
bestel-flow te bouwen, op basis van mijn eigen lezing van de case en Bijlage B — niet
op basis van een eigen interpretatie van de AI. Twee punten waar ik het niet blind
vertrouwde en apart heb gecontroleerd:

- De **rekenregels** heb ik met een los script tegen een handmatige referentieberekening
  gedraaid. Dat script vond een echte bug: door floating-point afronding werd €2,45 soms
  €2,46 (0,245 × 10 wordt intern net iets meer dan 245 centen). Gefixt met een kleine
  epsilon vóór het afronden — zonder die check was dit onopgemerkt gebleven.
- De **leeftijdskorting** (stapelen de "ouder dan 3 dagen"- en "week of ouder"-regel, of
  vervangt de tweede de eerste?) heb ik niet op het eerste antwoord aangenomen, maar
  teruggelezen in de letterlijke brontekst van Bijlage B om zeker te zijn welke lezing klopt.
