"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomFieldDef, RecordType } from "@/types";
import { getCustomFieldValue, setCustomFieldValue } from "@/lib/custom-fields";

interface CustomFieldRendererProps {
  entity: RecordType;
  recordId: string;
  field: CustomFieldDef;
  value?: string;
  onChange?: (value: string) => void;
}

export function CustomFieldRenderer({
  entity,
  recordId,
  field,
  value,
  onChange,
}: CustomFieldRendererProps) {
  const currentValue = value ?? getCustomFieldValue(entity, recordId, field.key) ?? "";

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else {
      setCustomFieldValue(entity, recordId, field.key, newValue);
    }
  };

  switch (field.type) {
    case "text":
      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.label}
          />
        </div>
      );

    case "number":
      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            type="number"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={field.label}
          />
        </div>
      );

    case "date":
      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            type="date"
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      );

    case "select":
      return (
        <div className="space-y-2">
          <Label>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select value={currentValue} onValueChange={handleChange}>
            <SelectTrigger>
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`${entity}-${recordId}-${field.key}`}
            checked={currentValue === "true"}
            onChange={(e) => handleChange(e.target.checked ? "true" : "false")}
            className="w-4 h-4"
          />
          <Label htmlFor={`${entity}-${recordId}-${field.key}`}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        </div>
      );

    default:
      return null;
  }
}