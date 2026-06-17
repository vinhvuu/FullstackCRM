"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { quotes as initialQuotes, quoteLineItems as initialQuoteLineItems, deals, companies, contacts, products as allProducts } from "@/lib/mock-data";
import { Product, Quote, QuoteLineItem, QuoteStatus } from "@/types";
import { QUOTE_STATUS, TAX_RATES } from "@/lib/constants";
import { computeQuoteTotals, nextQuoteNumber } from "@/lib/quotes";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Printer, Send, Check, X, ArrowLeft } from "lucide-react";

function QuoteLineItemRow({
  item,
  onChange,
  onRemove,
  products,
}: {
  item: QuoteLineItem;
  onChange: (item: QuoteLineItem) => void;
  onRemove: () => void;
  products: Product[];
}) {
  const handleProductSelect = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      onChange({
        ...item,
        productId: product.id,
        name: product.name,
        unitPrice: product.unitPrice,
        taxPct: product.defaultTaxPct || 10,
        total: item.qty * product.unitPrice * (1 - item.discountPct / 100),
      });
    }
  };

  const updateField = (field: keyof QuoteLineItem, value: string | number) => {
    const updated = { ...item, [field]: value };
    if (field === "qty" || field === "unitPrice" || field === "discountPct" || field === "taxPct") {
      updated.total = updated.qty * updated.unitPrice * (1 - updated.discountPct / 100) * (1 + updated.taxPct / 100);
    }
    onChange(updated);
  };

  return (
    <tr className="border-t border-gray-100">
      <td className="px-2 py-2">
        <select
          className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
          value={item.productId || ""}
          onChange={(e) => handleProductSelect(e.target.value)}
        >
          <option value="">Chọn sản phẩm...</option>
          {products.filter(p => p.isActive).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <Input
          value={item.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Tên sản phẩm..."
          className="mt-1 h-8 text-sm"
        />
      </td>
      <td className="px-2 py-2 w-20">
        <Input
          type="number"
          min={1}
          value={item.qty}
          onChange={(e) => updateField("qty", Number(e.target.value))}
          className="h-9 text-right"
        />
      </td>
      <td className="px-2 py-2 w-28">
        <Input
          type="number"
          min={0}
          value={item.unitPrice}
          onChange={(e) => updateField("unitPrice", Number(e.target.value))}
          className="h-9 text-right"
        />
      </td>
      <td className="px-2 py-2 w-20">
        <Input
          type="number"
          min={0}
          max={100}
          value={item.discountPct}
          onChange={(e) => updateField("discountPct", Number(e.target.value))}
          className="h-9 text-right"
        />
      </td>
      <td className="px-2 py-2 w-20">
        <Select
          value={String(item.taxPct)}
          onValueChange={(v) => updateField("taxPct", Number(v))}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TAX_RATES.map((t) => (
              <SelectItem key={t.id} value={String(t.value)}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="px-2 py-2 text-right font-medium w-32">
        {formatCurrency(item.total)}
      </td>
      <td className="px-2 py-2 w-10">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

export default function QuoteBuilderPage() {
  const router = useRouter();
  const params = useParams();
  const paramId = Array.isArray(params.id) ? params.id[0] : params.id;
  const quoteId = paramId || "new";

  const isNew = quoteId === "new";
  const existingQuote = !isNew ? initialQuotes.find((q) => q.id === quoteId) : null;
  const existingLineItems = !isNew ? initialQuoteLineItems.filter((li) => li.quoteId === quoteId) : [];

  const [quote, setQuote] = useState<Partial<Quote>>(
    existingQuote || {
      number: nextQuoteNumber(),
      title: "",
      status: "draft",
      currency: "VND",
      subtotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      total: 0,
      terms: "",
      createdAt: new Date().toISOString().split("T")[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }
  );

  const [lineItems, setLineItems] = useState<QuoteLineItem[]>(existingLineItems);

  const totals = useMemo(() => computeQuoteTotals(lineItems), [lineItems]);

  const handleAddLineItem = () => {
    const newItem: QuoteLineItem = {
      id: `qli-${Date.now()}`,
      quoteId: quoteId !== "new" ? quoteId : "",
      productId: "",
      name: "",
      qty: 1,
      unitPrice: 0,
      discountPct: 0,
      taxPct: 10,
      total: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, item: QuoteLineItem) => {
    setLineItems(lineItems.map((li) => (li.id === id ? item : li)));
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((li) => li.id !== id));
  };

  const updateQuoteStatus = (status: QuoteStatus) => {
    setQuote({ ...quote, status });
  };

  const getCompanyName = (companyId?: string) => {
    if (!companyId) return "";
    const company = companies.find((c) => c.id === companyId);
    return company?.name || "";
  };

  const getContactName = (contactId?: string) => {
    if (!contactId) return "";
    const contact = contacts.find((c) => c.id === contactId);
    return contact?.name || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {isNew ? "Tạo báo giá mới" : `Báo giá ${quote.number}`}
              </h1>
              <Badge variant={quote.status === "draft" ? "outline" : quote.status === "sent" ? "info" : quote.status === "accepted" ? "success" : "error"}>
                {QUOTE_STATUS.find((s) => s.id === quote.status)?.label || quote.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {quote.companyId ? getCompanyName(quote.companyId) : "Khách hàng mới"} — {quote.contactId ? getContactName(quote.contactId) : "Chưa chọn liên hệ"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {quote.status === "draft" && (
            <>
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                In / PDF
              </Button>
              <Button onClick={() => updateQuoteStatus("sent")}>
                <Send className="mr-2 h-4 w-4" />
                Gửi báo giá
              </Button>
            </>
          )}
          {quote.status === "sent" && (
            <>
              <Button variant="outline" className="text-green-600" onClick={() => updateQuoteStatus("accepted")}>
                <Check className="mr-2 h-4 w-4" />
                Chấp nhận
              </Button>
              <Button variant="outline" className="text-red-600" onClick={() => updateQuoteStatus("rejected")}>
                <X className="mr-2 h-4 w-4" />
                Từ chối
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin báo giá</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tiêu đề báo giá</Label>
                  <Input
                    value={quote.title}
                    onChange={(e) => setQuote({ ...quote, title: e.target.value })}
                    placeholder="Báo giá..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Số báo giá</Label>
                  <Input value={quote.number} disabled />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Khách hàng (Công ty)</Label>
                  <Select
                    value={quote.companyId || ""}
                    onValueChange={(v) => setQuote({ ...quote, companyId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn công ty" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Liên hệ</Label>
                  <Select
                    value={quote.contactId || ""}
                    onValueChange={(v) => setQuote({ ...quote, contactId: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn liên hệ" />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.filter(c => c.companyId === quote.companyId).map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Hết hạn</Label>
                  <Input
                    type="date"
                    value={quote.validUntil}
                    onChange={(e) => setQuote({ ...quote, validUntil: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <Button variant="outline" size="sm" onClick={handleAddLineItem}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm dòng
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-muted-foreground">
                      <th className="text-left px-3 py-2 font-medium">Sản phẩm</th>
                      <th className="text-right px-3 py-2 font-medium w-20">SL</th>
                      <th className="text-right px-3 py-2 font-medium w-28">Đơn giá</th>
                      <th className="text-right px-3 py-2 font-medium w-20">CK%</th>
                      <th className="text-right px-3 py-2 font-medium w-20">Thuế</th>
                      <th className="text-right px-3 py-2 font-medium w-32">Thành tiền</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <QuoteLineItemRow
                        key={item.id}
                        item={item}
                        onChange={(updated) => updateLineItem(item.id, updated)}
                        onRemove={() => removeLineItem(item.id)}
                        products={allProducts}
                      />
                    ))}
                    {lineItems.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                          Chưa có sản phẩm. Nhấn "Thêm dòng" để bắt đầu.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {lineItems.length > 0 && (
                <div className="mt-4 space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Chiết khấu</span>
                    <span>-{formatCurrency(totals.discountTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Thuế</span>
                    <span>{formatCurrency(totals.taxTotal)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Tổng cộng</span>
                    <span className="text-primary">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Điều khoản & Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={quote.terms}
                onChange={(e) => setQuote({ ...quote, terms: e.target.value })}
                placeholder="Điều khoản thanh toán, bảo hành, v.v..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trạng thái</span>
                <Badge variant={quote.status === "accepted" ? "success" : "outline"}>
                  {QUOTE_STATUS.find((s) => s.id === quote.status)?.label}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ngày tạo</span>
                <span>{quote.createdAt ? formatDate(quote.createdAt) : "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ngày gửi</span>
                <span>{quote.sentAt ? formatDate(quote.sentAt) : "-"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ngày quyết định</span>
                <span>{quote.decidedAt ? formatDate(quote.decidedAt) : "-"}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold">
                  <span>Tổng giá trị</span>
                  <span className="text-primary text-lg">{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="print:hidden">
            <CardHeader>
              <CardTitle>Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                In báo giá
              </Button>
              {quote.status === "draft" && (
                <Button className="w-full justify-start" onClick={() => updateQuoteStatus("sent")}>
                  <Send className="mr-2 h-4 w-4" />
                  Gửi báo giá
                </Button>
              )}
              {quote.status === "sent" && (
                <>
                  <Button className="w-full justify-start text-green-600" onClick={() => updateQuoteStatus("accepted")}>
                    <Check className="mr-2 h-4 w-4" />
                    Đánh dấu chấp nhận
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600" onClick={() => updateQuoteStatus("rejected")}>
                    <X className="mr-2 h-4 w-4" />
                    Đánh dấu từ chối
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}