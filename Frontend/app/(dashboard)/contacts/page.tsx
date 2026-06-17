"use client";

import { useState, useMemo } from "react";
import { contacts as initialContacts, companies } from "@/lib/mock-data";
import { Contact } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CompanyPicker } from "@/components/companies/company-picker";
import { EmptyState } from "@/components/shared/empty-state";
import { Search, Plus, Phone, Mail, Building2, MoreHorizontal, User } from "lucide-react";
import Link from "next/link";

function ContactFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: Partial<Contact>;
  onSubmit: (data: Omit<Contact, "id">) => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    phone: initial?.phone || "",
    position: initial?.position || "",
    company: initial?.company || "",
    companyId: initial?.companyId || "",
  });
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setErr("Tên là bắt buộc"); return; }
    setErr("");
    onSubmit({
      ...form,
      createdAt: new Date().toISOString().split("T")[0],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initial?.id ? "Chỉnh sửa liên hệ" : "Thêm liên hệ mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="Nguyễn Văn A"
            />
            {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">Điện thoại</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                placeholder="0901234567"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Chức vụ</label>
            <input
              value={form.position}
              onChange={(e) => set("position", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
              placeholder="CEO, Manager..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">Công ty</label>
            <CompanyPicker
              value={form.companyId}
              onChange={(id) => {
                const c = companies.find((co) => co.id === id);
                setForm((f) => ({ ...f, companyId: id, company: c?.name || f.company }));
              }}
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              {initial?.id ? "Cập nhật" : "Thêm liên hệ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ContactsPage() {
  const [contactList, setContactList] = useState<Contact[]>(initialContacts);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | null>(null);

  const filtered = useMemo(
    () =>
      contactList.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.company.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      ),
    [contactList, search]
  );

  const handleAdd = (data: Omit<Contact, "id">) => {
    setContactList((prev) => [{ ...data, id: `ct-${Date.now()}` }, ...prev]);
  };

  const handleEdit = (data: Omit<Contact, "id">) => {
    if (!editContact) return;
    setContactList((prev) =>
      prev.map((c) => (c.id === editContact.id ? { ...c, ...data } : c))
    );
    setEditContact(null);
  };

  const handleDelete = (id: string) => {
    setContactList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text-dark">Liên hệ</h1>
          <p className="text-text-muted mt-1">{contactList.length} liên hệ</p>
        </div>
        <Button variant="cta" className="gap-2" onClick={() => setAddOpen(true)}>
          <Plus className="w-4 h-4" />
          Thêm liên hệ
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          placeholder="Tìm kiếm liên hệ..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<User className="w-12 h-12" />}
          title="Không có liên hệ nào"
          action={
            <Button onClick={() => setAddOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Thêm liên hệ
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Link href={`/contacts/${contact.id}`} className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white font-semibold">
                      {contact.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-dark group-hover:text-indigo-600 transition-colors">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-text-muted">{contact.position}</p>
                    </div>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditContact(contact)}>Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(contact.id)}
                      >
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Building2 className="w-4 h-4 flex-shrink-0" />
                    {contact.companyId ? (
                      <Link href={`/companies/${contact.companyId}`} className="hover:text-indigo-600 hover:underline truncate">
                        {contact.company}
                      </Link>
                    ) : (
                      <span className="truncate">{contact.company}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button variant="ghost" size="sm" className="flex-1 gap-1">
                    <Phone className="w-4 h-4" />
                    Gọi
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ContactFormDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleAdd} />

      {editContact && (
        <ContactFormDialog
          open={!!editContact}
          onOpenChange={(v) => { if (!v) setEditContact(null); }}
          initial={editContact}
          onSubmit={handleEdit}
        />
      )}
    </div>
  );
}
