import type { CefrLevel, Lesson, LessonDraft, LessonStatus } from "@/shared/domain";

/** What FilterBar (S2.2) drives on the lesson library. All fields optional, all combined with AND. */
export type LessonFilter = {
  level?: CefrLevel;
  status?: LessonStatus;
  /** Matched against title and summary, case-insensitively. */
  query?: string;
};

/** UI contract. A production implementation must authorise every call on the server. */
export interface LessonService {
  list(filter?: LessonFilter): Promise<Lesson[]>;
  get(lessonId: string): Promise<Lesson>;
  create(draft: LessonDraft): Promise<Lesson>;
  update(lessonId: string, draft: LessonDraft): Promise<Lesson>;
}
