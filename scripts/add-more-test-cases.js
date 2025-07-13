/**
 * This script updates the sample-data.json file with more test cases
 */

const fs = require('fs');
const path = require('path');
const testCases = require('../src/testCases');

// Load existing sample data
const dataPath = path.join(__dirname, '..', 'data', 'sample-data.json');
const sampleData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Create a set of existing originals to avoid duplicates
const existingOriginals = new Set(sampleData.samples.map(sample => sample.original));

// Convert our test cases to the format used in sample-data.json
const additionalSamples = [];
Object.entries(testCases.testCases).forEach(([original, normalized]) => {
  if (!existingOriginals.has(original)) {
    additionalSamples.push({ original, normalized });
    existingOriginals.add(original);
  }
});

// Add the new samples to the existing ones
sampleData.samples = sampleData.samples.concat(additionalSamples);

// Save the updated data
console.log(`Adding ${additionalSamples.length} new test cases to sample-data.json`);
fs.writeFileSync(dataPath, JSON.stringify(sampleData, null, 2));
console.log(`Total samples now: ${sampleData.samples.length}`);

// Optional: Make a backup of the original file
fs.writeFileSync(
  path.join(__dirname, '..', 'data', 'sample-data.backup.json'),
  JSON.stringify(JSON.parse(fs.readFileSync(dataPath, 'utf8')), null, 2)
);