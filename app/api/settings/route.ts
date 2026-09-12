export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbRun, newId } from "@/lib/db";

export async function GET() {
  const row = await dbGet("SELECT * FROM institution_settings LIMIT 1");
  return NextResponse.json(row || {
    institution_name: "Mi Institución Educativa",
    logo_url: "",
    default_monthly_fee: 80,
  });
}

export async function PUT(req: NextRequest) {
  const b = await req.json();
  try {
    const current = await dbGet("SELECT id FROM institution_settings LIMIT 1");
    if (current) {
      await dbRun(
        "UPDATE institution_settings SET institution_name=?,logo_url=?,default_monthly_fee=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",
        [b.institution_name, b.logo_url || null, Number(b.default_monthly_fee || 0), current.id]
      );
    } else {
      await dbRun(
        "INSERT INTO institution_settings (id,institution_name,logo_url,default_monthly_fee) VALUES (?,?,?,?)",
        [newId(), b.institution_name, b.logo_url || null, Number(b.default_monthly_fee || 0)]
      );
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo guardar la configuración" }, { status: 500 });
  }
}
