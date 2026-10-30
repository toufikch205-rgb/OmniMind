import { PAGE_STORAGE_KEY, starterPages, type TaskBlockData, type TaskPage } from "./types";

function migrateBlock(value: any, index: number): TaskBlockData | null {
  if (!value || typeof value !== "object") return null;
  if (value.type === "task") {
    return { id: String(value.id ?? "task-" + index), type: "task", text: String(value.text ?? ""), done: Boolean(value.done) };
  }
  if (value.type === "text" || value.type === "paragraph") {
    return { id: String(value.id ?? "text-" + index), type: "paragraph", text: String(value.text ?? "") };
  }
  if (["heading", "bullet", "image", "table"].includes(value.type)) {
    return {
      id: String(value.id ?? value.type + "-" + index),
      type: value.type,
      text: typeof value.text === "string" ? value.text : "",
      url: typeof value.url === "string" ? value.url : "",
      rows: Array.isArray(value.rows) ? value.rows.map((row: unknown) => Array.isArray(row) ? row.map(String) : []) : undefined,
      done: Boolean(value.done),
    } as TaskBlockData;
  }
  return null;
}

function migratePage(value: any): TaskPage | null {
  if (!value || typeof value !== "object" || typeof value.id !== "string") return null;
  const blocks = Array.isArray(value.blocks)
    ? value.blocks.map(migrateBlock).filter((block: TaskBlockData | null): block is TaskBlockData => block !== null)
    : [];
  const children = Array.isArray(value.children)
    ? value.children.map(migratePage).filter((page: TaskPage | null): page is TaskPage => page !== null)
    : [];
  return {
    id: value.id,
    title: typeof value.title === "string" ? value.title : "صفحة جديدة",
    icon: typeof value.icon === "string" ? value.icon : "📄",
    blocks,
    children,
  };
}

export function loadPages(): TaskPage[] {
  try {
    const raw = globalThis.localStorage?.getItem(PAGE_STORAGE_KEY);
    if (!raw) return starterPages;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return starterPages;
    const pages = parsed.map(migratePage).filter((page: TaskPage | null): page is TaskPage => page !== null);
    return pages.length ? pages : starterPages;
  } catch {
    return starterPages;
  }
}

export function savePages(pages: TaskPage[]) {
  try {
    globalThis.localStorage?.setItem(PAGE_STORAGE_KEY, JSON.stringify(pages));
  } catch {
    // Storage can be unavailable or full; keep the editor usable in memory.
  }
}
