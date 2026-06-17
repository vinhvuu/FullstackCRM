"use client";

import { companies } from "@/lib/mock-data";
import { EntityPicker } from "@/components/shared/entity-picker";

interface CompanyPickerProps {
  value?: string;
  onChange: (id: string) => void;
  onCreateNew?: (name: string) => void;
  className?: string;
}

export function CompanyPicker({ value, onChange, onCreateNew, className }: CompanyPickerProps) {
  const options = companies.map((c) => ({
    id: c.id,
    label: c.name,
    sublabel: c.industry,
  }));

  return (
    <EntityPicker
      options={options}
      value={value}
      onChange={onChange}
      onCreateNew={onCreateNew}
      placeholder="Tìm công ty..."
      createLabel="Tạo công ty"
      className={className}
    />
  );
}
