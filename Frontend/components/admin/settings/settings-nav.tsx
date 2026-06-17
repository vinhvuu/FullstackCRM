"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "general", label: "Chung" },
  { id: "lead-sources", label: "Nguồn lead" },
  { id: "tags", label: "Tag" },
  { id: "sla", label: "SLA & Pool" },
];

export function SettingsNav() {
  const router = useRouter();
  const searchParams = new URLSearchParams(useSearchParams()?.toString() || "");
  const currentSection = searchParams.get("section") || "general";

  const handleSectionChange = (section: string) => {
    searchParams.set("section", section);
    router.push(`/admin/settings?${searchParams.toString()}`);
  };

  return (
    <div className="lg:w-56 shrink-0">
      <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => handleSectionChange(section.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-left whitespace-nowrap lg:whitespace-normal",
              currentSection === section.id
                ? "bg-primary text-white"
                : "text-text-muted hover:bg-gray-100 hover:text-text-dark"
            )}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
}