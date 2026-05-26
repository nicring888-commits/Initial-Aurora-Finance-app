import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { GlassPanel } from "./GlassPanel";

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  tone: "mint" | "coral" | "amber" | "iris";
  icon: LucideIcon;
}

const toneMap = {
  mint: "text-mint bg-mint/10",
  coral: "text-coral bg-coral/10",
  amber: "text-amber bg-amber/10",
  iris: "text-iris bg-iris/10"
};

export function StatCard({ label, value, trend, tone, icon: Icon }: StatCardProps) {
  const positive = tone !== "coral";

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
      <GlassPanel className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-ink-300/70">{label}</p>
            <h3 className="mt-3 text-[1.7rem] font-semibold tracking-normal text-ink-100">{value}</h3>
          </div>
          <span className={`grid h-10 w-10 place-items-center rounded-lg ${toneMap[tone]}`}>
            <Icon size={19} />
          </span>
        </div>
        <div className="mt-5 flex items-center gap-2 text-xs text-ink-300/70">
          {positive ? <ArrowUpRight size={14} className="text-mint" /> : <ArrowDownRight size={14} className="text-coral" />}
          <span>{trend}</span>
        </div>
      </GlassPanel>
    </motion.div>
  );
}
