import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const source = fs.readFileSync(new URL('../src/shared/layout/auth-card.tsx', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
const nodeRequire = createRequire(import.meta.url);
const module = { exports: {} };
vm.runInThisContext(`(function(require, module, exports) { ${outputText}\n })`)(specifier => specifier.endsWith('.css') ? { card: 'card', cardScene: 'scene', cardFlipper: 'flipper', cardFace: 'face' } : nodeRequire(specifier), module, module.exports);
const { AuthCard } = module.exports;

test('AuthCard is static by default and renders only the selected content when disabled', () => {
  const front = renderToStaticMarkup(createElement(AuthCard, { back: 'Teacher' }, 'Student'));
  assert.match(front, /Student/); assert.doesNotMatch(front, /Teacher|flipper|data-flipped/);
  const back = renderToStaticMarkup(createElement(AuthCard, { enableFlip: false, flipped: true, back: 'Teacher' }, 'Student'));
  assert.match(back, /Teacher/); assert.doesNotMatch(back, /Student|flipper|data-flipped/);
});

test('enabled flip reserves both faces and removes the inactive face from accessibility/focus', () => {
  for (const flipped of [false, true]) {
    const html = renderToStaticMarkup(createElement(AuthCard, { enableFlip: true, flipped, back: 'Teacher' }, 'Student'));
    assert.match(html, new RegExp(`data-flipped="${flipped}"`));
    assert.match(html, /Student/); assert.match(html, /Teacher/);
    assert.match(html, new RegExp(`data-face="${flipped ? 'front' : 'back'}" inert="" aria-hidden="true"`));
  }
});
