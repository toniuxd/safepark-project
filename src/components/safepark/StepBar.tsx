import { cn } from "@/lib/utils";

interface StepBarProps {
  total: number;
  current: number;
  variant?: "blue" | "teal";
}

const StepBar = ({ total, current, variant = "blue" }: StepBarProps) => {
  const filled = variant === "blue" ? "bg-sp-blue" : "bg-sp-teal";
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-colors",
            i < current ? filled : "bg-border"
          )}
        />
      ))}
    </div>
  );
};

export default StepBar;
