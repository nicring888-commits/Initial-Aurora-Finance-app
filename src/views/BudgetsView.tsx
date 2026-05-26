import { AlertTriangle, WalletCards } from "lucide-react";
import type { Category, FinanceSettings, Transaction } from "../types";
import { formatCurrency, getBudgetUsage, getCurrentMonthTransactions, sumTransactions } from "../utils/finance";
import { CategoryIcon } from "../components/CategoryIcon";
import { GlassPanel } from "../components/GlassPanel";
import { ProgressBar } from "../components/ProgressBar";

interface BudgetsViewProps {
  transactions: Transaction[];
  categories: Category[];
  settings: FinanceSettings;
  onUpdateCategoryBudget: (categoryId: string, budget: number) => void;
  onUpdateSettings: (settings: Partial<FinanceSettings>) => void;
}

export function BudgetsView({ transactions, categories, settings, onUpdateCategoryBudget, onUpdateSettings }: BudgetsViewProps) {
  const monthTransactions = getCurrentMonthTransactions(transactions);
  const spent = sumTransactions(monthTransactions, "expense");
  const progress = Math.round((spent / settings.monthlyBudget) * 100);
  const usage = getBudgetUsage(monthTransactions, categories);

  return (
    <div className="space-y-5">
      <GlassPanel className="p-5">
        <div className="grid grid-cols-[1fr_220px] items-end gap-4 max-md:grid-cols-1">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-mint/10 text-mint">
                <WalletCards size={19} />
              </span>
              <div>
                <p className="text-xs uppercase text-ink-300/45">Monatsbudget</p>
                <h2 className="mt-1 text-lg font-semibold text-ink-100">{formatCurrency(spent, settings.currency, settings.privacyMode)} genutzt</h2>
              </div>
            </div>
            <ProgressBar value={progress} color="#6ee7b7" className="h-3" />
          </div>
          <label className="field">
            <span className="text-xs text-ink-300/55">Limit</span>
            <input type="number" value={settings.monthlyBudget} onChange={(event) => onUpdateSettings({ monthlyBudget: Number(event.target.value) })} />
          </label>
        </div>
      </GlassPanel>

      <div className="grid grid-cols-2 gap-4 max-xl:grid-cols-1">
        {usage.map((item) => (
          <GlassPanel key={item.id} className="p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <CategoryIcon icon={item.icon} color={item.color} />
                <div>
                  <h3 className="font-semibold text-ink-100">{item.name}</h3>
                  <p className="text-sm text-ink-300/55">
                    {formatCurrency(item.spent, settings.currency, settings.privacyMode)} / {formatCurrency(item.budget, settings.currency, settings.privacyMode)}
                  </p>
                </div>
              </div>
              {item.progress > 100 && (
                <span className="flex items-center gap-1.5 rounded-full bg-coral/10 px-3 py-1 text-xs text-coral">
                  <AlertTriangle size={13} />
                  Limit
                </span>
              )}
            </div>
            <ProgressBar value={item.progress} color={item.color} className="mb-5" />
            <div className="grid grid-cols-[1fr_150px] items-center gap-3 max-sm:grid-cols-1">
              <p className="text-sm text-ink-300/60">
                {item.remaining >= 0 ? `${formatCurrency(item.remaining, settings.currency, settings.privacyMode)} frei` : `${formatCurrency(Math.abs(item.remaining), settings.currency, settings.privacyMode)} drueber`}
              </p>
              <input
                className="h-10 rounded-lg border border-white/[0.08] bg-white/[0.045] px-3 text-sm text-ink-100 outline-none focus:border-white/[0.16]"
                type="number"
                value={item.budget}
                onChange={(event) => onUpdateCategoryBudget(item.id, Number(event.target.value))}
              />
            </div>
          </GlassPanel>
        ))}
      </div>
    </div>
  );
}
