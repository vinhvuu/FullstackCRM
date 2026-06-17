"use client";

import { useState, useEffect } from "react";
import { LeadSource } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getLeadSources, saveLeadSource, deleteLeadSource, reorderLeadSources } from "@/lib/admin/admin-data";
import { Plus, GripVertical, Edit, Trash2, Save } from "lucide-react";

export function LeadSourceSettings() {
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<LeadSource | null>(null);
  const [formData, setFormData] = useState({ name: "", isActive: true });

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = async () => {
    setLoading(true);
    try {
      const data = await getLeadSources();
      setSources(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (source?: LeadSource) => {
    if (source) {
      setEditingSource(source);
      setFormData({ name: source.name, isActive: source.isActive });
    } else {
      setEditingSource(null);
      setFormData({ name: "", isActive: true });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;
    
    const id = editingSource?.id || `source_${Date.now()}`;
    await saveLeadSource({ id, name: formData.name.trim(), isActive: formData.isActive });
    setDialogOpen(false);
    await loadSources();
  };

  const handleToggle = async (source: LeadSource) => {
    await saveLeadSource({ id: source.id, name: source.name, isActive: !source.isActive });
    await loadSources();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa nguồn này?")) {
      await deleteLeadSource(id);
      await loadSources();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Nguồn lead</CardTitle></CardHeader>
        <CardContent><div className="h-40 bg-gray-100 animate-pulse rounded" /></CardContent>
      </Card>
    );
  }

  const activeSources = sources.filter((s) => s.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nguồn lead</CardTitle>
        <CardDescription>Quản lý các nguồn lead của hệ thống</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {sources.length === 0 ? (
            <p className="text-center text-text-muted py-4">Chưa có nguồn nào</p>
          ) : (
            sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-text-muted cursor-grab" />
                  <span className="font-medium text-text-dark">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={source.isActive} onCheckedChange={() => handleToggle(source)} />
                  <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(source)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(source.id)} className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm nguồn
        </Button>

        {activeSources.length === 0 && sources.length > 0 && (
          <p className="text-sm text-orange-600">Không có nguồn nào đang active</p>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSource ? "Sửa nguồn" : "Thêm nguồn"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tên nguồn</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên nguồn"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <span className="text-sm">Đang hoạt động</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleSave} disabled={!formData.name.trim()}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}