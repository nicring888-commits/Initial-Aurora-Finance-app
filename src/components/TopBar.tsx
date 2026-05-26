import { Command, Plus, Search } from "lucide-react";
import type { ViewId } from "../types";

const viewTitles: Record<ViewId, string> = {
  dashboard: "Uebersicht",
  transactions: "Transaktionen",
  analytics: "Analytics",
  budgets: "Budgets",
  categories: "Kategorien",
  settings: "Settings"
};

interface TopBarProps {
  activeView: ViewId;
  onOpenAdd: () => void;
  onOpenCommand: () => void;
}

export function TopBar({ activeView, onOpenAdd, onOpenCommand }: TopBarProps) {
  const dateLabel = new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(new Date());

  return (
    <header className="drag-region flex min-h-[76px] items-center justify-between gap-4 border-b border-white/[0.06] px-7 max-md:px-4">
      <div>
        <p className="text-xs uppercase text-ink-300/50">{dateLabel}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal text-ink-100">{viewTitles[activeView]}</h1>
      </div>

      <div className="no-drag flex items-center gap-2">
        <button
          className="hidden h-10 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.045] px-3 text-sm text-ink-300/80 transition hover:bg-white/[0.075] hover:text-ink-100 md:flex"
          onClick={onOpenCommand}
          title="Command Center"
        >
          <Search size={16} />
          <span>Suche</span>
          <Command size={14} className="text-ink-300/45" />
        </button>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.045] text-ink-200 transition hover:bg-white/[0.075]"
          onClick={onOpenCommand}
          title="Command Center"
        >
          <Command size={17} />
        </button>

        <button
          className="flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-ink-950 transition hover:bg-ink-100"
          onClick={onOpenAdd}
          title="Transaktion hinzufuegen"
        >
          <Plus size={17} />
          <span className="max-sm:hidden">Neu</span>
        </button>
      </div>
    </header>
  );
}
