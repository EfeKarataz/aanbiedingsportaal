import { NextResponse } from "next/server";
import { plaatsBestelling } from "@/lib/orders";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : null;
  const aantalEmmers = Number(body?.aantalEmmers);

  if (!code || !Number.isFinite(aantalEmmers)) {
    return NextResponse.json({ success: false, reden: "ongeldig verzoek" }, { status: 400 });
  }

  const resultaat = plaatsBestelling(code, aantalEmmers);
  return NextResponse.json(resultaat, { status: resultaat.success ? 200 : 409 });
}
