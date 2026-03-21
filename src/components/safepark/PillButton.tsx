import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "teal";
}

const PillButton = ({ className, variant = "blue", disabled, children, ...props }: PillButtonProps) => {
  const bg = variant === "blue" ? "bg-sp-blue" : "bg-sp-teal";
  return (
    <button
      className={cn(
        "w-full h-[52px] rounded-pill font-bold text-base text-foreground transition-colors",
        bg,
        "active:scale-[0.98] transition-transform",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default PillButton;
