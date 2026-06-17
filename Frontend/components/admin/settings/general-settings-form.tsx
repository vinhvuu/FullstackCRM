"use client";

import { useState, useEffect } from "react";
import { AdminGeneralSettings, UserRole } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getAdminGeneralSettings, updateAdminGeneralSettings } from "@/lib/admin/admin-data";
import { Save, AlertCircle } from "lucide-react";

interface GeneralSettingsFormProps {
  isDirty: boolean;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: () => void;
}

export function GeneralSettingsForm({ isDirty, onDirtyChange, onSaved }: GeneralSettingsFormProps) {
  const [settings, setSettings] = useState<AdminGeneralSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originalSettings = JSON.stringify(settings);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    onDirtyChange(JSON.stringify(settings) !== originalSettings);
  }, [settings, originalSettings]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdminGeneralSettings();
      setSettings(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    setError(null);
    setSaving(true);
    try {
      await updateAdminGeneralSettings(settings);
      onSaved();
    } catch (e) {
      setError("Lỗi khi lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof AdminGeneralSettings>(field: K, value: AdminGeneralSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Cấu hình chung</CardTitle></CardHeader>
        <CardContent><div className="h-40 bg-gray-100 animate-pulse rounded" /></CardContent>
      </Card>
    );
  }

  if (!settings) return null;

  const canSave = isDirty && settings.systemName.trim() && settings.invitationTtlHours >= 1 && settings.invitationTtlHours <= 720;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình chung</CardTitle>
        <CardDescription>Các thiết lập hệ thống cơ bản</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="systemName">Tên hệ thống</Label>
          <Input
            id="systemName"
            value={settings.systemName}
            onChange={(e) => updateField("systemName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timezone">Múi giờ</Label>
          <select
            id="timezone"
            value={settings.timezone}
            onChange={(e) => updateField("timezone", e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300"
          >
            <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
            <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
            <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultRole">Vai trò mặc định</Label>
          <select
            id="defaultRole"
            value={settings.defaultRole}
            onChange={(e) => updateField("defaultRole", e.target.value as UserRole)}
            className="w-full px-3 py-2 rounded-md border border-gray-300"
          >
            <option value="user">Nhân viên</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label>Cho phép tự đăng ký</Label>
            <p className="text-sm text-text-muted">Cho phép người dùng tự tạo tài khoản</p>
          </div>
          <Switch
            checked={settings.allowSelfRegistration}
            onCheckedChange={(checked) => updateField("allowSelfRegistration", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invitationTtl">Thời hạn lời mời (giờ)</Label>
          <Input
            id="invitationTtl"
            type="number"
            value={settings.invitationTtlHours}
            onChange={(e) => updateField("invitationTtlHours", parseInt(e.target.value) || 72)}
            min={1}
            max={720}
          />
          <p className="text-sm text-text-muted">Lời mời sẽ hết hạn sau số giờ này (1-720)</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <Button onClick={handleSave} disabled={!canSave || saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </CardContent>
    </Card>
  );
}