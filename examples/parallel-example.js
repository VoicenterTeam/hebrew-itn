/**
 * Example demonstrating the optimized parallel text normalization functionality
 *
 * This script shows how to use the normalizeTranscriptParallel function
 * with a persistent worker pool for high-performance processing.
 */

const { normalizeTranscriptParallel, shutdownWorkerPool } = require('../src/index');

// Sample transcript data with Hebrew spelled-out numbers
const transcriptSample = [
  {
    speaker: "Speaker0",
    text: "את זה לשם.",
    startTime: 104.32,
    endTime: 104.52,
    sentence_id: 38,
  },
  {
    speaker: "Speaker1",
    text: "כן. בוא נארגנת השמנה, יש כבר חמש מאות דברים שאני אספתי בעגלה.",
    startTime: 96,
    endTime: 122.08,
    sentence_id: 39,
  },
  {
    speaker: "Speaker0",
    text: "הפנתי לך ברציף שלוש.",
    startTime: 120.04,
    endTime: 130.6,
    sentence_id: 40
  },
  {
    speaker: "Speaker1",
    text: "תודה, קניתי שלושת אלפים מאתיים חמישים ושבעה מוצרים אתמול.",
    startTime: 131.0,
    endTime: 135.5,
    sentence_id: 41
  }
];

// Create a larger dataset to demonstrate worker pool efficiency
function generateLargeDataset(baseData, size = 1000) {
  const largeDataset = [];

  for (let i = 0; i < size; i++) {
    const index = i % baseData.length;
    const item = { ...baseData[index] };
    item.sentence_id = i + 1;
    item.startTime += i * 0.01;
    item.endTime += i * 0.01;
    largeDataset.push(item);
  }

  return largeDataset;
}

async function runExample() {
  console.log('Processing with parallel normalization...\n');
  try {
    // Process a small batch first
    console.log('Processing small batch:');
    console.time('Small batch processing time');
    const normalizedTranscript = await normalizeTranscriptParallel(transcriptSample);
    console.timeEnd('Small batch processing time');
    console.log(`Processed ${normalizedTranscript.length} items\n`);

    // Process a medium batch - worker pool is already initialized from previous call
    const mediumBatch = generateLargeDataset(transcriptSample, 100);
    console.log('Processing medium batch:');
    console.time('Medium batch processing time');
    const mediumResult = await normalizeTranscriptParallel(mediumBatch);
    console.timeEnd('Medium batch processing time');
    console.log(`Processed ${mediumResult.length} items\n`);

    // Process a large batch - worker pool is reused again
    const largeBatch = generateLargeDataset(transcriptSample, 1000);
    console.log('Processing large batch:');
    console.time('Large batch processing time');
    const largeResult = await normalizeTranscriptParallel(largeBatch);
    console.timeEnd('Large batch processing time');
    console.log(`Processed ${largeResult.length} items\n`);

    // Sample results
    console.log('Sample of normalized results:');
    console.log(JSON.stringify(normalizedTranscript, null, 2));

    // Demonstrate running multiple normalization operations in sequence
    console.log('\nRunning consecutive normalization operations:');
    console.time('Consecutive operations');
    // Run 5 consecutive operations to show the worker pool stays alive
    for (let i = 0; i < 5; i++) {
      const result = await normalizeTranscriptParallel(transcriptSample);
      console.log(`Batch ${i+1}: Processed ${result.length} items`);
    }
    console.timeEnd('Consecutive operations');

    // Always shut down the worker pool when completely done
    console.log('\nShutting down worker pool...');
    await shutdownWorkerPool();
    console.log('Worker pool terminated successfully');
  } catch (error) {
    console.error('Error during parallel normalization:', error);
    // Ensure worker pool is shut down on error
    await shutdownWorkerPool();
  }
}

runExample();
