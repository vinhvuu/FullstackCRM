"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

interface WonDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  dealTitle: string;
}

export function WonDialog({ open, onOpenChange, onConfirm, dealTitle }: WonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <Trophy className="w-5 h-5" /> Đánh dấu Won
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-text-muted">
          Xác nhận <span className="font-semibold text-text-dark">{dealTitle}</span> đã thắng?
        </p>
        <div className="flex gap-3 justify-end mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => { onConfirm(); onOpenChange(false); }}>
            Xác nhận Won
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
