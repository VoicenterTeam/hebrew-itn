#!/usr/bin/env node
/**
 * Hebrew ITN CLI
 *
 * Command-line interface for the Hebrew Inverse Text Normalization module
 *
 * @example
 * $ node cli.js "יש חמש מאות אלף הורים וחמשת אלפיים שלוש מאות ושניים ילדים נמצאים ברציף שמונה"
 * > יש 500,000 הורים ו5,302 ילדים נמצאים ברציף 8
 */

const { normalizeText } = require('./index');

/**
 * Processes command line arguments and runs the normalization
 *
 * @returns {void}
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Hebrew Inverse Text Normalization CLI

Usage:
  node cli.js <text>         Normalize the provided Hebrew text
  node cli.js --help, -h     Show this help message

Example:
  node cli.js "יש חמש מאות ילדים בגן"
    `);
    return;
  }

  try {
    const inputText = args.join(' ');
    const normalized = normalizeText(inputText);
    console.log(normalized);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Execute the main function if this script is run directly
if (require.main === module) {
  main();
}

module.exports = { main };
