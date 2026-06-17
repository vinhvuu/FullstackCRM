"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, EmployeeLoad } from "@/types";
import { getEmployeeLoads } from "@/lib/admin/admin-data";

interface AssignLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadCount: number;
  onAssign: (userId: number, userName: string) => void;
}

export function AssignLeadDialog({ open, onOpenChange, leadCount, onAssign }: AssignLeadDialogProps) {
  const [employees, setEmployees] = useState<EmployeeLoad[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      loadEmployees();
    }
  }, [open]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployeeLoads();
      setEmployees(data);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = () => {
    if (selectedUserId) {
      const user = employees.find((e) => e.userId === selectedUserId);
      if (user) {
        onAssign(selectedUserId, user.userName);
        onOpenChange(false);
      }
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => a.activeLeadCount - b.activeLeadCount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gán {leadCount} lead cho...</DialogTitle>
          <DialogDescription>
            Chọn nhân viên để gán lead. Nhân viên có ít lead nhất sẽ hiển thị trước.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {sortedEmployees.map((emp) => (
                <button
                  key={emp.userId}
                  onClick={() => setSelectedUserId(emp.userId)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${
                    selectedUserId === emp.userId
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {emp.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-text-dark">{emp.userName}</p>
                      <p className="text-xs text-text-muted">
                        {emp.activeLeadCount} lead • {emp.openDealCount} deal đang mở
                      </p>
                    </div>
                  </div>
                  {emp.activeLeadCount === Math.min(...employees.map((e) => e.activeLeadCount)) && (
                    <span className="text-xs text-green-600 font-medium">ít nhất</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleAssign} disabled={!selectedUserId}>
            Gán lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}