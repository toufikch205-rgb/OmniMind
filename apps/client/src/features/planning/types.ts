export type PlanningPeriod = "month" | "week" | "day";
export type GoalPriority = "high" | "medium" | "low";
export type GoalStatus = "active" | "done";

export type PlanningGoal = {
  id: string;
  title: string;
  period: PlanningPeriod;
  startDate: string;
  endDate: string;
  priority: GoalPriority;
  status: GoalStatus;
  parentId: string | null;
  notes: string;
  createdAt: string;
};

export const PLANNING_STORAGE_KEY = "omnimind.planning.goals.v1";
export const createGoalId = () => `goal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
