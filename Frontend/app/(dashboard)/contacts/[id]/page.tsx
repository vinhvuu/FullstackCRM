"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { contacts, companies, deals, activities } from "@/lib/mock-data";
import { getTimeline } from "@/lib/timeline";
import { TimelineItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RecordTimeline } from "@/components/shared/record-timeline";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Calendar,
  Edit,
  Trash2,
  PhoneCall,
  FileText,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ContactDetailPage() {
  const params = useParams();
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id;

  const contact = contacts.find((c) => c.id === paramId);
  const company = contact?.companyId ? companies.find((co) => co.id === contact.companyId) : null;
  const contactDeals = deals.filter((d) => d.contactId === paramId);

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    if (paramId) {
      setTimelineItems(getTimeline("contact", paramId));
    }
  }, [paramId]);

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-text-muted mb-4">Không tìm thấy liên hệ</p>
        <Link href="/contacts">
          <Button variant="outline">Quay lại danh sách</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/contacts">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Danh sách liên hệ
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Button>
          <Button variant="ghost" className="gap-2 text-red-600 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            Xóa
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white text-2xl font-bold">
                  {contact.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <CardTitle className="text-2xl">{contact.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-text-muted">
                    <Building2 className="w-4 h-4" />
                    {company ? (
                      <Link
                        href={`/companies/${company.id}`}
                        className="hover:text-indigo-600 hover:underline font-medium flex items-center gap-1"
                      >
                        {contact.position} tại {contact.company}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span>{contact.position} tại {contact.company}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Email</p>
                  <p className="font-medium text-text-dark flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-text-muted">Điện thoại</p>
                  <p className="font-medium text-text-dark flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </p>
                </div>
                {contact.createdAt && (
                  <div className="space-y-1">
                    <p className="text-sm text-text-muted">Ngày tạo</p>
                    <p className="font-medium text-text-dark">{formatDate(contact.createdAt)}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch sử tương tác</CardTitle>
            </CardHeader>
            <CardContent>
              <RecordTimeline
                recordType="contact"
                recordId={contact.id}
                items={timelineItems}
                onItemsChange={setTimelineItems}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3">
                <Phone className="w-4 h-4 text-blue-500" />
                Gọi điện
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Mail className="w-4 h-4 text-green-500" />
                Gửi Email
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Calendar className="w-4 h-4 text-orange-500" />
                Đặt lịch họp
              </Button>
            </CardContent>
          </Card>

          {company && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Công ty</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/companies/${company.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {company.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-text-dark group-hover:text-indigo-600 truncate">
                      {company.name}
                    </p>
                    {company.industry && (
                      <p className="text-xs text-text-muted truncate">{company.industry}</p>
                    )}
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {contactDeals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deals liên quan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contactDeals.map((deal) => (
                    <Link
                      key={deal.id}
                      href={`/deals/${deal.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-text-dark group-hover:text-indigo-600 text-sm truncate">
                          {deal.title}
                        </p>
                        <p className="text-xs text-text-muted capitalize">{deal.stage}</p>
                      </div>
                      <p className="text-sm font-bold text-primary ml-2 flex-shrink-0">
                        {formatCurrency(deal.value)}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
