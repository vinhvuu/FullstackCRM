"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RelatedListPanelProps {
  title: string;
  count?: number;
  children: ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  className?: string;
}

export function RelatedListPanel({
  title,
  count,
  children,
  onAdd,
  addLabel = "Thêm",
  className,
}: RelatedListPanelProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold text-text-dark">
          {title}
          {count !== undefined && (
            <span className="ml-2 text-xs font-normal text-text-muted">({count})</span>
          )}
        </CardTitle>
        {onAdd && (
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={onAdd}>
            <Plus className="w-3.5 h-3.5" />
            {addLabel}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}
