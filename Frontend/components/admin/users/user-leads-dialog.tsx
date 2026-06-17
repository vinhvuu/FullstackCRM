"use client";

import { useState, useEffect } from "react";
import { Lead, User } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getLeadsByAssignee } from "@/lib/admin/admin-data";
import { Mail, Building, Star, Calendar, User as UserIcon } from "lucide-react";

interface UserLeadsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  qualified: "Đã qualify",
  lost: "Thất bại",
};

export function UserLeadsDialog({ user, open, onOpenChange }: UserLeadsDialogProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && user) {
      loadLeads();
    }
  }, [open, user]);

  const loadLeads = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getLeadsByAssignee(user.name);
      setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-medium">{user.name.charAt(0)}</span>
            </div>
            <div>
              <div>{user.name}</div>
              <p className="text-sm font-normal text-text-muted">{user.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-6 mb-6 text-sm text-text-muted">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {leads.length} lead
            </span>
            <span className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              {leads.filter(l => l.status === "qualified").length} đã qualify
            </span>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <UserIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>User này chưa có lead nào</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Lead</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Công ty</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Score</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-text-muted">Ngày nhận</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-text-dark">{lead.name}</p>
                          <p className="text-xs text-text-muted">{lead.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-dark">{lead.company}</td>
                      <td className="px-4 py-3">
                        <Badge variant={lead.status === "qualified" ? "success" : "outline"}>
                          {STATUS_LABELS[lead.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                            lead.score >= 80
                              ? "bg-green-100 text-green-700"
                              : lead.score >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-muted">
                        {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}