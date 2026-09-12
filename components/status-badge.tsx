import { CheckCircle2, Clock3, AlertCircle, XCircle } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const config: Record<string, { cls: string; icon: React.ReactNode }> = {
    PAGADO: { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 size={13} /> },
    PENDIENTE: { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Clock3 size={13} /> },
    ATRASADO: { cls: "bg-red-500/10 text-red-400 border-red-500/20", icon: <AlertCircle size={13} /> },
    VERIFIED: { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 size={13} /> },
    REJECTED: { cls: "bg-red-500/10 text-red-400 border-red-500/20", icon: <XCircle size={13} /> }
  };
  const item = config[normalized] || { cls: "bg-zinc-800 text-zinc-300 border-zinc-700", icon: null };
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.cls}`}>{item.icon}{normalized}</span>;
}