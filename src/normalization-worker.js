/**
 * Worker thread for Hebrew text normalization
 *
 * This worker processes batches of transcript sentences, applying
 * normalization to each text element while maintaining the sentence structure.
 *
 * @module normalization-worker
 */

const { parentPort } = require('worker_threads');
const path = require('path');

// We need to load the main module dynamically to avoid circular dependencies
let normalizeText;
try {
  // First try to load from the parent directory if we're in a worker
  const hebrewItn = require('./index.js');
  normalizeText = hebrewItn.normalizeText;
} catch (error) {
  // Fallback approach if the first method fails
  console.error('Error loading main module:', error);
  process.exit(1);
}

// Listen for messages from the main thread
parentPort.on('message', (task) => {
  try {
    // Process a batch of sentences by normalizing their text properties
    const normalizedBatch = task.batch.map(item => {
  // Apply normalization to the text property only
  const normalizedText = normalizeText(item.text);

  // Return a new object with the same properties but normalized text
  return { ...item, text: normalizedText };
});

// Send the processed batch back to the main thread
parentPort.postMessage(normalizedBatch);
  } catch (error) {
    // Send error back to main thread
    parentPort.postMessage({ error: error.message });
  }
});
