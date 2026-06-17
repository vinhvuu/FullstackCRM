import { AlertTriangle } from "lucide-react";

interface DealRottingBadgeProps {
  days?: number;
}

export function DealRottingBadge({ days }: DealRottingBadgeProps) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-medium">
      <AlertTriangle className="w-3 h-3" />
      {days !== undefined ? `Ì ${days}N` : "Ì"}
    </div>
  );
}
