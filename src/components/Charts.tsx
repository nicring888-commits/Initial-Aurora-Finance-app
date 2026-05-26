import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { FinanceSettings } from "../types";
import { formatCurrency } from "../utils/finance";

interface ChartTooltipProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ name: string; value: number; color?: string; dataKey?: string }>;
  currency: FinanceSettings["currency"];
  privacyMode: boolean;
}

function ChartTooltip({ active, payload, label, currency, privacyMode }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/[0.08] bg-ink-900/90 p-3 text-xs shadow-glow backdrop-blur-xl">
      {label && <p className="mb-2 text-ink-100">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={`${item.name}-${item.dataKey}`} className="flex min-w-[150px] items-center justify-between gap-5">
            <span className="text-ink-300/70">{item.name}</span>
            <span className="font-medium text-ink-100">{formatCurrency(Number(item.value), currency, privacyMode)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TrendProps {
  data: Array<{ month: string; income: number; expenses: number; saved: number }>;
  currency: FinanceSettings["currency"];
  privacyMode: boolean;
}

export function MonthlyTrend({ data, currency, privacyMode }: TrendProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 14, right: 12, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ee7b7" stopOpacity={0.42} />
            <stop offset="100%" stopColor="#6ee7b7" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fb7185" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#fb7185" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "rgba(237,240,243,0.46)", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "rgba(237,240,243,0.4)", fontSize: 12 }} />
        <Tooltip content={<ChartTooltip currency={currency} privacyMode={privacyMode} />} />
        <Area type="monotone" dataKey="income" name="Einnahmen" stroke="#6ee7b7" strokeWidth={2.4} fill="url(#income)" />
        <Area type="monotone" dataKey="expenses" name="Ausgaben" stroke="#fb7185" strokeWidth={2.4} fill="url(#expenses)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface DonutProps {
  data: Array<{ name: string; value: number; color: string }>;
  currency: FinanceSettings["currency"];
  privacyMode: boolean;
}

export function CategoryDonut({ data, currency, privacyMode }: DonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={78} outerRadius={108} paddingAngle={3} stroke="none">
            {data.map((item) => (
              <Cell key={item.name} fill={item.color} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip currency={currency} privacyMode={privacyMode} />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="text-xs text-ink-300/55">Ausgaben</p>
          <p className="mt-1 text-xl font-semibold text-ink-100">{formatCurrency(total, currency, privacyMode)}</p>
        </div>
      </div>
    </div>
  );
}

export function CategoryBars({ data, currency, privacyMode }: DonutProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data.slice(0, 7)} layout="vertical" margin={{ top: 8, right: 10, left: 18, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,0.055)" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis dataKey="name" type="category" width={84} axisLine={false} tickLine={false} tick={{ fill: "rgba(237,240,243,0.56)", fontSize: 12 }} />
        <Tooltip content={<ChartTooltip currency={currency} privacyMode={privacyMode} />} />
        <Bar dataKey="value" name="Ausgaben" radius={[0, 8, 8, 0]} barSize={12}>
          {data.map((item) => (
            <Cell key={item.name} fill={item.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
