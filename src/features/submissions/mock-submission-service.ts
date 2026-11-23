import { assignments, feedback, lessons, students, submissions } from "@/shared/data/fixtures";
import { ServiceError, clone, required, transport } from "@/shared/data/mock-transport";
import type { Activity, Answer, Attempt, Score, Submission } from "@/shared/domain";
import type { AttemptDraft, SubmissionService, SubmissionView } from "./submission-service";

const normalise = (value: string) => value.trim().toLowerCase();

/**
 * Writing is never auto-scored — only a teacher can judge it, so the attempt
 * carries a null score until FeedbackPanel (S4.6) supplies awardedPoints.
 */
function scoreAttempt(activity: Activity, answers: Answer[]): Score | null {
  if (activity.type === "writing") return null;

  let correct = 0;
  let total = 0;

  if (activity.type === "multiple-choice") {
    for (const question of activity.questions) {
      total += 1;
      const answer = answers.find((a) => a.type === "multiple-choice" && a.questionId === question.id);
      if (answer?.type === "multiple-choice" && answer.selectedOptionId === question.correctOptionId) correct += 1;
    }
  } else {
    for (const question of activity.questions) {
      const answer = answers.find((a) => a.type === "gap-fill" && a.questionId === question.id);
      for (const gap of question.gaps) {
        total += 1;
        const given = answer?.type === "gap-fill" ? answer.gaps[gap.id] : undefined;
        if (given === undefined) continue;
        const accepted = [gap.answer, ...gap.alternatives].map(normalise);
        if (accepted.includes(normalise(given))) correct += 1;
      }
    }
  }

  return { correct, total, percentage: total === 0 ? 0 : Math.round((correct / total) * 100) };
}

function totalScore(attempts: Attempt[]): Score | null {
  const scored = attempts.filter((a) => a.score !== null);
  if (scored.length === 0) return null;
  const correct = scored.reduce((sum, a) => sum + a.score!.correct, 0);
  const total = scored.reduce((sum, a) => sum + a.score!.total, 0);
  return { correct, total, percentage: total === 0 ? 0 : Math.round((correct / total) * 100) };
}

function findActivity(lessonId: string, activityId: string): Activity {
  const lesson = required(lessons.find((l) => l.id === lessonId), "Lesson");
  return required(lesson.activities.find((a) => a.id === activityId), "Activity");
}

function toView(submission: Submission): SubmissionView {
  const assignment = required(assignments.find((a) => a.id === submission.assignmentId), "Assignment");
  const lesson = required(lessons.find((l) => l.id === assignment.lessonId), "Lesson");
  const student = required(students.find((s) => s.id === submission.studentId), "Student");
  return {
    ...submission,
    assignment: { id: assignment.id, dueAt: assignment.dueAt, status: assignment.status },
    lesson: { id: lesson.id, title: lesson.title },
    student: { id: student.id, name: student.name },
  };
}

export const mockSubmissionService: SubmissionService = {
  getForAssignment: (assignmentId) =>
    transport(() => {
      const found = submissions.find((s) => s.assignmentId === assignmentId);
      return found === undefined ? null : clone(found);
    }),

  saveAttempt: (assignmentId, draft: AttemptDraft) =>
    transport(() => {
      const assignment = required(assignments.find((a) => a.id === assignmentId), "Assignment");
      if (assignment.status === "submitted" || assignment.status === "reviewed") {
        throw new ServiceError("conflict", "This assignment was already submitted.");
      }
      const activity = findActivity(assignment.lessonId, draft.activityId);
      const now = new Date().toISOString();

      let submission = submissions.find((s) => s.assignmentId === assignmentId);
      if (submission === undefined) {
        submission = { id: `submission-${assignmentId}`, assignmentId, studentId: assignment.studentId, startedAt: now, submittedAt: null, attempts: [], score: null };
        submissions.push(submission);
      }

      const attempt: Attempt = {
        id: `attempt-${assignmentId}-${draft.activityId}`,
        activityId: draft.activityId,
        activityType: activity.type,
        startedAt: submission.attempts.find((a) => a.activityId === draft.activityId)?.startedAt ?? now,
        submittedAt: now,
        answers: draft.answers,
        score: scoreAttempt(activity, draft.answers),
      };

      const index = submission.attempts.findIndex((a) => a.activityId === draft.activityId);
      if (index === -1) submission.attempts.push(attempt);
      else submission.attempts[index] = attempt;

      submission.score = totalScore(submission.attempts);
      assignment.status = "in-progress";
      return clone(submission);
    }),

  submit: (assignmentId) =>
    transport(() => {
      const assignment = required(assignments.find((a) => a.id === assignmentId), "Assignment");
      if (assignment.status === "submitted" || assignment.status === "reviewed") {
        throw new ServiceError("conflict", "This assignment was already submitted.");
      }
      const submission = required(submissions.find((s) => s.assignmentId === assignmentId), "Submission");
      submission.submittedAt = new Date().toISOString();
      submission.score = totalScore(submission.attempts);
      assignment.status = "submitted";
      return clone(submission);
    }),

  listPendingReview: (teacherId) =>
    transport(() => {
      const owned = new Set(assignments.filter((a) => a.assignedById === teacherId && a.status === "submitted").map((a) => a.id));
      return clone(submissions.filter((s) => owned.has(s.assignmentId)).map(toView));
    }),

  getFeedback: (submissionId) =>
    transport(() => {
      const found = feedback.find((f) => f.submissionId === submissionId);
      return found === undefined ? null : clone(found);
    }),

  saveFeedback: (submissionId, teacherId, draft) =>
    transport(() => {
      const submission = required(submissions.find((s) => s.id === submissionId), "Submission");
      if (submission.submittedAt === null) {
        throw new ServiceError("conflict", "This submission has not been handed in yet.");
      }
      const assignment = required(assignments.find((a) => a.id === submission.assignmentId), "Assignment");
      const saved = { ...draft, id: `feedback-${submissionId}`, submissionId, teacherId, createdAt: new Date().toISOString() };
      const index = feedback.findIndex((f) => f.submissionId === submissionId);
      if (index === -1) feedback.push(saved);
      else feedback[index] = saved;
      assignment.status = "reviewed";
      return clone(saved);
    }),
};
