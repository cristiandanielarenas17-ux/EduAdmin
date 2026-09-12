"use client";

import { useEffect, useState } from "react";
import { Plus, CreditCard } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { money } from "@/lib/utils";

type Student = {id:string;first_name:string;last_name:string;grade:string;monthly_fee:number};
type Payment = {id:string;name:string;grade:string;payment_month:string;amount:number;currency:string;payment_method:string;status:string;created_at:string};

export default function PagosPage() {
  const [students,setStudents]=useState<Student[]>([]);
  const [payments,setPayments]=useState<Payment[]>([]);
  const [show,setShow]=useState(false);
  const [form,setForm]=useState({student_id:"",payment_month:new Date().toISOString().slice(0,7)+"-01",amount:"80",currency:"USD",payment_method:"Zelle",status:"verified",notes:""});

  async function load() {
    const [s,p]=await Promise.all([fetch("/api/students").then(r=>r.json()),fetch("/api/payments").then(r=>r.json())]);
    setStudents(s); setPayments(p);
  }
  useEffect(()=>{load()},[]);

  function chooseStudent(id:string) {
    const s=students.find(x=>x.id===id);
    setForm({...form,student_id:id,amount:s ? String(s.monthly_fee) : form.amount});
  }

  async function save(e:React.FormEvent) {
    e.preventDefault();
    const r=await fetch("/api/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    if(!r.ok){alert("No se pudo registrar el pago");return}
    setShow(false); await load();
  }

  return <main><PageHeader title="Pagos" subtitle="Control de mensualidades" />
    <div className="space-y-5 p-5 lg:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Pagos</h1><p className="text-sm text-zinc-500">Registra y consulta pagos de mensualidades.</p></div>
        <button className="btn-primary" onClick={()=>setShow(true)}><Plus size={17}/> Registrar pago</button>
      </div>

      {show && <div className="card p-5"><h2 className="mb-5 text-lg font-semibold">Registrar pago</h2><form onSubmit={save} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Alumno"><select required className="input" value={form.student_id} onChange={e=>chooseStudent(e.target.value)}><option value="">Seleccionar alumno</option>{students.map(s=><option key={s.id} value={s.id}>{s.first_name} {s.last_name} — {s.grade}</option>)}</select></Field>
        <Field label="Mes a pagar"><input required type="date" className="input" value={form.payment_month} onChange={e=>setForm({...form,payment_month:e.target.value})}/></Field>
        <Field label="Monto"><input required type="number" min="0" step="0.01" className="input" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></Field>
        <Field label="Moneda"><select className="input" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}><option>USD</option><option>VES</option></select></Field>
        <Field label="Método"><select className="input" value={form.payment_method} onChange={e=>setForm({...form,payment_method:e.target.value})}>{["Transferencia","Pago móvil","Efectivo","Zelle","Punto","Otro"].map(x=><option key={x}>{x}</option>)}</select></Field>
        <Field label="Estado"><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option value="verified">Verificado</option><option value="pending">Pendiente</option><option value="rejected">Rechazado</option></select></Field>
        <Field label="Notas"><input className="input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></Field>
        <div className="flex items-end gap-2"><button className="btn-primary">Guardar pago</button><button type="button" className="btn-secondary" onClick={()=>setShow(false)}>Cancelar</button></div>
      </form></div>}

      <div className="card overflow-hidden">
        <div className="border-b border-zinc-800 p-5"><h3 className="font-semibold">Últimos pagos</h3></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[900px]">
          <thead><tr className="border-b border-zinc-800 text-left text-xs uppercase tracking-wider text-zinc-600"><th className="px-5 py-4">Fecha</th><th className="px-5 py-4">Alumno</th><th className="px-5 py-4">Mes</th><th className="px-5 py-4">Monto</th><th className="px-5 py-4">Método</th><th className="px-5 py-4">Estado</th></tr></thead>
          <tbody>{payments.map(p=><tr key={p.id} className="border-b border-zinc-800/70 hover:bg-zinc-800/30"><td className="px-5 py-4 text-sm text-zinc-400">{new Date(p.created_at).toLocaleDateString("es-VE")}</td><td className="px-5 py-4 text-sm font-medium">{p.name}</td><td className="px-5 py-4 text-sm text-zinc-400">{new Date(p.payment_month).toLocaleDateString("es-VE",{month:"long",year:"numeric"})}</td><td className="px-5 py-4 text-sm font-semibold">{money(p.amount,p.currency)}</td><td className="px-5 py-4 text-sm text-zinc-400">{p.payment_method}</td><td className="px-5 py-4"><StatusBadge status={p.status}/></td></tr>)}</tbody>
        </table></div>
        {payments.length===0 && <div className="p-10 text-center text-zinc-500"><CreditCard className="mx-auto mb-2" size={30}/>No hay pagos registrados.</div>}
      </div>
    </div>
  </main>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="space-y-1.5"><span className="text-xs text-zinc-400">{label}</span>{children}</label>}