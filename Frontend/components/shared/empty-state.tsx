import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && <div className="mb-4 text-gray-300">{icon}</div>}
      <p className="font-medium text-text-dark mb-1">{title}</p>
      {description && <p className="text-sm text-text-muted mb-4">{description}</p>}
      {action}
    </div>
  );
}
