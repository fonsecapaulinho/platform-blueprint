import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';

process.env.NEXT_PUBLIC_MOCK_LATENCY_MS = '0';

const session = loadTs('src/features/session/demo-session.ts');
const fixtures = loadTs('src/shared/data/fixtures.ts');

test('a well-formed cookie parses into a stored session', () => {
  assert.deepEqual(
    session.parseDemoSession(JSON.stringify({ userId: 'student-ana', role: 'student' })),
    { userId: 'student-ana', role: 'student' },
  );
});

test('anything malformed parses to null rather than throwing', () => {
  for (const raw of [
    undefined,
    '',
    'not json',
    '[]',
    'null',
    '"student"',
    JSON.stringify({ userId: 'student-ana' }),
    JSON.stringify({ role: 'student' }),
    JSON.stringify({ userId: '', role: 'student' }),
    JSON.stringify({ userId: 'student-ana', role: 'admin' }),
    JSON.stringify({ userId: 'student-ana', role: ['student'] }),
    JSON.stringify({ userId: 42, role: 'student' }),
  ]) {
    assert.equal(session.parseDemoSession(raw), null, `expected null for ${String(raw)}`);
  }
});

test('the session resolves its user through the mock layer, not from the cookie', async () => {
  const resolved = await session.resolveSession({ userId: 'student-ana', role: 'student' });
  assert.equal(resolved.user.id, 'student-ana');
  assert.equal(resolved.user.role, 'student');
  assert.equal(resolved.user.name, fixtures.students[0].name);
  assert.equal(resolved.level, fixtures.students[0].level);
});

test('a teacher session resolves to the fixture teacher and carries no level', async () => {
  const resolved = await session.resolveSession({ userId: 'teacher-fonseca', role: 'teacher' });
  assert.equal(resolved.user.role, 'teacher');
  assert.equal(resolved.level, null);
});

test('a cookie claiming a role its id does not have resolves to null', async () => {
  assert.equal(await session.resolveSession({ userId: 'student-ana', role: 'teacher' }), null);
  assert.equal(await session.resolveSession({ userId: 'teacher-fonseca', role: 'student' }), null);
  assert.equal(await session.resolveSession({ userId: 'nobody', role: 'student' }), null);
});
