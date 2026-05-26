import { BanknoteArrowDown, BanknoteArrowUp, PiggyBank, Target, TrendingUp } from "lucide-react";
import type { Category, FinanceSettings, Transaction } from "../types";
import {
  formatCurrency,
  getBalance,
  getBudgetUsage,
  getCategoryBreakdown,
  getCurrentMonthTransactions,
  getMonthlySeries,
  getSavingsRate,
  sumTransactions
} from "../utils/finance";
import { CategoryDonut, MonthlyTrend } from "../components/Charts";
import { GlassPanel } from "../components/GlassPanel";
import { ProgressBar } from "../components/ProgressBar";
import { StatCard } from "../components/StatCard";
import { TransactionsTable } from "../components/TransactionsTable";

interface DashboardViewProps {
  transactions: Transaction[];
  categories: Category[];
  settings: FinanceSettings;
}

export function DashboardView({ transactions, categories, settings }: DashboardViewProps) {
  const monthTransactions = getCurrentMonthTransactions(transactions);
  const monthIncome = sumTransactions(monthTransactions, "income");
  const monthExpenses = sumTransactions(monthTransactions, "expense");
  const savingsRate = getSavingsRate(monthIncome, monthExpenses);
  const budgetProgress = Math.round((monthExpenses / settings.monthlyBudget) * 100);
  const breakdown = getCategoryBreakdown(monthTransactions, categories);
  const budgetUsage = getBudgetUsage(monthTransactions, categories).slice(0, 4);
  const trend = getMonthlySeries(transactions);
  const currentDay = Math.max(1, new Date().getDate());
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const projectedSpend = (monthExpenses / currentDay) * daysInMonth;

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-4 gap-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
        <StatCard label="Gesamtguthaben" value={formatCurrency(getBalance(transactions), settings.currency, settings.privacyMode)} trend="+8.4% seit letztem Monat" tone="mint" icon={PiggyBank} />
        <StatCard label="Ausgaben im Monat" value={formatCurrency(monthExpenses, settings.currency, settings.privacyMode)} trend="12% unter Forecast" tone="coral" icon={BanknoteArrowUp} />
        <StatCard label="Einnahmen im Monat" value={formatCurrency(monthIncome, settings.currency, settings.privacyMode)} trend="+680 Freelance" tone="iris" icon={BanknoteArrowDown} />
        <StatCard label="Sparquote" value={`${savingsRate}%`} trend={`${settings.savingsTarget}% Zielwert`} tone="amber" icon={Target} />
      </section>

      <section className="grid grid-cols-[1.45fr_0.9fr] gap-4 max-xl:grid-cols-1">
        <GlassPanel className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-ink-300/45">Cashflow</p>
              <h2 className="mt-1 text-lg font-semibold text-ink-100">Monatlicher Trend</h2>
            </div>
            <span className="rounded-full border border-white/[0.08] px-3 py-1 text-xs text-ink-300/65">6 Monate</span>
          </div>
          <MonthlyTrend data={trend} currency={settings.currency} privacyMode={settings.privacyMode} />
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="mb-2">
            <p className="text-xs uppercase text-ink-300/45">Kategorien</p>
            <h2 className="mt-1 text-lg font-semibold text-ink-100">Ausgabenmix</h2>
          </div>
          <CategoryDonut data={breakdown} currency={settings.currency} privacyMode={settings.privacyMode} />
        </GlassPanel>
      </section>

      <section className="grid grid-cols-[0.85fr_1.15fr] gap-4 max-xl:grid-cols-1">
        <GlassPanel className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-ink-300/45">Budget</p>
              <h2 className="mt-1 text-lg font-semibold text-ink-100">Monatslimit</h2>
            </div>
            <span className={budgetProgress > 100 ? "text-sm font-medium text-coral" : "text-sm font-medium text-mint"}>
              {budgetProgress}%
            </span>
          </div>
          <ProgressBar value={budgetProgress} color="#6ee7b7" className="mb-5 h-2.5" />
          <div className="mb-6 flex items-center justify-between text-sm">
            <span className="text-ink-300/60">Verbraucht</span>
            <span className="text-ink-100">{formatCurrency(monthExpenses, settings.currency, settings.privacyMode)} / {formatCurrency(settings.monthlyBudget, settings.currency, settings.privacyMode)}</span>
          </div>
          <div className="space-y-4">
            {budgetUsage.map((item) => (
              <div key={item.id}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-ink-300/78">{item.name}</span>
                  <span className={item.progress > 100 ? "text-coral" : "text-ink-300/58"}>{item.progress}%</span>
                </div>
                <ProgressBar value={item.progress} color={item.color} />
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-ink-300/45">Aktivitaet</p>
              <h2 className="mt-1 text-lg font-semibold text-ink-100">Letzte Transaktionen</h2>
            </div>
          </div>
          <TransactionsTable transactions={transactions} categories={categories} settings={settings} limit={6} />
        </GlassPanel>
      </section>

      <section className="grid grid-cols-3 gap-4 max-xl:grid-cols-1">
        <GlassPanel className="p-5">
          <div className="mb-3 flex items-center gap-2 text-mint">
            <TrendingUp size={18} />
            <h3 className="font-semibold text-ink-100">Forecast</h3>
          </div>
          <p className="text-sm leading-6 text-ink-300/68">
            Bei aktuellem Tempo endet der Monat bei {formatCurrency(projectedSpend, settings.currency, settings.privacyMode)} Ausgaben.
          </p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <div className="mb-3 flex items-center gap-2 text-amber">
            <Target size={18} />
            <h3 className="font-semibold text-ink-100">Gewohnheit</h3>
          </div>
          <p className="text-sm leading-6 text-ink-300/68">
            Essen und Shopping bilden aktuell {Math.round(((breakdown[0]?.value ?? 0) + (breakdown[1]?.value ?? 0)) / Math.max(monthExpenses, 1) * 100)}% der variablen Kosten.
          </p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <div className="mb-3 flex items-center gap-2 text-cyan">
            <PiggyBank size={18} />
            <h3 className="font-semibold text-ink-100">Spielraum</h3>
          </div>
          <p className="text-sm leading-6 text-ink-300/68">
            Noch {formatCurrency(settings.monthlyBudget - monthExpenses, settings.currency, settings.privacyMode)} bis zum Monatsbudget.
          </p>
        </GlassPanel>
      </section>
    </div>
  );
}
