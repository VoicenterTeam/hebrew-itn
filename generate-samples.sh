#!/bin/bash
# Script to generate Hebrew ITN samples using Google Gemini API

# Check if API key is provided
if [ -z "$1" ]; then
  echo "Usage: ./generate-samples.sh YOUR_GEMINI_API_KEY"
  echo "Or run without API key to use only template-based generation:"
  echo "./generate-samples.sh"
1. Requiring an API key (not making it optional)
2. Adding a parameter for number of samples
3. Adding error handling
4. Providing more detailed output messages

Here's the complete rewritten file:

```Shell Script
#!/bin/bash
# Script to generate Hebrew ITN samples using Google Gemini API

# Check if API key is provided
if [ -z "$1" ]; then
  echo "Usage: ./generate-samples.sh YOUR_GEMINI_API_KEY [number_of_samples]"
  echo "API key is required for the enhanced sample generation."
  exit 1
else
  GEMINI_API_KEY="$1"
  echo "Using provided Gemini API key"
fi

# Get number of samples (default: 100)
NUM_SAMPLES=100
if [ -n "$2" ]; then
  NUM_SAMPLES=$2
fi

# Export the API key for the Node.js script
export GEMINI_API_KEY

# Run the data generation script
echo "Generating $NUM_SAMPLES samples with advanced LLM-based approach..."
node data/generate-data.js $NUM_SAMPLES

# Check if generation was successful
if [ $? -eq 0 ]; then
  echo "Sample generation completed successfully!"
  echo "Results saved to data/sample-data.json"
  echo "Raw data with metadata saved to data/sample-data-raw.json"
else
  echo "Error: Sample generation failed"
  exit 1
fi
else
  GEMINI_API_KEY="$1"
  echo "Using provided Gemini API key"
fi

# Export the API key for the Node.js script
export GEMINI_API_KEY

# Run the data generation script
echo "Generating samples..."
node data/generate-data.js

echo "Done!"
