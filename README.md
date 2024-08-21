# Carrd Site Downloader

This project is a Node.js script designed to download the HTML content of a Carrd website and save it to your local machine.

## Features

- Fetches HTML content from a specified Carrd URL.
- Saves the HTML content to a local directory.
- Easily configurable via environment variables.

## Prerequisites

- [Node.js](https://nodejs.org/) (v12.x or later)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/carrd-downloader.git
   cd carrd-downloader
   npm install
   ```
 2. Set up environment variables:
 Create a .env file in the root directory of your project and add the following content:

  ```bash
CARRD_URL=https://your-carrd-site-url.com
USER_EMAIL=your-email@example.com
USER_PASSWORD=your-password
 ```
Replace the placeholder values with your actual Carrd URL, email, and password.

3. Add .env to .gitignore (if not already added):

  ```bash
echo ".env" >> .gitignore
 ```
4. Usage
Run the script:

  ```bash
node index.js
```
The script will fetch the HTML content from the specified Carrd URL and save it to the ./public directory.

5. Output
The downloaded HTML content will be saved in the public/index.html file.

