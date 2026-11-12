import { formatMonthLabel, shiftMonth } from "../lib/format";

interface MonthPickerProps {
  month: string;
  onChange: (month: string) => void;
}

export function MonthPicker({ month, onChange }: MonthPickerProps) {
  const buttonClass =
    "rounded-lg border border-slate-700 px-3 py-1 text-slate-300 transition hover:bg-slate-800";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, -1))}
        aria-label="Mês anterior"
        className={buttonClass}
      >
        ‹
      </button>
      <span className="min-w-36 text-center font-medium capitalize">
        {formatMonthLabel(month)}
      </span>
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, 1))}
        aria-label="Próximo mês"
        className={buttonClass}
      >
        ›
      </button>
    </div>
  );
}