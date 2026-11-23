import type { Assignment, Feedback, Lesson, Student, Submission, Teacher } from "@/shared/domain";

/**
 * The demo dataset. Fixed timestamps, so a screenshot taken today and one taken
 * next month show the same thing. Covers the minimum the delivery needs to
 * demonstrate: one teacher, five students, four lessons, one activity of each
 * type, and submissions in four different states.
 */

export const teacher: Teacher = {
  id: "teacher-fonseca",
  name: "Paulo Fonseca",
  email: "professor@example.com",
  role: "teacher",
};

export const students: Student[] = [
  { id: "student-ana", name: "Ana Ribeiro", email: "ana@example.com", role: "student", level: "B1", teacherId: teacher.id, joinedAt: "2026-02-10T13:00:00.000Z" },
  { id: "student-bruno", name: "Bruno Castro", email: "bruno@example.com", role: "student", level: "A2", teacherId: teacher.id, joinedAt: "2026-03-04T13:00:00.000Z" },
  { id: "student-carla", name: "Carla Nunes", email: "carla@example.com", role: "student", level: "B2", teacherId: teacher.id, joinedAt: "2026-04-18T13:00:00.000Z" },
  { id: "student-diego", name: "Diego Alves", email: "diego@example.com", role: "student", level: "A1", teacherId: teacher.id, joinedAt: "2026-06-01T13:00:00.000Z" },
  { id: "student-elisa", name: "Elisa Moraes", email: "elisa@example.com", role: "student", level: "C1", teacherId: teacher.id, joinedAt: "2026-08-22T13:00:00.000Z" },
];

export const lessons: Lesson[] = [
  {
    id: "lesson-past-simple",
    title: "Past simple: regular and irregular verbs",
    summary: "Forming and using the past simple, with the irregular verbs that come up most in conversation.",
    level: "A2",
    status: "published",
    authorId: teacher.id,
    createdAt: "2026-09-01T12:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    materials: [
      { id: "material-past-simple-notes", title: "Irregular verb list", kind: "pdf", url: "https://example.com/irregular-verbs.pdf", description: "The 60 most frequent irregular verbs." },
      { id: "material-past-simple-video", title: "Pronouncing -ed endings", kind: "video", url: "https://example.com/ed-endings" },
    ],
    activities: [
      {
        id: "activity-past-simple-mc",
        type: "multiple-choice",
        title: "Choose the correct past form",
        instructions: "Pick the form that completes each sentence.",
        points: 20,
        questions: [
          { id: "q1", prompt: "She ____ to the market yesterday.", correctOptionId: "q1-b", options: [{ id: "q1-a", text: "go" }, { id: "q1-b", text: "went" }, { id: "q1-c", text: "goes" }, { id: "q1-d", text: "gone" }] },
          { id: "q2", prompt: "They ____ the film last night.", correctOptionId: "q2-c", options: [{ id: "q2-a", text: "watchs" }, { id: "q2-b", text: "watching" }, { id: "q2-c", text: "watched" }, { id: "q2-d", text: "watch" }] },
        ],
      },
      {
        id: "activity-past-simple-gap",
        type: "gap-fill",
        title: "Complete the sentences",
        instructions: "Write the past simple of the verb in brackets.",
        points: 20,
        questions: [
          { id: "g1", template: "Last summer we {{gap1}} to Portugal.", gaps: [{ id: "gap1", answer: "travelled", alternatives: ["traveled"] }] },
          { id: "g2", template: "He {{gap2}} the door and {{gap3}} out.", gaps: [{ id: "gap2", answer: "opened", alternatives: [] }, { id: "gap3", answer: "walked", alternatives: ["went"] }] },
        ],
      },
      {
        id: "activity-past-simple-writing",
        type: "writing",
        title: "Write about last weekend",
        instructions: "Use at least five past simple verbs.",
        points: 30,
        prompt: "Describe what you did last weekend.",
        minWords: 60,
        maxWords: 150,
      },
    ],
  },
  {
    id: "lesson-job-interview",
    title: "Talking about your experience in an interview",
    summary: "Vocabulary and phrasing for describing past roles and responsibilities.",
    level: "B1",
    status: "published",
    authorId: teacher.id,
    createdAt: "2026-09-20T12:00:00.000Z",
    updatedAt: "2026-09-28T12:00:00.000Z",
    materials: [{ id: "material-interview-audio", title: "Mock interview recording", kind: "audio", url: "https://example.com/mock-interview.mp3" }],
    activities: [
      {
        id: "activity-interview-writing",
        type: "writing",
        title: "Your professional summary",
        points: 40,
        prompt: "Write a short summary of your professional experience, as you would say it out loud.",
        minWords: 80,
        maxWords: 200,
      },
    ],
  },
  {
    id: "lesson-phrasal-verbs",
    title: "Phrasal verbs for everyday situations",
    summary: "Twenty phrasal verbs grouped by the situation they belong to, not alphabetically.",
    level: "B2",
    status: "published",
    authorId: teacher.id,
    createdAt: "2026-10-05T12:00:00.000Z",
    updatedAt: "2026-10-05T12:00:00.000Z",
    materials: [{ id: "material-phrasal-list", title: "Grouped phrasal verbs", kind: "link", url: "https://example.com/phrasal-verbs" }],
    activities: [
      {
        id: "activity-phrasal-mc",
        type: "multiple-choice",
        title: "Which phrasal verb fits?",
        points: 25,
        questions: [{ id: "p1", prompt: "I need to ____ this contract before Friday.", correctOptionId: "p1-a", options: [{ id: "p1-a", text: "look over" }, { id: "p1-b", text: "look up to" }, { id: "p1-c", text: "look after" }] }],
      },
    ],
  },
  {
    id: "lesson-conditionals-draft",
    title: "Conditionals: first and second",
    summary: "Draft. Structure is laid out, activities are not written yet.",
    level: "B1",
    status: "draft",
    authorId: teacher.id,
    createdAt: "2026-11-10T12:00:00.000Z",
    updatedAt: "2026-11-10T12:00:00.000Z",
    materials: [],
    activities: [],
  },
];

/** One assignment per status StatusBadge renders, so every badge state is reachable in the demo. */
export const assignments: Assignment[] = [
  { id: "assignment-ana-past", lessonId: "lesson-past-simple", studentId: "student-ana", assignedById: teacher.id, assignedAt: "2026-11-02T12:00:00.000Z", dueAt: "2026-11-30T23:59:00.000Z", status: "reviewed" },
  { id: "assignment-bruno-past", lessonId: "lesson-past-simple", studentId: "student-bruno", assignedById: teacher.id, assignedAt: "2026-11-02T12:00:00.000Z", dueAt: "2026-11-30T23:59:00.000Z", status: "submitted" },
  { id: "assignment-carla-interview", lessonId: "lesson-job-interview", studentId: "student-carla", assignedById: teacher.id, assignedAt: "2026-11-08T12:00:00.000Z", dueAt: "2026-12-05T23:59:00.000Z", status: "in-progress" },
  { id: "assignment-diego-phrasal", lessonId: "lesson-phrasal-verbs", studentId: "student-diego", assignedById: teacher.id, assignedAt: "2026-11-15T12:00:00.000Z", dueAt: null, status: "not-started" },
  { id: "assignment-elisa-phrasal", lessonId: "lesson-phrasal-verbs", studentId: "student-elisa", assignedById: teacher.id, assignedAt: "2026-10-01T12:00:00.000Z", dueAt: "2026-10-20T23:59:00.000Z", status: "overdue" },
];

export const submissions: Submission[] = [
  {
    id: "submission-ana-past",
    assignmentId: "assignment-ana-past",
    studentId: "student-ana",
    startedAt: "2026-11-05T14:00:00.000Z",
    submittedAt: "2026-11-05T14:48:00.000Z",
    score: { correct: 5, total: 6, percentage: 83 },
    attempts: [
      { id: "attempt-ana-mc", activityId: "activity-past-simple-mc", activityType: "multiple-choice", startedAt: "2026-11-05T14:00:00.000Z", submittedAt: "2026-11-05T14:12:00.000Z", score: { correct: 2, total: 2, percentage: 100 }, answers: [{ type: "multiple-choice", questionId: "q1", selectedOptionId: "q1-b" }, { type: "multiple-choice", questionId: "q2", selectedOptionId: "q2-c" }] },
      { id: "attempt-ana-gap", activityId: "activity-past-simple-gap", activityType: "gap-fill", startedAt: "2026-11-05T14:12:00.000Z", submittedAt: "2026-11-05T14:30:00.000Z", score: { correct: 2, total: 3, percentage: 67 }, answers: [{ type: "gap-fill", questionId: "g1", gaps: { gap1: "traveled" } }, { type: "gap-fill", questionId: "g2", gaps: { gap2: "opened", gap3: "leaved" } }] },
      { id: "attempt-ana-writing", activityId: "activity-past-simple-writing", activityType: "writing", startedAt: "2026-11-05T14:30:00.000Z", submittedAt: "2026-11-05T14:48:00.000Z", score: null, answers: [{ type: "writing", questionId: "activity-past-simple-writing", text: "Last weekend I visited my grandmother in the countryside. We cooked together on Saturday morning and I helped her in the garden. In the afternoon my cousins arrived and we played cards until late. On Sunday I stayed home, read a book and watched an old film with my sister. It rained all day, so we did not go out at all." }] },
    ],
  },
  {
    id: "submission-bruno-past",
    assignmentId: "assignment-bruno-past",
    studentId: "student-bruno",
    startedAt: "2026-11-18T18:00:00.000Z",
    submittedAt: "2026-11-18T18:26:00.000Z",
    score: null,
    attempts: [
      { id: "attempt-bruno-mc", activityId: "activity-past-simple-mc", activityType: "multiple-choice", startedAt: "2026-11-18T18:00:00.000Z", submittedAt: "2026-11-18T18:09:00.000Z", score: { correct: 1, total: 2, percentage: 50 }, answers: [{ type: "multiple-choice", questionId: "q1", selectedOptionId: "q1-b" }, { type: "multiple-choice", questionId: "q2", selectedOptionId: "q2-d" }] },
      { id: "attempt-bruno-writing", activityId: "activity-past-simple-writing", activityType: "writing", startedAt: "2026-11-18T18:09:00.000Z", submittedAt: "2026-11-18T18:26:00.000Z", score: null, answers: [{ type: "writing", questionId: "activity-past-simple-writing", text: "I stayed at home last weekend. I watched three films and I cooked pasta on Sunday. My brother called me and we talked for one hour. I did not study much, so on Monday I felt bad about it." }] },
    ],
  },
  {
    id: "submission-carla-interview",
    assignmentId: "assignment-carla-interview",
    studentId: "student-carla",
    startedAt: "2026-11-20T10:00:00.000Z",
    submittedAt: null,
    score: null,
    attempts: [
      { id: "attempt-carla-writing", activityId: "activity-interview-writing", activityType: "writing", startedAt: "2026-11-20T10:00:00.000Z", submittedAt: null, score: null, answers: [{ type: "writing", questionId: "activity-interview-writing", text: "I have worked as a project assistant for three years." }] },
    ],
  },
];

export const feedback: Feedback[] = [
  {
    id: "feedback-ana-past",
    submissionId: "submission-ana-past",
    teacherId: teacher.id,
    comment: "Good control of the regular forms. Two things to work on: \"leaved\" should be \"left\", and in the writing you repeat \"and\" where a full stop would read better. The story itself is clear and well ordered.",
    awardedPoints: 26,
    createdAt: "2026-11-07T09:00:00.000Z",
  },
];
