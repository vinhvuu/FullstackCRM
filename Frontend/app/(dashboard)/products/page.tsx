"use client";

import { useState, useMemo } from "react";
import { products as initialProducts } from "@/lib/mock-data";
import { Product } from "@/types";
import { PRODUCT_GROUPS, TAX_RATES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Search, Plus, MoreHorizontal, Package, Edit, Trash2 } from "lucide-react";

function ProductFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Product;
  onSubmit: (data: Omit<Product, "id" | "createdAt">) => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    code: initial?.code || "",
    group: initial?.group || "",
    unitPrice: initial?.unitPrice || 0,
    currency: initial?.currency || "VND",
    unit: initial?.unit || "",
    defaultTaxPct: initial?.defaultTaxPct || 10,
    description: initial?.description || "",
    isActive: initial?.isActive ?? true,
  });
  const [err, setErr] = useState("");

  const set = (k: string, v: string | number | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Tên sản phẩm là bắt buộc"); return; }
    if (!form.unitPrice || form.unitPrice <= 0) { setErr("Đơn giá phải > 0"); return; }
    setErr("");
    onSubmit(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {err && <p className="text-sm text-red-500">{err}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mã sản phẩm</label>
              <Input
                value={form.code}
                onChange={(e) => set("code", e.target.value)}
                placeholder="SW-001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nhóm sản phẩm</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={form.group}
                onChange={(e) => set("group", e.target.value)}
              >
                <option value="">Chọn nhóm</option>
                {PRODUCT_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tên sản phẩm *</label>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Tên sản phẩm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Đơn giá</label>
              <Input
                type="number"
                value={form.unitPrice}
                onChange={(e) => set("unitPrice", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Đơn vị</label>
              <Input
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
                placeholder="license/year"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tiền tệ</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
              >
                <option value="VND">VND</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Thuế mặc định (%)</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                value={form.defaultTaxPct}
                onChange={(e) => set("defaultTaxPct", Number(e.target.value))}
              >
                {TAX_RATES.map((t) => (
                  <option key={t.id} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mô tả</label>
            <Input
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Mô tả sản phẩm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm">Hoạt động</label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let list = products;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code?.toLowerCase().includes(q)
      );
    }
    if (groupFilter) {
      list = list.filter((p) => p.group === groupFilter);
    }
    if (statusFilter === "active") {
      list = list.filter((p) => p.isActive);
    } else if (statusFilter === "inactive") {
      list = list.filter((p) => !p.isActive);
    }
    return list;
  }, [products, search, groupFilter, statusFilter]);

  const handleAdd = (data: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...data,
      id: "p" + Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleEdit = (data: Omit<Product, "id" | "createdAt">) => {
    if (!editingProduct) return;
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...p, ...data } : p))
    );
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý danh mục sản phẩm</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <ProductFormDialog
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            onSubmit={handleAdd}
          />
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2"
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
            >
              <option value="">Tất cả nhóm</option>
              {PRODUCT_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngừng hoạt động</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="Chưa có sản phẩm"
              description="Thêm sản phẩm đầu tiên để bắt đầu"
            />
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Mã</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Tên sản phẩm</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Nhóm</th>
                    <th className="text-right px-4 py-3 font-medium text-text-muted">Đơn giá</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Đơn vị</th>
                    <th className="text-left px-4 py-3 font-medium text-text-muted">Trạng thái</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono">{product.code || "-"}</td>
                      <td className="px-4 py-3 font-medium">{product.name}</td>
                      <td className="px-4 py-3">{product.group || "-"}</td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(product.unitPrice)}
                      </td>
                      <td className="px-4 py-3">{product.unit || "-"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={product.isActive ? "default" : "outline"}>
                          {product.isActive ? "Hoạt động" : "Ngừng"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingProduct} onOpenChange={(v) => !v && setEditingProduct(null)}>
        <ProductFormDialog
          open={!!editingProduct}
          onOpenChange={(v) => !v && setEditingProduct(null)}
          initial={editingProduct || undefined}
          onSubmit={handleEdit}
        />
      </Dialog>
    </div>
  );
}