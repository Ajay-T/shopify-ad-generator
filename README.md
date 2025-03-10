
# Shopify Ad Generator Overview

This project is a take-home assessment application that demonstrates an end-to-end solution integrating **web scraping**, **AI-based ad creative generation**, and a polished **React** user interface. The application accepts a Shopify product URL, scrapes product details (title, description, price, image), generates ad text using **OpenAI GPT-3.5-turbo** and ad images using **DALL·E**, and simulates publishing these creatives on an ad platform.

---

## Features

- **Product Scraping**  
  Extracts key product details from a Shopify product page (title, description, price, and image).

- **Ad Text Generation**  
  Uses GPT-3.5-turbo to generate persuasive, copy-paste–ready ad text.

- **Ad Image Generation**  
  Employs a two-step approach: GPT crafts a DALL·E prompt, then calls DALL·E to produce a pixel-art–style image.

- **Simulated Ad Publishing**  
  Provides a mock endpoint to “publish” the generated ad on a chosen platform.

- **Modern Frontend**  
  Built with React and Chakra UI, providing a clean and intuitive interface.

- **Concurrent Launch**  
  The backend (FastAPI) and frontend can be started with a single command using `concurrently`.

---

## Technologies Used

- **Frontend**: React, Chakra UI, Vite, Axios  
- **Backend**: FastAPI, Uvicorn, Python (Requests, BeautifulSoup, Pydantic)  
- **AI Integration**: OpenAI API (GPT-3.5-turbo, DALL·E)  
- **Tooling**: npm, pip, concurrently

---

## Prerequisites

- **Python 3.8+**  
- **Node.js (v16+ recommended)**

---

## Installation

### Backend Setup

1. **Navigate** to the backend directory:
   ```bash
   cd backend
   ```
2. **Create** and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
   *(On Windows: `venv\Scripts\activate`)*
3. **Install** Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. **Navigate** to the frontend directory:
   ```bash
   cd frontend
   ```
2. **Install** Node.js dependencies:
   ```bash
   npm install
   ```

### Root-Level Setup for Concurrent Start

A `package.json` is placed in the repository root to allow launching both servers together:

1. **From** the root directory, run:
   ```bash
   npm install
   ```
   This installs the `concurrently` dependency listed in the root `package.json`.
2. **Ensure** your structure looks like this:
   ```bash
   shopify-ad-generator/
   ├── backend/
   ├── frontend/
   ├── package.json
   └── README.md
   ```

---

## Running the Application

From the **repository root**, run:

```bash
npm run start
```

This command uses `concurrently` to:

- Start the FastAPI backend at `http://127.0.0.1:8000/`
- Start the React frontend at `http://localhost:5173/`

Open `http://localhost:5173/` in your browser to access the application.

---

## Using OpenAI's API

In the **main.py**, located in the backend folder insert your OpenAI API Key at this line:

```bash
openai.api_key = ""
```

This will allow the code to make calls to OpenAI's API

---

## Usage

1. **Fetch Product**  
   Enter a valid Shopify product URL and click **Fetch Product** to scrape product details.

2. **Generate Ad Text**  
   Produces short, persuasive ad copy suitable for immediate use.

3. **Generate Ad Image**  
   Calls GPT to craft a DALL·E prompt, then generates a pixel-art–style image.

4. **Publish Ad (Mock)**  
   Opens a modal where you can simulate posting your ad to a platform (Facebook, Twitter, or Google Ads).

---

## Design and Architecture

### Backend (FastAPI)
- Endpoints for scraping (`/scrape`), ad text generation (`/generate_ad`), image generation (`/generate_image`), and mock publishing (`/publish_ad`).
- Integrates with OpenAI’s GPT and DALL·E via HTTP requests.

### Frontend (React + Chakra UI)
- Provides a user-friendly interface for scraping, generating ad text/images, and simulating ad deployment.
- Communicates with the backend via Axios.
- Launches alongside the backend using `concurrently`.

### Machine Learning Integration
- **GPT-3.5-turbo** generates persuasive text.
- **DALL·E** produces images based on GPT-crafted prompts.

---

## Limitations and Future Enhancements

### Ad Image Accuracy
DALL·E’s pixel-art approach may not exactly match brand logos or product details.

### Price Scraping
Some Shopify themes render price data via JavaScript. A headless browser approach might be needed in those cases.

### Real Ad Publishing
The `/publish_ad/` endpoint is a mock. A real integration would require valid API credentials and secure handling.

### Prompt Refinement
Additional prompt engineering could yield more brand-aligned or style-consistent images.

---

## Finding Valid Shopify Stores for Testing

- **Google Searches:**  
  Use queries like `site:myshopify.com "t-shirt"` or `site:myshopify.com "notebook"` to uncover Shopify subdomains.

- **Example Stores:**  
  - [Wikimedia Store](https://wikimedia.myshopify.com/) – Offers Wikipedia-themed merchandise.  
  - [Gfuel Store](https://gfuel.myshopify.com/) – An example that sometimes works (note: availability may vary).

- **Tools:**  
  Consider using BuiltWith, Wappalyzer, or SimilarTech to identify websites that run on Shopify.

Keep in mind that some stores may have scraping protections or load content dynamically, so results can vary.

---

## Final Notes

This project demonstrates a complete workflow: **scraping product data**, **generating AI-driven ad creatives**, and **simulating ad deployment**. It showcases how Python (FastAPI), React, and OpenAI APIs can be combined to create an AI-powered marketing tool.

For any questions or feedback, please check the inline code comments or open an issue in this repository. Happy exploring!
```
