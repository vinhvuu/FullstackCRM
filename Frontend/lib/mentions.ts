import { MentionUser } from "@/types";

export function parseMentions(body: string, users: MentionUser[]): string[] {
  const ids: string[] = [];
  const regex = /@([\w\s]+)/g;
  let match;
  while ((match = regex.exec(body)) !== null) {
    const name = match[1].trim();
    const user = users.find((u) => u.name.toLowerCase() === name.toLowerCase());
    if (user && !ids.includes(user.id)) ids.push(user.id);
  }
  return ids;
}
