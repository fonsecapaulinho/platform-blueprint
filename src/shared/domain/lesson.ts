import { z } from "zod";
import { activitySchema } from "./activity";
import { cefrLevelSchema, idSchema, isoDateTimeSchema } from "./primitives";

export const materialKindSchema = z.enum(["link", "pdf", "video", "audio"]);
export type MaterialKind = z.infer<typeof materialKindSchema>;

export const materialSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(160),
  kind: materialKindSchema,
  url: z.url(),
  description: z.string().max(280).optional(),
});
export type Material = z.infer<typeof materialSchema>;

export const lessonStatusSchema = z.enum(["draft", "published"]);
export type LessonStatus = z.infer<typeof lessonStatusSchema>;

/**
 * Materials and activities are embedded rather than referenced by id.
 * Page 05 always renders a lesson together with its activities, so a join
 * would buy nothing at this stage. Revisit if a lesson is ever reused
 * across teachers.
 */
export const lessonSchema = z.object({
  id: idSchema,
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(400),
  level: cefrLevelSchema,
  status: lessonStatusSchema,
  authorId: idSchema,
  materials: z.array(materialSchema),
  activities: z.array(activitySchema),
  createdAt: isoDateTimeSchema,
  updatedAt: isoDateTimeSchema,
});
export type Lesson = z.infer<typeof lessonSchema>;

/** What LessonForm (S5.3) submits. The service assigns id and both timestamps. */
export const lessonDraftSchema = lessonSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type LessonDraft = z.infer<typeof lessonDraftSchema>;
