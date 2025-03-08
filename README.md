# Shopify Ad Generator Overview

This project is a take-home assessment application that demonstrates an end-to-end solution integrating web scraping, AI-based ad creative generation, and a polished user interface. The application accepts a Shopify product URL (and optionally an image), scrapes product details (title, description, price, image), generates ad text using OpenAI GPT-3.5-turbo and ad images using DALL·E, and simulates publishing these creatives on an ad platform.

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
  The backend (FastAPI) and frontend (Vite) can be started with a single command using `concurrently`.

---

## Technologies Used

- **Frontend**: React, Chakra UI, Vite, Axios  
- **Backend**: FastAPI, Uvicorn, Python (Requests, BeautifulSoup, Pydantic)  
- **AI Integration**: OpenAI API (GPT-3.5-turbo, DALL·E)  
- **Tooling**: npm, pip, concurrently

---

## Installation

### Prerequisites

- **Python 3.8+**
- **Node.js (v16+ recommended)**

### Backend Setup

1. **Navigate** to the backend directory:
   ```bash
   cd backend
