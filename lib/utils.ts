export function money(value: number | string, currency = "USD") {
  const n = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2
  }).format(n);
}

export function dateLabel(value: string | Date) {
  return new Intl.DateTimeFormat("es-VE", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function monthLabel(value: string | Date) {
  return new Intl.DateTimeFormat("es-VE", {
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}