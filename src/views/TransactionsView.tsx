import { Download, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import type { Category, FinanceSettings, Transaction, TransactionFilters } from "../types";
import { filterTransactions } from "../utils/finance";
import { GlassPanel } from "../components/GlassPanel";
import { TransactionsTable } from "../components/TransactionsTable";

interface TransactionsViewProps {
  transactions: Transaction[];
  categories: Category[];
  settings: FinanceSettings;
  onExport: () => void;
}

export function TransactionsView({ transactions, categories, settings, onExport }: TransactionsViewProps) {
  const [filters, setFilters] = useState<TransactionFilters>({
    query: "",
    categoryId: "all",
    type: "all",
    amount: "all",
    date: "all"
  });

  const filtered = useMemo(() => filterTransactions(transactions, filters), [filters, transactions]);

  return (
    <div className="space-y-5">
      <GlassPanel className="p-4">
        <div className="grid grid-cols-[1fr_160px_150px_150px_150px_auto] gap-3 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <label className="field">
            <Search size={17} />
            <input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder="Suchen" />
          </label>
          <label className="field">
            <SlidersHorizontal size={17} />
            <select value={filters.categoryId} onChange={(event) => setFilters({ ...filters, categoryId: event.target.value })}>
              <option value="all">Alle Kategorien</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <select className="select-box" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value as TransactionFilters["type"] })}>
            <option value="all">Alle Typen</option>
            <option value="expense">Ausgaben</option>
            <option value="income">Einnahmen</option>
          </select>
          <select className="select-box" value={filters.date} onChange={(event) => setFilters({ ...filters, date: event.target.value as TransactionFilters["date"] })}>
            <option value="all">Alle Daten</option>
            <option value="thisMonth">Dieser Monat</option>
            <option value="last30">Letzte 30 Tage</option>
          </select>
          <select className="select-box" value={filters.amount} onChange={(event) => setFilters({ ...filters, amount: event.target.value as TransactionFilters["amount"] })}>
            <option value="all">Alle Betraege</option>
            <option value="under50">Unter 50</option>
            <option value="50to200">50 bis 200</option>
            <option value="over200">Ueber 200</option>
          </select>
          <button className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.055] px-4 text-sm text-ink-100 transition hover:bg-white/[0.09]" onClick={onExport}>
            <Download size={16} />
            CSV
          </button>
        </div>
      </GlassPanel>

      <GlassPanel className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-ink-300/45">Ledger</p>
            <h2 className="mt-1 text-lg font-semibold text-ink-100">{filtered.length} Buchungen</h2>
          </div>
        </div>
        <TransactionsTable transactions={filtered} categories={categories} settings={settings} />
      </GlassPanel>
    </div>
  );
}
