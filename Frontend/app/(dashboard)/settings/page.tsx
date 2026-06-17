"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Bell, Shield, Globe, Mail, Plus, Trash2, Edit, Check, X } from "lucide-react";
import { useI18n, Locale } from "@/lib/i18n";
import { emailTemplates as initialTemplates } from "@/lib/mock-data";
import { EmailTemplate } from "@/types";

function EmailTemplatesSection() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(initialTemplates);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<EmailTemplate>>({});
  const [adding, setAdding] = useState(false);
  const [newTpl, setNewTpl] = useState<Partial<EmailTemplate>>({ name: "", subject: "", body: "", isShared: false });

  const startEdit = (tpl: EmailTemplate) => {
    setEditingId(tpl.id);
    setEditDraft({ ...tpl });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setTemplates((prev) => prev.map((t) => t.id === editingId ? { ...t, ...editDraft } as EmailTemplate : t));
    setEditingId(null);
  };

  const cancelEdit = () => { setEditingId(null); setEditDraft({}); };

  const deleteTemplate = (id: string) => setTemplates((prev) => prev.filter((t) => t.id !== id));

  const addTemplate = () => {
    if (!newTpl.name?.trim() || !newTpl.subject?.trim()) return;
    const tpl: EmailTemplate = {
      id: `tpl-${Date.now()}`,
      name: newTpl.name!,
      subject: newTpl.subject!,
      body: newTpl.body || "",
      isShared: newTpl.isShared ?? false,
      ownerId: "u1",
    };
    setTemplates((prev) => [tpl, ...prev]);
    setAdding(false);
    setNewTpl({ name: "", subject: "", body: "", isShared: false });
  };

  const inputCls = "w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-500" />
              Template Email
            </CardTitle>
            <CardDescription>Quản lý template email cá nhân và dùng chung</CardDescription>
          </div>
          <Button size="sm" className="gap-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => setAdding(true)}>
            <Plus className="w-4 h-4" /> Thêm mới
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding && (
          <div className="border border-indigo-200 rounded-xl p-4 space-y-2 bg-indigo-50">
            <input value={newTpl.name} onChange={(e) => setNewTpl((d) => ({ ...d, name: e.target.value }))} placeholder="Tên template" className={inputCls} />
            <input value={newTpl.subject} onChange={(e) => setNewTpl((d) => ({ ...d, subject: e.target.value }))} placeholder="Tiêu đề (dùng {{contact.name}}, {{company.name}}...)" className={inputCls} />
            <textarea value={newTpl.body} onChange={(e) => setNewTpl((d) => ({ ...d, body: e.target.value }))} placeholder="Nội dung template..." rows={4} className={`${inputCls} resize-none`} />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="shared-new" checked={newTpl.isShared} onChange={(e) => setNewTpl((d) => ({ ...d, isShared: e.target.checked }))} className="rounded" />
              <label htmlFor="shared-new" className="text-sm text-text-dark">Dùng chung</label>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Hủy</Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={addTemplate}>Lưu</Button>
            </div>
          </div>
        )}

        {templates.length === 0 && !adding && (
          <p className="text-sm text-text-muted text-center py-6">Chưa có template nào</p>
        )}

        {templates.map((tpl) =>
          editingId === tpl.id ? (
            <div key={tpl.id} className="border border-indigo-200 rounded-xl p-4 space-y-2 bg-indigo-50">
              <input value={editDraft.name} onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Tên template" className={inputCls} />
              <input value={editDraft.subject} onChange={(e) => setEditDraft((d) => ({ ...d, subject: e.target.value }))} placeholder="Tiêu đề" className={inputCls} />
              <textarea value={editDraft.body} onChange={(e) => setEditDraft((d) => ({ ...d, body: e.target.value }))} rows={4} className={`${inputCls} resize-none`} />
              <div className="flex items-center gap-2">
                <input type="checkbox" id={`shared-${tpl.id}`} checked={editDraft.isShared} onChange={(e) => setEditDraft((d) => ({ ...d, isShared: e.target.checked }))} className="rounded" />
                <label htmlFor={`shared-${tpl.id}`} className="text-sm text-text-dark">Dùng chung</label>
              </div>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="w-4 h-4" /></Button>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={saveEdit}><Check className="w-4 h-4" /></Button>
              </div>
            </div>
          ) : (
            <div key={tpl.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 transition-all group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-text-dark">{tpl.name}</p>
                  {tpl.isShared && <Badge variant="default" className="text-xs py-0">Dùng chung</Badge>}
                </div>
                <p className="text-xs text-indigo-600 font-medium truncate">{tpl.subject}</p>
                <p className="text-xs text-text-muted mt-1 line-clamp-2">{tpl.body}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button type="button" onClick={() => startEdit(tpl)} className="p-1.5 rounded-lg hover:bg-gray-200 text-text-muted hover:text-indigo-600 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => deleteTemplate(tpl.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const [prefs, setPrefs] = useState({
    emailNotifs: true,
    pushNotifs: true,
    dailySummary: false,
    aiInsights: true,
  });
  const [emailSignature, setEmailSignature] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-poppins text-text-dark">{t("settings.title")}</h1>
        <p className="text-text-muted mt-1">{t("page.settings.description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                    HA
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-text-dark text-lg">Hoàng An</h3>
                <p className="text-text-muted text-sm">hoangan@company.com</p>
                <Badge variant="default" className="mt-2">
                  Admin
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start gap-3">
              <User className="w-4 h-4" />
              {t("settings.profile")}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Bell className="w-4 h-4" />
              {t("settings.notifications")}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Shield className="w-4 h-4" />
              {t("settings.password")}
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3">
              <Globe className="w-4 h-4" />
              {t("settings.language")}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.profile")}</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark">First Name</label>
                  <Input defaultValue="Hoàng" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark">Last Name</label>
                  <Input defaultValue="An" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">Email</label>
                <Input type="email" defaultValue="hoangan@company.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">Phone</label>
                <Input type="tel" defaultValue="0901234567" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">Position</label>
                <Input defaultValue="Sales Manager" />
              </div>
              <div className="flex justify-end">
                <Button variant="cta">{t("common.save")}</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.language")}</CardTitle>
              <CardDescription>
                Choose your preferred language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  variant={locale === "vi" ? "default" : "outline"}
                  onClick={() => setLocale("vi")}
                  className="gap-2"
                >
                  🇻🇳 Tiếng Việt
                </Button>
                <Button
                  variant={locale === "en" ? "default" : "outline"}
                  onClick={() => setLocale("en")}
                  className="gap-2"
                >
                  🇺🇸 English
                </Button>
              </div>
            </CardContent>
          </Card>

          <EmailTemplatesSection />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-500" />
                Chữ ký email
              </CardTitle>
              <CardDescription>Chữ ký tự động thêm vào cuối email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-dark">Nội dung chữ ký</label>
                <textarea
                  value={emailSignature}
                  onChange={(e) => setEmailSignature(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm resize-none"
                  placeholder="VD: Trân trọng,&#10;Hoàng An&#10;Sales Manager&#10;Email: hoangan@company.com&#10;Phone: 0901234567"
                />
              </div>
              {emailSignature && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs text-text-muted mb-1">Preview:</p>
                  <div className="text-sm text-text-dark whitespace-pre-wrap">{emailSignature}</div>
                </div>
              )}
              <div className="flex justify-end">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 1500); }}>
                  {saved ? "Đã lưu!" : "Lưu chữ ký"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.notifications")}</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50">
                <div>
                  <p className="font-medium text-text-dark">Email Notifications</p>
                  <p className="text-sm text-text-muted">
                    Receive email updates about new leads and deals
                  </p>
                </div>
                <Badge variant={prefs.emailNotifs ? "success" : "default"}>
                  {prefs.emailNotifs ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50">
                <div>
                  <p className="font-medium text-text-dark">Push Notifications</p>
                  <p className="text-sm text-text-muted">
                    Receive push notifications for important updates
                  </p>
                </div>
                <Badge variant={prefs.pushNotifs ? "success" : "default"}>
                  {prefs.pushNotifs ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50">
                <div>
                  <p className="font-medium text-text-dark">Daily Summary</p>
                  <p className="text-sm text-text-muted">
                    Get a daily summary of your sales activities
                  </p>
                </div>
                <Badge variant={prefs.dailySummary ? "success" : "default"}>
                  {prefs.dailySummary ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
