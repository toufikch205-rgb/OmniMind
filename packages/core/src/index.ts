/** Shared business foundations. Domain rules must stay independent from UI and platform APIs. */
export type Identifier = string;
export interface Entity { readonly id: Identifier; readonly createdAt: string; readonly updatedAt: string; }
