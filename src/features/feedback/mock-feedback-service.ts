import { assignments, feedback, submissions } from "@/shared/data/fixtures";
import { ServiceError, clone, required, transport } from "@/shared/data/mock-transport";
import type { Feedback } from "@/shared/domain";
import type { FeedbackService } from "./feedback-service";

export const mockFeedbackService: FeedbackService = {
  getForSubmission: (submissionId) =>
    transport(() => {
      const found = feedback.find((f) => f.submissionId === submissionId);
      return found === undefined ? null : clone(found);
    }),

  save: (submissionId, teacherId, draft) =>
    transport(() => {
      const submission = required(submissions.find((s) => s.id === submissionId), "Submission");
      if (submission.submittedAt === null) {
        throw new ServiceError("conflict", "This submission has not been handed in yet.");
      }
      const assignment = required(
        assignments.find((a) => a.id === submission.assignmentId),
        "Assignment",
      );
      const saved: Feedback = {
        ...draft,
        id: `feedback-${submissionId}`,
        submissionId,
        source: "teacher",
        teacherId,
        state: "ready",
        createdAt: new Date().toISOString(),
      };
      const index = feedback.findIndex((f) => f.submissionId === submissionId);
      if (index === -1) feedback.push(saved);
      else feedback[index] = saved;
      assignment.status = "reviewed";
      return clone(saved);
    }),
};
