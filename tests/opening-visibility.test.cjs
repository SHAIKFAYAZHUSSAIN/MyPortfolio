const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const source = readFileSync('src/app/layout.tsx', 'utf8');
const script = source.match(/const splashPendingScript = `([^`]+)`/)[1];
function run(overrides = {}) {
  const classes = new Set();
  let recovery;
  const window = { location: { pathname: '/', hash: '' }, scrollY: 0, matchMedia: () => ({ matches: false }), setTimeout: fn => { recovery = fn; }, ...overrides };
  vm.runInNewContext(script, { window, document: { documentElement: { classList: { add: value => classes.add(value), remove: value => classes.delete(value) } } }, sessionStorage: { getItem: () => null } });
  return { classes, recover: () => recovery?.() };
}
test('direct film pages never hide navigation behind a missing splash', () => {
  for (const pathname of ['/films/dope', '/films/spectre', '/films/one-last-dose']) {
    assert.equal(run({ location: { pathname, hash: '' } }).classes.size, 0);
  }
});
test('home introduction fails open if hydration does not finish', () => {
  const page = run();
  assert.equal(page.classes.has('splash-pending'), true);
  page.recover();
  assert.equal(page.classes.size, 0);
});
test('deep links, restored scroll and reduced motion retain visible content', () => {
  for (const options of [{ location: { pathname: '/', hash: '#work' } }, { scrollY: 80 }, { matchMedia: () => ({ matches: true }) }]) {
    assert.equal(run(options).classes.size, 0);
  }
});
