"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";
import { I18nProvider } from "@/lib/i18n";
import { CommandPalette } from "@/components/search/command-palette";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AdminSubnav } from "@/components/admin/admin-subnav";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background">
      {!isAdmin && <Sidebar />}
      {!isAdmin && <MobileNav />}
      <Header onSearchClick={() => setIsSearchOpen(true)} />
      <CommandPalette open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isAdmin ? "pt-16 lg:pl-0" : "pt-14",
          !isAdmin && (isCollapsed ? "lg:pl-20" : "lg:pl-64")
        )}
      >
        {isAdmin && <AdminSubnav />}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <I18nProvider>
        <DashboardContent>{children}</DashboardContent>
      </I18nProvider>
    </SidebarProvider>
  );
}
