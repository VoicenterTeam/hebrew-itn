#!/usr/bin/env node
/**
 * Hebrew ITN Model Evaluation Script
 *
 * This script evaluates the performance of the Hebrew ITN model on the sample data,
 * providing detailed metrics and analysis.
 *
 * Usage:
 *   node scripts/evaluate-model.js
 */

const fs = require('fs');
const path = require('path');
const { normalizeText } = require('../src/index');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

/**
 * Calculate exact match accuracy
 *
 * @param {Array<{original: string, normalized: string}>} samples - Test samples
 * @returns {Object} Object with accuracy metrics
 */
function calculateAccuracy(samples) {
  let correct = 0;
  let incorrect = 0;
  const results = [];

  samples.forEach((sample, i) => {
    const result = normalizeText(sample.original);
    console.log({ original: sample.original ,result, original_normalized: sample.normalized})
    const isCorrect = result === sample.normalized;

    if (isCorrect) {
      correct++;
    } else {
      incorrect++;
    }

    results.push({
      index: i + 1,
      original: sample.original,
      expected: sample.normalized,
      actual: result,
      correct: isCorrect
    });
  });

  return {
    total: samples.length,
    correct,
    incorrect,
    accuracy: correct / samples.length,
    results
  };
}

/**
 * Calculate more granular metrics for error analysis
 *
 * @param {Array<Object>} results - Test results
 * @returns {Object} Object with error metrics
 */
function analyzeErrors(results) {
  const failedResults = results.filter(r => !r.correct);

  // Categorize errors
  const categorizedErrors = {
    numberFormatting: 0,     // Correct number but wrong formatting (e.g., commas)
    missingNumber: 0,        // Failed to convert a number
    wrongNumber: 0,          // Converted to the wrong number
    textModification: 0,     // Modified non-number parts of the text
    other: 0                 // Other errors
  };

  failedResults.forEach(result => {
    // Simple heuristics for error categorization
    const expected = result.expected;
    const actual = result.actual;

    // Check if the difference is just in formatting (commas, etc.)
    if (expected.replace(/,/g, '') === actual.replace(/,/g, '')) {
      categorizedErrors.numberFormatting++;
    }
    // Check if there are digits in expected but not in actual
    else if (/\d/.test(expected) && !/\d/.test(actual)) {
      categorizedErrors.missingNumber++;
    }
    // Check if the numbers are different
    else if (/\d/.test(expected) && /\d/.test(actual)) {
      categorizedErrors.wrongNumber++;
    }
    // Check if non-number parts were modified
    else if (expected.replace(/\d/g, 'X') !== actual.replace(/\d/g, 'X')) {
      categorizedErrors.textModification++;
    }
    // Other errors
    else {
      categorizedErrors.other++;
    }
  });

  return {
    failedCount: failedResults.length,
    categories: categorizedErrors,
    examples: failedResults.slice(0, 10) // First 10 failure examples
  };
}

/**
 * Format results as a human-readable report
 *
 * @param {Object} accuracy - Accuracy metrics
 * @param {Object} errorAnalysis - Error analysis metrics
 * @returns {string} Formatted report
 */
function formatReport(accuracy, errorAnalysis) {
  const { total, correct, incorrect, accuracy: accuracyRate } = accuracy;
  const { categories, examples } = errorAnalysis;

  // Create colored progress bar for accuracy
  const progressBarLength = 50;
  const filledLength = Math.round(accuracyRate * progressBarLength);
  const progressBar = '█'.repeat(filledLength) + '░'.repeat(progressBarLength - filledLength);

  // Format accuracy color based on performance
  let accuracyColor = colors.red;
  if (accuracyRate >= 0.9) accuracyColor = colors.green;
  else if (accuracyRate >= 0.7) accuracyColor = colors.yellow;

  // Create the report
  let report = `
${colors.bold}${colors.cyan}====== Hebrew ITN Model Evaluation Report ======${colors.reset}

${colors.bold}Overall Performance:${colors.reset}
Total samples: ${total}
Correct: ${correct}
Incorrect: ${incorrect}
Accuracy: ${accuracyColor}${(accuracyRate * 100).toFixed(2)}%${colors.reset}

${progressBar}

${colors.bold}Error Analysis:${colors.reset}
Number formatting issues: ${categories.numberFormatting} (${((categories.numberFormatting / incorrect) * 100).toFixed(2)}%)
Missing number conversions: ${categories.missingNumber} (${((categories.missingNumber / incorrect) * 100).toFixed(2)}%)
Wrong number values: ${categories.wrongNumber} (${((categories.wrongNumber / incorrect) * 100).toFixed(2)}%)
Text modification issues: ${categories.textModification} (${((categories.textModification / incorrect) * 100).toFixed(2)}%)
Other issues: ${categories.other} (${((categories.other / incorrect) * 100).toFixed(2)}%)

${colors.bold}${colors.yellow}Sample Errors:${colors.reset}`;

  // Add example errors to the report
  examples.forEach((example, i) => {
    report += `
${colors.bold}Example #${i + 1}:${colors.reset}
Original: ${example.original}
Expected: ${example.expected}
Actual:   ${example.actual}
`;
  });

  // Add summary and recommendations
  report += `
${colors.bold}${colors.cyan}Summary:${colors.reset}
Your Hebrew ITN model is currently achieving ${accuracyColor}${(accuracyRate * 100).toFixed(2)}%${colors.reset} accuracy on the test set.
`;

  if (accuracyRate >= 0.9) {
    report += `${colors.green}The model is performing very well! Consider testing with more challenging examples.${colors.reset}`;
  } else if (accuracyRate >= 0.7) {
    report += `${colors.yellow}The model is performing adequately, but there's room for improvement.${colors.reset}`;
  } else {
    report += `${colors.red}The model needs significant improvements to be production-ready.${colors.reset}`;
  }

  return report;
}

/**
 * Main function
 */
function main() {
  try {
    // Load sample data
    const dataPath = path.join(__dirname, '..', 'data', 'sample-data-raw.json');
    const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    console.log(`${colors.cyan}Evaluating Hebrew ITN model on ${sampleData.length} samples...${colors.reset}`);

    // Calculate accuracy
    const accuracy = calculateAccuracy(sampleData);

    // Analyze errors
    const errorAnalysis = analyzeErrors(accuracy.results);

    // Generate and print report
    const report = formatReport(accuracy, errorAnalysis);
    console.log(report);

    // Save detailed results to file
    const outputPath = path.join(__dirname, '..', 'evaluation-results.json');
    fs.writeFileSync(
      outputPath,
      JSON.stringify({
        accuracy: {
          total: accuracy.total,
          correct: accuracy.correct,
          incorrect: accuracy.incorrect,
          accuracyRate: accuracy.accuracy
        },
        errorAnalysis: {
          categories: errorAnalysis.categories,
          failedCount: errorAnalysis.failedCount
        },
        results: accuracy.results
      }, null, 2)
    );

    console.log(`\n${colors.green}Detailed evaluation results saved to ${outputPath}${colors.reset}`);

    // Save text report
    const reportPath = path.join(__dirname, '..', 'evaluation-report.txt');
    fs.writeFileSync(reportPath, report.replace(/\x1b\[\d+m/g, '')); // Remove ANSI color codes

    console.log(`${colors.green}Text report saved to ${reportPath}${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}Error during evaluation:${colors.reset}`, error);
    process.exit(1);
  }
}

// Run the main function
if (require.main === module) {
  main();
}

module.exports = {
  calculateAccuracy,
  analyzeErrors,
  formatReport
};
