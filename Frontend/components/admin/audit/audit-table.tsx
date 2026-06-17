"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuditLog } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import {
  getAuditLogs,
  exportAuditLogs,
  getActiveUsers,
  AuditFilters,
} from "@/lib/admin/admin-data";
import { User } from "@/types";
import { Search, Download, X, Calendar, AlertCircle } from "lucide-react";

interface AuditFiltersProps {
  filters: AuditFilters;
  onChange: (filters: AuditFilters) => void;
  onClear: () => void;
  onExport: () => void;
  users: User[];
}

const ACTION_OPTIONS = [
  { value: "", label: "Tất cả hành động" },
  { value: "create", label: "Tạo mới" },
  { value: "update", label: "Cập nhật" },
  { value: "delete", label: "Xóa" },
  { value: "assign", label: "Gán" },
  { value: "convert", label: "Chuyển đổi" },
  { value: "auto_assign", label: "Gán tự động" },
];

const ENTITY_OPTIONS = [
  { value: "", label: "Tất cả đối tượng" },
  { value: "lead", label: "Lead" },
  { value: "deal", label: "Deal" },
  { value: "contact", label: "Contact" },
  { value: "user", label: "User" },
  { value: "distribution_rule", label: "Luật chia lead" },
  { value: "tag", label: "Tag" },
];

export function AuditFiltersComponent({
  filters,
  onChange,
  onClear,
  onExport,
  users,
}: AuditFiltersProps) {
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    if (searchDebounce) clearTimeout(searchDebounce);
    const timeout = setTimeout(() => {
      onChange({ ...filters, q: value, page: 1 });
    }, 300);
    setSearchDebounce(timeout);
  };

  const handleFromChange = (value: string) => {
    const newFilters = { ...filters, from: value, page: 1 };
    if (value && filters.to && value > filters.to) {
      // Invalid - will be handled in parent
    }
    onChange(newFilters);
  };

  const handleToChange = (value: string) => {
    onChange({ ...filters, to: value, page: 1 });
  };

  const hasFilters = filters.q || filters.userId || filters.action || filters.entityType || filters.from || filters.to;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input
              placeholder="Tìm kiếm..."
              defaultValue={filters.q}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={filters.userId || ""}
            onChange={(e) => onChange({ ...filters, userId: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm"
          >
            <option value="">Tất cả người dùng</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
          <select
            value={filters.action || ""}
            onChange={(e) => onChange({ ...filters, action: e.target.value || undefined, page: 1 })}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm"
          >
            {ACTION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            value={filters.entityType || ""}
            onChange={(e) => onChange({ ...filters, entityType: e.target.value || undefined, page: 1 })}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm"
          >
            {ENTITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={filters.from || ""}
              onChange={(e) => handleFromChange(e.target.value)}
              className="w-36"
            />
            <span className="text-text-muted">-</span>
            <Input
              type="date"
              value={filters.to || ""}
              onChange={(e) => handleToChange(e.target.value)}
              className="w-36"
            />
          </div>
          {hasFilters && (
            <Button variant="ghost" onClick={onClear}>
              <X className="w-4 h-4 mr-1" />
              Xóa
            </Button>
          )}
          <Button onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Xuất CSV
          </Button>
        </div>
        {filters.from && filters.to && filters.from > filters.to && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            Ngày bắt đầu phải nhỏ hơn ngày kết thúc
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AuditTableProps {
  logs: AuditLog[];
  loading: boolean;
  expandedId: number | null;
  onExpand: (id: number) => void;
}

const ACTION_LABELS: Record<string, { label: string; variant: "default" | "success" | "warning" | "error" | "outline" }> = {
  create: { label: "Tạo mới", variant: "success" },
  update: { label: "Cập nhật", variant: "default" },
  delete: { label: "Xóa", variant: "error" },
  assign: { label: "Gán", variant: "outline" },
  convert: { label: "Chuyển đổi", variant: "success" },
  auto_assign: { label: "Gán tự động", variant: "warning" },
};

export function AuditTable({ logs, loading, expandedId, onExpand }: AuditTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Không tìm thấy nhật ký phù hợp</p>
        <p className="text-sm mt-1">Thử thay đổi bộ lọc</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted w-12"></th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Thời gian</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Người thực hiện</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Hành động</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Đối tượng</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Tóm tắt</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {logs.map((log) => (
            <>
              <tr
                key={log.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onExpand(expandedId === log.id ? -1 : log.id)}
              >
                <td className="px-4 py-3">
                  <span className="text-text-muted">{expandedId === log.id ? "▼" : "▶"}</span>
                </td>
                <td className="px-4 py-3 text-sm text-text-dark">
                  {new Date(log.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs text-primary font-medium">
                        {log.userName?.charAt(0) || "H"}
                      </span>
                    </div>
                    <span className="text-sm text-text-dark">{log.userName || "Hệ thống"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={ACTION_LABELS[log.action]?.variant || "secondary"}>
                    {ACTION_LABELS[log.action]?.label || log.action}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-text-dark capitalize">{log.entityType}</td>
                <td className="px-4 py-3 text-sm text-text-muted truncate max-w-xs">
                  {log.entityId ? `#${log.entityId}` : "-"}
                </td>
              </tr>
              {expandedId === log.id && (
                <tr key={`${log.id}-detail`}>
                  <td colSpan={6} className="bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-text-dark mb-2">Trước</p>
                        <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-40">
                          {JSON.stringify(log.details?.before || {}, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <p className="font-medium text-text-dark mb-2">Sau</p>
                        <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-40">
                          {JSON.stringify(log.details?.after || {}, null, 2)}
                        </pre>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-text-muted">IP: {log.ipAddress || "N/A"}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}