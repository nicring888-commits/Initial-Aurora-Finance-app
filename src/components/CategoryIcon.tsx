import {
  CircleDollarSign,
  Gamepad2,
  Home,
  Landmark,
  Plane,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Tags,
  Ticket,
  TrainFront,
  Utensils,
  type LucideIcon
} from "lucide-react";
import clsx from "clsx";

const iconMap: Record<string, LucideIcon> = {
  CircleDollarSign,
  Gamepad2,
  Home,
  Landmark,
  Plane,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Tags,
  Ticket,
  TrainFront,
  Utensils
};

interface CategoryIconProps {
  icon: string;
  color: string;
  className?: string;
}

export function CategoryIcon({ icon, color, className }: CategoryIconProps) {
  const Icon = iconMap[icon] ?? CircleDollarSign;

  return (
    <span
      className={clsx("grid h-9 w-9 place-items-center rounded-lg border border-white/10", className)}
      style={{
        background: `${color}1f`,
        color
      }}
    >
      <Icon size={17} strokeWidth={2} />
    </span>
  );
}
