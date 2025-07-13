/**
 * Test for the specific examples that are failing in the evaluation
 */

const { normalizeText } = require('../src/index');

// The specific examples that are failing
const examples = [
  {
    original: 'קניתי שלושה ספרים חדשים בחנות.',
    expected: 'קניתי 3 ספרים חדשים בחנות.'
  },
  {
    original: 'יש לי שתי אחיות ואח אחד.',
    expected: 'יש לי 2 אחיות ו-1 אח.'
  },
  {
    original: 'היא חגגה יום הולדת שבע עשרה עם כל חבריה.',
    expected: 'היא חגגה יום הולדת 17 עם כל חבריה.'
  },
  {
    original: 'בכיתה שלנו יש שלושים ושניים תלמידים.',
    expected: 'בכיתה שלנו יש 32 תלמידים.'
  },
  {
    original: 'הספר מכיל ארבע מאות חמישים ושמונה עמודים.',
    expected: 'הספר מכיל 458 עמודים.'
  },
  {
    original: 'יותר מחמשת אלפים איש הגיעו להופעה בפארק.',
    expected: 'יותר מ-5,000 איש הגיעו להופעה בפארק.'
  },
  {
    original: 'סבתי נולדה בשנת אלף תשע מאות ארבעים וחמש.',
    expected: 'סבתי נולדה בשנת 1945.'
  },
  {
    original: 'הפגישה נקבעה לעשרים ושלושה במרץ.',
    expected: 'הפגישה נקבעה ל-23 במרץ.'
  },
  {
    original: 'החברה השקיעה שני מיליון שקלים בפרויקט החדש.',
    expected: 'החברה השקיעה 2,000,000 שקלים בפרויקט החדש.'
  },
  {
    original: 'חיכינו בתור כמעט שעה וחצי.',
    expected: 'חיכינו בתור כמעט 1.5 שעות.'
  }
];

// Test the examples
console.log('Testing specific examples:');
examples.forEach((example, index) => {
  const result = normalizeText(example.original);
  const success = result === example.expected;
  
  console.log(`\nExample #${index + 1}:`);
  console.log(`Original: ${example.original}`);
  console.log(`Expected: ${example.expected}`);
  console.log(`Result:   ${result}`);
  console.log(`Status:   ${success ? '✓ PASSED' : '❌ FAILED'}`);
});