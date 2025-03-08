import requests
from bs4 import BeautifulSoup
from models import ProductDetails
import json

# Extract product details from a Shopify product page 
def scrape_shopify_product(url: str) -> ProductDetails:
    
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return ProductDetails(
            title="N/A",
            description=f"Error fetching page: {str(e)}",
            price=None,
            image_url=None
        )
    
    soup = BeautifulSoup(response.text, "html.parser")

    # Extract title from og:title or fallback to <title>
    title_tag = soup.find("meta", {"property": "og:title"})
    title = title_tag["content"].strip() if title_tag and title_tag.get("content") else (soup.find("title").text.strip() if soup.find("title") else "N/A")

    # Extract description from og:description
    desc_tag = soup.find("meta", {"property": "og:description"})
    description = desc_tag["content"].strip() if desc_tag and desc_tag.get("content") else "N/A"

    # Extract image URL from og:image
    image_tag = soup.find("meta", {"property": "og:image"})
    image_url = image_tag["content"].strip() if image_tag and image_tag.get("content") else None

    # Initialize price
    price = None

    # Try meta tag for price
    meta_price = soup.find("meta", {"property": "product:price:amount"})
    if meta_price and meta_price.get("content"):
        price = meta_price["content"].strip()

    # Fallback: Try JSON-LD script blocks
    if not price:
        ld_json_tags = soup.find_all("script", {"type": "application/ld+json"})
        for tag in ld_json_tags:
            if not tag.string:
                continue
            try:
                data = json.loads(tag.string)
                if isinstance(data, dict) and data.get("@type") == "Product":
                    offers = data.get("offers")
                    if offers and isinstance(offers, dict) and "price" in offers:
                        price = offers["price"]
                        break
                elif isinstance(data, list):
                    for item in data:
                        if isinstance(item, dict) and item.get("@type") == "Product":
                            offers = item.get("offers")
                            if offers and isinstance(offers, dict) and "price" in offers:
                                price = offers["price"]
                                break
                    if price:
                        break
            except (json.JSONDecodeError, TypeError):
                pass

    # Fallback: Check application/json script blocks for variants
    if not price:
        json_scripts = soup.find_all("script", {"type": "application/json"})
        for script_tag in json_scripts:
            if not script_tag.string:
                continue
            try:
                data = json.loads(script_tag.string)
                if isinstance(data, dict):
                    variants = data.get("variants")
                    if variants and isinstance(variants, list) and len(variants) > 0:
                        possible_price = variants[0].get("price")
                        if possible_price:
                            price = possible_price.strip()
                            break
            except (json.JSONDecodeError, TypeError):
                pass
            if price:
                break

    # Final fallback if price is still not found
    if not price:
        price = None

    return ProductDetails(
        title=title,
        description=description,
        price=price,
        image_url=image_url
    )
