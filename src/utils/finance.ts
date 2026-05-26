import type { Category, FinanceSettings, Transaction, TransactionFilters, TransactionType } from "../types";

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

export const formatCurrency = (amount: number, currency: FinanceSettings["currency"], privacyMode = false) => {
  if (privacyMode) return "••••";

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
};

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short" }).format(new Date(date));

export const getMonthKey = (date: string | Date) => {
  const parsed = typeof date === "string" ? new Date(date) : date;
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
};

export const isCurrentMonth = (date: string) => getMonthKey(date) === getMonthKey(new Date());

export const sumTransactions = (transactions: Transaction[], type?: TransactionType) =>
  transactions
    .filter((transaction) => !type || transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

export const getCategory = (categories: Category[], id: string) =>
  categories.find((category) => category.id === id) ?? categories[0];

export const getCurrentMonthTransactions = (transactions: Transaction[]) =>
  transactions.filter((transaction) => isCurrentMonth(transaction.date));

export const getBalance = (transactions: Transaction[]) =>
  sumTransactions(transactions, "income") - sumTransactions(transactions, "expense");

export const getSavingsRate = (income: number, expenses: number) => {
  if (income <= 0) return 0;
  return Math.max(0, Math.round(((income - expenses) / income) * 100));
};

export const getMonthlySeries = (transactions: Transaction[]) => {
  const today = new Date();

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    const key = getMonthKey(date);
    const monthly = transactions.filter((transaction) => getMonthKey(transaction.date) === key);

    return {
      month: monthNames[date.getMonth()],
      income: Number(sumTransactions(monthly, "income").toFixed(2)),
      expenses: Number(sumTransactions(monthly, "expense").toFixed(2)),
      saved: Number((sumTransactions(monthly, "income") - sumTransactions(monthly, "expense")).toFixed(2))
    };
  });
};

export const getCategoryBreakdown = (transactions: Transaction[], categories: Category[]) => {
  const expenseTransactions = transactions.filter((transaction) => transaction.type === "expense");

  return categories
    .filter((category) => category.type !== "income")
    .map((category) => {
      const value = expenseTransactions
        .filter((transaction) => transaction.categoryId === category.id)
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      return {
        id: category.id,
        name: category.name,
        value: Number(value.toFixed(2)),
        color: category.color,
        budget: category.budget ?? 0
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);
};

export const getBudgetUsage = (transactions: Transaction[], categories: Category[]) =>
  categories
    .filter((category) => category.type !== "income" && category.budget)
    .map((category) => {
      const spent = transactions
        .filter((transaction) => transaction.type === "expense" && transaction.categoryId === category.id)
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const budget = category.budget ?? 0;

      return {
        ...category,
        spent,
        budget,
        progress: budget > 0 ? Math.round((spent / budget) * 100) : 0,
        remaining: budget - spent
      };
    })
    .sort((a, b) => b.progress - a.progress);

export const filterTransactions = (transactions: Transaction[], filters: TransactionFilters) =>
  transactions.filter((transaction) => {
    const query = filters.query.trim().toLowerCase();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const matchesQuery =
      !query ||
      transaction.merchant.toLowerCase().includes(query) ||
      transaction.note?.toLowerCase().includes(query);
    const matchesCategory = filters.categoryId === "all" || transaction.categoryId === filters.categoryId;
    const matchesType = filters.type === "all" || transaction.type === filters.type;
    const matchesDate =
      filters.date === "all" ||
      (filters.date === "thisMonth" && isCurrentMonth(transaction.date)) ||
      (filters.date === "last30" && new Date(transaction.date) >= thirtyDaysAgo);
    const matchesAmount =
      filters.amount === "all" ||
      (filters.amount === "under50" && transaction.amount < 50) ||
      (filters.amount === "50to200" && transaction.amount >= 50 && transaction.amount <= 200) ||
      (filters.amount === "over200" && transaction.amount > 200);

    return matchesQuery && matchesCategory && matchesType && matchesDate && matchesAmount;
  });

export const toCsv = (transactions: Transaction[], categories: Category[]) => {
  const rows = transactions.map((transaction) => {
    const category = getCategory(categories, transaction.categoryId);
    return [
      transaction.date,
      transaction.type,
      category.name,
      transaction.merchant,
      transaction.amount.toFixed(2),
      transaction.note ?? ""
    ];
  });

  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return [["date", "type", "category", "merchant", "amount", "note"], ...rows]
    .map((row) => row.map((value) => escape(String(value))).join(","))
    .join("\n");
};

export const createId = () => {
  if ("crypto" in window && "randomUUID" in window.crypto) {
    return window.crypto.randomUUID();
  }

  return `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};
