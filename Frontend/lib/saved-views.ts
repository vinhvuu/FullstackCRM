import { SavedView, RecordType } from "@/types";

export const mockSavedViews: SavedView[] = [
  {
    id: "1",
    userId: "1",
    entity: "lead",
    name: "My Leads",
    filters: { assignee: "1" },
    columns: ["name", "company", "email", "status", "score"],
    sort: "createdAt:desc",
    isShared: false,
  },
  {
    id: "2",
    userId: "1",
    entity: "lead",
    name: "High Score",
    filters: { scoreMin: 70 },
    columns: ["name", "company", "email", "status", "score"],
    sort: "score:desc",
    isShared: true,
  },
  {
    id: "3",
    userId: "1",
    entity: "deal",
    name: "Active Deals",
    filters: { status: "open" },
    columns: ["title", "value", "stage", "expectedCloseDate"],
    sort: "expectedCloseDate:asc",
    isShared: false,
  },
];

export function getSavedViews(userId: string, entity: RecordType): SavedView[] {
  return mockSavedViews.filter((v) => v.userId === userId && v.entity === entity);
}

export function getSavedView(id: string): SavedView | undefined {
  return mockSavedViews.find((v) => v.id === id);
}

export function createSavedView(
  userId: string,
  entity: RecordType,
  name: string,
  filters: Record<string, unknown>,
  columns: string[],
  sort?: string,
  isShared: boolean = false
): SavedView {
  const view: SavedView = {
    id: Date.now().toString(),
    userId,
    entity,
    name,
    filters,
    columns,
    sort,
    isShared,
  };
  mockSavedViews.push(view);
  return view;
}

export function updateSavedView(
  id: string,
  updates: Partial<Omit<SavedView, "id" | "userId" | "entity">>
): SavedView | undefined {
  const view = mockSavedViews.find((v) => v.id === id);
  if (view) {
    Object.assign(view, updates);
  }
  return view;
}

export function deleteSavedView(id: string): boolean {
  const index = mockSavedViews.findIndex((v) => v.id === id);
  if (index >= 0) {
    mockSavedViews.splice(index, 1);
    return true;
  }
  return false;
}