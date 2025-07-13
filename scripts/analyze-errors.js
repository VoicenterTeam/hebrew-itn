/**
 * Error Analysis Tool for Hebrew ITN
 * 
 * This script analyzes the evaluation results to identify patterns in errors
 * and suggest improvements.
 */

const fs = require('fs');
const path = require('path');
const { normalizeText } = require('../src/index');

// Load evaluation results if they exist
let evaluationResults;
try {
  const resultsPath = path.join(__dirname, '..', 'evaluation-results.json');
  evaluationResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
} catch (error) {
  console.error('Could not load evaluation results, running evaluation...');
  // Run evaluation if results don't exist
  // This part would depend on your evaluation script structure
}

// If we don't have evaluation results, run direct analysis
if (!evaluationResults) {
  // Load sample data
  const dataPath = path.join(__dirname, '..', 'data', 'sample-data.json');
  const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Test each sample
  const results = [];
  sampleData.samples.forEach((sample, index) => {
    const normalized = normalizeText(sample.original);
    const correct = normalized === sample.normalized;
    
    results.push({
      index,
      original: sample.original,
      expected: sample.normalized,
      actual: normalized,
      correct
    });
  });
  
  evaluationResults = { results };
}

// Analyze failures
const failures = evaluationResults.results.filter(r => !r.correct);
console.log(`Found ${failures.length} failures out of ${evaluationResults.results.length} samples (${(failures.length / evaluationResults.results.length * 100).toFixed(2)}% failure rate)`);

// Group failures by pattern
const patternAnalysis = {};

failures.forEach(failure => {
  // Check if expected has numbers but actual doesn't
  const expectedHasNumbers = /\d/.test(failure.expected);
  const actualHasNumbers = /\d/.test(failure.actual);
  
  if (expectedHasNumbers && !actualHasNumbers) {
    // Missing number conversion
    patternAnalysis['missing_conversion'] = (patternAnalysis['missing_conversion'] || 0) + 1;
  } else if (expectedHasNumbers && actualHasNumbers) {
    // Incorrect conversion
    patternAnalysis['incorrect_conversion'] = (patternAnalysis['incorrect_conversion'] || 0) + 1;
  } else {
    // Other issues
    patternAnalysis['other'] = (patternAnalysis['other'] || 0) + 1;
  }
  
  // Check for specific number patterns
  // Two-digit numbers (e.g., 21, 35)
  if (/\b\d\d\b/.test(failure.expected)) {
    patternAnalysis['two_digit_numbers'] = (patternAnalysis['two_digit_numbers'] || 0) + 1;
  }
  
  // Three-digit numbers (e.g., 123, 500)
  if (/\b\d\d\d\b/.test(failure.expected)) {
    patternAnalysis['three_digit_numbers'] = (patternAnalysis['three_digit_numbers'] || 0) + 1;
  }
  
  // Numbers with thousands separator (e.g., 1,234)
  if (/\b\d{1,3}(,\d{3})+\b/.test(failure.expected)) {
    patternAnalysis['numbers_with_commas'] = (patternAnalysis['numbers_with_commas'] || 0) + 1;
  }
  
  // Single-digit numbers
  if (/\b\d\b/.test(failure.expected)) {
    patternAnalysis['single_digit'] = (patternAnalysis['single_digit'] || 0) + 1;
  }
  
  // Years (e.g., 1984, 2023)
  if (/\b(19|20)\d\d\b/.test(failure.expected)) {
    patternAnalysis['years'] = (patternAnalysis['years'] || 0) + 1;
  }
  
  // Check for hyphenated expressions like "ו-2"
  if (/\bו-\d+\b/.test(failure.expected)) {
    patternAnalysis['hyphenated'] = (patternAnalysis['hyphenated'] || 0) + 1;
  }
  
  // Check for decimal numbers
  if (/\b\d+\.\d+\b/.test(failure.expected)) {
    patternAnalysis['decimal'] = (patternAnalysis['decimal'] || 0) + 1;
  }
});

// Print pattern analysis
console.log('\nPattern Analysis:');
Object.entries(patternAnalysis).sort((a, b) => b[1] - a[1]).forEach(([pattern, count]) => {
  console.log(`${pattern}: ${count} (${(count / failures.length * 100).toFixed(2)}%)`);
});

// Print some example failures for each pattern
console.log('\nExample Failures by Pattern:');

// Function to print examples of a specific pattern
function printExamples(pattern, predicate, count = 3) {
  const examples = failures.filter(predicate).slice(0, count);
  if (examples.length > 0) {
    console.log(`\n${pattern} (${examples.length} examples):`);
    examples.forEach((example, i) => {
      console.log(`Example ${i+1}:`);
      console.log(`Original: ${example.original}`);
      console.log(`Expected: ${example.expected}`);
      console.log(`Actual  : ${example.actual}`);
    });
  }
}

// Print examples for different patterns
printExamples('Missing Number Conversion', 
  f => /\d/.test(f.expected) && !/\d/.test(f.actual));

printExamples('Two-Digit Numbers', 
  f => /\b\d\d\b/.test(f.expected));

printExamples('Three-Digit Numbers', 
  f => /\b\d\d\d\b/.test(f.expected) && !/,/.test(f.expected));

printExamples('Numbers with Commas', 
  f => /\b\d{1,3}(,\d{3})+\b/.test(f.expected));

printExamples('Hyphenated Expressions', 
  f => /\bו-\d+\b/.test(f.expected));

printExamples('Decimal Numbers', 
  f => /\b\d+\.\d+\b/.test(f.expected));

printExamples('Years', 
  f => /\b(19|20)\d\d\b/.test(f.expected));

// Write common Hebrew number patterns that need to be fixed
console.log('\nCommon Hebrew number patterns to fix:');

// Extract common Hebrew number expressions that weren't converted
const hebrewPatterns = {};
failures.forEach(failure => {
  if (/\d/.test(failure.expected) && !/\d/.test(failure.actual)) {
    // Try to extract Hebrew number expressions by tokenizing
    const words = failure.original.split(/\s+/);
    
    // Check for sequences of 2-5 words that might be numbers
    for (let windowSize = 5; windowSize >= 2; windowSize--) {
      for (let i = 0; i <= words.length - windowSize; i++) {
        const phrase = words.slice(i, i + windowSize).join(' ');
        hebrewPatterns[phrase] = (hebrewPatterns[phrase] || 0) + 1;
      }
    }
    
    // Also check individual words
    words.forEach(word => {
      hebrewPatterns[word] = (hebrewPatterns[word] || 0) + 1;
    });
  }
});

// Print top Hebrew patterns
console.log('Top Hebrew number expressions to fix:');
Object.entries(hebrewPatterns)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20)
  .forEach(([pattern, count]) => {
    if (count > 1) { // Only show patterns that appear multiple times
      console.log(`"${pattern}": ${count} occurrences`);
    }
  });

// Generate suggestions for improvement
console.log('\nSuggested Improvements:');

if (patternAnalysis['missing_conversion'] > 0) {
  console.log('1. Enhance the basic number recognition to catch more Hebrew number expressions');
}

if (patternAnalysis['two_digit_numbers'] > 0) {
  console.log('2. Improve handling of compound numbers (tens + units) like "עשרים ושלושה" -> "23"');
}

if (patternAnalysis['three_digit_numbers'] > 0) {
  console.log('3. Add better support for hundreds expressions like "שלוש מאות" -> "300"');
}

if (patternAnalysis['numbers_with_commas'] > 0) {
  console.log('4. Ensure proper formatting of thousands with commas');
}

if (patternAnalysis['hyphenated'] > 0) {
  console.log('5. Implement handling of conjunction prefix "ו" followed by numbers');
}

if (patternAnalysis['years'] > 0) {
  console.log('6. Add special handling for year expressions');
}

if (patternAnalysis['decimal'] > 0) {
  console.log('7. Support decimal numbers and fractional expressions');
}

// Output the top 20 failures for detailed analysis
console.log('\nTop 20 Failures for Manual Analysis:');
failures.slice(0, 20).forEach((failure, i) => {
  console.log(`\nFailure ${i+1}:`);
  console.log(`Original: ${failure.original}`);
  console.log(`Expected: ${failure.expected}`);
  console.log(`Actual  : ${failure.actual}`);
});