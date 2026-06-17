"use client";

import { PoolConfig } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PoolConfigPanelProps {
  config: PoolConfig;
  onUpdate: (config: Partial<PoolConfig>) => void;
  loading: boolean;
}

export function PoolConfigPanel({ config, onUpdate, loading }: PoolConfigPanelProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình Pool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình Pool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-text-dark">Bật chế độ tự nhận</Label>
            <p className="text-sm text-text-muted">Cho phép nhân viên tự nhận lead từ pool</p>
          </div>
          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => onUpdate({ enabled: checked })}
          />
        </div>
        <div>
          <Label className="text-text-dark">Giới hạn lead đang mở</Label>
          <p className="text-sm text-text-muted mb-2">Số lead tối đa mỗi nhân viên có thể nhận</p>
          <Input
            type="number"
            value={config.claimLimit}
            onChange={(e) => onUpdate({ claimLimit: parseInt(e.target.value) || 5 })}
            disabled={!config.enabled}
            className="w-32"
            min={1}
            max={20}
          />
        </div>
        {!config.enabled && (
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-700">
              Pool đang tắt. Lead vẫn hiển thị nhưng nhân viên không thể tự nhận.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}