import {
  BarChart3,
  LogOut,
  LayoutDashboard,
  ListFilter,
  Settings,
  Tags,
  WalletCards,
  WalletMinimal
} from "lucide-react";
import clsx from "clsx";
import type { ViewId } from "../types";

const navItems: Array<{ id: ViewId; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Uebersicht", icon: LayoutDashboard },
  { id: "transactions", label: "Transaktionen", icon: ListFilter },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "budgets", label: "Budgets", icon: WalletCards },
  { id: "categories", label: "Kategorien", icon: Tags },
  { id: "settings", label: "Settings", icon: Settings }
];

interface SidebarProps {
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
  userEmail?: string;
  onSignOut: () => void;
}

export function Sidebar({ activeView, onNavigate, userEmail, onSignOut }: SidebarProps) {
  return (
    <aside className="glass-sidebar flex w-[248px] shrink-0 flex-col border-r border-white/[0.07] px-4 py-5 max-lg:w-[92px]">
      <div className="drag-region mb-8 flex h-10 items-center gap-3 px-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-ink-950">
          <WalletMinimal size={18} strokeWidth={2.4} />
        </span>
        <div className="max-lg:hidden">
          <p className="text-sm font-semibold text-ink-100">Aurora</p>
          <p className="text-xs text-ink-300/60">Personal Finance</p>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;

          return (
            <button
              key={item.id}
              className={clsx(
                "group no-drag flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm transition",
                active
                  ? "bg-white/[0.09] text-white shadow-hairline"
                  : "text-ink-300/72 hover:bg-white/[0.055] hover:text-ink-100",
                "max-lg:justify-center max-lg:px-0"
              )}
              onClick={() => onNavigate(item.id)}
              title={item.label}
            >
              <Icon size={18} strokeWidth={active ? 2.3 : 2} />
              <span className="max-lg:hidden">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 max-lg:p-2">
        <div className="flex items-center gap-3 max-lg:justify-center">
          <span className="h-8 w-8 rounded-lg bg-gradient-to-br from-mint via-cyan to-amber" />
          <div className="min-w-0 max-lg:hidden">
            <p className="truncate text-xs font-medium text-ink-100">{userEmail ?? "Account"}</p>
            <p className="text-xs text-ink-300/60">Premium Workspace</p>
          </div>
        </div>
        <button
          className="mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] text-xs text-ink-300/70 transition hover:bg-white/[0.06] hover:text-ink-100 max-lg:mt-2"
          onClick={onSignOut}
          title="Ausloggen"
        >
          <LogOut size={15} />
          <span className="max-lg:hidden">Ausloggen</span>
        </button>
      </div>
    </aside>
  );
}
