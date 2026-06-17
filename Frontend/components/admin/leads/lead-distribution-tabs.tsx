"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "manual", label: "Gán thủ công" },
  { id: "rules", label: "Luật tự động" },
  { id: "pool", label: "Pool" },
];

export function LeadDistributionTabs() {
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams()?.toString() || "");
  const currentTab = searchParams.get("tab") || "manual";

  const handleTabChange = (tab: string) => {
    searchParams.set("tab", tab);
    router.push(`/admin/leads?${searchParams.toString()}`);
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex gap-1 px-4 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
              currentTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-text-muted hover:text-text-dark hover:border-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}