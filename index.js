const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuration
const CARRD_URL = 'https://your-carrd-site-url.com'; // Replace with your Carrd URL
const USER_PASSWORD = 'your-password'; // Replace with your password
const OUTPUT_DIR = './public'; // Directory to save the HTML file

// Function to fetch HTML content
async function fetchHTML(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error('Error fetching HTML:', error);
        process.exit(1);
    }
}

// Function to save HTML to a file
function saveHTML(content, filePath) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`HTML content saved to ${filePath}`);
    } catch (error) {
        console.error('Error saving HTML:', error);
        process.exit(1);
    }
}

// Main function to download and process the website
async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    const htmlContent = await fetchHTML(CARRD_URL);

    // Optionally, add more processing of HTML content here
    // For example, updating media links or other modifications

    // Save HTML to file
    const outputPath = path.join(OUTPUT_DIR, 'index.html');
    saveHTML(htmlContent, outputPath);
}

// Run the script
main();
