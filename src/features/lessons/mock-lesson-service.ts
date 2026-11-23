import { lessons } from "@/shared/data/fixtures";
import { ServiceError, clone, required, transport } from "@/shared/data/mock-transport";
import type { LessonService } from "./lesson-service";

const slug = (title: string) =>
  `lesson-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}`;

export const mockLessonService: LessonService = {
  list: (filter) =>
    transport(() => {
      const query = filter?.query?.trim().toLowerCase();
      return clone(
        lessons.filter(
          (lesson) =>
            (filter?.level === undefined || lesson.level === filter.level) &&
            (filter?.status === undefined || lesson.status === filter.status) &&
            (query === undefined ||
              query === "" ||
              lesson.title.toLowerCase().includes(query) ||
              lesson.summary.toLowerCase().includes(query)),
        ),
      );
    }),

  get: (lessonId) => transport(() => clone(required(lessons.find((l) => l.id === lessonId), "Lesson"))),

  create: (draft) =>
    transport(() => {
      const now = new Date().toISOString();
      const id = slug(draft.title);
      if (lessons.some((l) => l.id === id)) {
        throw new ServiceError("conflict", "A lesson with that title already exists.");
      }
      const created = { ...draft, id, createdAt: now, updatedAt: now };
      lessons.push(created);
      return clone(created);
    }),

  update: (lessonId, draft) =>
    transport(() => {
      const index = lessons.findIndex((l) => l.id === lessonId);
      if (index === -1) throw new ServiceError("not-found", "Lesson was not found.");
      lessons[index] = { ...draft, id: lessonId, createdAt: lessons[index].createdAt, updatedAt: new Date().toISOString() };
      return clone(lessons[index]);
    }),
};
