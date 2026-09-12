export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { dbAll, dbRun, newId } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const like = `%${q}%`;
  try {
    const rows = await dbAll(
      `SELECT id, first_name, last_name, grade, section, representative_name,
              representative_phone, monthly_fee, active, created_at
       FROM students
       WHERE active=1 AND (
         first_name LIKE ? OR last_name LIKE ? OR grade LIKE ? OR representative_name LIKE ?
       )
       ORDER BY last_name, first_name`,
      [like, like, like, like]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo consultar la base de datos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.first_name || !b.last_name || !b.grade) {
    return NextResponse.json({ error: "Campos obligatorios" }, { status: 400 });
  }
  try {
    await dbRun(
      `INSERT INTO students
        (id,first_name,last_name,grade,section,representative_name,representative_phone,monthly_fee)
       VALUES (?,?,?,?,?,?,?,?)`,
      [newId(), b.first_name, b.last_name, b.grade, b.section || null,
        b.representative_name || null, b.representative_phone || null, Number(b.monthly_fee || 0)]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo registrar el alumno" }, { status: 500 });
  }
}
