import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, Euro, FileText, Tag, X } from "lucide-react";
import type { Category, TransactionDraft, TransactionType } from "../types";

interface TransactionModalProps {
  open: boolean;
  categories: Category[];
  onClose: () => void;
  onAdd: (draft: TransactionDraft) => void;
}

export function TransactionModal({ open, categories, onClose, onAdd }: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type || category.type === "both"),
    [categories, type]
  );
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(filteredCategories[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [merchant, setMerchant] = useState("");
  const [note, setNote] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!numericAmount || !categoryId || !merchant.trim()) return;

    onAdd({
      type,
      amount: numericAmount,
      categoryId,
      date,
      merchant: merchant.trim(),
      note: note.trim()
    });

    setAmount("");
    setMerchant("");
    setNote("");
    onClose();
  };

  const changeType = (nextType: TransactionType) => {
    setType(nextType);
    const nextCategory = categories.find((category) => category.type === nextType || category.type === "both");
    setCategoryId(nextCategory?.id ?? "");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/54 p-5 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            className="w-full max-w-[520px] rounded-xl border border-white/[0.1] bg-ink-900/88 p-5 shadow-glow"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={submit}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-ink-300/50">Neue Buchung</p>
                <h2 className="mt-1 text-xl font-semibold text-ink-100">Transaktion</h2>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-100"
                onClick={onClose}
                title="Schliessen"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 rounded-lg bg-white/[0.045] p-1">
              {(["expense", "income"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`h-9 rounded-md text-sm transition ${type === item ? "bg-white text-ink-950" : "text-ink-300 hover:text-white"}`}
                  onClick={() => changeType(item)}
                >
                  {item === "expense" ? "Ausgabe" : "Einnahme"}
                </button>
              ))}
            </div>

            <div className="grid gap-3">
              <label className="field">
                <Euro size={17} />
                <input value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="0" step="0.01" placeholder="0.00" />
              </label>

              <label className="field">
                <Tag size={17} />
                <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
                <label className="field">
                  <Calendar size={17} />
                  <input value={date} onChange={(event) => setDate(event.target.value)} type="date" />
                </label>
                <label className="field">
                  <FileText size={17} />
                  <input value={merchant} onChange={(event) => setMerchant(event.target.value)} placeholder="Name" />
                </label>
              </div>

              <textarea
                className="min-h-[96px] resize-none rounded-lg border border-white/[0.08] bg-white/[0.045] px-4 py-3 text-sm text-ink-100 outline-none transition placeholder:text-ink-300/40 focus:border-white/[0.16] focus:bg-white/[0.07]"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Notiz"
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" className="h-10 rounded-lg px-4 text-sm text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-100" onClick={onClose}>
                Abbrechen
              </button>
              <button className="flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-sm font-medium text-ink-950 transition hover:bg-ink-100">
                <Check size={17} />
                Speichern
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
