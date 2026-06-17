"use client";

import { useState, useMemo } from "react";
import { leads as initialLeads } from "@/lib/mock-data";
import { Lead, LeadFilters, QuickFilter, SortField, SortDirection, LeadStatus, ViewMode } from "@/types";
import { LeadTable } from "@/components/leads/lead-table";
import { LeadKanban } from "@/components/leads/lead-kanban";
import { LeadForm } from "@/components/leads/lead-form";
import { LeadChatbox } from "@/components/leads/lead-chatbox";
import { LeadFiltersComponent } from "@/components/leads/lead-filters";
import { QuickFilters } from "@/components/leads/quick-filters";
import { BulkActions } from "@/components/leads/bulk-actions";
import { Button } from "@/components/ui/button";
import { Plus, Download, Search, Filter, X, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { toCsv, downloadCsv } from "@/lib/csv";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const defaultFilters: LeadFilters = {
  status: [],
  source: [],
  dateFrom: "",
  dateTo: "",
  assignee: "all",
  scoreMin: 0,
  scoreMax: 100,
};

export default function LeadsPage() {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeChatLead, setActiveChatLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [sort, setSort] = useState<{ field: SortField; direction: SortDirection }>({
    field: "createdAt",
    direction: "desc",
  });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name.toLowerCase().includes(term) ||
          lead.company.toLowerCase().includes(term) ||
          lead.email.toLowerCase().includes(term) ||
          lead.phone.toLowerCase().includes(term) ||
          lead.source.toLowerCase().includes(term) ||
          lead.assignee.toLowerCase().includes(term)
      );
    }

    // Quick filters
    if (quickFilter === "new") {
      result = result.filter((lead) => lead.status === "new");
    } else if (quickFilter === "recent") {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      result = result.filter(
        (lead) => new Date(lead.createdAt).getTime() > sevenDaysAgo
      );
    } else if (quickFilter === "highScore") {
      result = result.filter((lead) => lead.score >= 70);
    }

    // Advanced filters
    if (filters.status.length > 0) {
      result = result.filter((lead) => filters.status.includes(lead.status));
    }
    if (filters.source.length > 0) {
      result = result.filter((lead) => filters.source.includes(lead.source));
    }
    if (filters.dateFrom) {
      result = result.filter(
        (lead) => new Date(lead.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      result = result.filter(
        (lead) => new Date(lead.createdAt) <= new Date(filters.dateTo)
      );
    }
    if (filters.assignee !== "all") {
      result = result.filter((lead) => lead.assignee === filters.assignee);
    }
    if (filters.scoreMin > 0) {
      result = result.filter((lead) => lead.score >= filters.scoreMin);
    }
    if (filters.scoreMax < 100) {
      result = result.filter((lead) => lead.score <= filters.scoreMax);
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = a[sort.field];
      let bVal: string | number = b[sort.field];

      if (sort.field === "status") {
        const statusOrder = { new: 1, contacted: 2, qualified: 3, lost: 4 };
        aVal = statusOrder[a.status];
        bVal = statusOrder[b.status];
      }

      if (sort.direction === "asc") {
        return String(aVal).localeCompare(String(bVal));
      } else {
        return String(bVal).localeCompare(String(aVal));
      }
    });

    return result;
  }, [searchTerm, filters, quickFilter, sort, leads]);

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedLead(null);
  };

  const handleSortChange = (field: SortField) => {
    if (sort.field === field) {
      setSort({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSort({ field, direction: "asc" });
    }
  };

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredLeads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLeads.map((lead) => lead.id));
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setLeads(leads.filter((lead) => !ids.includes(lead.id)));
    setSelectedIds([]);
  };

  const handleBulkStatusChange = (ids: string[], status: LeadStatus) => {
    setLeads(
      leads.map((lead) =>
        ids.includes(lead.id) ? { ...lead, status } : lead
      )
    );
  };

  const handleExport = () => {
    const headers = ["name", "company", "email", "phone", "source", "status", "score", "createdAt", "assignee"];
    const headerLabels: Record<string, string> = {
      name: t("lead.name"),
      company: t("lead.company"),
      email: t("lead.email"),
      phone: t("lead.phone"),
      source: t("lead.source"),
      status: t("lead.status"),
      score: t("lead.score"),
      createdAt: t("lead.createdAt"),
      assignee: t("lead.assignee"),
    };
    const rows = filteredLeads.map((lead) => ({
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      score: lead.score.toString(),
      createdAt: lead.createdAt,
      assignee: lead.assignee,
    }));
    const csv = toCsv(rows, headers, headerLabels);
    const filename = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeFilterCount =
    filters.status.length +
    filters.source.length +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.assignee !== "all" ? 1 : 0) +
    (filters.scoreMin > 0 || filters.scoreMax < 100 ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0 || quickFilter !== "all";

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setQuickFilter("all");
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(leads.map(lead =>
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    ));
  };

  const handleReorder = (leadId: string, newStatus: LeadStatus, newOrder: number) => {
    const leadToReorder = leads.find(l => l.id === leadId);
    if (!leadToReorder) return;
    
    const currentStatus = leadToReorder.status;
    const currentOrder = leadToReorder.order || 0;
    
    if (currentStatus === newStatus && currentOrder === newOrder) return;
    
    const updatedLeads = leads.map(lead => {
      if (lead.id === leadId) {
        return { ...lead, status: newStatus, order: newOrder };
      }
      if (lead.status === newStatus) {
        let leadOrder = lead.order || 0;
        if (currentStatus === newStatus) {
          if (currentOrder < newOrder) {
            if (leadOrder > currentOrder && leadOrder <= newOrder) {
              leadOrder--;
            }
          } else if (currentOrder > newOrder) {
            if (leadOrder >= newOrder && leadOrder < currentOrder) {
              leadOrder++;
            }
          }
        } else {
          if (leadOrder >= newOrder) {
            leadOrder++;
          }
        }
        return { ...lead, order: leadOrder };
      }
      if (currentStatus === newStatus && lead.status === currentStatus) {
        let leadOrder = lead.order || 0;
        if (currentOrder < newOrder) {
          if (leadOrder > currentOrder && leadOrder <= newOrder) {
            leadOrder--;
          }
        } else if (currentOrder > newOrder) {
          if (leadOrder >= newOrder && leadOrder < currentOrder) {
            leadOrder++;
          }
        }
        return { ...lead, order: leadOrder };
      }
      return lead;
    });
    
    setLeads(updatedLeads);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">{t("page.leads.title")}</h1>
          <p className="text-text-muted mt-1">{t("page.leads.description")}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-1.5"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{t("page.leads.table")}</span>
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="gap-1.5"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{t("page.leads.kanban")}</span>
            </Button>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            {t("common.export")}
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button variant="cta" className="gap-2">
                <Plus className="w-4 h-4" />
                {t("page.leads.addLead")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedLead ? t("page.leads.editLead") : t("page.leads.addLead")}
                </DialogTitle>
              </DialogHeader>
              <LeadForm lead={selectedLead} onClose={handleCloseModal} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search leads by name, company, email, phone..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-lg border border-gray-100 p-4 w-72">
              <LeadFiltersComponent
                filters={filters}
                onApply={(newFilters) => {
                  setFilters(newFilters);
                  setIsFilterOpen(false);
                }}
                onClear={() => {
                  setFilters(defaultFilters);
                }}
              />
            </div>
          )}
        </div>
      </div>

      <QuickFilters activeFilter={quickFilter} onFilterChange={setQuickFilter} />

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-muted">Active filters:</span>
          <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs h-6">
            <X className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        </div>
      )}

      {viewMode === "table" ? (
        <LeadTable 
          leads={filteredLeads} 
          onEdit={handleEditLead} 
          onMailClick={setActiveChatLead}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          sort={sort}
          onSortChange={handleSortChange}
        />
      ) : (
        <LeadKanban
          leads={leads}
          onStatusChange={handleStatusChange}
          onReorder={handleReorder}
          onEdit={handleEditLead}
          onMailClick={setActiveChatLead}
        />
      )}

      {activeChatLead && (
        <LeadChatbox 
          lead={activeChatLead} 
          onClose={() => setActiveChatLead(null)} 
        />
      )}

      <BulkActions
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        leads={leads}
        onDelete={handleBulkDelete}
        onChangeStatus={handleBulkStatusChange}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  );
}