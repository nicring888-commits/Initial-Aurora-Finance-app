import { RotateCcw, Shield, SlidersHorizontal, Sparkles } from "lucide-react";
import type { FinanceSettings } from "../types";
import { GlassPanel } from "../components/GlassPanel";

interface SettingsViewProps {
  settings: FinanceSettings;
  onUpdateSettings: (settings: Partial<FinanceSettings>) => void;
  onResetDemoData: () => void;
}

const accents: Array<{ id: FinanceSettings["accent"]; color: string; label: string }> = [
  { id: "mint", color: "#6ee7b7", label: "Mint" },
  { id: "coral", color: "#fb7185", label: "Coral" },
  { id: "iris", color: "#a78bfa", label: "Iris" },
  { id: "amber", color: "#fbbf24", label: "Amber" }
];

export function SettingsView({ settings, onUpdateSettings, onResetDemoData }: SettingsViewProps) {
  return (
    <div className="grid grid-cols-2 gap-5 max-xl:grid-cols-1">
      <GlassPanel className="p-5">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-cyan/10 text-cyan">
            <SlidersHorizontal size={19} />
          </span>
          <div>
            <p className="text-xs uppercase text-ink-300/45">Praeferenzen</p>
            <h2 className="mt-1 text-lg font-semibold text-ink-100">Darstellung</h2>
          </div>
        </div>

        <div className="space-y-4">
          <label className="setting-row">
            <span>
              <strong>Waehrung</strong>
              <small>Format fuer alle Betraege</small>
            </span>
            <select className="select-box min-w-[140px]" value={settings.currency} onChange={(event) => onUpdateSettings({ currency: event.target.value as FinanceSettings["currency"] })}>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </label>

          <label className="setting-row">
            <span>
              <strong>Sparziel</strong>
              <small>{settings.savingsTarget}% vom Monatseinkommen</small>
            </span>
            <input className="w-[180px] accent-white" type="range" min="5" max="60" value={settings.savingsTarget} onChange={(event) => onUpdateSettings({ savingsTarget: Number(event.target.value) })} />
          </label>

          <label className="setting-row">
            <span>
              <strong>Privacy Mode</strong>
              <small>Betraege ausblenden</small>
            </span>
            <input className="toggle" type="checkbox" checked={settings.privacyMode} onChange={(event) => onUpdateSettings({ privacyMode: event.target.checked })} />
          </label>
        </div>
      </GlassPanel>

      <GlassPanel className="p-5">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber/10 text-amber">
            <Sparkles size={19} />
          </span>
          <div>
            <p className="text-xs uppercase text-ink-300/45">Workspace</p>
            <h2 className="mt-1 text-lg font-semibold text-ink-100">Akzent</h2>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {accents.map((accent) => (
            <button
              key={accent.id}
              className={`h-16 rounded-lg border text-xs font-medium transition ${settings.accent === accent.id ? "border-white/70 text-white" : "border-white/[0.08] text-ink-300/60 hover:border-white/[0.18]"}`}
              style={{ background: `linear-gradient(135deg, ${accent.color}22, rgba(255,255,255,0.03))` }}
              onClick={() => onUpdateSettings({ accent: accent.id })}
            >
              {accent.label}
            </button>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="p-5 max-xl:col-span-1 xl:col-span-2">
        <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-coral/10 text-coral">
              <Shield size={19} />
            </span>
            <div>
              <h2 className="font-semibold text-ink-100">Lokale Daten</h2>
              <p className="mt-1 text-sm text-ink-300/58">Transaktionen und Einstellungen bleiben im lokalen App-Speicher.</p>
            </div>
          </div>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-white/[0.08] px-4 text-sm text-ink-200 transition hover:bg-white/[0.06]" onClick={onResetDemoData}>
            <RotateCcw size={16} />
            Demo zuruecksetzen
          </button>
        </div>
      </GlassPanel>
    </div>
  );
}
