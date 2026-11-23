import { z } from "zod";
import { assignmentStatusSchema, idSchema, isoDateTimeSchema } from "./primitives";

export const assignmentSchema = z.object({
  id: idSchema,
  lessonId: idSchema,
  studentId: idSchema,
  assignedById: idSchema,
  assignedAt: isoDateTimeSchema,
  dueAt: isoDateTimeSchema.nullable(),
  status: assignmentStatusSchema,
});
export type Assignment = z.infer<typeof assignmentSchema>;

/**
 * What AssignLessonDialog (S5.4) submits: one lesson to many students at once.
 * Status and assignedAt are the service's to set.
 */
export const assignmentDraftSchema = z.object({
  lessonId: idSchema,
  studentIds: z.array(idSchema).min(1),
  dueAt: isoDateTimeSchema.nullable(),
});
export type AssignmentDraft = z.infer<typeof assignmentDraftSchema>;
