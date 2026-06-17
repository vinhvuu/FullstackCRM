import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const Pagination = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div role="navigation" aria-label="pagination" className={cn("flex items-center gap-1", className)} {...props} />
);

const PaginationContent = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
);
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />
);
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({ className, isActive, ...props }: React.ComponentProps<typeof Button> & { isActive?: boolean }) => (
  <Button
    variant={isActive ? "default" : "outline"}
    className={cn("h-9 w-9 p-0", className)}
    {...props}
  />
);

const PaginationPrevious = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to previous page" className={cn("gap-1 pl-2.5", className)} {...props}>
    <span>‹</span>
    <span className="hidden sm:inline">Trước</span>
  </PaginationLink>
);

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label="Go to next page" className={cn("gap-1 pr-2.5", className)} {...props}>
    <span className="hidden sm:inline">Sau</span>
    <span>›</span>
  </PaginationLink>
);

export { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext };