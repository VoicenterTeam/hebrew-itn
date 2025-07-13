/**
 * Hebrew Text Processor
 *
 * This module handles text tokenization and reconstruction for Hebrew ITN.
 *
 * @module textProcessor
 */

const numberPatterns = require('./numberPatterns');

/**
 * Tokenizes Hebrew text into words
 *
 * @param {string} text - The Hebrew text to tokenize
 * @returns {Array<string>} Array of tokens
 *
 * @example
 * // Returns ['יש', 'חמש', 'מאות', 'אלף', 'הורים']
 * tokenize('יש חמש מאות אלף הורים');
 */
function tokenize(text) {
  // This simple implementation splits on whitespace
  // A more sophisticated implementation might handle punctuation and special cases
  return text.trim().split(/\s+/);
}

/**
 * Detects all possible Hebrew number expressions in a text
 *
 * This function scans the text looking for spans of 1-5 words that
 * might represent Hebrew number expressions
 *
 * @param {string} text - The Hebrew text to analyze
 * @returns {Array<{startIndex: number, endIndex: number, original: string, normalized: string}>} Array of detected numbers
 */
function detectNumberExpressions(text) {
  const allPatterns = numberPatterns.getAllPatterns();
  const tokens = tokenize(text);
  const results = [];

  // Check all possible word combinations from 1 to 5 words
  for (let windowSize = 5; windowSize >= 1; windowSize--) {
    for (let i = 0; i <= tokens.length - windowSize; i++) {
      const phrase = tokens.slice(i, i + windowSize).join(' ');

      // Check if this phrase is a known number pattern
      if (allPatterns[phrase]) {
        // Calculate the start and end position in the original text
        let startIndex = 0;
        for (let j = 0; j < i; j++) {
          startIndex += tokens[j].length + 1; // +1 for the space
        }

        const endIndex = startIndex + phrase.length;

        results.push({
          startIndex,
          endIndex,
          original: phrase,
          normalized: allPatterns[phrase]
        });
      }
    }
  }

  // Sort by position and filter overlapping matches (keep the longest)
  results.sort((a, b) => a.startIndex - b.startIndex);

  const filteredResults = [];
  for (let i = 0; i < results.length; i++) {
    const current = results[i];

    // Check if this result overlaps with any we've already added
    const overlaps = filteredResults.some(r =>
      (current.startIndex >= r.startIndex && current.startIndex < r.endIndex) ||
      (current.endIndex > r.startIndex && current.endIndex <= r.endIndex) ||
      (current.startIndex <= r.startIndex && current.endIndex >= r.endIndex)
    );

    // Only add if it doesn't overlap
    if (!overlaps) {
      filteredResults.push(current);
    }
  }

  return filteredResults;
}

/**
 * Handles special cases for certain contexts
 *
 * @param {string} text - The text to process
 * @returns {string} The processed text with special cases handled
 */
function handleSpecialCases(text) {
  // Handle platform numbers (רציף)
  let processedText = text.replace(/(רציף|ברציף)\s+(שמונה|שבע|שש|חמש|ארבע|שלוש|שתיים|אחת|תשע|עשר)/g,
    (match, prefix, number) => {
      const numMap = {
        'אחת': '1', 'שתיים': '2', 'שלוש': '3', 'ארבע': '4', 'חמש': '5',
        'שש': '6', 'שבע': '7', 'שמונה': '8', 'תשע': '9', 'עשר': '10'
      };
      return `${prefix} ${numMap[number]}`;
    }
  );

  // Handle common date formats
  processedText = processedText.replace(/(בשנת)\s+(אלף תשע מאות \w+ ו\w+)/g,
    (match, prefix, year) => {
      const yearValue = numberPatterns.getDigitForHebrewNumber(year);
      if (yearValue) {
        return `${prefix} ${yearValue}`;
      }
      return match;
    }
  );

  // Handle "וחצי" (and a half) expressions
  processedText = processedText.replace(/(\d+)\s+וחצי/g, '$1.5');

  return processedText;
}

/**
 * Reconstructs text with normalized number expressions
 *
 * @param {string} originalText - The original text
 * @param {Array<Object>} convertedExpressions - Array of converted number expressions
 * @returns {string} The reconstructed text with normalized numbers
 *
 * @example
 * // Returns "יש 500,000 הורים"
 * reconstruct("יש חמש מאות אלף הורים", [{original: "חמש מאות אלף", normalized: "500,000", startIndex: 3, endIndex: 16}]);
 */
function reconstruct(originalText, convertedExpressions) {
  // If no expressions were found, return the original text
  if (!convertedExpressions || convertedExpressions.length === 0) {
    return originalText;
  }

  // Sort expressions by their position in the text (from end to start)
  // This prevents issues with indices changing as we replace text
  const sortedExpressions = [...convertedExpressions].sort((a, b) => b.startIndex - a.startIndex);

  let result = originalText;

  // Replace each expression with its normalized form
  for (const expr of sortedExpressions) {
    const prefix = result.substring(0, expr.startIndex);
    const suffix = result.substring(expr.endIndex);

    // Special case: handle the Hebrew word "שמונה" (eight) when it appears at the end
    // and could refer to a platform number like "רציף שמונה" (platform 8)
    if (expr.original === 'שמונה' && suffix.trim() === '') {
      const prevWord = prefix.trim().split(/\s+/).pop();
      if (prevWord === 'רציף' || prevWord === 'ברציף') {
        result = prefix + '8' + suffix;
        continue;
      }
    }

    result = prefix + expr.normalized + suffix;
  }

  // Special case handling for specific patterns
  // Replace "ו" before numbers with "ו-" attached to the word
  result = result.replace(/\bו\s+([0-9,]+)/g, 'ו-$1');

  return result;
}

/**
 * Normalizes a Hebrew text by converting number expressions to digits
 *
 * @param {string} text - The Hebrew text to normalize
 * @returns {string} The normalized text
 */
function normalizeTextWithExpressions(text) {
  // First handle special cases
  let processedText = handleSpecialCases(text);

  // Detect number expressions
  const expressions = detectNumberExpressions(processedText);

  // Reconstruct the text with normalized expressions
  processedText = reconstruct(processedText, expressions);

  return processedText;
}

module.exports = {
  tokenize,
  detectNumberExpressions,
  handleSpecialCases,
  reconstruct,
  normalizeTextWithExpressions
};
