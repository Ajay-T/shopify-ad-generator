Shopify Ad Generator
Overview
This project is a take-home assessment application that demonstrates an end-to-end solution integrating web scraping, AI-based creative generation, and a polished user interface. The application accepts a Shopify product URL (and optionally an image), scrapes product details (title, description, price, image), generates ad creatives using OpenAI’s GPT-3.5-turbo (for ad text) and DALL·E (for ad image), and simulates publishing these creatives on an ad platform.

Features
Product Scraping: Extracts key product details from a Shopify product page.
Ad Text Generation: Uses GPT-3.5-turbo to generate persuasive ad copy that is ready to be copied and pasted.
Ad Image Generation: Uses a two-step approach with GPT to craft a DALL·E prompt, then generates an ad image.
Simulated Ad Publishing: Provides a mock endpoint to simulate deploying the generated ad to a platform.
Modern Frontend: A clean and intuitive UI built with React and Chakra UI.
Concurrent Launch: Start both the backend and frontend with a single command.
Technologies Used
Front-end: React, Chakra UI, Vite, Axios
Back-end: FastAPI, Uvicorn, Python, Requests, BeautifulSoup, Pydantic
AI Integration: OpenAI API (GPT-3.5-turbo, DALL·E)
Tooling: npm, pip, concurrently
Installation
Prerequisites
Python 3.8 or later
Node.js (v16+ recommended)
Backend Setup
Navigate to the backend/ directory:
bash
Copy
cd backend
Create and activate a virtual environment:
bash
Copy
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install Python dependencies:
bash
Copy
pip install -r requirements.txt
Note: If you don’t have a requirements.txt file, generate one with pip freeze > requirements.txt and clean it up as needed.
Frontend Setup
Navigate to the frontend/ directory:
bash
Copy
cd frontend
Install Node.js dependencies:
bash
Copy
npm install
Root-Level Setup for Simultaneous Start
A root-level package.json has been created in the repository root (the same level as the backend/ and frontend/ folders) to allow starting both services with one command:

Ensure your repository structure is as follows:
lua
Copy
shopify-ad-generator/
├── backend/
├── frontend/
├── README.md
└── package.json   <-- (root-level)
The root package.json should contain:
json
Copy
{
  "name": "shopify-ad-generator",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "concurrently \"cd backend && source venv/bin/activate && uvicorn main:app --reload\" \"cd frontend && npm run dev\""
  },
  "devDependencies": {
    "concurrently": "^9.1.2"
  }
}
From the repository root, install dependencies:
bash
Copy
npm install
Running the Application
From the repository root, run:

bash
Copy
npm run start
This command uses the concurrently package to start:

The FastAPI backend on http://127.0.0.1:8000/
The React frontend on http://localhost:5173/
Open your browser at http://localhost:5173/ to use the application.

Usage
Fetch Product: Enter a valid Shopify product URL and click “Fetch Product” to scrape product details.
Generate Ad Text: Click “Generate Ad Text” to generate persuasive ad copy. Use the regenerate option if needed.
Generate Ad Image: Click “Generate Ad Image” to generate an AI-driven ad image.
Publish Ad (Mock): Click “Publish Ad” to simulate sharing the ad. (Note: This integration is simulated and not fully functional with real ad platforms.)
Design and Architecture
Modular Design: The solution is divided into a front-end (React with Chakra UI) and a back-end (FastAPI) with clearly defined responsibilities.
AI Integration: Uses OpenAI APIs for generating creative ad text and images, with retry logic and error handling.
Web Scraping: Implements robust scraping of product data using BeautifulSoup, with multiple fallback methods.
Simulated Ad Publishing: Provides a framework for future integration with ad platforms.
Limitations and Future Enhancements
Ad Image Quality: DALL·E may not always produce on-brand images. Future improvements could involve refining the prompt or integrating image-to-image transformations.
Ad Platform Integration: The current publishing endpoint is simulated. A real integration with platforms like Meta or Google Ads would require additional API credentials and secure token handling.
Price Scraping: Some Shopify stores may render price dynamically; using a headless browser or API integration might be necessary for more robust extraction.
Documentation: This README and the inline code comments provide an overview; further documentation could include architecture diagrams and more detailed setup instructions if needed.
Setup and Testing
Ensure that all required environment variables (such as the OpenAI API key) are properly configured.
Test the application thoroughly by fetching different Shopify product URLs, generating ad text and images, and simulating the ad publishing flow.
Check the logs and console outputs for any errors during each process.
Final Notes
This project demonstrates the integration of web scraping, AI-based ad creative generation, and a clean front-end interface to meet the specified requirements. While some components (such as ad publishing) are simulated, the solution is designed to be robust, maintainable, and scalable for future enhancements.