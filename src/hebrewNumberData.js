/**
 * Hebrew Number Data
 *
 * This module contains mappings from Hebrew number words to their numeric values.
 *
 * @module hebrewNumberData
 */

/**
 * Complete mapping of Hebrew number words to their values
 * Includes both masculine and feminine forms where applicable
 *
 * @typedef {Object} HebrewNumberWords
 * @property {Object} cardinals - Mapping of cardinal numbers (1-10)
 * @property {Object} teens - Mapping of teen numbers (11-19)
 * @property {Object} tens - Mapping of tens (20-90)
 * @property {Object} hundreds - Mapping of hundreds (100-900)
 * @property {Object} thousands - Mapping of thousands
 * @property {Object} largeNumbers - Mapping of large numbers (million, billion, etc.)
 */
const HEBREW_NUMBER_WORDS = {
  // Cardinals 1-10 (masculine and feminine forms)
  cardinals: {
    // Masculine
    אחד: 1,
    שניים: 2,
    שנים: 2,
    שלושה: 3,
    ארבעה: 4,
    חמישה: 5,
    שישה: 6,
    שבעה: 7,
    שמונה: 8,
    תשעה: 9,
    עשרה: 10,

    // Feminine
    אחת: 1,
    שתיים: 2,
    שתים: 2,
    שלוש: 3,
    ארבע: 4,
    חמש: 5,
    שש: 6,
    שבע: 7,
    // שמונה: 8, // Same in both genders
    תשע: 9,
    עשר: 10,
  },

  // Teens 11-19 (masculine and feminine forms)
  teens: {
    // Masculine
    'אחד עשר': 11,
    'שנים עשר': 12,
    'שלושה עשר': 13,
    'ארבעה עשר': 14,
    'חמישה עשר': 15,
    'שישה עשר': 16,
    'שבעה עשר': 17,
    'שמונה עשר': 18,
    'תשעה עשר': 19,

    // Feminine
    'אחת עשרה': 11,
    'שתים עשרה': 12,
    'שלוש עשרה': 13,
    'ארבע עשרה': 14,
    'חמש עשרה': 15,
    'שש עשרה': 16,
    'שבע עשרה': 17,
    'שמונה עשרה': 18,
    'תשע עשרה': 19,
  },

  // Tens 20-90
  tens: {
    עשרים: 20,
    שלושים: 30,
    ארבעים: 40,
    חמישים: 50,
    שישים: 60,
    שבעים: 70,
    שמונים: 80,
    תשעים: 90,
  },

  // Hundreds 100-900
  hundreds: {
    מאה: 100,
    מאתיים: 200,
    מאתים: 200,
    מאות: 100, // Used in constructs like "שלוש מאות"
  },

  // Thousands
  thousands: {
    אלף: 1000,
    אלפיים: 2000,
    אלפים: 1000, // Used in constructs like "שלושת אלפים"
  },

  // Large numbers
  largeNumbers: {
    מיליון: 1000000,
    מיליונים: 1000000,
    מיליארד: 1000000000,
    מיליארדים: 1000000000,
  },
};

/**
 * Mapping of Hebrew construct forms to their base forms
 * These are used in construct states like "שלושת אלפים"
 *
 * @type {Object}
 */
const CONSTRUCT_FORMS = {
  שני: 2,
  שתי: 2,
  שלושת: 3,
  ארבעת: 4,
  חמשת: 5,
  ששת: 6,
  שבעת: 7,
  שמונת: 8,
  תשעת: 9,
  עשרת: 10,
};

/**
 * Mapping of Hebrew ordinal numbers to their values
 *
 * @type {Object}
 */
const ORDINAL_NUMBERS = {
  ראשון: 1,
  שני: 2,
  שלישי: 3,
  רביעי: 4,
  חמישי: 5,
  שישי: 6,
  שביעי: 7,
  שמיני: 8,
  תשיעי: 9,
  עשירי: 10,
  // Feminine forms
  ראשונה: 1,
  שניה: 2,
  שנייה: 2,
  שלישית: 3,
  רביעית: 4,
  חמישית: 5,
  שישית: 6,
  שביעית: 7,
  שמינית: 8,
  תשיעית: 9,
  עשירית: 10,
};

module.exports = {
  HEBREW_NUMBER_WORDS,
  CONSTRUCT_FORMS,
  ORDINAL_NUMBERS,
};
