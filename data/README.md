# Hebrew ITN Sample Data Generation

This directory contains tools and data for generating test samples for Hebrew Inverse Text Normalization (ITN).

## Sample Data Files

- `sample-data.json` - The main sample data file containing Hebrew sentences with spelled-out numbers and their normalized versions.
- `full-data.json` - Generated file containing additional samples (created by the generate-data.js script).

## Data Generation Script

The `generate-data.js` script can generate sample data for testing the Hebrew ITN system. It uses two approaches:

1. **Template-based generation** - Creates samples by combining sentence templates with number expressions.
2. **Google Gemini-based generation** - Uses Google's Gemini API to generate more diverse and natural sentences.

### Features

- Combines local template-based generation with AI-powered generation
- Automatically merges new samples with the existing dataset
- Avoids generating duplicate samples
- Provides normalized versions of all generated samples

### Usage

#### Basic Usage

```bash
# Run the data generation script
npm run generate-samples

# Alternatively, use Node directly
node data/generate-data.js
```

#### Using Google Gemini API

To use the Google Gemini API for generating more diverse samples:

1. Get an API key from Google AI Studio: https://makersuite.google.com/app/apikey
2. Set the API key as an environment variable:

```bash
# On Linux/macOS
export GEMINI_API_KEY=your_api_key_here

# On Windows (Command Prompt)
set GEMINI_API_KEY=your_api_key_here

# On Windows (PowerShell)
$env:GEMINI_API_KEY="your_api_key_here"
```

3. Run the generation script:

```bash
npm run generate-samples
```

### Customization

You can modify the script to:

- Change the number of samples generated (default is 100)
- Adjust the ratio of template-based vs. Gemini-based samples
- Add new sentence templates or number expressions
- Change the output format or location

## Sample Format

Each sample in the dataset has the following structure:

```json
{
  "original": "יש חמש מאות אלף הורים",
  "normalized": "יש 500,000 הורים"
}
```

- `original` - Hebrew text with spelled-out numbers
- `normalized` - The same text with numbers converted to digits