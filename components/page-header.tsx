import { Bell } from "lucide-react";

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-zinc-800 bg-[#0c0c0f]/80 px-5 backdrop-blur-xl lg:px-8">
      <div className="pl-12 lg:pl-0">
        <p className="text-xs text-zinc-500">Institución Educativa</p>
        <h2 className="font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-zinc-600">{subtitle}</p>}
      </div>
      <button className="relative rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition hover:text-white">
        <Bell size={18} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
      </button>
    </header>
  );
}