import { z } from "zod";
import { idSchema } from "./primitives";

export const activityTypeSchema = z.enum(["multiple-choice", "gap-fill", "writing"]);
export type ActivityType = z.infer<typeof activityTypeSchema>;

const activityBaseShape = {
  id: idSchema,
  title: z.string().min(1).max(160),
  instructions: z.string().max(600).optional(),
  points: z.number().int().positive(),
};

export const multipleChoiceQuestionSchema = z
  .object({
    id: idSchema,
    prompt: z.string().min(1),
    options: z.array(z.object({ id: idSchema, text: z.string().min(1) })).min(2),
    correctOptionId: idSchema,
  })
  .refine((q) => q.options.some((o) => o.id === q.correctOptionId), {
    error: "correctOptionId must match one of the options",
    path: ["correctOptionId"],
  });
export type MultipleChoiceQuestion = z.infer<typeof multipleChoiceQuestionSchema>;

export const multipleChoiceActivitySchema = z.object({
  ...activityBaseShape,
  type: z.literal("multiple-choice"),
  questions: z.array(multipleChoiceQuestionSchema).min(1),
});
export type MultipleChoiceActivity = z.infer<typeof multipleChoiceActivitySchema>;

export const gapFillQuestionSchema = z
  .object({
    id: idSchema,
    /** Sentence with each gap written as {{gapId}}, e.g. "She {{g1}} to school." */
    template: z.string().min(1),
    gaps: z
      .array(
        z.object({
          id: idSchema,
          answer: z.string().min(1),
          /** Also accepted, compared case-insensitively and trimmed. */
          alternatives: z.array(z.string().min(1)).default([]),
        }),
      )
      .min(1),
  })
  .refine((q) => q.gaps.every((gap) => q.template.includes(`{{${gap.id}}}`)), {
    error: "every gap id must appear as a {{placeholder}} in the template",
    path: ["template"],
  });
export type GapFillQuestion = z.infer<typeof gapFillQuestionSchema>;

export const gapFillActivitySchema = z.object({
  ...activityBaseShape,
  type: z.literal("gap-fill"),
  questions: z.array(gapFillQuestionSchema).min(1),
});
export type GapFillActivity = z.infer<typeof gapFillActivitySchema>;

export const writingActivitySchema = z
  .object({
    ...activityBaseShape,
    type: z.literal("writing"),
    prompt: z.string().min(1),
    minWords: z.number().int().positive(),
    maxWords: z.number().int().positive(),
  })
  .refine((a) => a.maxWords >= a.minWords, {
    error: "maxWords must be greater than or equal to minWords",
    path: ["maxWords"],
  });
export type WritingActivity = z.infer<typeof writingActivitySchema>;

/**
 * The union ActivityRenderer (S3.2) dispatches on. Adding a fourth type here
 * is what makes the renderer fail to compile until its branch is written.
 */
export const activitySchema = z.discriminatedUnion("type", [
  multipleChoiceActivitySchema,
  gapFillActivitySchema,
  writingActivitySchema,
]);
export type Activity = z.infer<typeof activitySchema>;
