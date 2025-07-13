# Hebrew ITN Implementation Approach

This document explains the approach taken to implement Hebrew Inverse Text Normalization (ITN).

## Overview

The Hebrew ITN system converts spelled-out numbers in Hebrew text to their digit representation. For example, it converts "חמש מאות" (hamesh me'ot) to "500".

## Architecture

The implementation consists of several modules:

1. **Core Implementation** (`src/index.js`): The main entry point that provides the public API.
2. **Number Patterns** (`src/numberPatterns.js`): Defines patterns for Hebrew number expressions.
3. **Hebrew ITN Implementation** (`src/hebrewITN.js`): Contains the core logic for normalizing Hebrew numbers.
4. **Text Processor** (`src/textProcessor.js`): Handles tokenization and text reconstruction.
5. **Test Cases** (`src/testCases.js`): A comprehensive collection of test cases for evaluation.

## Implementation Strategy

Our implementation uses a multi-layered approach:

### 1. Pattern Matching

We've defined comprehensive patterns for Hebrew number expressions, including:
- Single digits (0-9)
- Teen numbers (11-19)
- Tens (20, 30, 40, etc.)
- Hundreds (100, 200, 300, etc.)
- Thousands (1,000, 2,000, etc.)
- Millions (1,000,000, 2,000,000, etc.)
- Common compound numbers

### 2. Direct Normalization

For efficiency, we use direct text replacements for common patterns, implemented with regular expressions.

### 3. Special Case Handling

Hebrew has various special cases that require specific handling:
- Platform numbers (e.g., "רציף שמונה" → "רציף 8")
- Year expressions (e.g., "אלף תשע מאות ארבעים וחמש" → "1945")
- Fractional expressions (e.g., "שעה וחצי" → "1.5 שעות")
- Ordinal expressions (e.g., "יום הולדתו השמונים" → "יום הולדתו ה-80")
- Negative numbers (e.g., "מינוס שבע" → "-7")

### 4. Context-Aware Processing

Our implementation is context-aware, considering the surrounding text to determine the appropriate normalization:
- Conjunction prefixes (e.g., "ו" before a number becomes "ו-" before the digit)
- Prefixes like "כ", "ב", "ל", "מ" (e.g., "כמאה" → "כ-100")

### 5. Test-Driven Development

We used a test-driven approach with an extensive test suite:
- Unit tests for individual functions
- Integration tests for the complete normalization process
- A comprehensive evaluation framework that tests against a large dataset

## Evaluation

Our implementation achieves excellent accuracy on a diverse set of test cases. The evaluation framework provides detailed metrics and error analysis.

## Future Improvements

While our current implementation is robust, there are several areas for potential improvement:

1. **Enhanced Pattern Recognition**: Implementing more sophisticated pattern recognition algorithms could improve accuracy for complex number expressions.

2. **Context-Dependent Normalization**: Further refining context-dependent rules to better handle ambiguous cases.

3. **Language Model Integration**: Integrating with language models could help in recognizing and normalizing more complex or ambiguous expressions.

4. **Performance Optimization**: Optimizing the pattern matching algorithms for better performance with large texts.

5. **Support for Additional Number Types**: Extending support for more specialized number types like fractions, decimals, and percentages.

## Conclusion

Our Hebrew ITN implementation provides accurate and comprehensive normalization of Hebrew number expressions to their digit representations, which is essential for various NLP tasks including ASR and TTS applications.