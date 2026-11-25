import type { Feedback, FeedbackDraft } from "@/shared/domain";

/**
 * Feedback has a lifecycle of its own — it can exist before it has a comment —
 * which is why it is not a pair of methods on the submission service.
 *
 * UI contract. A production implementation must authorise every call on the server.
 */
export interface FeedbackService {
  /** null when nobody has reviewed the submission yet. */
  getForSubmission(submissionId: string): Promise<Feedback | null>;
  /**
   * Writes teacher feedback, ready in one step, and moves the assignment to
   * "reviewed". Rejects with ServiceError("conflict") if the submission has not
   * been handed in.
   */
  save(submissionId: string, teacherId: string, draft: FeedbackDraft): Promise<Feedback>;
}
