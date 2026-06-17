"use client";

import { useState, useMemo } from "react";
import { companies as initialCompanies, getCompanyStats } from "@/lib/mock-data";
import { Company } from "@/types";
import { INDUSTRIES, COMPANY_SIZES } from "@/lib/constants";
import { CompanyCard } from "@/components/companies/company-card";
import { CompanyTable } from "@/components/companies/company-table";
import { CompanyFormDialog } from "@/components/companies/company-form-dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Building2, LayoutGrid, List, Plus, Search, Filter } from "lucide-react";

type ViewMode = "grid" | "table";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(() =>
    initialCompanies.map((c) => {
      const stats = getCompanyStats(c.id);
      return { ...c, ...stats };
    })
  );
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("");
  const [filterSize, setFilterSize] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterIndustry && c.industry !== filterIndustry) return false;
      if (filterSize && c.size !== filterSize) return false;
      return true;
    });
  }, [companies, search, filterIndustry, filterSize]);

  const handleAdd = (data: Omit<Company, "id" | "createdAt">) => {
    const newCompany: Company = {
      ...data,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
      contactCount: 0,
      openDealCount: 0,
      openDealValue: 0,
    };
    setCompanies((prev) => [newCompany, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Công ty</h1>
          <p className="text-text-muted text-sm mt-0.5">{companies.length} công ty</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4" />
            Thêm công ty
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm công ty..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
          />
        </div>

        <select
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white"
        >
          <option value="">Tất cả ngành</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>

        <select
          value={filterSize}
          onChange={(e) => setFilterSize(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-white"
        >
          <option value="">Mọi quy mô</option>
          {COMPANY_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`p-2 transition-colors ${view === "grid" ? "bg-indigo-600 text-white" : "bg-white text-text-muted hover:bg-gray-50"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("table")}
            className={`p-2 transition-colors ${view === "table" ? "bg-indigo-600 text-white" : "bg-white text-text-muted hover:bg-gray-50"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-12 h-12" />}
          title="Không có công ty nào"
          description="Thêm công ty đầu tiên để bắt đầu"
          action={
            <Button onClick={() => setAddOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm công ty
            </Button>
          }
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <CompanyTable companies={filtered} />
      )}

      <CompanyFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleAdd}
      />
    </div>
  );
}
