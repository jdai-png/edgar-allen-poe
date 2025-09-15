// research.js
import { secEdgarApi } from "sec-edgar-api";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// A helper to get the directory name in an ES Module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Fetches SEC filings for a given stock symbol and saves them to a JSON file.
 * @param {string} symbol The stock ticker symbol (e.g., 'AAPL').
 */
async function researchAndSaveFilings(symbol) {
	if (!symbol) {
		console.error("Please provide a stock symbol as an argument.");
		process.exit(1);
	}

	try {
		console.log(`\n🔎 Fetching SEC filings for ${symbol.toUpperCase()}...`);
		const reports = await secEdgarApi.getReports({ symbol });

		if (reports.length === 0) {
			console.log(
				`\n⚠️ No reports found for ${symbol.toUpperCase()}. Please check the symbol.`
			);
			return;
		}

		console.log(`\n✅ Successfully fetched ${reports.length} reports.`);

		// Define the output file path.
		const outputDir = path.join(__dirname, "filings");

		// Create the directory if it doesn't exist.
		await mkdir(outputDir, { recursive: true });

		const outputFilePath = path.join(
			outputDir,
			`${symbol.toUpperCase()}_filings.json`
		);

		// Convert the array of reports to a human-readable JSON string.
		const jsonContent = JSON.stringify(reports, null, 2);

		// Write the JSON string to the specified file using async/await.
		await writeFile(outputFilePath, jsonContent);

		console.log(`\n✨ Successfully saved filings to ${outputFilePath}`);
	} catch (error) {
		console.error("\nAn error occurred during the process:", error);
	}
}

// Get the stock symbol from the command-line arguments.
const stockSymbol = process.argv[2];

// Run the script.
researchAndSaveFilings(stockSymbol);
