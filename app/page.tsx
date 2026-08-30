import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Aanbiedingsportaal</h1>
      <p className="text-gray-600">
        <Link href="/sander" className="text-blue-700 underline">
          Ga naar /sander
        </Link>{" "}
        om een klant en filter te kiezen — daar komen de klantpagina en het WhatsApp-bericht uit.
      </p>
      <p className="text-sm text-gray-500">Twee voorbeelden uit de case:</p>
      <ul className="flex flex-col gap-2 text-sm">
        <li>
          <Link href="/aanbieding/hoffmann?type=roos&lengte=50" className="text-blue-700 underline">
            Hoffmann (Keulen) — rozen, lengte 50
          </Link>
        </li>
        <li>
          <Link href="/aanbieding/kruger?type=tulp&maxLeeftijdDagen=3" className="text-blue-700 underline">
            Krüger (Bremen) — tulpen, niet ouder dan 3 dagen
          </Link>
        </li>
      </ul>
    </main>
  );
}
