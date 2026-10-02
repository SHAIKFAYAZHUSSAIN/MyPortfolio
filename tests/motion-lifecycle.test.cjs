const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function harness(allowed = true) {
  class Target {
    listeners = new Map();
    addEventListener(type, listener) { if (!this.listeners.has(type)) this.listeners.set(type,new Set()); this.listeners.get(type).add(listener); }
    removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
    emit(type, event = {}) { this.listeners.get(type)?.forEach(listener => listener(event)); }
    count() { return [...this.listeners.values()].reduce((n,list) => n + list.size,0); }
  }
  const surface = new Target(), preference = new Target(), document = new Target();
  preference.matches = allowed; document.hidden = false;
  surface.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1000, height: 600 });
  const style = { transform: 'scale(1.02)', removeProperty(key) { delete this[key]; } };
  const frames = new Map(); let id = 0, intersection, disconnected = false;
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync('src/lib/motion.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(source, { module, exports: module.exports, document,
    matchMedia: () => preference,
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: frame => frames.delete(frame),
    IntersectionObserver: class { constructor(callback) { intersection = callback; } observe() {} disconnect() { disconnected = true; } },
  });
  const cleanup = module.exports.bindDrift(surface, { style }, 18);
  const flush = () => { let ticks = 0; while (frames.size && ticks < 300) { const batch = [...frames.values()]; frames.clear(); batch.forEach(callback => callback()); ticks++; } return ticks; };
  return { surface, preference, document, frames, style, cleanup, flush, offscreen: () => intersection([{ isIntersecting: false }]), disconnected: () => disconnected };
}

test('camera response settles and does not overwrite scroll/entrance transforms', () => {
  const h = harness();
  h.surface.emit('pointermove', { pointerType: 'mouse', clientX: 900, clientY: 300 });
  assert.ok(h.frames.size > 0);
  assert.ok(h.flush() < 300, 'RAF must sleep once settled');
  assert.equal(h.frames.size, 0);
  assert.equal(h.style.transform, 'scale(1.02)');
  assert.ok(parseFloat(h.style.translate) > 0 && parseFloat(h.style.translate) <= 18);
  h.cleanup();
});

test('reduced motion and touch input never start camera response', () => {
  const h = harness(false);
  h.surface.emit('pointermove', { pointerType: 'mouse', clientX: 900, clientY: 300 });
  assert.equal(h.frames.size, 0);
  h.preference.matches = true;
  h.surface.emit('pointermove', { pointerType: 'touch', clientX: 900, clientY: 300 });
  assert.equal(h.frames.size, 0);
  h.cleanup();
});

test('preference changes, offscreen, hidden tab and unmount cancel pending frames', () => {
  const h = harness();
  const move = () => h.surface.emit('pointermove', { pointerType: 'mouse', clientX: 900, clientY: 300 });
  move(); h.preference.matches = false; h.preference.emit('change');
  assert.equal(h.frames.size, 0);
  h.preference.matches = true; move(); h.offscreen();
  assert.equal(h.frames.size, 0);
  move(); h.document.hidden = true; h.document.emit('visibilitychange');
  assert.equal(h.frames.size, 0);
  h.document.hidden = false; move(); h.cleanup();
  assert.equal(h.frames.size, 0);
  assert.equal(h.surface.count() + h.preference.count() + h.document.count(), 0);
  assert.equal(h.style.translate, undefined);
  assert.equal(h.disconnected(), true);
});
