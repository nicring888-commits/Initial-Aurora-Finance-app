import type { Category, FinanceSettings, Transaction } from "../types";

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();

const toDateString = (date: Date) => {
  const dateMonth = String(date.getMonth() + 1).padStart(2, "0");
  const dateDay = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${dateMonth}-${dateDay}`;
};

const iso = (dayOffset: number) => {
  const date = new Date(year, month, now.getDate() - dayOffset);
  return toDateString(date);
};

const pastMonth = (monthsBack: number, day: number) => {
  const date = new Date(year, month - monthsBack, day);
  return toDateString(date);
};

export const mockCategories: Category[] = [
  { id: "salary", name: "Gehalt", type: "income", icon: "Landmark", color: "#6ee7b7" },
  { id: "freelance", name: "Freelance", type: "income", icon: "Sparkles", color: "#67e8f9" },
  { id: "food", name: "Essen", type: "expense", icon: "Utensils", color: "#fb7185", budget: 520 },
  { id: "shopping", name: "Shopping", type: "expense", icon: "ShoppingBag", color: "#a78bfa", budget: 420 },
  { id: "gaming", name: "Gaming", type: "expense", icon: "Gamepad2", color: "#60a5fa", budget: 140 },
  { id: "travel", name: "Reisen", type: "expense", icon: "Plane", color: "#fbbf24", budget: 300 },
  { id: "subs", name: "Abos", type: "expense", icon: "RefreshCcw", color: "#c084fc", budget: 110 },
  { id: "transport", name: "Transport", type: "expense", icon: "TrainFront", color: "#34d399", budget: 180 },
  { id: "housing", name: "Wohnen", type: "expense", icon: "Home", color: "#f97316", budget: 1350 },
  { id: "leisure", name: "Freizeit", type: "expense", icon: "Ticket", color: "#22d3ee", budget: 260 }
];

export const mockSettings: FinanceSettings = {
  currency: "EUR",
  monthlyBudget: 3280,
  savingsTarget: 26,
  privacyMode: false,
  accent: "mint"
};

export const mockTransactions: Transaction[] = [
  { id: "tx-001", type: "income", amount: 4850, categoryId: "salary", date: pastMonth(0, 1), merchant: "Studio Payroll", note: "Mai Gehalt", recurring: true },
  { id: "tx-002", type: "expense", amount: 1320, categoryId: "housing", date: pastMonth(0, 2), merchant: "Miete", note: "Apartment", recurring: true },
  { id: "tx-003", type: "expense", amount: 84.5, categoryId: "food", date: iso(1), merchant: "Eataly Market", note: "Dinner + Wochenmarkt" },
  { id: "tx-004", type: "expense", amount: 19.99, categoryId: "subs", date: iso(2), merchant: "Linear Pro", recurring: true },
  { id: "tx-005", type: "expense", amount: 219, categoryId: "shopping", date: iso(3), merchant: "Arket", note: "Sommerjacke" },
  { id: "tx-006", type: "expense", amount: 42.8, categoryId: "transport", date: iso(4), merchant: "Deutschlandticket", recurring: true },
  { id: "tx-007", type: "income", amount: 680, categoryId: "freelance", date: iso(5), merchant: "Northstar Labs", note: "Landing Page Sprint" },
  { id: "tx-008", type: "expense", amount: 63.4, categoryId: "leisure", date: iso(6), merchant: "Kino International", note: "Tickets + Drinks" },
  { id: "tx-009", type: "expense", amount: 74.95, categoryId: "gaming", date: iso(8), merchant: "Steam", note: "Bundle Sale" },
  { id: "tx-010", type: "expense", amount: 38.2, categoryId: "food", date: iso(9), merchant: "Five Elephant", note: "Coffee + Brunch" },
  { id: "tx-011", type: "expense", amount: 186.2, categoryId: "travel", date: iso(11), merchant: "DB Fernverkehr", note: "Berlin - Hamburg" },
  { id: "tx-012", type: "expense", amount: 14.99, categoryId: "subs", date: iso(13), merchant: "Spotify", recurring: true },
  { id: "tx-013", type: "expense", amount: 96.7, categoryId: "food", date: iso(15), merchant: "Kochhaus", note: "Dinner ingredients" },
  { id: "tx-014", type: "expense", amount: 128.4, categoryId: "shopping", date: iso(18), merchant: "Muji", note: "Desk setup" },
  { id: "tx-015", type: "expense", amount: 52.3, categoryId: "transport", date: iso(19), merchant: "Share Now", note: "Airport ride" },
  { id: "tx-016", type: "income", amount: 4850, categoryId: "salary", date: pastMonth(1, 1), merchant: "Studio Payroll", recurring: true },
  { id: "tx-017", type: "expense", amount: 1320, categoryId: "housing", date: pastMonth(1, 2), merchant: "Miete", recurring: true },
  { id: "tx-018", type: "expense", amount: 468.1, categoryId: "food", date: pastMonth(1, 12), merchant: "Monatsmix Essen" },
  { id: "tx-019", type: "expense", amount: 332.6, categoryId: "shopping", date: pastMonth(1, 16), merchant: "Retail Mix" },
  { id: "tx-020", type: "expense", amount: 104.9, categoryId: "gaming", date: pastMonth(1, 18), merchant: "Gaming Mix" },
  { id: "tx-021", type: "expense", amount: 211.4, categoryId: "travel", date: pastMonth(1, 21), merchant: "Weekend Trip" },
  { id: "tx-022", type: "income", amount: 4850, categoryId: "salary", date: pastMonth(2, 1), merchant: "Studio Payroll", recurring: true },
  { id: "tx-023", type: "income", amount: 420, categoryId: "freelance", date: pastMonth(2, 15), merchant: "Northstar Labs" },
  { id: "tx-024", type: "expense", amount: 1320, categoryId: "housing", date: pastMonth(2, 2), merchant: "Miete", recurring: true },
  { id: "tx-025", type: "expense", amount: 524.7, categoryId: "food", date: pastMonth(2, 11), merchant: "Monatsmix Essen" },
  { id: "tx-026", type: "expense", amount: 248.2, categoryId: "leisure", date: pastMonth(2, 20), merchant: "Freizeit Mix" },
  { id: "tx-027", type: "income", amount: 4850, categoryId: "salary", date: pastMonth(3, 1), merchant: "Studio Payroll", recurring: true },
  { id: "tx-028", type: "expense", amount: 1320, categoryId: "housing", date: pastMonth(3, 2), merchant: "Miete", recurring: true },
  { id: "tx-029", type: "expense", amount: 441.9, categoryId: "food", date: pastMonth(3, 13), merchant: "Monatsmix Essen" },
  { id: "tx-030", type: "expense", amount: 398.5, categoryId: "travel", date: pastMonth(3, 19), merchant: "Kurztrip" },
  { id: "tx-031", type: "income", amount: 4850, categoryId: "salary", date: pastMonth(4, 1), merchant: "Studio Payroll", recurring: true },
  { id: "tx-032", type: "expense", amount: 1320, categoryId: "housing", date: pastMonth(4, 2), merchant: "Miete", recurring: true },
  { id: "tx-033", type: "expense", amount: 502.6, categoryId: "food", date: pastMonth(4, 10), merchant: "Monatsmix Essen" },
  { id: "tx-034", type: "expense", amount: 288.2, categoryId: "shopping", date: pastMonth(4, 22), merchant: "Shopping Mix" },
  { id: "tx-035", type: "income", amount: 4850, categoryId: "salary", date: pastMonth(5, 1), merchant: "Studio Payroll", recurring: true },
  { id: "tx-036", type: "expense", amount: 1320, categoryId: "housing", date: pastMonth(5, 2), merchant: "Miete", recurring: true },
  { id: "tx-037", type: "expense", amount: 476.3, categoryId: "food", date: pastMonth(5, 11), merchant: "Monatsmix Essen" },
  { id: "tx-038", type: "expense", amount: 166.9, categoryId: "transport", date: pastMonth(5, 17), merchant: "Transport Mix" }
];
