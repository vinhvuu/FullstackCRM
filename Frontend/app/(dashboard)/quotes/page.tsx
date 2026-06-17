"use client";

import { useState, useMemo } from "react";
import { quotes as initialQuotes, quoteLineItems as initialQuoteLineItems, companies, contacts } from "@/lib/mock-data";
import { Quote, QuoteStatus } from "@/types";
import { QUOTE_STATUS } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Search, Plus, FileText, Eye, Send, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<QuoteStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  draft: { icon: FileText, color: "bg-gray-100 text-gray-600", label: "Nháp" },
  sent: { icon: Send, color: "bg-blue-100 text-blue-600", label: "Đã gửi" },
  accepted: { icon: CheckCircle, color: "bg-green-100 text-green-600", label: "Chấp nhận" },
  rejected: { icon: XCircle, color: "bg-red-100 text-red-600", label: "Từ chối" },
  expired: { icon: Clock, color: "bg-yellow-100 text-yellow-600", label: "Hết hạn" },
};

export default function QuotesPage() {
  const [quotes] = useState<Quote[]>(initialQuotes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");

  const filteredQuotes = useMemo(() => {
    let list = quotes;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (quote) =>
          quote.title.toLowerCase().includes(q) ||
          quote.number.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((quote) => quote.status === statusFilter);
    }
    return list;
  }, [quotes, search, statusFilter]);

  const getCompanyName = (companyId?: string) => {
    if (!companyId) return "-";
    const company = companies.find((c) => c.id === companyId);
    return company?.name || "-";
  };

  const getContactName = (contactId?: string) => {
    if (!contactId) return "-";
    const contact = contacts.find((c) => c.id === contactId);
    return contact?.name || "-";
  };

  const getStatusBadge = (status: QuoteStatus) => {
    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Báo giá</h1>
          <p className="text-muted-foreground">Quản lý báo giá và quotes</p>
        </div>
        <Link href="/quotes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo báo giá
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm báo giá..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Tất cả trạng thái</option>
              {QUOTE_STATUS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredQuotes.length === 0 ? (
            <EmptyState
              title="Chưa có báo giá"
              description="Tạo báo giá đầu tiên để bắt đầu"
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Số BG</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Tiêu đề</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Khách hàng</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Liên hệ</th>
                    <th className="text-right px-4 py-3 font-medium text-text-muted">Giá trị</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Trạng thái</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Hiệu lực</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono">{quote.number}</td>
                      <td className="px-4 py-3 font-medium">{quote.title}</td>
                      <td className="px-4 py-3">{getCompanyName(quote.companyId)}</td>
                      <td className="px-4 py-3">{getContactName(quote.contactId)}</td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(quote.total)}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(quote.status)}</td>
                      <td className="px-4 py-3">
                        {quote.validUntil ? formatDate(quote.validUntil) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/quotes/${quote.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}