import { FormEvent, useState } from "react";
import { Plus, Tags } from "lucide-react";
import type { Category } from "../types";
import { CategoryIcon } from "../components/CategoryIcon";
import { GlassPanel } from "../components/GlassPanel";

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, "id">) => void;
}

const iconOptions = ["Tags", "Utensils", "ShoppingBag", "Gamepad2", "Plane", "RefreshCcw", "TrainFront", "Home", "Ticket", "Sparkles"];
const colorOptions = ["#6ee7b7", "#fb7185", "#fbbf24", "#a78bfa", "#67e8f9", "#f97316"];

export function CategoriesView({ categories, onAddCategory }: CategoriesViewProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Category["type"]>("expense");
  const [icon, setIcon] = useState("Tags");
  const [color, setColor] = useState(colorOptions[0]);
  const [budget, setBudget] = useState("200");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      name: name.trim(),
      type,
      icon,
      color,
      budget: type === "income" ? undefined : Number(budget)
    });

    setName("");
  };

  return (
    <div className="grid grid-cols-[1fr_360px] gap-5 max-xl:grid-cols-1">
      <GlassPanel className="p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-iris/10 text-iris">
            <Tags size={19} />
          </span>
          <div>
            <p className="text-xs uppercase text-ink-300/45">Struktur</p>
            <h2 className="mt-1 text-lg font-semibold text-ink-100">Kategorien</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 max-lg:grid-cols-1">
          {categories.map((category) => (
            <div key={category.id} className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4 transition hover:bg-white/[0.055]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <CategoryIcon icon={category.icon} color={category.color} />
                  <div>
                    <h3 className="font-medium text-ink-100">{category.name}</h3>
                    <p className="text-xs text-ink-300/55">{category.type === "income" ? "Einnahme" : category.type === "both" ? "Beides" : "Ausgabe"}</p>
                  </div>
                </div>
                {category.budget && <span className="text-sm text-ink-300/65">{category.budget} EUR</span>}
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel className="h-fit p-5">
        <div className="mb-5">
          <p className="text-xs uppercase text-ink-300/45">Neu</p>
          <h2 className="mt-1 text-lg font-semibold text-ink-100">Kategorie</h2>
        </div>
        <form className="space-y-3" onSubmit={submit}>
          <input className="input-box" value={name} onChange={(event) => setName(event.target.value)} placeholder="Name" />
          <select className="select-box w-full" value={type} onChange={(event) => setType(event.target.value as Category["type"])}>
            <option value="expense">Ausgabe</option>
            <option value="income">Einnahme</option>
            <option value="both">Beides</option>
          </select>
          <select className="select-box w-full" value={icon} onChange={(event) => setIcon(event.target.value)}>
            {iconOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            {colorOptions.map((item) => (
              <button
                key={item}
                type="button"
                className={`h-9 flex-1 rounded-lg border transition ${color === item ? "border-white/60" : "border-white/[0.08]"}`}
                style={{ background: item }}
                onClick={() => setColor(item)}
                title={item}
              />
            ))}
          </div>
          {type !== "income" && <input className="input-box" value={budget} onChange={(event) => setBudget(event.target.value)} type="number" placeholder="Budget" />}
          <button className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-medium text-ink-950 transition hover:bg-ink-100">
            <Plus size={17} />
            Hinzufuegen
          </button>
        </form>
      </GlassPanel>
    </div>
  );
}
