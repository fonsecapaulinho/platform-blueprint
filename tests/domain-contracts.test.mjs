import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';

const domain = loadTs('src/shared/domain/index.ts');
const fixtures = loadTs('src/shared/data/fixtures.ts');

test('every fixture satisfies its schema', () => {
  domain.teacherSchema.parse(fixtures.teacher);
  assert.equal(fixtures.students.length, 5);
  for (const student of fixtures.students) domain.studentSchema.parse(student);
  assert.equal(fixtures.lessons.length, 4);
  for (const lesson of fixtures.lessons) domain.lessonSchema.parse(lesson);
  for (const assignment of fixtures.assignments) domain.assignmentSchema.parse(assignment);
  for (const submission of fixtures.submissions) domain.submissionSchema.parse(submission);
  for (const entry of fixtures.feedback) domain.feedbackSchema.parse(entry);
});

test('the fixtures demonstrate one activity of each type and every badge state', () => {
  const types = new Set(fixtures.lessons.flatMap((lesson) => lesson.activities.map((a) => a.type)));
  assert.deepEqual([...types].sort(), ['gap-fill', 'multiple-choice', 'writing']);
  const statuses = new Set(fixtures.assignments.map((a) => a.status));
  assert.deepEqual([...statuses].sort(), ['in-progress', 'not-started', 'overdue', 'reviewed', 'submitted']);
});

test('fixture references resolve: no assignment or submission points at a missing record', () => {
  const lessonIds = new Set(fixtures.lessons.map((l) => l.id));
  const studentIds = new Set(fixtures.students.map((s) => s.id));
  const assignmentIds = new Set(fixtures.assignments.map((a) => a.id));
  for (const assignment of fixtures.assignments) {
    assert.ok(lessonIds.has(assignment.lessonId), `missing lesson ${assignment.lessonId}`);
    assert.ok(studentIds.has(assignment.studentId), `missing student ${assignment.studentId}`);
  }
  for (const submission of fixtures.submissions) {
    assert.ok(assignmentIds.has(submission.assignmentId), `missing assignment ${submission.assignmentId}`);
  }
});

test('a multiple-choice question whose correct option is not in its options is rejected', () => {
  const question = { id: 'q', prompt: 'p', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }], correctOptionId: 'zzz' };
  assert.equal(domain.multipleChoiceQuestionSchema.safeParse(question).success, false);
  assert.equal(domain.multipleChoiceQuestionSchema.safeParse({ ...question, correctOptionId: 'b' }).success, true);
});

test('a gap whose id has no placeholder in the template is rejected', () => {
  const question = { id: 'g', template: 'She ___ home.', gaps: [{ id: 'gap1', answer: 'went', alternatives: [] }] };
  assert.equal(domain.gapFillQuestionSchema.safeParse(question).success, false);
  assert.equal(domain.gapFillQuestionSchema.safeParse({ ...question, template: 'She {{gap1}} home.' }).success, true);
});

test('a writing activity with maxWords below minWords is rejected', () => {
  const activity = { id: 'w', type: 'writing', title: 'T', points: 10, prompt: 'P', minWords: 100, maxWords: 50 };
  assert.equal(domain.writingActivitySchema.safeParse(activity).success, false);
  assert.equal(domain.writingActivitySchema.safeParse({ ...activity, maxWords: 150 }).success, true);
});

test('the activity union discriminates on type and rejects an unknown one', () => {
  const [lesson] = fixtures.lessons;
  for (const activity of lesson.activities) {
    assert.equal(domain.activitySchema.parse(activity).type, activity.type);
  }
  assert.equal(domain.activitySchema.safeParse({ ...lesson.activities[0], type: 'matching' }).success, false);
});

test('timestamps must be ISO date-times', () => {
  assert.equal(domain.isoDateTimeSchema.safeParse('2026-11-23T02:00:00.000Z').success, true);
  assert.equal(domain.isoDateTimeSchema.safeParse('2026-13-01T00:00:00.000Z').success, false);
  assert.equal(domain.isoDateTimeSchema.safeParse('23/11/2026').success, false);
});

test('drafts omit the fields the service owns', () => {
  const draftKeys = Object.keys(domain.lessonDraftSchema.shape);
  assert.equal(draftKeys.includes('id'), false);
  assert.equal(draftKeys.includes('createdAt'), false);
  assert.equal(Object.keys(domain.studentDraftSchema.shape).includes('joinedAt'), false);
  assert.equal(Object.keys(domain.feedbackDraftSchema.shape).includes('teacherId'), false);
});
