import { useCallback, useEffect, useMemo, useState } from "react";
import { mockCategories, mockSettings } from "../data/mockData";
import type { Category, FinanceSettings, FinanceState, TransactionDraft } from "../types";
import { createId } from "../utils/finance";

const STORAGE_KEY = "aurora-finance-state-v1";

const initialState: FinanceState = {
  transactions: [],
  categories: mockCategories,
  settings: mockSettings
};

const getStorageKey = (userId: string) => `${STORAGE_KEY}:${userId}`;
const isDemoTransactionId = (id: string) => /^tx-\d{3}$/.test(id);

const readState = (userId: string): FinanceState => {
  try {
    const stored = localStorage.getItem(getStorageKey(userId));
    const parsed = stored ? ({ ...initialState, ...JSON.parse(stored) } as FinanceState) : initialState;
    return {
      ...parsed,
      transactions: parsed.transactions.filter((transaction) => !isDemoTransactionId(transaction.id))
    };
  } catch {
    return initialState;
  }
};

export function useFinanceStore(userId: string) {
  const [state, setState] = useState<FinanceState>(() => readState(userId));

  useEffect(() => {
    setState(readState(userId));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(state));
  }, [state, userId]);

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

  const resetWorkspace = useCallback(() => {
    setState(initialState);
  }, []);

  return useMemo(
    () => ({
      ...state,
      addTransaction,
      updateSettings,
      updateCategoryBudget,
      addCategory,
      resetWorkspace
    }),
    [addCategory, addTransaction, resetWorkspace, state, updateCategoryBudget, updateSettings]
  );
}
