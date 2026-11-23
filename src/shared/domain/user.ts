import { z } from "zod";
import { cefrLevelSchema, idSchema, isoDateTimeSchema, roleSchema } from "./primitives";

export const userSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(120),
  email: z.email(),
  role: roleSchema,
});
export type User = z.infer<typeof userSchema>;

export const teacherSchema = userSchema.extend({ role: z.literal("teacher") });
export type Teacher = z.infer<typeof teacherSchema>;

export const studentSchema = userSchema.extend({
  role: z.literal("student"),
  level: cefrLevelSchema,
  teacherId: idSchema,
  joinedAt: isoDateTimeSchema,
});
export type Student = z.infer<typeof studentSchema>;

/** What StudentForm (S5.5) submits. The service assigns id, role and joinedAt. */
export const studentDraftSchema = studentSchema.omit({ id: true, role: true, joinedAt: true });
export type StudentDraft = z.infer<typeof studentDraftSchema>;

/**
 * The session shape S1.5 represents with controlled data.
 * Not a security boundary — the next stage enforces that in the services.
 */
export const sessionSchema = z.object({
  user: userSchema,
  /** Present only when user.role is "student". */
  level: cefrLevelSchema.nullable(),
});
export type Session = z.infer<typeof sessionSchema>;
