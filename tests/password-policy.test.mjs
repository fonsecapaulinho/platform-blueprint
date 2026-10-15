import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../src/features/auth/password-policy.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { evaluatePassword } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

const good = 'Cedar!9RiverMoon';
test('accepts a non-obvious password and Unicode letters', () => {
  assert.equal(evaluatePassword(good).valid, true);
  assert.equal(evaluatePassword('Élan!9RivièreBleue').valid, true);
});
test('enforces length and all requested character classes', () => {
  for (const value of ['', 'Ab!9xy', 'cedar!9rivermoon', 'CEDAR!9RIVERMOON', 'Cedar!RiverMoon', 'Cedar9RiverMoon', 'A!9' + 'x'.repeat(126)]) assert.equal(evaluatePassword(value).valid, false);
  assert.equal(evaluatePassword('A!9' + '😀'.repeat(9)).checks.length, true);
});
test('rejects common passwords and obfuscated versions', () => {
  for (const value of ['Password!9824', 'P@ssw0rd!9824', 'Welcome!9824', 'S3nha!9824Moon', 'Blueprint!9824']) assert.equal(evaluatePassword(value).checks.common, false, value);
});
test('rejects ascending, descending, keyboard and repeated patterns', () => {
  for (const value of ['Cedar!1234Moon', 'Cedar!4321Moon', 'Cedar!abcd9Moon', 'Cedar!dcba9Moon', 'Cedar!asdf9Moon', 'Cedar!aaa9Moon', 'Cedar!xyxyxy9Moon']) assert.equal(evaluatePassword(value).checks.patterns, false, value);
});
test('rejects name/email even with case, accents or common substitutions', () => {
  for (const [value,identity] of [['Maria!9RiverMoon',{name:'Maria Silva'}],['M4ria!9RiverMoon',{name:'Maria Silva'}],['Joao!9RiverMoon',{name:'João Silva'}],['Alice!9RiverMoon',{email:'alice.smith@example.com'}]]) assert.equal(evaluatePassword(value,identity).checks.personal,false);
  assert.equal(evaluatePassword(good, {name:'Alice Smith',email:'alice@example.com'}).valid, true);
});
test('strength never reports strong when any rule fails', () => {
  for (const value of ['', 'Password!9824', 'Cedar!1234Moon', 'Cedar!RiverMoon']) assert.notEqual(evaluatePassword(value).strength,3);
  assert.equal(evaluatePassword(good).strength,3);
});
