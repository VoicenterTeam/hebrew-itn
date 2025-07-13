/**
 * Test specific Hebrew number patterns
 */

const { normalizeText } = require('../src/index');
const hebrewITN = require('../src/hebrewITN');

// Common patterns from our failure analysis
const patterns = [
  // Two-digit numbers
  {
    pattern: 'המחיר של המוצר הוא חמישים ושלושה שקלים',
    expected: 'המחיר של המוצר הוא 53 שקלים',
    description: 'Tens and units (50 + 3)'
  },
  {
    pattern: 'הרכבת תצא בעוד שלושים ושתיים דקות',
    expected: 'הרכבת תצא בעוד 32 דקות',
    description: 'Tens and units (30 + 2)'
  },
  
  // Three-digit numbers
  {
    pattern: 'היא שילמה מאה ועשרים שקלים עבור הספר',
    expected: 'היא שילמה 120 שקלים עבור הספר',
    description: 'Hundreds and tens (100 + 20)'
  },
  {
    pattern: 'הם הזמינו שתי מאות ושבעים כיסאות לאירוע',
    expected: 'הם הזמינו 270 כיסאות לאירוע',
    description: 'Hundreds and tens (200 + 70)'
  },
  
  // Complex numbers
  {
    pattern: 'הגיעו אלף ושלוש מאות וארבעים וחמישה משתתפים לכנס',
    expected: 'הגיעו 1,345 משתתפים לכנס',
    description: 'Complex number (1000 + 300 + 40 + 5)'
  },
  {
    pattern: 'יש שלושת אלפים מאתיים וחמישים ושבעה תלמידים בבית הספר',
    expected: 'יש 3,257 תלמידים בבית הספר',
    description: 'Complex number (3000 + 200 + 50 + 7)'
  },
  
  // Years
  {
    pattern: 'המדינה נוסדה בשנת אלף תשע מאות ארבעים ושמונה',
    expected: 'המדינה נוסדה בשנת 1948',
    description: 'Year (1948)'
  },
  
  // Single digits
  {
    pattern: 'צריך לקנות חמישה קילוגרמים של קמח',
    expected: 'צריך לקנות 5 קילוגרמים של קמח',
    description: 'Single digit (5)'
  },
  
  // Platform numbers
  {
    pattern: 'הרכבת נמצאת ברציף שמונה',
    expected: 'הרכבת נמצאת ברציף 8',
    description: 'Platform number (8)'
  }
];

// Test each pattern
console.log('Testing specific number patterns:\n');

patterns.forEach((testCase, index) => {
  // Test with the main normalizeText function
  const result = normalizeText(testCase.pattern);
  
  // Test with the direct pattern matcher
  const directResult = hebrewITN.normalizeTextDirectly(testCase.pattern);
  
  console.log(`${index + 1}. ${testCase.description}:`);
  console.log(`   Original: ${testCase.pattern}`);
  console.log(`   Expected: ${testCase.expected}`);
  console.log(`   Result:   ${result}`);
  console.log(`   Direct:   ${directResult}`);
  console.log(`   Success:  ${result === testCase.expected ? 'YES' : 'NO'}\n`);
});