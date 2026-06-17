"use client";

import { RecordType } from "@/types";
import { EntityPicker, EntityOption } from "@/components/shared/entity-picker";
import { leads } from "@/lib/mock-data";
import { contacts } from "@/lib/mock-data";
import { deals } from "@/lib/mock-data";
import { companies } from "@/lib/mock-data";

interface RelatedRecordPickerProps {
  value?: { type: RecordType; id: string };
  onChange: (value: { type: RecordType; id: string } | undefined) => void;
}

export function RelatedRecordPicker({ value, onChange }: RelatedRecordPickerProps) {
  const getOptions = (type: RecordType): EntityOption[] => {
    switch (type) {
      case "lead":
        return leads.map((l) => ({ id: l.id, label: l.name, sublabel: l.company }));
      case "contact":
        return contacts.map((c) => ({ id: c.id, label: c.name, sublabel: c.company }));
      case "deal":
        return deals.map((d) => ({ id: d.id, label: d.title, sublabel: `${d.value.toLocaleString("vi-VN")} VND` }));
      case "company":
        return companies.map((c) => ({ id: c.id, label: c.name, sublabel: c.industry }));
      default:
        return [];
    }
  };

  const recordTypes: { value: RecordType; label: string }[] = [
    { value: "lead", label: "Lead" },
    { value: "contact", label: "Contact" },
    { value: "deal", label: "Deal" },
    { value: "company", label: "Company" },
  ];

  const selectedType = value?.type || "lead";
  const options = getOptions(selectedType);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-dark">Liên kết record</label>
      <div className="flex gap-2 mb-2">
        {recordTypes.map((rt) => (
          <button
            key={rt.value}
            type="button"
            onClick={() => onChange(undefined)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedType === rt.value
                ? "bg-primary text-white"
                : "bg-gray-100 text-text-muted hover:bg-gray-200"
            }`}
          >
            {rt.label}
          </button>
        ))}
      </div>
      <EntityPicker
        options={options}
        value={value?.id}
        onChange={(id) => onChange({ type: selectedType, id })}
        placeholder="Chọn record..."
      />
    </div>
  );
}