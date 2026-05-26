import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Download, LayoutDashboard, ListPlus, Search, Tags, WalletCards, X } from "lucide-react";
import type { ViewId } from "../types";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: ViewId) => void;
  onAdd: () => void;
  onExport: () => void;
}

const actions: Array<{ label: string; view?: ViewId; icon: typeof LayoutDashboard }> = [
  { label: "Uebersicht oeffnen", view: "dashboard", icon: LayoutDashboard },
  { label: "Transaktionen anzeigen", view: "transactions", icon: Search },
  { label: "Analytics auswerten", view: "analytics", icon: BarChart3 },
  { label: "Budgets pruefen", view: "budgets", icon: WalletCards },
  { label: "Kategorien verwalten", view: "categories", icon: Tags }
];

export function CommandPalette({ open, onClose, onNavigate, onAdd, onExport }: CommandPaletteProps) {
  const run = (callback: () => void) => {
    callback();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 grid place-items-start justify-center bg-black/38 px-5 pt-[12vh] backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="w-full max-w-[620px] overflow-hidden rounded-xl border border-white/[0.1] bg-ink-900/92 shadow-glow"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
              <Search size={18} className="text-ink-300/60" />
              <input className="h-9 flex-1 bg-transparent text-sm text-ink-100 outline-none placeholder:text-ink-300/40" autoFocus placeholder="Command Center" />
              <button className="grid h-8 w-8 place-items-center rounded-lg text-ink-300 transition hover:bg-white/[0.06] hover:text-white" onClick={onClose} title="Schliessen">
                <X size={16} />
              </button>
            </div>

            <div className="p-2">
              <button className="command-item" onClick={() => run(onAdd)}>
                <ListPlus size={17} />
                <span>Transaktion hinzufuegen</span>
              </button>
              <button className="command-item" onClick={() => run(onExport)}>
                <Download size={17} />
                <span>CSV exportieren</span>
              </button>
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.label} className="command-item" onClick={() => action.view && run(() => onNavigate(action.view!))}>
                    <Icon size={17} />
                    <span>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
