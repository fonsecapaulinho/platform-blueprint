import { z } from "zod";
import { idSchema, isoDateTimeSchema } from "./primitives";

/**
 * Who produced the feedback. Only "teacher" is produced today — automatic
 * generation is out of scope for this delivery — but the field exists so that
 * adding it later is a new value, not a migration of every stored record.
 */
export const feedbackSourceSchema = z.enum(["teacher", "ai"]);
export type FeedbackSource = z.infer<typeof feedbackSourceSchema>;

/**
 * Teacher-written feedback is created "ready" in one step. A generated one would
 * appear as "pending" and settle later, which is why FeedbackPanel (S4.6) must be
 * able to render feedback that exists but has no comment yet.
 */
export const feedbackStateSchema = z.enum(["pending", "ready", "failed"]);
export type FeedbackState = z.infer<typeof feedbackStateSchema>;

export const feedbackSchema = z
  .object({
    id: idSchema,
    submissionId: idSchema,
    source: feedbackSourceSchema,
    /** null when the source is "ai" — no teacher wrote it. */
    teacherId: idSchema.nullable(),
    state: feedbackStateSchema,
    /** Empty while the state is "pending" or "failed". */
    comment: z.string().max(2000),
    /** Teacher's score for what the mock cannot grade, writing above all. */
    awardedPoints: z.number().int().nonnegative().nullable(),
    createdAt: isoDateTimeSchema,
  })
  .refine((feedback) => feedback.state !== "ready" || feedback.comment.trim().length > 0, {
    error: "feedback in the ready state must carry a comment",
    path: ["comment"],
  })
  .refine((feedback) => feedback.source !== "teacher" || feedback.teacherId !== null, {
    error: "teacher feedback must name the teacher who wrote it",
    path: ["teacherId"],
  });
export type Feedback = z.infer<typeof feedbackSchema>;

/**
 * What TeacherReviewForm (S6.3) submits. A teacher always writes a finished
 * comment, so there is no pending state and no empty comment to represent here —
 * the service supplies id, submissionId, source, teacherId, state and createdAt.
 */
export const feedbackDraftSchema = z.object({
  comment: z.string().min(1).max(2000),
  awardedPoints: z.number().int().nonnegative().nullable(),
});
export type FeedbackDraft = z.infer<typeof feedbackDraftSchema>;
