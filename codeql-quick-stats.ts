import * as fs from 'fs';
import * as path from 'path';

// Define the interfaces for the SARIF structure
interface SarifResult {
  ruleId: string;
}

interface SarifRun {
  tool: object;
  results: SarifResult[];
}

interface SarifLog {
  $schema: string;
  version: string;
  runs: SarifRun[];
}

// Function to read and parse the SARIF file
function readSarifFile(filePath: string): SarifLog {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data) as SarifLog;
}

// Function to display the total number of detected warnings
function displayTotalWarnings(results: SarifResult[]): void {
  console.log(`Total number of detected warnings: ${results.length}`);
}

// Function to display all distinct ruleIds
function displayDistinctRuleIds(results: SarifResult[]): void {
  const ruleIds = new Set(results.map(result => result.ruleId));
  console.log('Distinct ruleIds:');
  ruleIds.forEach(ruleId => console.log(ruleId));
}

// Function to display count of distinct ruleIds
function displayCountDistinctRuleIds(results: SarifResult[]): void {
  const ruleIds = new Set(results.map(result => result.ruleId));
  console.log(`Count of distinct ruleIds: ${ruleIds.size}`);
}

// Main function to handle command-line arguments and execute corresponding functions
function main() {
  if (process.argv.length < 4) {
    console.error('Usage: npx ts-node codeql-quick-stats.ts <file> <-t|-n|-d>');
    process.exit(1);
  }

  const filePath = path.resolve(process.argv[2]);
  const option = process.argv[3];
  const sarifLog = readSarifFile(filePath);
  //console.log(sarifLog.runs.length);
  
  // Assuming we're interested in the results from the first run
  if (sarifLog.runs.length === 0) {
    console.error('No runs found in the SARIF file.');
    process.exit(1);
  }

  const results = sarifLog.runs[0].results;
  switch (option) {
    case '-t':
      displayTotalWarnings(results);
      break;
    case '-n':
      displayDistinctRuleIds(results);
      break;
    case '-d':
      displayCountDistinctRuleIds(results);
      break;
    default:
      console.error('Invalid option. Use -t, -n, or -d.');
      process.exit(1);
  }
}

// Execute the main function
main();