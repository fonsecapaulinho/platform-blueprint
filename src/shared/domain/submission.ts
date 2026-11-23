import { z } from "zod";
import { activityTypeSchema } from "./activity";
import { idSchema, isoDateTimeSchema, scoreSchema } from "./primitives";

export const multipleChoiceAnswerSchema = z.object({
  type: z.literal("multiple-choice"),
  questionId: idSchema,
  /** null while the student has seen the question but not chosen. */
  selectedOptionId: idSchema.nullable(),
});

export const gapFillAnswerSchema = z.object({
  type: z.literal("gap-fill"),
  questionId: idSchema,
  /** Keyed by gap id; a missing key is an unfilled gap. */
  gaps: z.record(idSchema, z.string()),
});

export const writingAnswerSchema = z.object({
  type: z.literal("writing"),
  questionId: idSchema,
  text: z.string(),
});

export const answerSchema = z.discriminatedUnion("type", [
  multipleChoiceAnswerSchema,
  gapFillAnswerSchema,
  writingAnswerSchema,
]);
export type Answer = z.infer<typeof answerSchema>;

/**
 * One run at one activity. AttemptHistory (S6.4) lists these;
 * AnswerReview (S4.5) reads a single one against its activity.
 */
export const attemptSchema = z.object({
  id: idSchema,
  activityId: idSchema,
  activityType: activityTypeSchema,
  startedAt: isoDateTimeSchema,
  submittedAt: isoDateTimeSchema.nullable(),
  answers: z.array(answerSchema),
  /** null for writing activities, which only a teacher can score. */
  score: scoreSchema.nullable(),
});
export type Attempt = z.infer<typeof attemptSchema>;

/** The assignment-level record. One per assignment, holding every attempt in it. */
export const submissionSchema = z.object({
  id: idSchema,
  assignmentId: idSchema,
  studentId: idSchema,
  startedAt: isoDateTimeSchema,
  submittedAt: isoDateTimeSchema.nullable(),
  attempts: z.array(attemptSchema),
  score: scoreSchema.nullable(),
});
export type Submission = z.infer<typeof submissionSchema>;
