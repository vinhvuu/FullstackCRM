"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { deals as allDeals, contacts } from "@/lib/mock-data";
import { getTimeline } from "@/lib/timeline";
import { Deal, DealLineItem, TimelineItem } from "@/types";
import { DEAL_STAGES, LOSS_REASONS } from "@/lib/constants";
import { isRotting } from "@/lib/deals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DealScore } from "@/components/deals/deal-score";
import { DealLineItemTable } from "@/components/deals/deal-line-item-table";
import { WonDialog } from "@/components/deals/won-dialog";
import { LostDialog } from "@/components/deals/lost-dialog";
import { DealRottingBadge } from "@/components/deals/deal-rotting-badge";
import { RecordTimeline } from "@/components/shared/record-timeline";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft, Building2, Calendar, Edit, Trash2,
  Phone, Mail, DollarSign, TrendingUp, Trophy, XCircle,
} from "lucide-react";
import Link from "next/link";

export default function DealDetailPage() {
  const params = useParams();
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id;
  const initialDeal = allDeals.find((d) => d.id === paramId) || null;

  const [deal, setDeal] = useState<Deal | null>(initialDeal);
  const [lineItems, setLineItems] = useState<DealLineItem[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [wonOpen, setWonOpen] = useState(false);
  const [lostOpen, setLostOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"timeline" | "products">("timeline");

  const contact = deal ? contacts.find((c) => c.id === deal.contactId) : null;

  useEffect(() => {
    if (paramId) setTimelineItems(getTimeline("deal", paramId));
  }, [paramId]);

  if (!deal) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-text-muted mb-4">Không tìm thấy deal</p>
        <Link href="/deals"><Button variant="outline">Quay lại</Button></Link>
      </div>
    );
  }

  const stageInfo = DEAL_STAGES.find((s) => s.id === deal.stage);
  const rotting = isRotting(deal);

  const handleMarkWon = () => {
    const updated = { ...deal, status: "won" as const, wonAt: new Date().toISOString().split("T")[0], stage: "won" as const, probability: 100 };
    setDeal(updated);
    setTimelineItems((prev) => [{
      id: `tl-won-${Date.now()}`,
      type: "system" as const,
      title: "Deal Won 🎉",
      content: "Deal đã được đánh dấu thắng",
      createdAt: new Date().toLocaleString("vi-VN"),
      createdBy: "Bạn",
    }, ...prev]);
  };

  const handleMarkLost = (data: { lossReason: string; competitor?: string; note?: string }) => {
    const reason = LOSS_REASONS.find((r) => r.id === data.lossReason)?.label || data.lossReason;
    const updated = { ...deal, status: "lost" as const, lostAt: new Date().toISOString().split("T")[0], stage: "lost" as const, probability: 0, lossReason: data.lossReason, competitor: data.competitor };
    setDeal(updated);
    setTimelineItems((prev) => [{
      id: `tl-lost-${Date.now()}`,
      type: "system" as const,
      title: "Deal Lost",
      content: `Lý do: ${reason}${data.competitor ? ` · Đối thủ: ${data.competitor}` : ""}${data.note ? `\n${data.note}` : ""}`,
      createdAt: new Date().toLocaleString("vi-VN"),
      createdBy: "Bạn",
    }, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/deals">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại Deals
          </Button>
        </Link>
        <div className="flex gap-2">
          {deal.status !== "won" && deal.status !== "lost" && (
            <>
              <Button variant="outline" className="gap-2 text-green-600 border-green-200 hover:bg-green-50" onClick={() => setWonOpen(true)}>
                <Trophy className="w-4 h-4" /> Won
              </Button>
              <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setLostOpen(true)}>
                <XCircle className="w-4 h-4" /> Lost
              </Button>
            </>
          )}
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" /> Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-2xl">{deal.title}</CardTitle>
                    {rotting && <DealRottingBadge />}
                    {deal.status === "won" && <Badge className="bg-green-100 text-green-700 border-0">Won ✓</Badge>}
                    {deal.status === "lost" && <Badge className="bg-red-100 text-red-700 border-0">Lost</Badge>}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <Badge style={{ backgroundColor: `${stageInfo?.color}20`, color: stageInfo?.color }} className="capitalize border-0">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: stageInfo?.color }} />
                      {deal.stage}
                    </Badge>
                    <DealScore score={deal.probability} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-primary whitespace-nowrap">{formatCurrency(deal.value)}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted">Ngày đóng dự kiến</p>
                  <p className="font-medium text-text-dark flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />{formatDate(deal.expectedCloseDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">Ngày tạo</p>
                  <p className="font-medium text-text-dark flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />{formatDate(deal.createdAt)}
                  </p>
                </div>
                {deal.lossReason && (
                  <div>
                    <p className="text-xs text-text-muted">Lý do thua</p>
                    <p className="font-medium text-red-600 mt-1">
                      {LOSS_REASONS.find((r) => r.id === deal.lossReason)?.label || deal.lossReason}
                      {deal.competitor && ` · ${deal.competitor}`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-1 border-b border-gray-100">
            {(["timeline", "products"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-text-muted hover:text-text-dark"
                }`}
              >
                {tab === "timeline" ? "Hoạt động" : "Sản phẩm"}
              </button>
            ))}
          </div>

          {activeTab === "timeline" ? (
            <Card>
              <CardContent className="pt-6">
                <RecordTimeline
                  recordType="deal"
                  recordId={deal.id}
                  items={timelineItems}
                  onItemsChange={setTimelineItems}
                />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader><CardTitle className="text-lg">Sản phẩm & Line items</CardTitle></CardHeader>
              <CardContent>
                <DealLineItemTable dealId={deal.id} items={lineItems} onChange={setLineItems} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-primary to-primary-hover border-0">
            <CardContent className="p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8" />
                <div>
                  <p className="text-white/60 text-sm">Giá trị deal</p>
                  <p className="text-2xl font-bold">{formatCurrency(deal.value)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-white/80 text-sm">
                  <span>Xác suất thắng</span>
                  <span>{deal.probability}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all" style={{ width: `${deal.probability}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          {contact && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Liên hệ chính</CardTitle></CardHeader>
              <CardContent>
                <Link href={`/contacts/${contact.id}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-semibold text-sm">
                    {contact.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-text-dark group-hover:text-indigo-600 truncate">{contact.name}</p>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {contact.company}
                    </p>
                  </div>
                </Link>
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" className="flex-1 gap-1"><Phone className="w-4 h-4" /> Gọi</Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-1"><Mail className="w-4 h-4" /> Email</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-lg">Pipeline Stage</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {DEAL_STAGES.map((stage) => (
                  <div key={stage.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${deal.stage === stage.id ? "bg-primary/10" : ""}`}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                    <span className={`text-sm font-medium ${deal.stage === stage.id ? "text-primary" : "text-text-dark"}`}>
                      {stage.label}
                    </span>
                    {deal.stage === stage.id && <TrendingUp className="w-4 h-4 text-primary ml-auto" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <WonDialog open={wonOpen} onOpenChange={setWonOpen} dealTitle={deal.title} onConfirm={handleMarkWon} />
      <LostDialog open={lostOpen} onOpenChange={setLostOpen} dealTitle={deal.title} onConfirm={handleMarkLost} />
    </div>
  );
}
