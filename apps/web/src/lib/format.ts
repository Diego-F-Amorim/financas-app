const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(cents: number) {
  return currencyFormatter.format(cents / 100);
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

export function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonthLabel(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  return monthFormatter.format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}

export function parseCurrencyToCents(value: string) {
  return Math.round(Number(value.replace(",", ".")) * 100);
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function currentMonth() {
  return todayISO().slice(0, 7);
}

export function shiftMonth(month: string, delta: number) {
  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, monthNumber - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}