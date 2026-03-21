import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className }: PageWrapperProps) => (
  <div className={cn("mx-auto max-w-[390px] min-h-screen bg-background px-5 py-6", className)}>
    {children}
  </div>
);

export default PageWrapper;
