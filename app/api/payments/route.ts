export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { dbAll, dbGet, dbRun, newId } from "@/lib/db";

export async function GET() {
  try {
    const rows = await dbAll(`
      SELECT p.id, p.amount, p.currency, p.payment_method, p.status,
             p.payment_month, p.created_at,
             CONCAT(s.first_name, ' ', s.last_name) AS name, s.grade
      FROM payments p JOIN students s ON s.id=p.student_id
      ORDER BY p.created_at DESC LIMIT 100
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo consultar los pagos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  if (!b.student_id || !b.payment_month || !b.amount || !b.payment_method) {
    return NextResponse.json({ error: "Campos obligatorios" }, { status: 400 });
  }
  try {
    const student = await dbGet("SELECT id FROM students WHERE id=? AND active=1", [b.student_id]);
    if (!student) return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });

    await dbRun(
      `INSERT INTO payments
        (id,student_id,payment_month,amount,currency,payment_method,status,notes)
       VALUES (?,?,?,?,?,?,?,?)`,
      [newId(), b.student_id, b.payment_month, Number(b.amount), b.currency || "USD",
        b.payment_method, b.status || "verified", b.notes || null]
    );
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "No se pudo registrar el pago" }, { status: 500 });
  }
}
