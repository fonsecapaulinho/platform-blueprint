import { z } from "zod";

/** Identifiers are readable slugs in the mock layer, not UUIDs. The real API may narrow this. */
export const idSchema = z.string().min(1);
export const isoDateTimeSchema = z.iso.datetime();

export const roleSchema = z.enum(["student", "teacher"]);
export type Role = z.infer<typeof roleSchema>;

export const cefrLevelSchema = z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]);
export type CefrLevel = z.infer<typeof cefrLevelSchema>;

/**
 * The five states StatusBadge renders (S2.1).
 * `overdue` is derived from `dueAt` at read time — no form ever writes it.
 */
export const assignmentStatusSchema = z.enum([
  "not-started",
  "in-progress",
  "submitted",
  "reviewed",
  "overdue",
]);
export type AssignmentStatus = z.infer<typeof assignmentStatusSchema>;

export const scoreSchema = z.object({
  correct: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  /** Rounded to the integer the UI prints; recomputing from correct/total would drift. */
  percentage: z.number().int().min(0).max(100),
});
export type Score = z.infer<typeof scoreSchema>;
