@echo off
REM Script to generate Hebrew ITN samples using Google Gemini API

REM Check if API key is provided
IF "%~1"=="" (
  echo Usage: generate-samples.bat YOUR_GEMINI_API_KEY
  echo Or run without API key to use only template-based generation:
  echo generate-samples.bat
  SET GEMINI_API_KEY=
) ELSE (
  SET GEMINI_API_KEY=%~1
  echo Using provided Gemini API key
)

REM Run the data generation script
echo Generating samples...
node data/generate-data.js

echo Done!