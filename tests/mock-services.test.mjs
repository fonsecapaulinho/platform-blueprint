import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';

process.env.NEXT_PUBLIC_MOCK_LATENCY_MS = '0';

const { services } = loadTs('src/shared/data/services.ts');
const { isServiceError } = loadTs('src/shared/data/mock-transport.ts');
const { resolveStatus } = loadTs('src/features/assignments/mock-assignment-service.ts');
const fixtures = loadTs('src/shared/data/fixtures.ts');

const TEACHER = 'teacher-fonseca';
const NEW_ASSIGNMENT = 'assignment-student-diego-lesson-past-simple';

test('the lesson filter combines level, status and free text', async () => {
  assert.equal((await services.lessons.list()).length, 4);
  assert.equal((await services.lessons.list({ status: 'draft' })).length, 1);
  assert.equal((await services.lessons.list({ level: 'A2' })).length, 1);
  assert.equal((await services.lessons.list({ query: 'PHRASAL' })).length, 1);
  assert.equal((await services.lessons.list({ level: 'A2', status: 'draft' })).length, 0);
});

test('reads hand back copies, so a caller cannot mutate the fixtures', async () => {
  const [lesson] = await services.lessons.list({ status: 'draft' });
  lesson.title = 'mutated';
  const [again] = await services.lessons.list({ status: 'draft' });
  assert.notEqual(again.title, 'mutated');
});

test('an unfinished assignment past its due date reads as overdue, a submitted one does not', () => {
  const past = { dueAt: '2026-01-01T00:00:00.000Z', status: 'not-started' };
  const future = { dueAt: '2099-01-01T00:00:00.000Z', status: 'not-started' };
  assert.equal(resolveStatus(past), 'overdue');
  assert.equal(resolveStatus(future), 'not-started');
  assert.equal(resolveStatus({ ...past, status: 'submitted' }), 'submitted');
  assert.equal(resolveStatus({ dueAt: null, status: 'in-progress' }), 'in-progress');
});

test('assigning one lesson to several students creates one assignment each', async () => {
  const created = await services.assignments.assign(TEACHER, {
    lessonId: 'lesson-past-simple',
    studentIds: ['student-diego'],
    dueAt: '2099-01-01T00:00:00.000Z',
  });
  assert.equal(created.length, 1);
  assert.equal(created[0].id, NEW_ASSIGNMENT);
  assert.equal(created[0].status, 'not-started');
});

test('a multiple-choice attempt is scored against the correct options', async () => {
  const submission = await services.submissions.saveAttempt(NEW_ASSIGNMENT, {
    activityId: 'activity-past-simple-mc',
    answers: [
      { type: 'multiple-choice', questionId: 'q1', selectedOptionId: 'q1-b' },
      { type: 'multiple-choice', questionId: 'q2', selectedOptionId: 'q2-a' },
    ],
  });
  const attempt = submission.attempts.find((a) => a.activityId === 'activity-past-simple-mc');
  assert.deepEqual(attempt.score, { correct: 1, total: 2, percentage: 50 });
});

test('gap-fill accepts the listed alternatives, ignoring case and surrounding space', async () => {
  const submission = await services.submissions.saveAttempt(NEW_ASSIGNMENT, {
    activityId: 'activity-past-simple-gap',
    answers: [
      { type: 'gap-fill', questionId: 'g1', gaps: { gap1: '  Traveled ' } },
      { type: 'gap-fill', questionId: 'g2', gaps: { gap2: 'opened' } },
    ],
  });
  const attempt = submission.attempts.find((a) => a.activityId === 'activity-past-simple-gap');
  assert.deepEqual(attempt.score, { correct: 2, total: 3, percentage: 67 });
});

test('a writing attempt is left unscored for the teacher', async () => {
  const submission = await services.submissions.saveAttempt(NEW_ASSIGNMENT, {
    activityId: 'activity-past-simple-writing',
    answers: [{ type: 'writing', questionId: 'activity-past-simple-writing', text: 'I went to the beach.' }],
  });
  const attempt = submission.attempts.find((a) => a.activityId === 'activity-past-simple-writing');
  assert.equal(attempt.score, null);
  assert.deepEqual(submission.score, { correct: 3, total: 5, percentage: 60 });
});

test('saving the same activity twice replaces the attempt instead of appending one', async () => {
  const before = await services.submissions.getForAssignment(NEW_ASSIGNMENT);
  const submission = await services.submissions.saveAttempt(NEW_ASSIGNMENT, {
    activityId: 'activity-past-simple-mc',
    answers: [
      { type: 'multiple-choice', questionId: 'q1', selectedOptionId: 'q1-b' },
      { type: 'multiple-choice', questionId: 'q2', selectedOptionId: 'q2-c' },
    ],
  });
  assert.equal(submission.attempts.length, before.attempts.length);
  const attempt = submission.attempts.find((a) => a.activityId === 'activity-past-simple-mc');
  assert.deepEqual(attempt.score, { correct: 2, total: 2, percentage: 100 });
});

test('submitting twice is rejected as a conflict', async () => {
  const submitted = await services.submissions.submit(NEW_ASSIGNMENT);
  assert.notEqual(submitted.submittedAt, null);

  await assert.rejects(
    () => services.submissions.submit(NEW_ASSIGNMENT),
    (error) => isServiceError(error) && error.code === 'conflict',
  );
  await assert.rejects(
    () => services.submissions.saveAttempt(NEW_ASSIGNMENT, { activityId: 'activity-past-simple-mc', answers: [] }),
    (error) => isServiceError(error) && error.code === 'conflict',
  );
});

test('feedback moves the assignment to reviewed', async () => {
  const pending = await services.submissions.listPendingReview(TEACHER);
  assert.ok(pending.some((s) => s.assignmentId === NEW_ASSIGNMENT));

  const saved = await services.feedback.save(`submission-${NEW_ASSIGNMENT}`, TEACHER, {
    comment: 'Clear writing. Watch the irregular past forms.',
    awardedPoints: 22,
  });
  assert.equal(saved.teacherId, TEACHER);
  assert.equal(saved.source, 'teacher');
  assert.equal(saved.state, 'ready');

  const read = await services.feedback.getForSubmission(`submission-${NEW_ASSIGNMENT}`);
  assert.equal(read.comment, saved.comment);

  const view = await services.assignments.get(NEW_ASSIGNMENT);
  assert.equal(view.status, 'reviewed');
  const stillPending = await services.submissions.listPendingReview(TEACHER);
  assert.equal(stillPending.some((s) => s.assignmentId === NEW_ASSIGNMENT), false);
});

test('feedback on a submission that was never handed in is rejected', async () => {
  await assert.rejects(
    () => services.feedback.save('submission-carla-interview', TEACHER, { comment: 'x', awardedPoints: null }),
    (error) => isServiceError(error) && error.code === 'conflict',
  );
});

test('an unknown id fails as not-found, not as a crash', async () => {
  await assert.rejects(
    () => services.lessons.get('lesson-does-not-exist'),
    (error) => isServiceError(error) && error.code === 'not-found',
  );
  assert.equal(await services.submissions.getForAssignment('assignment-nope'), null);
});

test('creating a student with an email already in use is a conflict', async () => {
  await assert.rejects(
    () => services.students.create(TEACHER, { name: 'Another Ana', email: fixtures.students[0].email, level: 'B1', teacherId: TEACHER }),
    (error) => isServiceError(error) && error.code === 'conflict',
  );
});
