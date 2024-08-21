require('dotenv').config(); // Load environment variables from .env file
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Configuration
const CARRD_URL = process.env.CARRD_URL; // Carrd URL from .env
const OUTPUT_DIR = './public'; // Directory to save the HTML and media files

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

// Function to download media files and save them locally
async function saveMedia(mediaUrl, outputDir) {
    const urlObj = new URL(mediaUrl, CARRD_URL); // Convert relative URL to absolute
    const fileName = path.basename(urlObj.pathname); // Extract filename
    const filePath = path.join(outputDir, fileName);

    try {
        const response = await fetch(urlObj.href);
        if (!response.ok) {
            throw new Error(`Failed to fetch media from ${urlObj.href}: ${response.statusText}`);
        }
        const buffer = await response.buffer();
        fs.writeFileSync(filePath, buffer);
        console.log(`Media content saved to ${filePath}`);
        return `./media/${fileName}`;
    } catch (error) {
        console.error('Error saving media:', error);
        return null;
    }
}

// Function to process HTML and download media files
async function processHTML(htmlContent) {
    const outputDir = path.join(OUTPUT_DIR, 'media');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    // Replace media URLs in HTML content and download media
    const mediaUrlRegex = /<img\s+[^>]*src="([^"]+)"|<video\s+[^>]*src="([^"]+)"|<source\s+[^>]*src="([^"]+)"|url\(\s*['"]?([^'"\)]+\.(jpg|jpeg|png|gif|svg|mp4|webm|ogg))['"]?\s*\)/gi;
    let modifiedHTML = htmlContent;

    const matches = htmlContent.matchAll(mediaUrlRegex);
    for (const match of matches) {
        const mediaUrl = match[1] || match[2] || match[3] || match[4];
        if (mediaUrl) {
            const absoluteMediaUrl = new URL(mediaUrl, CARRD_URL).href; // Ensure absolute URL
            const localFilePath = await saveMedia(absoluteMediaUrl, outputDir);
            if (localFilePath) {
                modifiedHTML = modifiedHTML.replace(mediaUrl, localFilePath);
            }
        }
    }

    return modifiedHTML;
}

// Main function to download and process the website
async function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    let htmlContent = await fetchHTML(CARRD_URL);
    htmlContent = await processHTML(htmlContent);

    // Save processed HTML to file
    const outputPath = path.join(OUTPUT_DIR, 'index.html');
    saveHTML(htmlContent, outputPath);
}

// Run the script
main();
