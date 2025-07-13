/**
 * Worker Pool Performance Benchmark
 * 
 * This benchmark compares the performance of:
 * 1. Sequential processing
 * 2. Parallel processing with our worker pool
 * 
 * It shows the significant performance improvement for large datasets.
 */

const { normalizeText, normalizeTranscriptParallel, shutdownWorkerPool } = require('../src/index');

// Sample transcript data with Hebrew spelled-out numbers
const sampleData = [
  {
    speaker: "Speaker0",
    text: "את זה לשם.",
    sentence_id: 1
  },
  {
    speaker: "Speaker1",
    text: "כן. בוא נארגנת השמנה, יש כבר חמש מאות דברים שאני אספתי בעגלה.",
    sentence_id: 2
  },
  {
    speaker: "Speaker0",
    text: "הפנתי לך ברציף שלוש.",
    sentence_id: 3
  },
  {
    speaker: "Speaker1",
    text: "תודה, קניתי שלושת אלפים מאתיים חמישים ושבעה מוצרים אתמול.",
    sentence_id: 4
  }
];

// Generate datasets of different sizes for benchmarking
function generateDataset(size) {
  const dataset = [];
  for (let i = 0; i < size; i++) {
    const index = i % sampleData.length;
    const item = { ...sampleData[index] };
    item.sentence_id = i + 1;
    dataset.push(item);
  }
  return dataset;
}

// Sequential processing function (for comparison)
function processSequentially(sentences) {
  return sentences.map(sentence => ({
    ...sentence,
    text: normalizeText(sentence.text)
  }));
}

// Run benchmark with different dataset sizes
async function runBenchmark() {
  const sizes = [10, 100, 500, 1000, 5000];
  const results = {
    sequential: {},
    parallel: {}
  };
  
  console.log('🚀 Worker Pool Performance Benchmark 🚀');
  console.log('======================================\n');
  
  // Warm up worker pool with small dataset
  await normalizeTranscriptParallel(generateDataset(10));
  
  for (const size of sizes) {
    const dataset = generateDataset(size);
    console.log(`Testing with dataset size: ${size} items`);
    
    // Sequential benchmark
    console.time(`Sequential ${size}`);
    processSequentially(dataset);
    const sequentialTime = process.hrtime.bigint();
    processSequentially(dataset);
    const sequentialDuration = Number(process.hrtime.bigint() - sequentialTime) / 1000000;
    console.timeEnd(`Sequential ${size}`);
    results.sequential[size] = sequentialDuration;
    
    // Parallel benchmark
    console.time(`Parallel ${size}`);
    await normalizeTranscriptParallel(dataset);
    const parallelTime = process.hrtime.bigint();
    await normalizeTranscriptParallel(dataset);
    const parallelDuration = Number(process.hrtime.bigint() - parallelTime) / 1000000;
    console.timeEnd(`Parallel ${size}`);
    results.parallel[size] = parallelDuration;
    
    // Calculate speedup
    const speedup = sequentialDuration / parallelDuration;
    console.log(`Speedup: ${speedup.toFixed(2)}x faster with worker pool\n`);
  }
  
  // Print summary
  console.log('\n📊 Performance Summary 📊');
  console.log('========================');
  console.log('Dataset Size | Sequential (ms) | Parallel (ms) | Speedup');
  console.log('------------|-----------------|--------------|--------');
  
  for (const size of sizes) {
    const seq = results.sequential[size].toFixed(2);
    const par = results.parallel[size].toFixed(2);
    const speedup = (results.sequential[size] / results.parallel[size]).toFixed(2);
    console.log(`${size.toString().padEnd(12)}| ${seq.padEnd(16)}| ${par.padEnd(14)}| ${speedup}x`);
  }
  
  // Clean up
  await shutdownWorkerPool();
}

runBenchmark().catch(console.error);