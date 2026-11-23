import type { Student, StudentDraft } from "@/shared/domain";

/** UI contract. A production implementation must authorise every call on the server. */
export interface StudentService {
  list(teacherId: string): Promise<Student[]>;
  get(studentId: string): Promise<Student>;
  create(teacherId: string, draft: StudentDraft): Promise<Student>;
  update(studentId: string, draft: StudentDraft): Promise<Student>;
}
