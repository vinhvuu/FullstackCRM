"use client";

import { useState, useEffect } from "react";
import { TagConfig } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { getTagConfigs, saveTagConfig, deleteTagConfig } from "@/lib/admin/admin-data";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

export function TagSettings() {
  const [tags, setTags] = useState<TagConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagConfig | null>(null);
  const [formData, setFormData] = useState({ id: "", label: "", color: "#6B7280", bgColor: "#F3F4F6" });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await getTagConfigs();
      setTags(data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tag?: TagConfig) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ id: tag.id, label: tag.label, color: tag.color, bgColor: tag.bgColor });
    } else {
      setEditingTag(null);
      setFormData({ id: "", label: "", color: "#6B7280", bgColor: "#F3F4F6" });
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label.trim() || !formData.id.trim()) return;
    
    await saveTagConfig({
      id: formData.id.toLowerCase().replace(/\s+/g, "_"),
      label: formData.label.trim(),
      color: formData.color,
      bgColor: formData.bgColor,
    });
    setDialogOpen(false);
    await loadTags();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa tag này? Lead đang dùng tag này sẽ không bị ảnh hưởng.")) {
      await deleteTagConfig(id);
      await loadTags();
    }
  };

  const isValidHex = (color: string) => /^#[0-9A-Fa-f]{6}$/.test(color);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Tag</CardTitle></CardHeader>
        <CardContent><div className="h-40 bg-gray-100 animate-pulse rounded" /></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tag</CardTitle>
        <CardDescription>Quản lý các tag để gắn vào lead</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {tags.length === 0 ? (
            <p className="text-center text-text-muted py-4">Chưa có tag nào</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: tag.bgColor, color: tag.color }}
                    >
                      {tag.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(tag)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(tag.id)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm tag
        </Button>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTag ? "Sửa tag" : "Thêm tag"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Key (ID)</label>
                <Input
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g. vip, hot, follow_up"
                  disabled={!!editingTag}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Label</label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. VIP, Hot, Follow-up"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Màu text</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Màu nền</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={formData.bgColor}
                      onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.bgColor}
                      onChange={(e) => setFormData({ ...formData, bgColor: e.target.value })}
                      className="flex-1"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Preview</p>
                <span
                  className="inline-block px-3 py-1.5 rounded font-medium"
                  style={{ backgroundColor: formData.bgColor, color: formData.color }}
                >
                  {formData.label || "Sample"}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
              <Button onClick={handleSave} disabled={!formData.label.trim() || !formData.id.trim()}>Lưu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}