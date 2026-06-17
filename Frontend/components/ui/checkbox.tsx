"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onCheckedChange, ...props }, ref) => {
    const refObj = React.useRef<HTMLInputElement>(null);
    
    React.useEffect(() => {
      if (refObj.current) {
        refObj.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate]);

    React.useEffect(() => {
      if (refObj.current) {
        refObj.current.checked = checked || false;
      }
    }, [checked]);

    return (
      <input
        type="checkbox"
        ref={(el) => {
          if (typeof ref === 'function') ref(el);
          else if (ref) ref.current = el;
          refObj.current = el;
        }}
        className={cn(
          "w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary",
          className
        )}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };