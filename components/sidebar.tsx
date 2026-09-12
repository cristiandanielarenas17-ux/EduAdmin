"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, CreditCard, Settings, GraduationCap,
  Menu, X
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const items = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/alumnos", label: "Alumnos", icon: Users },
  { href: "/pagos", label: "Pagos", icon: CreditCard },
  { href: "/configuracion", label: "Configuración", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 lg:hidden"
        aria-label="Abrir menú"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-[#0c0c0f] transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center gap-3 border-b border-zinc-800 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/20">
            <GraduationCap size={23} />
          </div>
          <div>
            <h1 className="font-bold">EduAdmin</h1>
            <p className="text-xs text-zinc-500">Administración escolar</p>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Principal</p>
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${active ? "bg-indigo-600/10 font-medium text-indigo-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}>
                <Icon size={18} /> {item.label}
              </Link>
            );
          })}

          <div className="my-5 border-t border-zinc-800" />
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Sistema</p>

          <Link
            href="/configuracion"
            onClick={() => setOpen(false)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${pathname.startsWith("/configuracion") ? "bg-indigo-600/10 font-medium text-indigo-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
          >
            <Settings size={18} /> Configuración
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-zinc-800 p-4">
          <ThemeToggle />
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold">AD</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">Administrador</p>
              <p className="truncate text-xs text-zinc-500">Panel administrativo</p>
            </div>
          </div>
        </div>
      </aside>

      {open && <button onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden" aria-label="Cerrar menú" />}
    </>
  );
}