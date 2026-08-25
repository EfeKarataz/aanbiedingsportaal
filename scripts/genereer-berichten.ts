import { KLANTEN } from "../lib/klanten";
import { bouwAanbieding } from "../lib/filter";
import { genereerWhatsappBericht } from "../lib/whatsapp";

for (const klant of Object.values(KLANTEN)) {
  const aanbieding = bouwAanbieding(klant);
  const url = `https://aanbiedingsportaal.vercel.app/aanbieding/${klant.slug}`;
  console.log(`\n=== ${klant.naam} (${klant.plaats}) ===\n`);
  console.log(genereerWhatsappBericht(aanbieding, url));
}
