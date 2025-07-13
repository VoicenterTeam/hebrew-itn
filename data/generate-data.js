/**
 * Advanced Sample Data Generator for Hebrew ITN using Google Gemini API
 *
 * This script generates rich, diverse sample data for testing the Hebrew ITN system,
 * using Google Gemini to create natural Hebrew sentences with complex number expressions.
 *
 * It focuses on generating a wide variety of realistic contexts, number types,
 * and grammatical constructions to ensure comprehensive testing of the ITN system.
 *
 * @example
 * $ node generate-data.js
 * $ GEMINI_API_KEY=your_key node generate-data.js
 */

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { normalizeText } = require('../src/index');

// Your Google API key should be set as an environment variable
const API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Google Generative AI client if API key is available
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Define categories for more structured and diverse sample generation
const CATEGORIES = [
  'everyday_life',
  'finance_and_economics',
  'news_and_media',
  'education',
  'travel',
  'sports',
  'science_and_technology',
  'dates_and_time',
  'measurements',
  'statistics'
];

// Define number types to ensure coverage of different numerical expressions
const NUMBER_TYPES = [
  'cardinal_small',       // 1-10
  'cardinal_medium',      // 11-99
  'cardinal_large',       // 100-999
  'cardinal_thousands',   // 1,000-999,999
  'cardinal_millions',    // 1,000,000+
  'ordinal',              // First, second, third...
  'decimal',              // Numbers with decimal points
  'fraction',             // Fractions like half, quarter, etc.
  'negative',             // Negative numbers
  'phone_number',         // Phone numbers
  'age',                  // Ages
  'percentage',           // Percentages
  'year',                 // Years (1948, 2023, etc.)
  'id_number',            // ID numbers
  'currency',             // Money amounts
  'measurement'           // Weights, distances, etc.
];

// Grammatical contexts to ensure diverse sentence structures
const GRAMMATICAL_CONTEXTS = [
  'subject',              // Number as subject
  'object',               // Number as object
  'quantifier',           // Number as quantifier
  'possessive',           // Possessive forms
  'comparative',          // Comparative expressions
  'prepositional',        // After prepositions
  'question',             // In questions
  'complex_sentence',     // In complex sentences
  'multiple_numbers',     // Multiple numbers in one sentence
  'prefixed_numbers'      // Numbers with prefixes (כ-, ב-, ל-, מ-)
];
/**
 * Asks Google Gemini to generate a batch of diverse Hebrew sentences with complex number expressions
 *
 * @param {Object} options - Generation options
 * @param {number} options.count - Number of samples to generate
 * @param {Array<string>} options.categories - Categories to focus on
 * @param {Array<string>} options.numberTypes - Number types to include
 * @param {Array<string>} options.grammaticalContexts - Grammatical contexts to use
 * @returns {Promise<Array<Object>>} Array of generated samples
 */
async function generateAdvancedSamples(options = {}) {
  if (!genAI) {
    console.error("Gemini API key not provided. Cannot generate advanced samples.");
      return [];
    }

  const {
    count = 10,
    categories = CATEGORIES.slice(0, 3),
    numberTypes = NUMBER_TYPES.slice(0, 5),
    grammaticalContexts = GRAMMATICAL_CONTEXTS.slice(0, 3)
  } = options;
  try {
    // Create a generative model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Build a more detailed prompt that guides the model to create diverse, realistic examples
    const prompt = `
    אני צריך ${count} משפטים בעברית המכילים מספרים שכתובים במילים.

    הנה הקטגוריות שאני מעוניין בהן:
    ${categories.map(cat => `- ${cat}`).join('\n')}

    סוגי המספרים שאני רוצה לכלול:
    ${numberTypes.map(type => `- ${type}`).join('\n')}

    הקשרים דקדוקיים לשימוש:
    ${grammaticalContexts.map(context => `- ${context}`).join('\n')}

    הנה כמה הנחיות חשובות:
    1. כתוב משפטים טבעיים ומגוונים בעברית מודרנית עם מספרים מבוטאים במילים
    2. כלול מגוון מספרים: קטנים, גדולים, שברים, אחוזים, שנים, ללא מספרים עגולים תבחר מספרים רנדומלים וכו'
    3. השתמש במגוון הקשרים: תיאורי כמות, גילאים, מחירים, תאריכים, מדידות, סטטיסטיקות
    4. כלול מבנים דקדוקיים מגוונים: יחיד/רבים, זכר/נקבה, סמיכות
    5. עבור כל משפט, ספק גם את הגרסה המנורמלת שבה המספרים במילים מומרים לספרות

    עבור הגרסה המנורמלת:
    - המר כל מספר מבוטא במילים לספרות (לדוגמה: "חמש מאות" ל-"500")
    - עבור מספרים עם תחיליות, שים מקף (לדוגמה: "כחמישים" ל-"כ-50")
    - עבור מספרים עם ו' החיבור, הוסף מקף (לדוגמה: "ושלושה" ל-"ו-3")
    - פרמט מספרים גדולים עם פסיקים (לדוגמה: "מיליון" ל-"1,000,000")
    - אל תשנה את שאר הטקסט

    החזר את התוצאות בפורמט JSON תקף עם המבנה הזה:
    [
      {
        "original": "משפט עם מספרים מבוטאים במילים",
        "normalized": "משפט עם מספרים בספרות",
        "category": "קטגוריה",
        "numberTypes": ["סוג מספר1", "סוג מספר2"],
        "grammaticalContext": "הקשר דקדוקי"
      },
      ...
    ]

    חשוב: וודא שהגרסה המנורמלת מדויקת - כל המספרים שמבוטאים במילים בגרסה המקורית צריכים להיות מומרים לספרות בגרסה המנורמלת.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Parse the JSON response
    const text = response.text();
    // Find JSON content between square brackets
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      let samples = JSON.parse(jsonMatch[0]);

      // Additional validation to ensure high-quality samples
      samples = samples.filter(sample => {
        // Ensure both original and normalized exist
        if (!sample.original || !sample.normalized) return false;

        // Ensure original has text written numbers and normalized has digits
        const originalHasTextNumbers = /[א-ת]+ [א-ת]+/.test(sample.original) && !/\d/.test(sample.original);
        const normalizedHasDigits = /\d/.test(sample.normalized);

        return originalHasTextNumbers && normalizedHasDigits;
      });

      console.log(`Generated ${samples.length} valid samples using Gemini`);
  return samples;
    } else {
      console.error("Could not parse JSON from Gemini response");
      return [];
}
  } catch (error) {
    console.error("Error generating samples with Gemini:", error);
    return [];
  }
}

/**
 * Generates targeted samples for specific edge cases and challenging scenarios
 *
 * @param {number} count - Number of samples to generate
 * @returns {Promise<Array<Object>>} Array of edge case samples
 */
async function generateEdgeCaseSamples(count = 10) {
  if (!genAI) {
    console.error("Gemini API key not provided. Cannot generate edge case samples.");
    return [];
}

  try {
    // Create a generative model instance
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    // Edge case scenarios to test
    const edgeCases = [
      'מספרים שלפניהם יש מילת יחס (ב, ל, כ, מ) עם וללא מקף',
      'מספרים עם ו החיבור',
      'ביטויי מספר מורכבים מאוד (עם אלפים, מאות, עשרות ויחידות)',
      'מספרים שליליים',
      'מספרים עשרוניים וביטויי שברים',
      'מספרי טלפון ותאריכים',
      'ביטויי זמן (שעות, דקות)',
      'מספרים סידוריים',
      'מספרים בסמיכות',
      'ביטויים מספריים עם מילות יחס מורכבות (יותר מ, פחות מ, כמעט)',
      'מספרים עם תחילית וסיומת'
    ];

    const prompt = `
    אני צריך דוגמאות למקרי קצה ותרחישים מאתגרים למערכת נרמול טקסט עברי שממירה מספרים כתובים במילים לספרות.

    הנה סוגי מקרי הקצה שאני מעוניין בהם:
    ${edgeCases.map(ec => `- ${ec}`).join('\n')}

    אנא צור ${count} משפטים בעברית, כל אחד מכיל מקרה קצה שונה, וספק את הגרסה המנורמלת שלו.

    החזר את התוצאות בפורמט JSON תקף עם המבנה הזה:
    [
      {
        "original": "משפט עם מספר מאתגר במילים",
        "normalized": "משפט עם המספר המאתגר בספרות",
        "challengeType": "סוג האתגר"
      },
      ...
    ]
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Parse the JSON response
    const text = response.text();
    // Find JSON content between square brackets
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const samples = JSON.parse(jsonMatch[0]);
      console.log(`Generated ${samples.length} edge case samples using Gemini`);

      // Transform to standard format
      return samples.map(sample => ({
        original: sample.original,
        normalized: sample.normalized,
        category: 'edge_case',
        challengeType: sample.challengeType
      }));
    } else {
      console.error("Could not parse JSON from Gemini response");
      return [];
    }
  } catch (error) {
    console.error("Error generating edge case samples with Gemini:", error);
    return [];
  }
}

/**
 * Validates samples against our ITN implementation
 *
 * @param {Array<Object>} samples - Samples to validate
 * @returns {Array<Object>} Validated samples
 */
function validateSamples(samples) {
  return samples.map(sample => {
    try {
      // Test our implementation against the provided normalized version
      const ourNormalized = normalizeText(sample.original);

      // Add validation metadata
      return {
        ...sample,
        validationPassed: ourNormalized === sample.normalized,
        ourNormalized
      };
    } catch (error) {
      console.warn(`Error validating sample: ${sample.original}`, error);
      return {
        ...sample,
        validationPassed: false,
        validationError: error.message
      };
    }
  });
}

/**
 * Generates diverse sample data for testing, using Gemini's advanced capabilities
 *
 * @param {Object} options - Generation options
 * @param {number} options.count - Total number of samples to generate
 * @param {boolean} options.includeEdgeCases - Whether to include edge cases
 * @param {boolean} options.validateWithImplementation - Whether to validate against our implementation
 * @returns {Promise<Array<Object>>} Array of test cases
 */
async function generateSampleData(options = {}) {
  const {
    count = 5,
    includeEdgeCases = true,
    validateWithImplementation = true,
    batchSize = 5
  } = options;

  let samples = [];

  // Read existing samples to avoid duplicates
  try {
    const existingData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'sample-data-raw.json'), 'utf8')
    );
    samples.push(...existingData.samples);
    console.log(`Loaded ${existingData.samples.length} existing samples`);
  } catch (error) {
    console.log("No existing sample data found or error loading it");
  }

  const existingOriginals = new Set(samples.map(s => s.original));

  // If API key is not available, return existing samples
  if (!API_KEY) {
    console.warn("Warning: GEMINI_API_KEY environment variable not set. Returning existing samples only.");
    return samples;
  }

  // Calculate how many samples to generate
  const targetCount = Math.max(0, count - samples.length);
  if (targetCount <= 0) {
    console.log("Already have enough samples, no need to generate more");
    return samples;
  }

  console.log(`Need to generate ${targetCount} more samples`);

  // Allocate samples between regular and edge cases
  const edgeCaseCount = includeEdgeCases ? Math.min(Math.ceil(targetCount * 0.2), 20) : 0;
  const regularCount = targetCount - edgeCaseCount;

  // Generate samples in batches
  const remainingRegularCount = regularCount;
  const batches = Math.ceil(remainingRegularCount / batchSize);

  let newSamples = [];

  // Generate regular samples
  if (remainingRegularCount > 0) {
    console.log(`Generating ${remainingRegularCount} regular samples in ${batches} batches...`);

    for (let i = 0; i < batches; i++) {
      const currentBatchSize = Math.min(batchSize, remainingRegularCount - (i * batchSize));
      if (currentBatchSize <= 0) break;

      console.log(`Generating batch ${i+1}/${batches} (${currentBatchSize} samples)...`);

      // Randomly select categories, number types, and grammatical contexts for this batch
      const categories = CATEGORIES.sort(() => 0.5 - Math.random()).slice(0, 3);
      const numberTypes = NUMBER_TYPES.sort(() => 0.5 - Math.random()).slice(0, 5);
      const grammaticalContexts = GRAMMATICAL_CONTEXTS.sort(() => 0.5 - Math.random()).slice(0, 3);

      const batchSamples = await generateAdvancedSamples({
        count: currentBatchSize,
        categories,
        numberTypes,
        grammaticalContexts
      });

      // Add non-duplicate samples
      for (const sample of batchSamples) {
        if (!existingOriginals.has(sample.original)) {
          newSamples.push(sample);
          existingOriginals.add(sample.original);
        }
      }

      // Add a delay between batches to avoid rate limiting
      if (i < batches - 1) {
        console.log("Waiting a moment before generating the next batch...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  // Generate edge case samples
  if (edgeCaseCount > 0) {
    console.log(`Generating ${edgeCaseCount} edge case samples...`);
    const edgeCaseSamples = await generateEdgeCaseSamples(edgeCaseCount);

    // Add non-duplicate edge case samples
    for (const sample of edgeCaseSamples) {
      if (!existingOriginals.has(sample.original)) {
        newSamples.push(sample);
        existingOriginals.add(sample.original);
      }
    }
  }

  console.log(`Generated ${newSamples.length} new samples`);

  // Validate samples against our implementation if requested
  if (validateWithImplementation) {
    console.log("Validating samples against our implementation...");
    newSamples = validateSamples(newSamples);

    const validCount = newSamples.filter(s => s.validationPassed).length;
    console.log(`Validation results: ${validCount}/${newSamples.length} samples passed`);

    // Optional: Log some validation failures for debugging
    const failures = newSamples.filter(s => !s.validationPassed).slice(0, 5);
    if (failures.length > 0) {
      console.log("Sample validation failures (first 5):");
      failures.forEach((sample, i) => {
        console.log(`\nFailure ${i+1}:`);
        console.log(`Original: ${sample.original}`);
        console.log(`Expected: ${sample.normalized}`);
        console.log(`Our result: ${sample.ourNormalized}`);
      });
    }
  }

  // Combine with existing samples
  const allSamples = [...samples, ...newSamples];
  console.log(`Total samples: ${allSamples.length}`);

  return allSamples;
}

/**
 * Saves the generated data to the sample-data.json file
 *
 * @param {Array<Object>} samples - Array of test cases
 */
function saveSampleData(samples) {
  // Clean samples for storage (remove validation metadata)
  const cleanSamples = samples.map(({ original, normalized }) => ({ original, normalized }));

  const data = { samples: cleanSamples };
  const outputPath = path.join(__dirname, 'sample-data.json');

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Saved ${cleanSamples.length} samples to ${outputPath}`);

  // Save raw data with metadata for analysis
  const rawOutputPath = path.join(__dirname, 'sample-data-raw.json');
  fs.writeFileSync(rawOutputPath, JSON.stringify(samples, null, 2), 'utf8');
  console.log(`Saved raw data with metadata to ${rawOutputPath}`);
}

/**
 * Main function to generate and save sample data
 */
async function main() {
  if (!API_KEY) {
    console.warn("Warning: GEMINI_API_KEY environment variable not set. Set it to use Google Gemini API.");
    console.warn("You can still use existing samples, but cannot generate new ones without an API key.");
  }

  try {
    const samples = await generateSampleData({
      count: 1000,                        // Aim for 200 total samples
      includeEdgeCases: true,            // Include edge cases
      validateWithImplementation: true,   // Validate against our implementation
      batchSize: 20                       // Generate in batches of 10
    });

    saveSampleData(samples);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Execute if run directly
if (require.main === module) {
  main();
}
module.exports = { generateSampleData, saveSampleData, generateAdvancedSamples, generateEdgeCaseSamples };
