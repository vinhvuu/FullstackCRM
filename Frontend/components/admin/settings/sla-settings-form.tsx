"use client";

import { useState, useEffect } from "react";
import { AdminSlaSettings } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getAdminSlaSettings, updateAdminSlaSettings } from "@/lib/admin/admin-data";
import { Save, AlertCircle, Info } from "lucide-react";

interface SlaSettingsFormProps {
  isDirty: boolean;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: () => void;
}

export function SlaSettingsForm({ isDirty, onDirtyChange, onSaved }: SlaSettingsFormProps) {
  const [settings, setSettings] = useState<AdminSlaSettings | null>(null);
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
      const data = await getAdminSlaSettings();
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
      await updateAdminSlaSettings(settings);
      onSaved();
    } catch (e) {
      setError("Lỗi khi lưu cấu hình");
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof AdminSlaSettings>(field: K, value: AdminSlaSettings[K]) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>SLA & Pool</CardTitle></CardHeader>
        <CardContent><div className="h-40 bg-gray-100 animate-pulse rounded" /></CardContent>
      </Card>
    );
  }

  if (!settings) return null;

  const canSave = isDirty && 
    settings.unassignedAlertHours > 0 &&
    settings.reminderLeadTimeHours > 0 &&
    settings.dormantLeadDays > 0 &&
    settings.poolClaimLimit > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>SLA & Pool</CardTitle>
        <CardDescription>Cấu hình thời gian và pool lead</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Cấu hình SLA</p>
              <p>Các thiết lập này ảnh hưởng đến cảnh báo và theo dõi lead</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="unassignedAlert">Cảnh báo lead chưa gán (giờ)</Label>
          <Input
            id="unassignedAlert"
            type="number"
            value={settings.unassignedAlertHours}
            onChange={(e) => updateField("unassignedAlertHours", parseInt(e.target.value) || 24)}
            min={1}
          />
          <p className="text-sm text-text-muted">Sau bao nhiêu giờ chưa gán sẽ cảnh báo</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reminderTime">Reminder mặc định (giờ)</Label>
          <Input
            id="reminderTime"
            type="number"
            value={settings.reminderLeadTimeHours}
            onChange={(e) => updateField("reminderLeadTimeHours", parseInt(e.target.value) || 48)}
            min={1}
          />
          <p className="text-sm text-text-muted">Thời gian mặc định để nhắc follow-up</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dormantDays">Lead ngủ đông (ngày)</Label>
          <Input
            id="dormantDays"
            type="number"
            value={settings.dormantLeadDays}
            onChange={(e) => updateField("dormantLeadDays", parseInt(e.target.value) || 7)}
            min={1}
          />
          <p className="text-sm text-text-muted">Sau bao nhiêu ngày không hoạt động thì coi là ngủ đông</p>
        </div>

        <div className="border-t pt-6">
          <h4 className="font-medium mb-4">Cấu hình Pool</h4>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label>Bật chế độ Pool</Label>
              <p className="text-sm text-text-muted">Cho phép nhân viên tự nhận lead từ pool</p>
            </div>
            <Switch
              checked={settings.poolEnabled}
              onCheckedChange={(checked) => updateField("poolEnabled", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="claimLimit">Giới hạn lead mỗi người</Label>
            <Input
              id="claimLimit"
              type="number"
              value={settings.poolClaimLimit}
              onChange={(e) => updateField("poolClaimLimit", parseInt(e.target.value) || 5)}
              min={1}
              max={20}
              disabled={!settings.poolEnabled}
            />
            <p className="text-sm text-text-muted">Số lead tối đa mỗi nhân viên có thể nhận từ pool</p>
          </div>
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