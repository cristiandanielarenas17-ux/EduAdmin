export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { databaseHealth } from "@/lib/db";

export async function GET() {
  try {
    await databaseHealth();
    return NextResponse.json({ ok: true, database: "connected", engine: "MySQL" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, database: "disconnected", engine: "MySQL" }, { status: 500 });
  }
}
