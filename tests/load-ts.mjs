import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

/** Loads a TypeScript module in-process, resolving relative and "@/" imports the way tsconfig does. */
const root = url.fileURLToPath(new URL('../', import.meta.url));
const nodeRequire = createRequire(import.meta.url);
const cache = new Map();

function resolve(specifier, fromDir) {
  let base;
  if (specifier.startsWith('@/')) base = path.join(root, 'src', specifier.slice(2));
  else if (specifier.startsWith('.')) base = path.resolve(fromDir, specifier);
  else return null;
  for (const candidate of [`${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(`cannot resolve ${specifier} from ${fromDir}`);
}

export function loadTs(file) {
  const abs = path.isAbsolute(file) ? file : path.join(root, file);
  const cached = cache.get(abs);
  if (cached !== undefined) return cached;

  const source = fs.readFileSync(abs, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  });
  const module = { exports: {} };
  cache.set(abs, module.exports);
  const dir = path.dirname(abs);
  vm.runInThisContext(`(function(require, module, exports, __filename, __dirname) { ${outputText}\n })`, { filename: abs })(
    (specifier) => {
      const resolved = resolve(specifier, dir);
      return resolved === null ? nodeRequire(specifier) : loadTs(resolved);
    },
    module,
    module.exports,
    abs,
    dir,
  );
  return module.exports;
}
