import type { Answer, Assignment, Lesson, Student, Submission } from "@/shared/domain";

/** What SubmissionBar (S4.2) sends when the student finishes one activity. */
export type AttemptDraft = {
  activityId: string;
  answers: Answer[];
};

/** Read model for the teacher's review queue (S2.3, S6.4). */
export type SubmissionView = Submission & {
  assignment: Pick<Assignment, "id" | "dueAt" | "status">;
  lesson: Pick<Lesson, "id" | "title">;
  student: Pick<Student, "id" | "name">;
};

/** UI contract. A production implementation must authorise every call on the server. */
export interface SubmissionService {
  /** null when the student has not opened the assignment yet. */
  getForAssignment(assignmentId: string): Promise<Submission | null>;
  /** Creates the submission on first call; replaces the attempt for that activity afterwards. */
  saveAttempt(assignmentId: string, draft: AttemptDraft): Promise<Submission>;
  /** Rejects with ServiceError("conflict") if the assignment was already submitted. */
  submit(assignmentId: string): Promise<Submission>;
  listPendingReview(teacherId: string): Promise<SubmissionView[]>;
}
