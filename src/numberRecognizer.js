/**
 * Hebrew Number Expression Recognizer
 *
 * This module identifies number expressions in Hebrew text.
 *
 * @module numberRecognizer
 */

const { HEBREW_NUMBER_WORDS, CONSTRUCT_FORMS } = require('./hebrewNumberData');

/**
 * Determines if a token is a Hebrew number word
 *
 * @param {string} token - The token to check
 * @returns {boolean} True if the token is a Hebrew number word
 *
 * @example
 * // Returns true
 * isNumberWord('שלושה');
 */
function isNumberWord(token) {
  // Handle compound tokens with underscore (from preprocessing)
  if (token.includes('_')) {
    const parts = token.split('_');
    return parts.every(part => isNumberWord(part));
  }

  return HEBREW_NUMBER_WORDS.cardinals.hasOwnProperty(token) ||
         HEBREW_NUMBER_WORDS.tens.hasOwnProperty(token) ||
         HEBREW_NUMBER_WORDS.hundreds.hasOwnProperty(token) ||
         HEBREW_NUMBER_WORDS.thousands.hasOwnProperty(token) ||
         HEBREW_NUMBER_WORDS.largeNumbers.hasOwnProperty(token) ||
         CONSTRUCT_FORMS.hasOwnProperty(token);
}

/**
 * Identifies potential conjunctions that could connect number parts
 *
 * @param {string} token - The token to check
 * @returns {boolean} True if the token is a conjunction
 *
 * @example
 * // Returns true
 * isConjunction('ו');
 */
function isConjunction(token) {
  return token === 'ו' || token === 'וה' || token === 'ה';
}

/**
 * Processes compound tokens that contain an underscore
 *
 * @param {string} token - The compound token
 * @returns {Array<string>} Array of individual tokens
 * @private
 */
function processCompoundToken(token) {
  if (!token.includes('_')) {
    return [token];
  }

  const parts = token.split('_');
  return [parts[0], 'ו', parts[1]]; // Reconstruct with the implied "ו" conjunction
}

/**
 * Finds contiguous number expressions in a token array
 *
 * @param {Array<string>} tokens - Array of tokens from the text
 * @returns {Array<Object>} Array of identified number expressions
 *
 * @example
 * // Returns [{ tokens: ['חמש', 'מאות'], original: 'חמש מאות', startIndex: 0, endIndex: 8 }]
 * findNumberExpressions(['חמש', 'מאות']);
 */
function findNumberExpressions(tokens) {
  const expressions = [];
  let currentExpression = null;
  let originalText = '';
  let startPosition = 0;
  let position = 0;
  let prevEnd = 0;

  // Expand compound tokens
  const expandedTokens = [];
  const positionMap = []; // Maps expanded position to original position

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const tokenPos = i === 0 ? 0 : prevEnd + 1; // Add 1 for space

    if (token.includes('_')) {
      const expanded = processCompoundToken(token);
      expandedTokens.push(...expanded);

      // Map positions
      for (let j = 0; j < expanded.length; j++) {
        positionMap.push({
          start: tokenPos,
          end: tokenPos + token.length
        });
      }
    } else {
      expandedTokens.push(token);
      positionMap.push({
        start: tokenPos,
        end: tokenPos + token.length
      });
    }

    prevEnd = tokenPos + token.length;
  }

  // Reset for processing expanded tokens
  currentExpression = null;
  originalText = '';
  startPosition = 0;
  prevEnd = 0;

  // Function to finalize and add the current expression to our results
  const finalizeExpression = () => {
    if (currentExpression && currentExpression.length > 0) {
      // Remove trailing conjunctions
      while (currentExpression.length > 0 &&
             isConjunction(currentExpression[currentExpression.length - 1])) {
        currentExpression.pop();
      }

      if (currentExpression.length > 0) {
        expressions.push({
          tokens: currentExpression,
          original: originalText.trim(),
          startIndex: startPosition,
          endIndex: prevEnd,
        });
      }
    }
    currentExpression = null;
    originalText = '';
  };

  // Process the expanded tokens
  expandedTokens.forEach((token, index) => {
    const posInfo = positionMap[index];

    // If we have a number word, start or continue an expression
    if (isNumberWord(token)) {
      if (!currentExpression) {
        currentExpression = [token];
        startPosition = posInfo.start;
        originalText = token;
      } else {
        currentExpression.push(token);
        originalText += ' ' + token;
      }
    }
    // Conjunctions can be part of number expressions
    else if (isConjunction(token) && currentExpression) {
      currentExpression.push(token);
      originalText += ' ' + token;
    }
    // Non-number word and not a conjunction - finalize the current expression
    else {
      finalizeExpression();
    }

    prevEnd = posInfo.end;
  });

  // Finalize any expression that might be at the end of the text
  finalizeExpression();

  return expressions;
}

module.exports = {
  findNumberExpressions,
  isNumberWord,
  isConjunction,
};
