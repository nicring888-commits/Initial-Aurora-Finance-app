import type { Category, FinanceSettings } from "../types";

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
