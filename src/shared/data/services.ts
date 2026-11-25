import { mockAssignmentService } from "@/features/assignments/mock-assignment-service";
import { mockFeedbackService } from "@/features/feedback/mock-feedback-service";
import { mockLessonService } from "@/features/lessons/mock-lesson-service";
import { mockStudentService } from "@/features/students/mock-student-service";
import { mockSubmissionService } from "@/features/submissions/mock-submission-service";

/**
 * The one place a component reaches for data. Swapping a mock for a real HTTP
 * implementation is a change here and nowhere else — no component imports a
 * mock directly.
 */
export const services = {
  students: mockStudentService,
  lessons: mockLessonService,
  assignments: mockAssignmentService,
  submissions: mockSubmissionService,
  feedback: mockFeedbackService,
};

export type Services = typeof services;
