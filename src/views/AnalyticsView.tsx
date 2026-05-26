import { ArrowDownRight, ArrowUpRight, Sigma } from "lucide-react";
import type { Category, FinanceSettings, Transaction } from "../types";
import {
  formatCurrency,
  getCategoryBreakdown,
  getCurrentMonthTransactions,
  getMonthKey,
  getMonthlySeries,
  getSavingsRate,
  sumTransactions
} from "../utils/finance";
import { CategoryBars, CategoryDonut, MonthlyTrend } from "../components/Charts";
import { GlassPanel } from "../components/GlassPanel";

interface AnalyticsViewProps {
  transactions: Transaction[];
  categories: Category[];
  settings: FinanceSettings;
}

export function AnalyticsView({ transactions, categories, settings }: AnalyticsViewProps) {
  const currentMonth = getCurrentMonthTransactions(transactions);
  const previousDate = new Date();
  previousDate.setMonth(previousDate.getMonth() - 1);
  const previousMonth = transactions.filter((transaction) => getMonthKey(transaction.date) === getMonthKey(previousDate));
  const currentExpenses = sumTransactions(currentMonth, "expense");
  const previousExpenses = sumTransactions(previousMonth, "expense");
  const currentIncome = sumTransactions(currentMonth, "income");
  const previousIncome = sumTransactions(previousMonth, "income");
  const expenseDelta = previousExpenses ? Math.round(((currentExpenses - previousExpenses) / previousExpenses) * 100) : 0;
  const incomeDelta = previousIncome ? Math.round(((currentIncome - previousIncome) / previousIncome) * 100) : 0;
  const breakdown = getCategoryBreakdown(currentMonth, categories);
  const trend = getMonthlySeries(transactions);

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
        <GlassPanel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink-300/65">Ausgaben vs. Vormonat</p>
            {expenseDelta <= 0 ? <ArrowDownRight size={18} className="text-mint" /> : <ArrowUpRight size={18} className="text-coral" />}
          </div>
          <h3 className="text-3xl font-semibold text-ink-100">{expenseDelta > 0 ? "+" : ""}{expenseDelta}%</h3>
          <p className="mt-2 text-sm text-ink-300/55">{formatCurrency(currentExpenses, settings.currency, settings.privacyMode)} aktuell</p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink-300/65">Einnahmen vs. Vormonat</p>
            {incomeDelta >= 0 ? <ArrowUpRight size={18} className="text-mint" /> : <ArrowDownRight size={18} className="text-coral" />}
          </div>
          <h3 className="text-3xl font-semibold text-ink-100">{incomeDelta > 0 ? "+" : ""}{incomeDelta}%</h3>
          <p className="mt-2 text-sm text-ink-300/55">{formatCurrency(currentIncome, settings.currency, settings.privacyMode)} aktuell</p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink-300/65">Sparquote</p>
            <Sigma size={18} className="text-amber" />
          </div>
          <h3 className="text-3xl font-semibold text-ink-100">{getSavingsRate(currentIncome, currentExpenses)}%</h3>
          <p className="mt-2 text-sm text-ink-300/55">Zielwert {settings.savingsTarget}%</p>
        </GlassPanel>
      </section>

      <section className="grid grid-cols-[1.35fr_0.9fr] gap-4 max-xl:grid-cols-1">
        <GlassPanel className="p-5">
          <div className="mb-4">
            <p className="text-xs uppercase text-ink-300/45">Monatsuebersicht</p>
            <h2 className="mt-1 text-lg font-semibold text-ink-100">Income, Spend, Saved</h2>
          </div>
          <MonthlyTrend data={trend} currency={settings.currency} privacyMode={settings.privacyMode} />
        </GlassPanel>

        <GlassPanel className="p-5">
          <div className="mb-2">
            <p className="text-xs uppercase text-ink-300/45">Verteilung</p>
            <h2 className="mt-1 text-lg font-semibold text-ink-100">Kategorien</h2>
          </div>
          <CategoryDonut data={breakdown} currency={settings.currency} privacyMode={settings.privacyMode} />
        </GlassPanel>
      </section>

      <GlassPanel className="p-5">
        <div className="mb-4">
          <p className="text-xs uppercase text-ink-300/45">Ranking</p>
          <h2 className="mt-1 text-lg font-semibold text-ink-100">Ausgaben nach Kategorie</h2>
        </div>
        <CategoryBars data={breakdown} currency={settings.currency} privacyMode={settings.privacyMode} />
      </GlassPanel>
    </div>
  );
}
