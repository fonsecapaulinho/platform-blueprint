import { students } from "@/shared/data/fixtures";
import { ServiceError, clone, required, transport } from "@/shared/data/mock-transport";
import type { StudentService } from "./student-service";

const slug = (name: string) => `student-${name.trim().toLowerCase().split(/\s+/)[0]}`;

export const mockStudentService: StudentService = {
  list: (teacherId) => transport(() => clone(students.filter((s) => s.teacherId === teacherId))),

  get: (studentId) => transport(() => clone(required(students.find((s) => s.id === studentId), "Student"))),

  create: (teacherId, draft) =>
    transport(() => {
      if (students.some((s) => s.email === draft.email)) {
        throw new ServiceError("conflict", "A student with that email already exists.");
      }
      const created = { ...draft, id: slug(draft.name), role: "student" as const, teacherId, joinedAt: new Date().toISOString() };
      students.push(created);
      return clone(created);
    }),

  update: (studentId, draft) =>
    transport(() => {
      const index = students.findIndex((s) => s.id === studentId);
      if (index === -1) throw new ServiceError("not-found", "Student was not found.");
      students[index] = { ...students[index], ...draft };
      return clone(students[index]);
    }),
};
