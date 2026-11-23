import { assignments, lessons, students } from "@/shared/data/fixtures";
import { clone, required, transport } from "@/shared/data/mock-transport";
import type { Assignment, AssignmentStatus } from "@/shared/domain";
import type { AssignmentService, AssignmentView } from "./assignment-service";

/** Only unfinished work can go overdue; a submitted or reviewed assignment stays as it is. */
export function resolveStatus(assignment: Assignment, now = new Date()): AssignmentStatus {
  if (assignment.status === "submitted" || assignment.status === "reviewed") return assignment.status;
  if (assignment.dueAt !== null && new Date(assignment.dueAt) < now) return "overdue";
  return assignment.status;
}

function toView(assignment: Assignment): AssignmentView {
  const lesson = required(lessons.find((l) => l.id === assignment.lessonId), "Lesson");
  const student = required(students.find((s) => s.id === assignment.studentId), "Student");
  return {
    ...assignment,
    status: resolveStatus(assignment),
    lesson: { id: lesson.id, title: lesson.title, summary: lesson.summary, level: lesson.level },
    student: { id: student.id, name: student.name, level: student.level },
  };
}

export const mockAssignmentService: AssignmentService = {
  listForStudent: (studentId) =>
    transport(() => clone(assignments.filter((a) => a.studentId === studentId).map(toView))),

  listForTeacher: (teacherId) =>
    transport(() => clone(assignments.filter((a) => a.assignedById === teacherId).map(toView))),

  get: (assignmentId) =>
    transport(() => clone(toView(required(assignments.find((a) => a.id === assignmentId), "Assignment")))),

  assign: (teacherId, draft) =>
    transport(() => {
      required(lessons.find((l) => l.id === draft.lessonId), "Lesson");
      const assignedAt = new Date().toISOString();
      const created = draft.studentIds.map((studentId) => {
        required(students.find((s) => s.id === studentId), "Student");
        const assignment: Assignment = {
          id: `assignment-${studentId}-${draft.lessonId}`,
          lessonId: draft.lessonId,
          studentId,
          assignedById: teacherId,
          assignedAt,
          dueAt: draft.dueAt,
          status: "not-started",
        };
        return assignment;
      });
      assignments.push(...created);
      return clone(created);
    }),
};
