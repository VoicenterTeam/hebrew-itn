/**
 * Hebrew Number Converter
 *
 * This module converts identified Hebrew number expressions to their digit form.
 *
 * @module numberConverter
 */

const { HEBREW_NUMBER_WORDS, CONSTRUCT_FORMS, ORDINAL_NUMBERS } = require('./hebrewNumberData');

/**
 * Gets the numeric value of a Hebrew number word
 *
 * @param {string} word - The Hebrew number word
 * @returns {number|null} The numeric value or null if not a number word
 *
 * @example
 * // Returns 5
 * getWordValue('חמש');
 */
function getWordValue(word) {
  // Check in all number word categories
  for (const category of Object.values(HEBREW_NUMBER_WORDS)) {
    if (category[word] !== undefined) {
      return category[word];
    }
  }

  // Check construct forms
  if (CONSTRUCT_FORMS[word] !== undefined) {
    return CONSTRUCT_FORMS[word];
  }

  // Check ordinal numbers
  if (ORDINAL_NUMBERS[word] !== undefined) {
    return ORDINAL_NUMBERS[word];
  }

  return null;
}

/**
 * Formats a number with thousands separators
 *
 * @param {number} num - The number to format
 * @returns {string} The formatted number string
 *
 * @example
 * // Returns "1,234,567"
 * formatNumberWithCommas(1234567);
 */
function formatNumberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Handles special compound expressions directly
 *
 * @param {Array<string>} tokens - Array of tokens
 * @returns {number|null} The calculated value or null if not a special case
 * @private
 */
function handleSpecialCompounds(tokens) {
  // Check for "עשרים ושלושה" (twenty-three) patterns
  if (tokens.length === 3 && tokens[1] === 'ו') {
    const tens = getWordValue(tokens[0]);
    const units = getWordValue(tokens[2]);

    if (tens && units && tens % 10 === 0 && units < 10) {
      return tens + units;
    }
  }

  // Check for "מאה ועשרים" (hundred and twenty) patterns
  if (tokens.length === 3 && tokens[1] === 'ו') {
    const hundreds = getWordValue(tokens[0]);
    const rest = getWordValue(tokens[2]);

    if (hundreds && rest && (hundreds === 100 || hundreds === 200 || hundreds === 300)) {
      return hundreds + rest;
    }
  }

  return null;
}

/**
 * Converts a sequence of Hebrew number words to a numeric value
 *
 * @param {Array<string>} tokens - Array of tokens representing the number expression
 * @returns {number} The calculated numeric value
 *
 * @example
 * // Returns 352
 * parseNumberExpression(['שלוש', 'מאות', 'ו', 'חמישים', 'ו', 'שניים']);
 */
function parseNumberExpression(tokens) {
  // First, handle simple single-token cases
  if (tokens.length === 1) {
    return getWordValue(tokens[0]) || 0;
  }

  // Handle compound expressions directly
  const specialValue = handleSpecialCompounds(tokens);
  if (specialValue !== null) {
    return specialValue;
  }

  // Filter out conjunctions for complex processing
  const numberTokens = tokens.filter(token => token !== 'ו' && token !== 'וה' && token !== 'ה');

  // Special cases for specific patterns
  const tokenStr = tokens.join(' ');

  // "עשרים ושלושה" (twenty-three) pattern
  if (/^(עשרים|שלושים|ארבעים|חמישים|שישים|שבעים|שמונים|תשעים)\s+ו\s+(אחד|שניים|שלושה|ארבעה|חמישה|שישה|שבעה|שמונה|תשעה|אחת|שתיים|שלוש|ארבע|חמש|שש|שבע|תשע)$/.test(tokenStr)) {
    const parts = tokenStr.split(/\s+ו\s+/);
    return getWordValue(parts[0]) + getWordValue(parts[1]);
  }

  // Initialize for recursive processing of complex expressions
  let total = 0;
  let i = 0;

  // Function to parse a number part recursively
  const parseNumberPart = () => {
    let value = 0;

    // Get the base value of the current token
    if (i < numberTokens.length) {
      const token = numberTokens[i];
      const tokenValue = getWordValue(token);

      if (tokenValue !== null) {
        value = tokenValue;
        i++;

        // Check if this is followed by a multiplier
        if (i < numberTokens.length) {
          const nextToken = numberTokens[i];
          const nextValue = getWordValue(nextToken);

          // Handle "שלוש מאות" (three hundred)
          if (nextToken === 'מאות' || nextValue === 100) {
            value *= 100;
            i++;
          }
          // Handle "שלושת אלפים" (three thousand)
          else if (nextToken === 'אלפים' || nextValue === 1000) {
            value *= 1000;
            i++;
          }
          // Handle "שני מיליון" (two million)
          else if (nextToken === 'מיליון' || nextValue === 1000000) {
            value *= 1000000;
            i++;
          }
        }
      }
    }

    return value;
  };

  // Process the tokens to build the number
  while (i < numberTokens.length) {
    total += parseNumberPart();
  }

  return total;
}

/**
 * Converts a Hebrew number expression to its digit form
 *
 * @param {Object} expr - The number expression object
 * @param {Array<string>} expr.tokens - The tokens in the expression
 * @returns {string} Digit representation of the number
 *
 * @example
 * // Returns "352"
 * convertToDigits({tokens: ['שלוש', 'מאות', 'ו', 'חמישים', 'ו', 'שניים']});
 */
function convertToDigits(expr) {
  // Direct handling of special case expressions
  const joinedTokens = expr.tokens.join(' ');

  // Handle "עשרים ושלושה" (twenty-three)
  if (/^(עשרים|שלושים|ארבעים|חמישים|שישים|שבעים|שמונים|תשעים)\s+ו\s+(אחד|שניים|שלושה|ארבעה|חמישה|שישה|שבעה|שמונה|תשעה|אחת|שתיים|שלוש|ארבע|חמש|שש|שבע|תשע)$/.test(joinedTokens)) {
    const parts = joinedTokens.split(/\s+ו\s+/);
    const value = getWordValue(parts[0]) + getWordValue(parts[1]);
    return value.toString();
  }

  // Regular processing for other expressions
  const numericValue = parseNumberExpression(expr.tokens);

  // Format with thousands separators for large numbers
  if (numericValue >= 1000) {
    return formatNumberWithCommas(numericValue);
  }

  return numericValue.toString();
}

module.exports = {
  convertToDigits,
  parseNumberExpression,
  getWordValue,
  formatNumberWithCommas
};
