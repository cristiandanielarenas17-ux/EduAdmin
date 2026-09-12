export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import RevenueChart from "@/components/revenue-chart";
import { money } from "@/lib/utils";
import { dbAll } from "@/lib/db";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  WalletCards,
  MoreHorizontal,
  Database,
} from "lucide-react";

type DashboardData = {
  total: number;
  solventes: number;
  deuda: number;
  monthly: number;
  revenue: {
    month: string;
    amount: number;
  }[];
  recent: any[];
};

async function getDashboard(): Promise<DashboardData> {
  try {
    const students = await dbAll(`
      SELECT
        COUNT(*) AS total,
        COALESCE(
          SUM(
            CASE
              WHEN EXISTS (
                SELECT 1
                FROM payments p
                WHERE p.student_id = s.id
                  AND p.payment_month = DATE_FORMAT(CURDATE(), '%Y-%m-01')
                  AND p.status = 'verified'
              )
              THEN 1
              ELSE 0
            END
          ),
          0
        ) AS solventes
      FROM students s
      WHERE s.active = 1
    `);

    const revenue = await dbAll(`
      SELECT
        DATE_FORMAT(payment_month, '%Y-%m') AS ym,
        DATE_FORMAT(payment_month, '%m') AS month,
        SUM(amount) AS amount
      FROM payments
      WHERE status = 'verified'
        AND currency = 'USD'
      GROUP BY ym, month
      ORDER BY ym DESC
      LIMIT 7
    `);

    const monthly = await dbAll(`
      SELECT COALESCE(SUM(amount), 0) AS amount
      FROM payments
      WHERE status = 'verified'
        AND currency = 'USD'
        AND payment_month = DATE_FORMAT(CURDATE(), '%Y-%m-01')
    `);

    const recent = await dbAll(`
      SELECT
        p.id,
        p.amount,
        p.currency,
        p.payment_method,
        p.status,
        p.payment_month,
        p.created_at,
        CONCAT(s.first_name, ' ', s.last_name) AS name,
        s.grade
      FROM payments p
      JOIN students s ON s.id = p.student_id
      ORDER BY p.created_at DESC
      LIMIT 8
    `);

    const total = Number(students[0]?.total || 0);
    const solventes = Number(students[0]?.solventes || 0);

    return {
      total,
      solventes,
      deuda: Math.max(total - solventes, 0),
      monthly: Number(monthly[0]?.amount || 0),

      revenue: revenue
        .slice()
        .reverse()
        .map((item) => ({
          month:
            [
              "ene",
              "feb",
              "mar",
              "abr",
              "may",
              "jun",
              "jul",
              "ago",
              "sep",
              "oct",
              "nov",
              "dic",
            ][Number(item.month) - 1] || String(item.month),

          amount: Number(item.amount || 0),
        })),

      recent,
    };
  } catch (error) {
    console.error("ERROR DASHBOARD / MYSQL:", error);

    /*
     * Si Aiven no responde, no dejamos que toda la página
     * se caiga con "Application error".
     *
     * Mostramos el Dashboard vacío y permitimos que el resto
     * de la aplicación siga funcionando.
     */
    return {
      total: 0,
      solventes: 0,
      deuda: 0,
      monthly: 0,
      revenue: [],
      recent: [],
    };
  }
}

export default async function Dashboard() {
  const data = await getDashboard();

  return (
    <main>
      <PageHeader
        title="Liceo San José"
        subtitle="Panel de administración"
      />

      <div className="space-y-7 p-5 lg:p-8">

        {/* ENCABEZADO */}
        <div>
          <div className="flex items-center gap-2">
            <Database
              size={16}
              className="text-emerald-400"
            />

            <span className="text-xs font-medium text-emerald-400">
              Sistema conectado
            </span>
          </div>

          <p className="mt-4 text-sm text-zinc-500">
            Resumen general
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Buenos días 👋
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Aquí tienes el estado financiero y académico.
          </p>
        </div>

        {/* KPI */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Kpi
            title="Total estudiantes"
            value={data.total.toLocaleString()}
            subtitle="Estudiantes activos"
            icon={<Users size={21} />}
          />

          <Kpi
            title="Solventes"
            value={data.solventes.toLocaleString()}
            subtitle="Mensualidad actual pagada"
            icon={<CheckCircle2 size={21} />}
            green
          />

          <Kpi
            title="Con deuda"
            value={data.deuda.toLocaleString()}
            subtitle="Requieren seguimiento"
            icon={<AlertCircle size={21} />}
            red
          />

          <Kpi
            title="Cobrado este mes"
            value={money(data.monthly)}
            subtitle="Pagos verificados en USD"
            icon={<DollarSign size={21} />}
          />

        </div>

        {/* GRÁFICO */}
        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">

          <div className="card p-5">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-sm text-zinc-400">
                  Ingresos mensuales
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  {money(data.monthly)}
                </h3>
              </div>

              <MoreHorizontal
                size={18}
                className="text-zinc-500"
              />

            </div>

            <RevenueChart data={data.revenue} />

          </div>

          {/* ESTADO */}
          <div className="card p-5">

            <p className="text-sm text-zinc-400">
              Estado de mensualidades
            </p>

            <h3 className="mt-1 text-xl font-bold">
              Mes actual
            </h3>

            <div className="mt-7 space-y-6">

              <Progress
                label="Solventes"
                value={
                  data.total
                    ? Math.round(
                        (data.solventes / data.total) * 100
                      )
                    : 0
                }
                cls="bg-emerald-500"
              />

              <Progress
                label="Con deuda"
                value={
                  data.total
                    ? Math.round(
                        (data.deuda / data.total) * 100
                      )
                    : 0
                }
                cls="bg-red-500"
              />

            </div>

            <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                  <WalletCards size={18} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Cobrado
                  </p>

                  <p className="text-xs text-zinc-500">
                    Mes actual
                  </p>
                </div>

                <p className="ml-auto font-bold">
                  {money(data.monthly)}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ÚLTIMOS PAGOS */}
        <div className="card overflow-hidden">

          <div className="flex items-center justify-between border-b border-zinc-800 p-5">

            <div>
              <h3 className="font-semibold">
                Últimos pagos
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Operaciones registradas recientemente
              </p>
            </div>

            <a
              href="/pagos"
              className="btn-primary"
            >
              Ver pagos
            </a>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[760px]">

              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-600">

                  <th className="px-5 py-4">
                    Alumno
                  </th>

                  <th className="px-5 py-4">
                    Grado
                  </th>

                  <th className="px-5 py-4">
                    Mes
                  </th>

                  <th className="px-5 py-4">
                    Monto
                  </th>

                  <th className="px-5 py-4">
                    Método
                  </th>

                  <th className="px-5 py-4">
                    Estado
                  </th>

                </tr>
              </thead>

              <tbody>

                {data.recent.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-5 py-10 text-center text-sm text-zinc-500"
                    >
                      No hay pagos registrados todavía.
                    </td>

                  </tr>

                ) : (

                  data.recent.map((payment) => (

                    <tr
                      key={payment.id}
                      className="border-b border-zinc-800/70 hover:bg-zinc-800/30"
                    >

                      <td className="px-5 py-4 text-sm font-medium">
                        {payment.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {payment.grade}
                      </td>

                      <td className="px-5 py-4 text-sm capitalize text-zinc-400">
                        {new Date(
                          payment.payment_month
                        ).toLocaleDateString(
                          "es-VE",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold">
                        {money(
                          payment.amount,
                          payment.currency
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-zinc-400">
                        {payment.payment_method}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={payment.status}
                        />
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </main>
  );
}


/* =========================================================
   KPI
========================================================= */

function Kpi({
  title,
  value,
  subtitle,
  icon,
  green,
  red,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  green?: boolean;
  red?: boolean;
}) {
  return (
    <div className="card p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-500/40">

      <div
        className={`w-fit rounded-xl p-3 ${
          green
            ? "bg-emerald-500/10 text-emerald-400"
            : red
            ? "bg-red-500/10 text-red-400"
            : "bg-indigo-500/10 text-indigo-400"
        }`}
      >
        {icon}
      </div>

      <p className="mt-5 text-sm text-zinc-400">
        {title}
      </p>

      <h2 className="mt-1 text-3xl font-bold">
        {value}
      </h2>

      <p className="mt-2 text-xs text-zinc-500">
        {subtitle}
      </p>

    </div>
  );
}


/* =========================================================
   PROGRESS
========================================================= */

function Progress({
  label,
  value,
  cls,
}: {
  label: string;
  value: number;
  cls: string;
}) {
  return (
    <div>

      <div className="mb-2 flex justify-between text-sm">

        <span className="text-zinc-400">
          {label}
        </span>

        <span>
          {value}%
        </span>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-800">

        <div
          className={`h-full rounded-full ${cls}`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}