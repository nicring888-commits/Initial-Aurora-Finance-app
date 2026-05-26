import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ViewId } from "./types";
import { useFinanceStore } from "./hooks/useFinanceStore";
import { toCsv } from "./utils/finance";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { TransactionModal } from "./components/TransactionModal";
import { CommandPalette } from "./components/CommandPalette";
import { DashboardView } from "./views/DashboardView";
import { TransactionsView } from "./views/TransactionsView";
import { AnalyticsView } from "./views/AnalyticsView";
import { BudgetsView } from "./views/BudgetsView";
import { CategoriesView } from "./views/CategoriesView";
import { SettingsView } from "./views/SettingsView";

const accentColors = {
  mint: "#6ee7b7",
  coral: "#fb7185",
  iris: "#a78bfa",
  amber: "#fbbf24"
};

function App() {
  const store = useFinanceStore();
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const exportCsv = useCallback(async () => {
    const csv = toCsv(store.transactions, store.categories);
    const filename = `aurora-finance-${new Date().toISOString().slice(0, 10)}.csv`;

    if (window.finance?.exportCsv) {
      await window.finance.exportCsv(csv, filename);
      return;
    }

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [store.categories, store.transactions]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const commandKey = event.metaKey || event.ctrlKey;

      if (commandKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }

      if (commandKey && event.key.toLowerCase() === "n") {
        event.preventDefault();
        setTransactionModalOpen(true);
      }

      if (commandKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        void exportCsv();
      }

      if (event.key === "Escape") {
        setCommandOpen(false);
        setTransactionModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exportCsv]);

  const renderView = () => {
    switch (activeView) {
      case "transactions":
        return <TransactionsView transactions={store.transactions} categories={store.categories} settings={store.settings} onExport={exportCsv} />;
      case "analytics":
        return <AnalyticsView transactions={store.transactions} categories={store.categories} settings={store.settings} />;
      case "budgets":
        return (
          <BudgetsView
            transactions={store.transactions}
            categories={store.categories}
            settings={store.settings}
            onUpdateCategoryBudget={store.updateCategoryBudget}
            onUpdateSettings={store.updateSettings}
          />
        );
      case "categories":
        return <CategoriesView categories={store.categories} onAddCategory={store.addCategory} />;
      case "settings":
        return <SettingsView settings={store.settings} onUpdateSettings={store.updateSettings} onResetDemoData={store.resetDemoData} />;
      default:
        return <DashboardView transactions={store.transactions} categories={store.categories} settings={store.settings} />;
    }
  };

  return (
    <div
      className="relative h-screen overflow-hidden bg-ink-950 text-ink-100"
      style={{ "--accent": accentColors[store.settings.accent] } as React.CSSProperties}
    >
      <div className="app-surface absolute inset-0" />
      <div className="relative z-10 flex h-screen">
        <Sidebar activeView={activeView} onNavigate={setActiveView} />
        <main className="flex min-w-0 flex-1 flex-col">
          <TopBar activeView={activeView} onOpenAdd={() => setTransactionModalOpen(true)} onOpenCommand={() => setCommandOpen(true)} />
          <section className="min-h-0 flex-1 overflow-y-auto px-7 py-6 max-md:px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </section>
        </main>
      </div>

      <TransactionModal
        open={transactionModalOpen}
        categories={store.categories}
        onClose={() => setTransactionModalOpen(false)}
        onAdd={store.addTransaction}
      />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onNavigate={setActiveView}
        onAdd={() => setTransactionModalOpen(true)}
        onExport={exportCsv}
      />
    </div>
  );
}

export default App;
