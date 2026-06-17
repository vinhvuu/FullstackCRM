"use client";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "./sidebar-context";
import {
  LayoutDashboard,
  Users,
  Contact,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Package,
  FileText,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Contact,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  Building2,
  Package,
  FileText,
};

export function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { t } = useI18n();

  const navLabelMap: Record<string, string> = {
    Dashboard: t("nav.dashboard"),
    Leads: t("nav.leads"),
    Contacts: t("nav.contacts"),
    Deals: t("nav.deals"),
    Activities: t("nav.activities"),
    Reports: t("nav.reports"),
    Settings: t("nav.settings"),
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn("p-6 flex items-center justify-center", isCollapsed && "p-4")}>
        <Link href="/">
          <img src="/VANH-CORP.png" alt="Logo" className="h-10 w-24 object-contain" />
        </Link>
      </div>

      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors",
          isCollapsed && "rotate-180"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-text-muted" />
        )}
      </button>

      <nav className={cn("flex-1 px-4", isCollapsed && "px-2")}>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const currentPath = pathname ?? "";
            const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));
            const label = navLabelMap[item.label] || item.label;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                    isCollapsed
                      ? "justify-center p-3"
                      : "gap-3 px-4 py-3",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "text-text-muted hover:bg-primary/5 hover:text-text-dark"
                  )}
                  title={isCollapsed ? label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
