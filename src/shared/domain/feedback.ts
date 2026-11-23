import { z } from "zod";
import { idSchema, isoDateTimeSchema } from "./primitives";

export const feedbackSchema = z.object({
  id: idSchema,
  submissionId: idSchema,
  teacherId: idSchema,
  comment: z.string().min(1).max(2000),
  /** Teacher's override for activities the mock cannot score, writing above all. */
  awardedPoints: z.number().int().nonnegative().nullable(),
  createdAt: isoDateTimeSchema,
});
export type Feedback = z.infer<typeof feedbackSchema>;

/** What TeacherReviewForm (S6.3) submits. */
export const feedbackDraftSchema = feedbackSchema.omit({
  id: true,
  teacherId: true,
  createdAt: true,
});
export type FeedbackDraft = z.infer<typeof feedbackDraftSchema>;
