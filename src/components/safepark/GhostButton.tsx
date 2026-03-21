import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "teal";
}

const GhostButton = ({ className, variant = "blue", disabled, children, ...props }: GhostButtonProps) => {
  const borderColor = variant === "blue" ? "border-sp-blue text-sp-blue" : "border-sp-teal text-sp-teal";
  return (
    <button
      className={cn(
        "w-full h-[52px] rounded-pill font-bold text-base bg-transparent border-2 transition-colors",
        borderColor,
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

export default GhostButton;
