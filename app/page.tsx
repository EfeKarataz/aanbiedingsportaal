import Link from "next/link";
import { KLANTEN } from "@/lib/klanten";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Aanbiedingsportaal — demo</h1>
      <p className="text-gray-600">Twee vaste voorbeeldklanten uit de case:</p>
      <ul className="flex flex-col gap-2">
        {Object.values(KLANTEN).map((klant) => (
          <li key={klant.slug}>
            <Link href={`/aanbieding/${klant.slug}`} className="text-blue-700 underline">
              {klant.naam} ({klant.plaats}) — {klant.filterBeschrijving}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
