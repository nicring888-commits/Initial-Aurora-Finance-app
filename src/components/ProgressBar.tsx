import { motion } from "framer-motion";
import clsx from "clsx";

interface ProgressBarProps {
  value: number;
  color?: string;
  className?: string;
}

export function ProgressBar({ value, color = "#6ee7b7", className }: ProgressBarProps) {
  const progress = Math.min(Math.max(value, 0), 140);
  const width = `${Math.min(progress, 100)}%`;

  return (
    <div className={clsx("h-2 overflow-hidden rounded-full bg-white/[0.08]", className)}>
      <motion.div
        className="h-full rounded-full"
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            progress > 100
              ? "linear-gradient(90deg, #fb7185, #fbbf24)"
              : `linear-gradient(90deg, ${color}, ${color}cc)`
        }}
      />
    </div>
  );
}
