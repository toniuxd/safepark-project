import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: "blue" | "teal";
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, variant = "blue", ...props }, ref) => {
    const focusRing = variant === "blue" ? "focus:border-sp-blue focus:ring-sp-blue" : "focus:border-sp-teal focus:ring-sp-teal";
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-sp-surface border border-border rounded-input px-4 py-3 text-base text-foreground placeholder:text-sp-text-secondary",
          "outline-none focus:ring-2 transition-colors",
          focusRing,
          className
        )}
        {...props}
      />
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
