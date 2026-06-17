import { CustomFieldDef, CustomFieldValue, RecordType } from "@/types";

export const mockCustomFieldDefs: CustomFieldDef[] = [
  { id: "1", entity: "lead", key: "facebook", label: "Facebook", type: "text", required: false, order: 1 },
  { id: "2", entity: "lead", key: "referredBy", label: "Referred By", type: "text", required: false, order: 2 },
  { id: "3", entity: "contact", key: "birthday", label: "Birthday", type: "date", required: false, order: 1 },
  { id: "4", entity: "contact", key: "department", label: "Department", type: "select", options: ["Sales", "Marketing", "IT", "HR"], required: false, order: 2 },
  { id: "5", entity: "deal", key: "priority", label: "Priority", type: "select", options: ["Low", "Medium", "High", "Critical"], required: false, order: 1 },
];

export const mockCustomFieldValues: CustomFieldValue[] = [
  { entity: "lead", recordId: "1", fieldKey: "facebook", value: "fb.com/techcorp" },
  { entity: "lead", recordId: "1", fieldKey: "referredBy", value: "Google" },
  { entity: "contact", recordId: "1", fieldKey: "birthday", value: "1990-05-15" },
];

export function getCustomFieldDefs(entity: RecordType): CustomFieldDef[] {
  return mockCustomFieldDefs
    .filter((def) => def.entity === entity)
    .sort((a, b) => a.order - b.order);
}

export function getCustomFieldValues(entity: RecordType, recordId: string): CustomFieldValue[] {
  return mockCustomFieldValues.filter(
    (v) => v.entity === entity && v.recordId === recordId
  );
}

export function getCustomFieldValue(
  entity: RecordType,
  recordId: string,
  fieldKey: string
): string | undefined {
  const value = mockCustomFieldValues.find(
    (v) => v.entity === entity && v.recordId === recordId && v.fieldKey === fieldKey
  );
  return value?.value;
}

export function setCustomFieldValue(
  entity: RecordType,
  recordId: string,
  fieldKey: string,
  value: string
): void {
  const existing = mockCustomFieldValues.findIndex(
    (v) => v.entity === entity && v.recordId === recordId && v.fieldKey === fieldKey
  );
  if (existing >= 0) {
    mockCustomFieldValues[existing].value = value;
  } else {
    mockCustomFieldValues.push({ entity, recordId, fieldKey, value });
  }
}