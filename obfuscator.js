// obfuscator.js - Multi-language support (JS, C, Python)

const RESERVED = new Set([
  // JS keywords
  'break','case','catch','class','const','continue','debugger','default',
  'delete','do','else','export','extends','finally','for','function','if',
  'import','in','instanceof','let','new','return','static','super','switch',
  'this','throw','try','typeof','var','void','while','with','yield',
  'true','false','null','undefined','NaN','Infinity','arguments',
  // C / C++ / Java
  'int','float','double','char','bool','long','short',
  'unsigned','signed','struct','enum','typedef','sizeof',
  'extern','register','volatile','inline',
  'public','private','protected','namespace','template',
  'virtual','override','final',
  // Python keywords
  'def','lambda','pass','raise','from','with','as','assert',
  'global','nonlocal','not','and','or','is','elif','None','True','False',
  'range','len','print','str','list','dict','set','tuple','type',
  // Common builtins
  'console','log','Math','JSON','window','document',
  'Object','Array','String','Number','Boolean','Promise',
  'async','await','of','get','set','constructor',
]);

const _LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const _POOL    = _LETTERS + '0123456789';

function randomIdent(usedSet) {
  let minLen = 6, maxLen = 9, attempts = 0, name;
  do {
    const len = minLen + Math.floor(Math.random() * (maxLen - minLen + 1));
    let s = _LETTERS[Math.floor(Math.random() * _LETTERS.length)];
    for (let i = 1; i < len; i++) {
      s += _POOL[Math.floor(Math.random() * _POOL.length)];
    }
    name = s;
    if (++attempts > 5000) { minLen++; maxLen++; attempts = 0; }
  } while (usedSet.has(name) || RESERVED.has(name));
  usedSet.add(name);
  return name;
}

function reEscape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractDeclaredNames(src) {
  const names = new Set();

  // 1. JS/C named functions: function foo(
  const reFn = /function\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g;
  let m;
  while ((m = reFn.exec(src)) !== null) {
    if (!RESERVED.has(m[1])) names.add(m[1]);
  }

  // 2. Python functions: def foo(
  const rePyDef = /def\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(/g;
  while ((m = rePyDef.exec(src)) !== null) {
    if (!RESERVED.has(m[1])) names.add(m[1]);
  }

  // 3. JS/C variable declarations: var/let/const/int/float/etc. varName
  const declKeywords = ['var','let','const','int','float','double','char','bool','long','short','unsigned','signed','auto','string'];
  const reVar = new RegExp('(?:^|[^A-Za-z0-9_$])(' + declKeywords.join('|') + ')\\s+([A-Za-z_$][A-Za-z0-9_$]*)', 'g');
  while ((m = reVar.exec(src)) !== null) {
    if (!RESERVED.has(m[2])) names.add(m[2]);
  }

  // 4. Class declarations: class Foo
  const reCls = /class\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
  while ((m = reCls.exec(src)) !== null) {
    if (!RESERVED.has(m[1])) names.add(m[1]);
  }

  // 5. JS/C function parameters: function foo(a, b, c)
  const reParams = /function\s*[A-Za-z_$][A-Za-z0-9_$]*?\s*\(([^)]*)\)/g;
  while ((m = reParams.exec(src)) !== null) {
    const paramStr = m[1].trim();
    if (!paramStr) continue;
    paramStr.split(',').forEach(part => {
      const tokens = part.trim().split(/\s+/);
      const varName = tokens[tokens.length - 1];
      if (varName && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(varName) && !RESERVED.has(varName)) {
        names.add(varName);
      }
    });
  }

  // 6. Python function parameters: def foo(a, b, c):
  const rePyParams = /def\s+[A-Za-z_][A-Za-z0-9_]*\s*\(([^)]*)\)/g;
  while ((m = rePyParams.exec(src)) !== null) {
    const paramStr = m[1].trim();
    if (!paramStr) continue;
    paramStr.split(',').forEach(part => {
      // Handle "arr: list" or just "arr"
      const clean = part.split(':')[0].trim();
      if (clean && /^[A-Za-z_][A-Za-z0-9_]*$/.test(clean) && !RESERVED.has(clean)) {
        names.add(clean);
      }
    });
  }

  // 7. Python variable assignments (simple): varName =
  // Only capture single-word LHS to avoid false positives
  const rePyVar = /(?:^|[\n;])\s*([A-Za-z_][A-Za-z0-9_]*)\s*=/gm;
  while ((m = rePyVar.exec(src)) !== null) {
    if (!RESERVED.has(m[1])) names.add(m[1]);
  }

  // 8. Anonymous function params: function(x, y)
  const reAnonParams = /function\s*\(([^)]+)\)/g;
  while ((m = reAnonParams.exec(src)) !== null) {
    const paramStr = m[1].trim();
    paramStr.split(',').forEach(part => {
      const tokens = part.trim().split(/\s+/);
      const varName = tokens[tokens.length - 1];
      if (varName && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(varName) && !RESERVED.has(varName)) {
        names.add(varName);
      }
    });
  }

  return names;
}

function replaceIdentifiers(src, forwardMap) {
  const originals = Object.keys(forwardMap);
  if (!originals.length) return src;
  originals.sort((a, b) => b.length - a.length);
  const pattern = '\\b(' + originals.map(reEscape).join('|') + ')\\b';
  const re = new RegExp(pattern, 'g');
  return src.replace(re, match => forwardMap[match] !== undefined ? forwardMap[match] : match);
}

function obfuscate(src) {
  const declared = extractDeclaredNames(src);
  const usedNames  = new Set();
  const forwardMap = {};
  const decodeMap  = {};
  declared.forEach(orig => {
    const fresh = randomIdent(usedNames);
    forwardMap[orig]  = fresh;
    decodeMap[fresh]  = orig;
  });
  const obfuscated = replaceIdentifiers(src, forwardMap);
  return { obfuscated, mapObj: decodeMap };
}

function deobfuscate(obfCode, decodeMap) {
  return replaceIdentifiers(obfCode, decodeMap);
}
