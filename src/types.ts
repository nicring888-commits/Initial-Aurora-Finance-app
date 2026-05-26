export type TransactionType = "income" | "expense";

export type ViewId = "dashboard" | "transactions" | "analytics" | "budgets" | "categories" | "settings";

export type Accent = "mint" | "coral" | "iris" | "amber";

export interface Category {
  id: string;
  name: string;
  type: TransactionType | "both";
  icon: string;
  color: string;
  budget?: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  merchant: string;
  note?: string;
  recurring?: boolean;
}

export interface FinanceSettings {
  currency: "EUR" | "USD" | "GBP";
  monthlyBudget: number;
  savingsTarget: number;
  privacyMode: boolean;
  accent: Accent;
}

export interface FinanceState {
  transactions: Transaction[];
  categories: Category[];
  settings: FinanceSettings;
}

export interface TransactionDraft {
  type: TransactionType;
  amount: number;
  categoryId: string;
  date: string;
  merchant: string;
  note?: string;
}

export interface TransactionFilters {
  query: string;
  categoryId: string;
  type: "all" | TransactionType;
  amount: "all" | "under50" | "50to200" | "over200";
  date: "all" | "thisMonth" | "last30";
}
