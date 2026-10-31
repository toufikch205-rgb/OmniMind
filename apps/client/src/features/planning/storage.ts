import { PLANNING_STORAGE_KEY, type PlanningGoal } from "./types";

export function loadPlanningGoals(): PlanningGoal[] {
  try {
    const raw = globalThis.localStorage?.getItem(PLANNING_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is PlanningGoal =>
      Boolean(item && typeof item === "object" &&
        typeof item.id === "string" && typeof item.title === "string" &&
        ["month", "week", "day"].includes(item.period) &&
        typeof item.startDate === "string" && typeof item.endDate === "string" &&
        ["high", "medium", "low"].includes(item.priority) &&
        ["active", "done"].includes(item.status) &&
        (item.parentId === null || typeof item.parentId === "string"))
    );
  } catch {
    return [];
  }
}

export function savePlanningGoals(goals: PlanningGoal[]) {
  try {
    globalThis.localStorage?.setItem(PLANNING_STORAGE_KEY, JSON.stringify(goals));
  } catch {
    // Keep the current session usable if browser storage is unavailable.
  }
}
