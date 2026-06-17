"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Popover({ open, onOpenChange, children, className }: PopoverProps) {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div ref={popoverRef} className={cn("absolute z-50 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-72", className)}>
      {children}
    </div>
  );
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export function PopoverTrigger({ children, onClick, className }: PopoverTriggerProps) {
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
}

interface PopoverContentProps {
  children: React.ReactNode;
}

export function PopoverContent({ children }: PopoverContentProps) {
  return <>{children}</>;
}