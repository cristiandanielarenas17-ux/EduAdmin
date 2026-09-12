export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { dbAll, dbTransaction, newId } from "@/lib/db";

export async function GET() {
  const students = await dbAll("SELECT * FROM students");
  const payments = await dbAll("SELECT * FROM payments");
  const settings = await dbAll("SELECT * FROM institution_settings");
  const backup = { version: 3, database: "mysql", created_at: new Date().toISOString(), students, payments, institution_settings: settings };
  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="respaldo-eduadmin-${new Date().toISOString().slice(0,10)}.json"`,
    },
  });
}

export async function POST(req: NextRequest) {
  const b = await req.json();
  try {
    await dbTransaction(async (conn) => {
      if (Array.isArray(b.students)) {
        for (const s of b.students) {
          await conn.execute(
            `INSERT INTO students (id,first_name,last_name,grade,section,representative_name,representative_phone,monthly_fee,active,created_at)
             VALUES (?,?,?,?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE first_name=VALUES(first_name),last_name=VALUES(last_name),grade=VALUES(grade),section=VALUES(section),representative_name=VALUES(representative_name),representative_phone=VALUES(representative_phone),monthly_fee=VALUES(monthly_fee),active=VALUES(active)`,
            [s.id || newId(), s.first_name, s.last_name, s.grade, s.section || null, s.representative_name || null, s.representative_phone || null, Number(s.monthly_fee || 0), s.active ?? 1, s.created_at || new Date()]
          );
        }
      }
      if (Array.isArray(b.payments)) {
        for (const p of b.payments) {
          await conn.execute(
            `INSERT INTO payments (id,student_id,payment_month,amount,currency,payment_method,status,notes,created_at)
             VALUES (?,?,?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE amount=VALUES(amount),currency=VALUES(currency),payment_method=VALUES(payment_method),status=VALUES(status),notes=VALUES(notes)`,
            [p.id || newId(), p.student_id, p.payment_month, Number(p.amount || 0), p.currency || "USD", p.payment_method, p.status || "verified", p.notes || null, p.created_at || new Date()]
          );
        }
      }
      if (Array.isArray(b.institution_settings) && b.institution_settings[0]) {
        const s = b.institution_settings[0];
        await conn.execute(
          `INSERT INTO institution_settings (id,institution_name,logo_url,default_monthly_fee) VALUES (?,?,?,?)
           ON DUPLICATE KEY UPDATE institution_name=VALUES(institution_name),logo_url=VALUES(logo_url),default_monthly_fee=VALUES(default_monthly_fee)`,
          [s.id || newId(), s.institution_name, s.logo_url || null, Number(s.default_monthly_fee || 0)]
        );
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Respaldo inválido o incompatible" }, { status: 400 });
  }
}
