export function renderTemplate(tpl: string, ctx: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (_, k) => ctx[k] ?? "");
}
