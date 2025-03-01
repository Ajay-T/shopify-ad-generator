from fastapi import FastAPI
from shopify_scraper import scrape_shopify_product

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Shopify Product Scraper API is running"}

@app.get("/scrape/")
def scrape_product(url: str):
    """Fetch product details from a Shopify product URL."""
    return scrape_shopify_product(url)
