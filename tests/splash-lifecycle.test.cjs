const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('OpeningSplash includes all required action words in order', () => {
  const code = fs.readFileSync('src/components/opening-splash.tsx', 'utf8');
  const expectedWords = [
    'LOADING',
    'FILMING',
    'SHOOTING',
    'CAPTURING',
    'CUTTING',
    'EDITING',
    'CODING',
    'BUILDING',
    'EXPERIMENTING',
    'CREATING',
  ];

  expectedWords.forEach(word => {
    assert.ok(code.includes(`"${word}"`), `Must contain action word: ${word}`);
  });

  assert.ok(code.includes('FAYAZ SHAIK'), 'Must resolve to identity: FAYAZ SHAIK');
  assert.ok(code.includes('CURIOSITY'), 'Must include FILM × CODE × CURIOSITY');
});

test('OpeningSplash timing fits within 2 to 4 seconds target', () => {
  const code = fs.readFileSync('src/components/opening-splash.tsx', 'utf8');
  const durationMatch = code.match(/const durations = \[([\d\s,]+)\]/);
  assert.ok(durationMatch, 'Should declare durations array');
  const durations = durationMatch[1].split(',').map(s => parseInt(s.trim(), 10)).filter(Boolean);
  assert.equal(durations.length, 10, 'Must have 10 word durations');

  const totalWordTime = durations.reduce((sum, d) => sum + d, 0);
  const finalHoldMatch = code.match(/const finalHold = (\d+);/);
  const finalHold = finalHoldMatch ? parseInt(finalHoldMatch[1], 10) : 500;
  const totalSequenceTime = totalWordTime + finalHold;

  assert.ok(totalSequenceTime >= 2000 && totalSequenceTime <= 4000,
    `Total sequence time (${totalSequenceTime}ms) must be between 2000ms and 4000ms`);
});

test('Session persistence and reduced motion conditions are respected', () => {
  const splashCode = fs.readFileSync('src/components/opening-splash.tsx', 'utf8');
  assert.ok(splashCode.includes('portfolio_splash_seen'), 'Checks session storage for visited state');
  assert.ok(splashCode.includes('motion.query.reduce'), 'Checks reduced motion media query');
  assert.ok(splashCode.includes('window.scrollY > 40'), 'Bypasses on restored scroll');
  assert.ok(splashCode.includes('window.location.hash'), 'Bypasses on deep link');

  const layoutCode = fs.readFileSync('src/app/layout.tsx', 'utf8');
  assert.ok(layoutCode.includes('portfolio_splash_seen'), 'Layout script checks session storage');
  assert.ok(layoutCode.includes('splash-pending'), 'Layout marks splash-pending class');
});

test('CinematicHero coordinates with splash:reveal event', () => {
  const heroCode = fs.readFileSync('src/components/cinematic-hero.tsx', 'utf8');
  assert.ok(heroCode.includes('splash-pending'), 'Hero checks for splash-pending state');
  assert.ok(heroCode.includes('splash:reveal'), 'Hero listens for splash:reveal event');
});

test('Styles use existing palette tokens and reduced-motion overrides', () => {
  const css = fs.readFileSync('src/app/motion.css', 'utf8');
  assert.ok(css.includes('.opening-splash'), 'Contains .opening-splash class');
  assert.ok(css.includes('var(--canvas)'), 'Uses --canvas background token');
  assert.ok(css.includes('var(--text)'), 'Uses --text typography token');
  assert.ok(css.includes('var(--accent)'), 'Uses --accent green token');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'Contains reduced motion media query');
  assert.ok(css.includes('.opening-splash {\n    display: none !important;\n  }'), 'Hides splash in reduced motion');
});
