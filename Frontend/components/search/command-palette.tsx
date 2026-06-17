"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, FileText, User, Building2, DollarSign, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { leads, contacts, companies, deals } from "@/lib/mock-data";
import { SearchResult } from "@/types";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useI18n();

  const searchData = useCallback(
    (q: string): SearchResult[] => {
      if (!q.trim()) return [];
      const term = q.toLowerCase();
      const results: SearchResult[] = [];

      leads.forEach((lead) => {
        if (
          lead.name.toLowerCase().includes(term) ||
          lead.company.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term)
        ) {
          results.push({
            type: "lead",
            id: lead.id,
            title: lead.name,
            subtitle: lead.company,
            link: `/leads?id=${lead.id}`,
          });
        }
      });

      contacts.forEach((contact) => {
        if (
          contact.name.toLowerCase().includes(term) ||
          contact.company?.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term)
        ) {
          results.push({
            type: "contact",
            id: contact.id,
            title: contact.name,
            subtitle: contact.company,
            link: `/contacts?id=${contact.id}`,
          });
        }
      });

      companies.forEach((company) => {
        if (company.name.toLowerCase().includes(term)) {
          results.push({
            type: "company",
            id: company.id,
            title: company.name,
            subtitle: company.industry,
            link: `/companies?id=${company.id}`,
          });
        }
      });

      deals.forEach((deal) => {
        if (deal.title.toLowerCase().includes(term)) {
          results.push({
            type: "deal",
            id: deal.id,
            title: deal.title,
            subtitle: `${deal.value.toLocaleString("vi-VN")} VND`,
            link: `/deals?id=${deal.id}`,
          });
        }
      });

      return results.slice(0, 10);
    },
    []
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setResults(searchData(query));
    setSelectedIndex(0);
  }, [query, searchData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (!open) return;
      if (e.key === "Escape") {
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        router.push(results[selectedIndex].link);
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange, results, selectedIndex, router]);

  const getIcon = (type: string) => {
    switch (type) {
      case "lead":
        return <User className="w-4 h-4" />;
      case "contact":
        return <User className="w-4 h-4" />;
      case "company":
        return <Building2 className="w-4 h-4" />;
      case "deal":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center px-4 border-b">
          <Search className="w-5 h-5 text-text-muted" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="border-0 focus-visible:ring-0 text-lg"
          />
          <button onClick={() => onOpenChange(false)}>
            <X className="w-5 h-5 text-text-muted hover:text-text-dark" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 && query && (
            <div className="p-8 text-center text-text-muted">
              {t("search.noResults")}
            </div>
          )}
          {results.length === 0 && !query && (
            <div className="p-4">
              <div className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 px-2">
                {t("search.recent")}
              </div>
              <div className="flex items-center gap-3 p-2 text-text-muted text-sm">
                <Clock className="w-4 h-4" />
                <span>No recent searches</span>
              </div>
            </div>
          )}
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => {
                router.push(result.link);
                onOpenChange(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                index === selectedIndex ? "bg-gray-50" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-text-muted">
                {getIcon(result.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-text-dark truncate">{result.title}</div>
                {result.subtitle && (
                  <div className="text-sm text-text-muted truncate">{result.subtitle}</div>
                )}
              </div>
              <div className="text-xs text-text-muted capitalize">{result.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}