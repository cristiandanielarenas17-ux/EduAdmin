"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Trash2, Users, X, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  grade: string;
  section?: string;
  representative_name?: string;
  representative_phone?: string;
  monthly_fee: number;
};

type FormState = {
  first_name: string;
  last_name: string;
  grade: string;
  section: string;
  representative_name: string;
  representative_phone: string;
  monthly_fee: string;
};

const emptyForm: FormState = {
  first_name: "",
  last_name: "",
  grade: "",
  section: "",
  representative_name: "",
  representative_phone: "",
  monthly_fee: "80",
};

export default function AlumnosPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [show, setShow] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/students?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "No se pudieron cargar los estudiantes.");
      }
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.students)
          ? data.students
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setStudents(list);
    } catch (err) {
      console.error(err);
      setStudents([]);
      setError(err instanceof Error ? err.message : "No se pudieron cargar los estudiantes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(load, 180);
    return () => window.clearTimeout(timer);
  }, [q]);

  function openForm() {
    setError("");
    setForm(emptyForm);
    setShow(true);
  }

  function closeForm() {
    if (saving) return;
    setShow(false);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "No se pudo registrar el alumno.");
      }

      setShow(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "No se pudo registrar el alumno.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este alumno? También se eliminarán sus pagos.")) return;
    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo eliminar el alumno.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el alumno.");
    }
  }

  return (
    <main>
      <PageHeader title="Alumnos" subtitle={`${students.length} resultados`} />

      <div className="space-y-5 p-5 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Registro de alumnos</h1>
            <p className="text-sm text-zinc-500">Consulta y administra estudiantes.</p>
          </div>
          <button type="button" className="btn-primary" onClick={openForm}>
            <Plus size={17} /> Nuevo alumno
          </button>
        </div>

        <div className="card p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={17} />
              <input
                className="input pl-10"
                placeholder="Buscar por nombre, grado o representante..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <button type="button" className="btn-secondary" onClick={load} disabled={loading}>
              <RefreshCw size={17} className={loading ? "animate-spin" : ""} /> Actualizar
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-300/40 bg-red-500/10 p-4 text-sm text-red-600 dark:border-red-500/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-600">
                  <th className="px-5 py-4">Alumno</th>
                  <th className="px-5 py-4">Grado</th>
                  <th className="px-5 py-4">Representante</th>
                  <th className="px-5 py-4">Mensualidad</th>
                  <th className="px-5 py-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-zinc-500">Cargando...</td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <Users className="mx-auto mb-3 text-zinc-400" size={34} />
                      <p className="font-semibold">No hay alumnos registrados.</p>
                      <p className="mt-1 text-sm text-zinc-500">Pulsa “Nuevo alumno” para registrar el primero.</p>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="border-b border-zinc-800/70 transition hover:bg-zinc-800/30">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-600 dark:text-indigo-300">
                            {(s.first_name?.[0] || "").toUpperCase()}{(s.last_name?.[0] || "").toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{s.first_name} {s.last_name}</p>
                            <p className="text-xs text-zinc-600">{s.representative_phone || "Sin teléfono"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-zinc-400">{s.grade} {s.section ? `· ${s.section}` : ""}</td>
                      <td className="px-5 py-4 text-sm text-zinc-400">{s.representative_name || "—"}</td>
                      <td className="px-5 py-4 text-sm font-semibold">${Number(s.monthly_fee || 0).toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => remove(s.id)}
                          className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-500"
                          title="Eliminar alumno"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && closeForm()}>
          <div className="card max-h-[92vh] w-full max-w-3xl overflow-y-auto p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="nuevo-alumno-title">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="nuevo-alumno-title" className="text-xl font-bold">Nuevo alumno</h2>
                <p className="mt-1 text-sm text-zinc-500">Completa los datos para registrar al estudiante.</p>
              </div>
              <button type="button" className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white" onClick={closeForm} disabled={saving} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre"><input required autoFocus className="input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></Field>
              <Field label="Apellido"><input required className="input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></Field>
              <Field label="Grado"><input required className="input" placeholder="5to Año" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} /></Field>
              <Field label="Sección"><input className="input" placeholder="A" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} /></Field>
              <Field label="Representante"><input className="input" value={form.representative_name} onChange={(e) => setForm({ ...form, representative_name: e.target.value })} /></Field>
              <Field label="Teléfono"><input className="input" type="tel" value={form.representative_phone} onChange={(e) => setForm({ ...form, representative_phone: e.target.value })} /></Field>
              <Field label="Mensualidad USD"><input required type="number" min="0" step="0.01" className="input" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })} /></Field>

              <div className="flex items-end justify-end gap-2 sm:col-span-2">
                <button type="button" className="btn-secondary" onClick={closeForm} disabled={saving}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar alumno"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="space-y-1.5"><span className="text-xs font-medium text-zinc-500">{label}</span>{children}</label>;
}
