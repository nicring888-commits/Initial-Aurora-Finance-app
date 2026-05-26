import { useCallback, useEffect, useMemo, useState } from "react";
import { mockCategories, mockSettings, mockTransactions } from "../data/mockData";
import type { Category, FinanceSettings, FinanceState, TransactionDraft } from "../types";
import { createId } from "../utils/finance";

const STORAGE_KEY = "aurora-finance-state-v1";

const initialState: FinanceState = {
  transactions: mockTransactions,
  categories: mockCategories,
  settings: mockSettings
};

const readState = (): FinanceState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialState, ...JSON.parse(stored) } : initialState;
  } catch {
    return initialState;
  }
};

export function useFinanceStore() {
  const [state, setState] = useState<FinanceState>(readState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addTransaction = useCallback((draft: TransactionDraft) => {
    setState((current) => ({
      ...current,
      transactions: [
        {
          id: createId(),
          ...draft,
          amount: Number(draft.amount)
        },
        ...current.transactions
      ]
    }));
  }, []);

  const updateSettings = useCallback((settings: Partial<FinanceSettings>) => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...settings }
    }));
  }, []);

  const updateCategoryBudget = useCallback((categoryId: string, budget: number) => {
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === categoryId ? { ...category, budget: Number(budget) } : category
      )
    }));
  }, []);

  const addCategory = useCallback((category: Omit<Category, "id">) => {
    setState((current) => ({
      ...current,
      categories: [
        ...current.categories,
        {
          id: `cat-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          ...category
        }
      ]
    }));
  }, []);

  const resetDemoData = useCallback(() => {
    setState(initialState);
  }, []);

  return useMemo(
    () => ({
      ...state,
      addTransaction,
      updateSettings,
      updateCategoryBudget,
      addCategory,
      resetDemoData
    }),
    [addCategory, addTransaction, resetDemoData, state, updateCategoryBudget, updateSettings]
  );
}
