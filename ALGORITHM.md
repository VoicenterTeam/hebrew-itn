# Hebrew Inverse Text Normalization (ITN) Algorithm

## Introduction

Inverse Text Normalization (ITN) is the process of converting written-out expressions (like numbers, dates, times, etc.) into their normalized form (typically, digits and symbols). This document describes the algorithm for performing ITN on Hebrew text, specifically focusing on numeric expressions.

The transformation looks like this:

**Input:** יש חמש מאות אלף הורים וחמשת אלפיים שלוש מאות ושניים ילדים נמצאים ברציף  
**Output:** יש 500,000 הורים ו5,302 ילדים נמצאים ברציף 8

## Challenges in Hebrew ITN

Hebrew presents several unique challenges for ITN:

1. **Gender Agreement**: Hebrew numbers exhibit gender agreement (masculine and feminine forms)
   - Masculine: שניים (shtayim), שלושה (shlosha)
   - Feminine: שתיים (shtayim), שלוש (shalosh)

2. **Number Construct State**: Hebrew uses construct states (סמיכות) for compound numbers
   - Example: חמשת אלפים (five thousand) vs. חמישה (five)

3. **Conjunctions**: Hebrew often uses the letter "ו" (vav) to connect numbers
   - Example: שלושים ושתיים (thirty-two)

4. **Multiple Number Systems**: Hebrew can express numbers using:
   - Hebrew words: אחד, שניים, שלושה
   - Gematria (Hebrew letters as numerals): א', ב', ג'
   - Western Arabic numerals: 1, 2, 3

5. **Contextual Variations**: Numbers may appear differently depending on context
   - Example: "מספר שמונה" (number eight) vs "שמונה אנשים" (eight people)

## Algorithm Steps

### 1. Tokenization and Detection

1. Tokenize the input text into words
2. Identify potential number expressions:
   - Standalone number words: אחד, שניים, שלושה
   - Compound expressions: עשרים ושתיים, מאה וחמישים
   - Number words with quantifiers: אלף, מיליון
   - Construct state numbers: שלושת, ארבעת
   - Ordinal numbers: ראשון, שני, שלישי

### 2. Number Word Mapping

Create a comprehensive mapping of Hebrew number words to their digit equivalents:

#### Cardinal Numbers (1-10)
- Masculine: אחד (1), שניים (2), שלושה (3), ארבעה (4), חמישה (5), שישה (6), שבעה (7), שמונה (8), תשעה (9), עשרה (10)
- Feminine: אחת (1), שתיים (2), שלוש (3), ארבע (4), חמש (5), שש (6), שבע (7), שמונה (8), תשע (9), עשר (10)

#### Teens (11-19)
- אחד עשר (11), שניים עשר (12), שלושה עשר (13), etc.
- אחת עשרה (11), שתים עשרה (12), שלוש עשרה (13), etc.

#### Tens (20-90)
- עשרים (20), שלושים (30), ארבעים (40), חמישים (50), שישים (60), שבעים (70), שמונים (80), תשעים (90)

#### Hundreds (100-900)
- מאה (100), מאתיים (200), שלוש מאות (300), ארבע מאות (400), etc.

#### Large Numbers
- אלף (1,000), אלפיים (2,000), מיליון (1,000,000), מיליארד (1,000,000,000)

#### Construct States
- שני/שתי, שלושת, ארבעת, חמשת, etc.

### 3. Number Expression Parsing

1. Identify the boundaries of number expressions in the text
2. Handle compound expressions like "עשרים ושלושה" (twenty-three)
3. Process hierarchical structures: "שלוש מאות אלף" (three hundred thousand)
4. Resolve gender agreements based on context
5. Handle construct states properly

### 4. Normalization Rules

1. **Simple Numbers**: Direct mapping from words to digits
   - "חמישה" → "5"

2. **Compound Numbers**: Combine the values of multiple words
   - "עשרים ושלושה" → "23"
   - "מאה וחמישה" → "105"

3. **Hierarchical Numbers**: Multiply according to position
   - "שלוש מאות" (three hundred) → "300"
   - "חמישה אלפים" (five thousand) → "5,000"
   - "שני מיליון" (two million) → "2,000,000"

4. **Mixed Expressions**: Handle combinations of the above
   - "שלוש מאות ועשרים אלף" → "320,000"
   - "מיליון וחמש מאות אלף" → "1,500,000"

5. **Special Forms**: Account for special constructions
   - "אלפיים" (two thousand) → "2,000"
   - "מאתיים" (two hundred) → "200"

6. **Construct States**: Convert construct forms to their numerical value
   - "שלושת אלפים" → "3,000"
   - "חמשת מיליון" → "5,000,000"

### 5. Contextual Processing

1. Identify context for disambiguation:
   - Noun gender for choosing correct number form
   - Position relative to other words

2. Apply context-specific rules:
   - Ordinal vs. cardinal interpretations
   - Temporal expressions (dates, times)
   - Monetary values
   - Measurements

3. Handle special cases:
   - Phone numbers
   - Dates and times
   - Addresses
   - Percentages

### 6. Text Reconstruction

1. Replace identified number expressions with their normalized form
2. Preserve surrounding text and formatting
3. Apply correct punctuation for number formatting (commas, periods)
4. Handle special cases like currency symbols or units

## Implementation Considerations

1. **Efficiency**: Use finite-state transducers or regular expressions for fast pattern matching
2. **Disambiguation**: Implement statistical or rule-based disambiguation for ambiguous cases
3. **Extensibility**: Design the system to handle new patterns and special cases
4. **Error Handling**: Implement fallback mechanisms for unrecognized patterns

## Limitations and Edge Cases

1. **Ambiguity**: Some expressions might be ambiguous without context
2. **Idioms**: Expressions like "אלף ואחד" (a thousand and one) can be idiomatic
3. **Mixed Scripts**: Text may mix Hebrew numbers with Arabic numerals
4. **Regional Variations**: Different Hebrew-speaking communities may use different number expressions

## References

- Glinert, L. (1989). The Grammar of Modern Hebrew
- Coffin, E. A., & Bolozky, S. (2005). A Reference Grammar of Modern Hebrew
- Netzer, Y., et al. (2007). "Can you tag an email: An empirical comparison of HMM taggers for Hebrew"