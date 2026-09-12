"use client";

import { useEffect, useState } from "react";
import { Download, Upload, Save, Settings } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export default function ConfiguracionPage() {
  const [form,setForm]=useState({institution_name:"",logo_url:"",default_monthly_fee:"80"});
  const [saving,setSaving]=useState(false);

  useEffect(()=>{fetch("/api/settings").then(r=>r.json()).then(x=>setForm({institution_name:x.institution_name||"",logo_url:x.logo_url||"",default_monthly_fee:String(x.default_monthly_fee||80)}))},[]);

  async function save(e:React.FormEvent){e.preventDefault();setSaving(true);await fetch("/api/settings",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});setSaving(false);alert("Configuración guardada");}

  function backup(){
    window.location.href="/api/backup";
  }

  async function restore(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0]; if(!file)return;
    const text=await file.text();
    const json=JSON.parse(text);
    const r=await fetch("/api/backup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(json)});
    alert(r.ok?"Respaldo restaurado":"No se pudo restaurar el respaldo");
  }

  return <main><PageHeader title="Configuración" subtitle="Preferencias de la institución"/>
    <div className="space-y-6 p-5 lg:p-8">
      <div><h1 className="text-2xl font-bold">Configuración del sistema</h1><p className="text-sm text-zinc-500">Administra los datos generales y respaldos.</p></div>

      <form onSubmit={save} className="card max-w-3xl p-6">
        <div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-400"><Settings size={20}/></div><div><h2 className="font-semibold">Datos institucionales</h2><p className="text-xs text-zinc-500">Información mostrada en el sistema.</p></div></div>
        <div className="grid gap-5">
          <Field label="Nombre del liceo o institución"><input required className="input" value={form.institution_name} onChange={e=>setForm({...form,institution_name:e.target.value})}/></Field>
          <Field label="URL del logo (opcional)"><input className="input" placeholder="https://..." value={form.logo_url} onChange={e=>setForm({...form,logo_url:e.target.value})}/></Field>
          <Field label="Mensualidad predeterminada USD"><input type="number" min="0" step="0.01" className="input" value={form.default_monthly_fee} onChange={e=>setForm({...form,default_monthly_fee:e.target.value})}/></Field>
          <button className="btn-primary w-fit" disabled={saving}><Save size={17}/>{saving?"Guardando...":"Guardar cambios"}</button>
        </div>
      </form>

      <section className="card max-w-3xl p-6">
        <h2 className="font-semibold">Respaldos</h2>
        <p className="mt-1 text-sm text-zinc-500">Exporta estudiantes, pagos y configuración en un archivo JSON.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={backup}><Download size={17}/> Descargar copia JSON</button>
          <label className="btn-secondary cursor-pointer"><Upload size={17}/> Restaurar respaldo<input type="file" accept=".json,application/json" className="hidden" onChange={restore}/></label>
        </div>
      </section>
    </div>
  </main>;
}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="space-y-1.5"><span className="text-xs text-zinc-400">{label}</span>{children}</label>}