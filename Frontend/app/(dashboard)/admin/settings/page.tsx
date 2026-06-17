"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SettingsNav } from "@/components/admin/settings/settings-nav";
import { GeneralSettingsForm } from "@/components/admin/settings/general-settings-form";
import { SlaSettingsForm } from "@/components/admin/settings/sla-settings-form";
import { LeadSourceSettings } from "@/components/admin/settings/lead-source-settings";
import { TagSettings } from "@/components/admin/settings/tag-settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminSettingsPage() {
  const searchParams = useSearchParams() || new URLSearchParams();
  const router = useRouter();
  const section = searchParams.get("section") || "general";

  const [dirtySections, setDirtySections] = useState<Record<string, boolean>>({});
  const [showSaved, setShowSaved] = useState(false);
  const [showDirtyDialog, setShowDirtyDialog] = useState(false);
  const [pendingSection, setPendingSection] = useState<string | null>(null);

  const isDirty = dirtySections[section] || false;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleDirtyChange = (sectionId: string, dirty: boolean) => {
    setDirtySections((prev) => ({ ...prev, [sectionId]: dirty }));
  };

  const handleSaved = () => {
    setDirtySections((prev) => ({ ...prev, [section]: false }));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleSectionChange = (newSection: string) => {
    if (isDirty) {
      setPendingSection(newSection);
      setShowDirtyDialog(true);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", newSection);
      router.push(`/admin/settings?${params.toString()}`);
    }
  };

  const confirmSectionChange = () => {
    if (pendingSection) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("section", pendingSection);
      router.push(`/admin/settings?${params.toString()}`);
      setDirtySections((prev) => ({ ...prev, [section]: false }));
    }
    setShowDirtyDialog(false);
    setPendingSection(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-poppins text-text-dark">Cấu hình</h1>
        <p className="text-text-muted mt-1">Thiết lập hệ thống CRM</p>
      </div>

      {showSaved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Đã lưu</AlertTitle>
          <AlertDescription className="text-green-700">
            Cấu hình đã được lưu thành công.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsNav />

        <div className="flex-1 space-y-6">
          {section === "general" && (
            <GeneralSettingsForm
              isDirty={isDirty}
              onDirtyChange={(dirty) => handleDirtyChange("general", dirty)}
              onSaved={handleSaved}
            />
          )}

          {section === "lead-sources" && <LeadSourceSettings />}

          {section === "tags" && <TagSettings />}

          {section === "sla" && (
            <SlaSettingsForm
              isDirty={isDirty}
              onDirtyChange={(dirty) => handleDirtyChange("sla", dirty)}
              onSaved={handleSaved}
            />
          )}
        </div>
      </div>

      {showDirtyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-semibold">Bỏ thay đổi?</h3>
            </div>
            <p className="text-text-muted mb-6">
              Bạn có thay đổi chưa lưu. Bạn có chắc muốn chuyển sang section khác?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDirtyDialog(false)}
                className="px-4 py-2 text-sm text-text-muted hover:text-text-dark"
              >
                Hủy
              </button>
              <button
                onClick={confirmSectionChange}
                className="px-4 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                Bỏ thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}