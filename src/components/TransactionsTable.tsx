import { ArrowDownLeft, ArrowUpRight, Repeat2 } from "lucide-react";
import type { Category, FinanceSettings, Transaction } from "../types";
import { formatCurrency, formatDate, getCategory } from "../utils/finance";
import { CategoryIcon } from "./CategoryIcon";

interface TransactionsTableProps {
  transactions: Transaction[];
  categories: Category[];
  settings: FinanceSettings;
  limit?: number;
}

export function TransactionsTable({ transactions, categories, settings, limit }: TransactionsTableProps) {
  const visibleTransactions = [...transactions]
    .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
    .slice(0, limit ?? transactions.length);

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.07]">
      <table className="w-full border-collapse text-left">
        <thead className="bg-white/[0.035] text-xs uppercase text-ink-300/45">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium max-md:hidden">Kategorie</th>
            <th className="px-4 py-3 font-medium max-lg:hidden">Datum</th>
            <th className="px-4 py-3 text-right font-medium">Betrag</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.06]">
          {visibleTransactions.map((transaction) => {
            const category = getCategory(categories, transaction.categoryId);
            const income = transaction.type === "income";

            return (
              <tr key={transaction.id} className="group bg-transparent transition hover:bg-white/[0.035]">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <CategoryIcon icon={category.icon} color={category.color} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-ink-100">{transaction.merchant}</p>
                        {transaction.recurring && <Repeat2 size={13} className="shrink-0 text-ink-300/45" />}
                      </div>
                      <p className="truncate text-xs text-ink-300/55">{transaction.note || category.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-ink-300/70 max-md:hidden">{category.name}</td>
                <td className="px-4 py-3 text-sm text-ink-300/60 max-lg:hidden">{formatDate(transaction.date)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex items-center justify-end gap-1.5 text-sm font-semibold ${income ? "text-mint" : "text-ink-100"}`}>
                    {income ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} className="text-coral" />}
                    {income ? "+" : "-"}
                    {formatCurrency(transaction.amount, settings.currency, settings.privacyMode)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
