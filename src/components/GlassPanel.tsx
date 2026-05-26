import type { HTMLAttributes } from "react";
import clsx from "clsx";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
}

export function GlassPanel({ className, elevated, ...props }: GlassPanelProps) {
  return (
    <div
      className={clsx(
        "glass-panel rounded-lg border border-white/[0.08] bg-white/[0.045] shadow-hairline",
        elevated && "shadow-glow",
        className
      )}
      {...props}
    />
  );
}
