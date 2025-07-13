/**
 * Debug script for pattern matching
 */

const numberPatterns = require('../src/numberPatterns');
const textProcessor = require('../src/textProcessor');
const { normalizeText } = require('../src/index');

// Test cases that are failing in the evaluation
const testCases = [
  {
    original: 'הגיעו אלף ושלוש מאות וארבעים וחמישה משתתפים לכנס',
    expected: 'הגיעו 1,345 משתתפים לכנס'
  },
  {
    original: 'המחיר של המוצר הוא חמישים ושלושה שקלים',
    expected: 'המחיר של המוצר הוא 53 שקלים'
  },
  {
    original: 'הרכבת תצא בעוד שלושים ושתיים דקות',
    expected: 'הרכבת תצא בעוד 32 דקות'
  },
  {
    original: 'היא שילמה מאה ועשרים שקלים עבור הספר',
    expected: 'היא שילמה 120 שקלים עבור הספר'
  },
  {
    original: 'הם הזמינו שתי מאות ושבעים כיסאות לאירוע',
    expected: 'הם הזמינו 270 כיסאות לאירוע'
  }
];

// Test each case
console.log('Testing individual cases:');
testCases.forEach((testCase, index) => {
  // Try with the normalizeText function
  const result = normalizeText(testCase.original);
  console.log(`\nTest case ${index + 1}:`);
  console.log(`Original: ${testCase.original}`);
  console.log(`Expected: ${testCase.expected}`);
  console.log(`Result:   ${result}`);
  console.log(`Success:  ${result === testCase.expected ? 'YES' : 'NO'}`);
  
  // Try with the pattern detector to see what's being found
  console.log('\nDetected patterns:');
  const patterns = textProcessor.detectNumberExpressions(testCase.original);
  console.log(patterns);
  
  // Debug tokenization
  console.log('\nTokenization:');
  const tokens = textProcessor.tokenize(testCase.original);
  console.log(tokens);
  
  // Try to manually find the number expressions in the tokens
  console.log('\nManual pattern search:');
  const allPatterns = numberPatterns.getAllPatterns();
  for (let windowSize = 5; windowSize >= 1; windowSize--) {
    for (let i = 0; i <= tokens.length - windowSize; i++) {
      const phrase = tokens.slice(i, i + windowSize).join(' ');
      if (allPatterns[phrase]) {
        console.log(`Found pattern: "${phrase}" -> "${allPatterns[phrase]}"`);
      }
    }
  }
});

// Debug some specific number patterns
console.log('\n\nTesting specific number patterns:');
const specificPatterns = [
  'חמישים ושלושה',
  'שלושים ושתיים',
  'מאה ועשרים',
  'שתי מאות ושבעים',
  'אלף ושלוש מאות וארבעים וחמישה'
];

specificPatterns.forEach(pattern => {
  console.log(`\nPattern: "${pattern}"`);
  console.log(`Direct lookup: ${numberPatterns.getDigitForHebrewNumber(pattern)}`);
});