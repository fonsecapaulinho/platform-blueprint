import type { Assignment, AssignmentDraft, AssignmentStatus, Lesson, Student } from "@/shared/domain";

/**
 * Read model for the list views. AssignmentCard (S3.1) and PendingWorkList (S2.3)
 * need the lesson title and the student name, and neither should fetch them itself.
 */
export type AssignmentView = Assignment & {
  lesson: Pick<Lesson, "id" | "title" | "summary" | "level">;
  student: Pick<Student, "id" | "name" | "level">;
  /** Recomputed on read: a stored "not-started" past its dueAt reads as "overdue". */
  status: AssignmentStatus;
};

/** UI contract. A production implementation must authorise every call on the server. */
export interface AssignmentService {
  listForStudent(studentId: string): Promise<AssignmentView[]>;
  listForTeacher(teacherId: string): Promise<AssignmentView[]>;
  get(assignmentId: string): Promise<AssignmentView>;
  /** One lesson to many students; returns one assignment per student. */
  assign(teacherId: string, draft: AssignmentDraft): Promise<Assignment[]>;
}
