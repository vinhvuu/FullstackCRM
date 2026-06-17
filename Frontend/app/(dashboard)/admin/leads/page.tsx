"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Lead, DistributionRule, PoolConfig, DistributionSummary } from "@/types";
import { Button } from "@/components/ui/button";
import { DistributionSummaryCards } from "@/components/admin/leads/distribution-summary";
import { LeadDistributionTabs } from "@/components/admin/leads/lead-distribution-tabs";
import { LeadAssignmentFilters, AssignableLeadTable } from "@/components/admin/leads/assignable-lead-table";
import { LeadBulkActionBar } from "@/components/admin/leads/lead-bulk-action-bar";
import { AssignLeadDialog } from "@/components/admin/leads/assign-lead-dialog";
import { RuleList } from "@/components/admin/leads/rule-list";
import { PoolConfigPanel } from "@/components/admin/leads/pool-config-panel";
import {
  getDistributionSummary,
  getAssignableLeads,
  getDistributionRules,
  getPoolLeads,
  getPoolConfig,
  assignLeads,
  moveToPool,
  removeFromPool,
  toggleDistributionRule,
  deleteDistributionRule,
  updatePoolConfig,
  applyDistributionRules,
  LeadFilters,
} from "@/lib/admin/admin-data";
import { RefreshCw, Layers, Zap } from "lucide-react";

export default function AdminLeadsPage() {
  const searchParams = useSearchParams() || new URLSearchParams();
  const tab = searchParams.get("tab") || "manual";

  const [summary, setSummary] = useState<DistributionSummary | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [rules, setRules] = useState<DistributionRule[]>([]);
  const [poolLeads, setPoolLeads] = useState<Lead[]>([]);
  const [poolConfig, setPoolConfig] = useState<PoolConfig>({ enabled: true, claimLimit: 5 });

  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    source: "all",
    status: "all",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, rulesData, poolConfigData] = await Promise.all([
        getDistributionSummary(),
        getDistributionRules(),
        getPoolConfig(),
      ]);
      setSummary(summaryData);
      setRules(rulesData);
      setPoolConfig(poolConfigData);

      if (tab === "manual" || tab === "pool") {
        const leadsData = tab === "pool"
          ? await getPoolLeads({})
          : await getAssignableLeads(filters);
        if (tab === "pool") {
          setPoolLeads(leadsData);
        } else {
          setLeads(leadsData);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [tab, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentLeads = tab === "pool" ? poolLeads : leads;
      setSelectedIds(currentLeads.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleAssign = async (userId: number, userName: string) => {
    const result = await assignLeads(selectedIds, userId, userName);
    if (result.success) {
      setSelectedIds([]);
      await loadData();
    }
  };

  const handleMoveToPool = async () => {
    await moveToPool(selectedIds);
    setSelectedIds([]);
    await loadData();
  };

  const handleRemoveFromPool = async () => {
    await removeFromPool(selectedIds);
    setSelectedIds([]);
    await loadData();
  };

  const handleToggleRule = async (id: number) => {
    await toggleDistributionRule(id);
    await loadData();
  };

  const handleDeleteRule = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa luật này?")) {
      await deleteDistributionRule(id);
      await loadData();
    }
  };

  const handleApplyRules = async () => {
    const result = await applyDistributionRules();
    if (result.assignedCount > 0) {
      alert(`Đã gán tự động ${result.assignedCount} lead theo rules:\n${result.details.map(d => `- ${d.leadName} → ${d.userName} (${d.ruleName})`).join("\n")}`);
    } else {
      alert("Không có lead nào trong pool phù hợp với rules.");
    }
    await loadData();
  };

  const handlePoolConfigUpdate = async (config: Partial<PoolConfig>) => {
    await updatePoolConfig(config);
    setPoolConfig((prev) => ({ ...prev, ...config }));
  };

  const handleClearFilters = () => {
    setFilters({ search: "", source: "all", status: "all" });
  };

  const displayedLeads = tab === "pool" ? poolLeads : leads;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Chia lead</h1>
          <p className="text-text-muted mt-1">Quản lý phân bổ lead cho nhân viên</p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      <DistributionSummaryCards summary={summary} loading={loading} />

      <LeadDistributionTabs />

      <div className="bg-white rounded-lg border">
        {tab === "manual" && (
          <div className="p-4 space-y-4">
            <LeadAssignmentFilters
              filters={filters}
              onChange={setFilters}
              onClear={handleClearFilters}
            />
            <AssignableLeadTable
              leads={leads}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onSelectAll={handleSelectAll}
              loading={loading}
            />
            <LeadBulkActionBar
              selectedCount={selectedIds.length}
              onAssign={() => setAssignDialogOpen(true)}
              onMoveToPool={handleMoveToPool}
              onClearSelection={() => setSelectedIds([])}
            />
          </div>
        )}

        {tab === "rules" && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-800">Áp dụng rules tự động</p>
                <p className="text-sm text-blue-600">Tự động gán lead trong pool theo rules đang bật</p>
              </div>
              <Button onClick={handleApplyRules}>
                <Zap className="w-4 h-4 mr-2" />
                Áp dụng ngay
              </Button>
            </div>
            <RuleList
              rules={rules}
              loading={loading}
              onToggle={handleToggleRule}
              onEdit={(rule) => console.log("Edit", rule)}
              onDelete={handleDeleteRule}
              onCreate={() => console.log("Create rule")}
            />
          </div>
        )}

        {tab === "pool" && (
          <div className="p-4 space-y-4">
            <PoolConfigPanel
              config={poolConfig}
              onUpdate={handlePoolConfigUpdate}
              loading={loading}
            />
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Lead trong pool
              </h3>
              <AssignableLeadTable
                leads={poolLeads}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onSelectAll={handleSelectAll}
                loading={loading}
              />
              <LeadBulkActionBar
                selectedCount={selectedIds.length}
                onAssign={() => setAssignDialogOpen(true)}
                onRemoveFromPool={handleRemoveFromPool}
                onClearSelection={() => setSelectedIds([])}
              />
            </div>
          </div>
        )}
      </div>

      <AssignLeadDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        leadCount={selectedIds.length}
        onAssign={handleAssign}
      />
    </div>
  );
}