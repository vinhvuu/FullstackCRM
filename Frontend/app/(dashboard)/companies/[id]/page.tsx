"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  companies as initialCompanies,
  contacts as allContacts,
  deals as allDeals,
  getCompanyStats,
} from "@/lib/mock-data";
import { getTimeline } from "@/lib/timeline";
import { Company, Contact, Deal, TimelineItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecordTimeline } from "@/components/shared/record-timeline";
import { RelatedListPanel } from "@/components/shared/related-list-panel";
import { CompanyFormDialog } from "@/components/companies/company-form-dialog";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  MapPin,
  Users,
  TrendingUp,
  Edit,
  Mail,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

export default function CompanyDetailPage() {
  const params = useParams();
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id;

  const found = initialCompanies.find((c) => c.id === paramId);
  const stats = found ? getCompanyStats(found.id) : null;
  const initial = found ? { ...found, ...stats } : null;

  const [company, setCompany] = useState<Company | null>(initial);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [editOpen, setEditOpen] = useState(false);

  const contacts = allContacts.filter((c) => c.companyId === paramId);
  const deals = allDeals.filter((d) => (d as any).companyId === paramId);

  useEffect(() => {
    if (paramId) {
      setTimelineItems(getTimeline("company", paramId));
    }
  }, [paramId]);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-text-muted mb-4">Không tìm thấy công ty</p>
        <Link href="/companies">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/companies">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Danh sách công ty
          </Button>
        </Link>
        <Button variant="outline" className="gap-2" onClick={() => setEditOpen(true)}>
          <Edit className="w-4 h-4" />
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {company.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-text-dark">{company.name}</h1>
                  {company.industry && (
                    <p className="text-text-muted mt-1">{company.industry}</p>
                  )}
                  {company.description && (
                    <p className="text-sm text-text-muted mt-2">{company.description}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                {company.website && (
                  <div>
                    <p className="text-xs text-text-muted mb-1">Website</p>
                    <p className="text-sm font-medium text-text-dark flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-600">
                        {company.website}
                      </a>
                    </p>
                  </div>
                )}
                {company.phone && (
                  <div>
                    <p className="text-xs text-text-muted mb-1">Điện thoại</p>
                    <p className="text-sm font-medium text-text-dark flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-500" />
                      {company.phone}
                    </p>
                  </div>
                )}
                {company.size && (
                  <div>
                    <p className="text-xs text-text-muted mb-1">Quy mô</p>
                    <p className="text-sm font-medium text-text-dark flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500" />
                      {company.size} nhân viên
                    </p>
                  </div>
                )}
                {company.address && (
                  <div>
                    <p className="text-xs text-text-muted mb-1">Địa chỉ</p>
                    <p className="text-sm font-medium text-text-dark flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      {company.address}
                    </p>
                  </div>
                )}
                {company.taxCode && (
                  <div>
                    <p className="text-xs text-text-muted mb-1">Mã số thuế</p>
                    <p className="text-sm font-medium text-text-dark">{company.taxCode}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-text-muted mb-1">Ngày tạo</p>
                  <p className="text-sm font-medium text-text-dark">{formatDate(company.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch sử hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <RecordTimeline
                recordType="company"
                recordId={company.id}
                items={timelineItems}
                onItemsChange={setTimelineItems}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-text-muted mb-1">Liên hệ</p>
                <p className="text-2xl font-bold text-indigo-600">{contacts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-text-muted mb-1">Deals</p>
                <p className="text-2xl font-bold text-green-600">{deals.length}</p>
              </CardContent>
            </Card>
          </div>

          <RelatedListPanel
            title="Liên hệ"
            count={contacts.length}
            onAdd={() => {}}
            addLabel="Thêm liên hệ"
          >
            {contacts.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">Chưa có liên hệ</p>
            ) : (
              <div className="space-y-2">
                {contacts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contacts/${c.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-semibold flex-shrink-0">
                      {c.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-dark group-hover:text-indigo-600 truncate">
                        {c.name}
                      </p>
                      <p className="text-xs text-text-muted truncate">{c.position}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </RelatedListPanel>

          <RelatedListPanel
            title="Deals"
            count={deals.length}
          >
            {deals.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">Chưa có deal</p>
            ) : (
              <div className="space-y-2">
                {deals.map((d) => (
                  <Link
                    key={d.id}
                    href={`/deals/${d.id}`}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-dark group-hover:text-indigo-600 truncate">
                        {d.title}
                      </p>
                      <p className="text-xs text-text-muted">{d.stage}</p>
                    </div>
                    <p className="text-xs font-semibold text-green-600 flex-shrink-0 ml-2">
                      {formatCurrency(d.value)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </RelatedListPanel>
        </div>
      </div>

      {editOpen && (
        <CompanyFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          initial={company}
          onSubmit={(data) => setCompany({ ...company, ...data })}
        />
      )}
    </div>
  );
}
