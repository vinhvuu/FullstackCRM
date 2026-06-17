"use client";

import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard: require("lucide-react").LayoutDashboard,
  Users: require("lucide-react").Users,
  Contact: require("lucide-react").Contact,
  TrendingUp: require("lucide-react").TrendingUp,
  Calendar: require("lucide-react").Calendar,
  BarChart3: require("lucide-react").BarChart3,
  Settings: require("lucide-react").Settings,
};

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-muted hover:text-text-dark"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div
            className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-poppins font-bold text-xl text-text-dark">VanhCorp</span>
              </Link>
            </div>

            <nav className="px-4">
              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const Icon = iconMap[item.icon];
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-white"
                            : "text-text-muted hover:bg-primary/5 hover:text-text-dark"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
