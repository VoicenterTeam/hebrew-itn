/**
 * Basic Example of Hebrew-ITN Usage
 * 
 * This example demonstrates the most common use case for normalizing
 * Hebrew text with spelled-out numbers.
 */

const { normalizeText, normalizeNumber } = require('../src/index');

// Example 1: Normalizing a complete sentence
const sentence = "יש חמש מאות אלף הורים וחמשת אלפיים שלוש מאות ושניים ילדים נמצאים ברציף שמונה";
console.log('Original:', sentence);
console.log('Normalized:', normalizeText(sentence));
// Expected output: "יש 500,000 הורים ו5,302 ילדים נמצאים ברציף 8"

// Example 2: Normalizing just numbers
const numbers = [
  "חמש מאות",
  "אלף ומאתיים",
  "שלושת אלפים מאתיים חמישים ושבעה",
  "עשרים ושלושה"
];

console.log('\nNumber Normalization Examples:');
numbers.forEach(num => {
  console.log(`${num} → ${normalizeNumber(num)}`);
});

// Example 3: Normalizing with context
const contextExamples = [
  "הפנתי לך ברציף שלוש",
  "יש לנו מאה וחמישה עובדים בחברה",
  "הוא הרוויח עשרים ושלושה אלף שקל בחודש שעבר"
];

console.log('\nContext-based Normalization Examples:');
contextExamples.forEach(text => {
  console.log(`${text} → ${normalizeText(text)}`);
});