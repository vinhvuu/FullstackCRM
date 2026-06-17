"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuditLog, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AuditFiltersComponent, AuditTable } from "@/components/admin/audit/audit-table";
import { getAuditLogs, exportAuditLogs, getActiveUsers, AuditFilters } from "@/lib/admin/admin-data";
import { FileText, Download } from "lucide-react";

export default function AdminAuditPage() {
  const searchParams = useSearchParams() || new URLSearchParams();
  const router = useRouter();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState<AuditFilters>({
    q: searchParams.get("q") || undefined,
    userId: searchParams.get("user") ? Number(searchParams.get("user")) : undefined,
    action: searchParams.get("action") || undefined,
    entityType: searchParams.get("entity") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: 10,
  });

  const updateUrl = useCallback((newFilters: AuditFilters) => {
    const params = new URLSearchParams();
    if (newFilters.q) params.set("q", newFilters.q);
    if (newFilters.userId) params.set("user", String(newFilters.userId));
    if (newFilters.action) params.set("action", newFilters.action);
    if (newFilters.entityType) params.set("entity", newFilters.entityType);
    if (newFilters.from) params.set("from", newFilters.from);
    if (newFilters.to) params.set("to", newFilters.to);
    if (newFilters.page && newFilters.page > 1) params.set("page", String(newFilters.page));
    
    const queryString = params.toString();
    router.push(queryString ? `/admin/audit?${queryString}` : "/admin/audit");
  }, [router]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [logsData, usersData] = await Promise.all([
        getAuditLogs(filters),
        Promise.resolve(getActiveUsers()),
      ]);
      setLogs(logsData.data);
      setTotal(logsData.total);
      setTotalPages(logsData.totalPages);
      setUsers(usersData);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (newFilters: AuditFilters) => {
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleClearFilters = () => {
    const cleared = { ...filters, q: undefined, userId: undefined, action: undefined, entityType: undefined, from: undefined, to: undefined, page: 1 };
    setFilters(cleared);
    updateUrl(cleared);
  };

  const handleExport = async () => {
    const csv = await exportAuditLogs(filters);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const currentPage = filters.page || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Nhật ký hoạt động</h1>
          <p className="text-text-muted mt-1">Theo dõi các thao tác trong hệ thống</p>
        </div>
      </div>

      <AuditFiltersComponent
        filters={filters}
        onChange={handleFilterChange}
        onClear={handleClearFilters}
        onExport={handleExport}
        users={users}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">
          Tổng: <strong>{total}</strong> bản ghi
        </p>
      </div>

      <AuditTable
        logs={logs}
        loading={loading}
        expandedId={expandedId}
        onExpand={setExpandedId}
      />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(currentPage - 1)}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 py-2 text-sm">
                Trang {currentPage} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(currentPage + 1)}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}