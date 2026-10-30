export type BlockType = "paragraph" | "heading" | "task" | "bullet" | "table" | "image";

export type TaskBlockData = {
  id: string;
  type: BlockType;
  text?: string;
  done?: boolean;
  url?: string;
  rows?: string[][];
};

export type TaskPage = {
  id: string;
  title: string;
  icon: string;
  blocks: TaskBlockData[];
  children: TaskPage[];
};

export type FlatPage = { page: TaskPage; depth: number; parent: string | null };

export const PAGE_STORAGE_KEY = "omnimind.tasks.pages.v1";
export const PAGE_ICONS = ["📄", "📚", "🎯", "💡", "🧠", "💼", "🏠", "📌"];

export const createId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const starterPages: TaskPage[] = [
  {
    id: "inbox",
    title: "مهامي",
    icon: "📥",
    blocks: [
      { id: "t1", type: "task", text: "رتّب أولوياتك لهذا الأسبوع", done: false },
      { id: "n1", type: "paragraph", text: "هذه مساحتك. أضف المهام والملاحظات والأفكار بحرية." },
    ],
    children: [],
  },
  {
    id: "study",
    title: "الدراسة",
    icon: "📚",
    blocks: [{ id: "t2", type: "task", text: "مراجعة الدروس", done: false }],
    children: [],
  },
];
