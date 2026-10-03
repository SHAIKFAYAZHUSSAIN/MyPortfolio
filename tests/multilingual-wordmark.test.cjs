const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('MultilingualWordmark data configuration and script correctness', () => {
  const fileContent = fs.readFileSync('src/components/multilingual-wordmark.tsx', 'utf8');

  // Verify the list contains 20 scripts
  const scriptMatches = fileContent.match(/lang:\s*["']([a-z]{2})["']/g);
  assert.ok(scriptMatches, 'Should have language definitions');
  const languages = scriptMatches.map(m => m.match(/["']([a-z]{2})["']/)[1]);
  assert.equal(languages.length, 20, 'Should have exactly 20 languages defined');

  // Expected 20 languages
  const expectedLanguages = [
    'en', 'ur', 'ar', 'hi', 'te', 'bn', 'ta', 'ml', 'kn', 'mr',
    'gu', 'pa', 'zh', 'ja', 'ko', 'ru', 'el', 'he', 'fa', 'th'
  ];
  for (const lang of expectedLanguages) {
    assert.ok(languages.includes(lang), `Language ${lang} should be included`);
  }

  // Verify font requirements:
  // Almarai for Urdu, Arabic, Persian
  assert.ok(fileContent.includes('"Almarai"'), 'Almarai font must be specified');
  // ZCOOL KuaiLe for Chinese
  assert.ok(fileContent.includes('"ZCOOL KuaiLe"'), 'ZCOOL KuaiLe font must be specified for Chinese');

  // Verify RTL scripts are flagged with dir: "rtl"
  const rtlLanguages = ['ur', 'ar', 'he', 'fa'];
  for (const rtl of rtlLanguages) {
    const langBlockRegex = new RegExp(`lang:\\s*["']${rtl}["'][\\s\\S]*?dir:\\s*["']rtl["']`);
    assert.ok(langBlockRegex.test(fileContent), `Language ${rtl} must have dir: "rtl"`);
  }

  // Accessibility: Screen reader label "Fayaz Shaik" with sr-only, animated track has aria-hidden="true"
  assert.ok(fileContent.includes('<span className="sr-only">Fayaz Shaik</span>'), 'Must have sr-only Fayaz Shaik');
  assert.ok(fileContent.includes('aria-hidden="true"'), 'Cycling visual track must be marked aria-hidden="true"');

  // Prefers reduced motion handled
  assert.ok(fileContent.includes('prefers-reduced-motion: reduce'), 'prefers-reduced-motion must be checked');
});

test('Google Fonts link and preconnects are present in layout.tsx', () => {
  const layoutContent = fs.readFileSync('src/app/layout.tsx', 'utf8');
  assert.ok(layoutContent.includes('fonts.googleapis.com'), 'Must have fonts.googleapis.com preconnect or stylesheet');
  assert.ok(layoutContent.includes('fonts.gstatic.com'), 'Must have fonts.gstatic.com preconnect');
  assert.ok(layoutContent.includes('Almarai:wght@300;400;700;800'), 'Must include Almarai font weights');
  assert.ok(layoutContent.includes('ZCOOL+KuaiLe'), 'Must include ZCOOL KuaiLe font');
});

test('CSS provides layout shift protection and smooth transitions for wordmark', () => {
  const artCss = fs.readFileSync('src/app/art-direction.css', 'utf8');
  assert.ok(artCss.includes('.wordmark {'), '.wordmark must be styled');
  assert.ok(artCss.includes('min-width: 195px;'), 'Desktop wordmark must have stable min-width');
  assert.ok(artCss.includes('white-space: nowrap;'), 'Wordmark track must avoid wrapping');
  assert.ok(artCss.includes('.wordmark-text[data-phase="visible"]'), 'Visible phase styles defined');
  assert.ok(artCss.includes('.wordmark-text[data-phase="exiting"]'), 'Exiting phase styles defined');
  assert.ok(artCss.includes('.wordmark-text[dir="rtl"]'), 'RTL styles defined with direction: rtl');
  assert.ok(artCss.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced motion CSS media query handled');
});
