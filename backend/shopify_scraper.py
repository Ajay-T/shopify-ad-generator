import requests
from bs4 import BeautifulSoup
from models import ProductDetails
import json

def scrape_shopify_product(url: str) -> ProductDetails:
    """Extract product details (title, description, price, image) from a Shopify product page."""
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

    # --------------------------
    # 1) Title
    # --------------------------
    title_tag = soup.find("meta", {"property": "og:title"})
    if title_tag and title_tag.get("content"):
        title = title_tag["content"].strip()
    else:
        fallback_title = soup.find("title")
        title = fallback_title.text.strip() if fallback_title else "N/A"

    # --------------------------
    # 2) Description
    # --------------------------
    desc_tag = soup.find("meta", {"property": "og:description"})
    if desc_tag and desc_tag.get("content"):
        description = desc_tag["content"].strip()
    else:
        description = "N/A"

    # --------------------------
    # 3) Image URL
    # --------------------------
    image_tag = soup.find("meta", {"property": "og:image"})
    image_url = image_tag["content"].strip() if (image_tag and image_tag.get("content")) else None

    # --------------------------
    # 4) Price
    # --------------------------
    price = None

    # (a) Check <meta property="product:price:amount">
    meta_price = soup.find("meta", {"property": "product:price:amount"})
    if meta_price and meta_price.get("content"):
        price = meta_price["content"].strip()

    # (b) JSON-LD fallback
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

    # (c) Check <script type="application/json"> blocks for variants
    #     Some Shopify themes store product data in a "ProductJson" script.
    if not price:
        json_scripts = soup.find_all("script", {"type": "application/json"})
        for script_tag in json_scripts:
            # If the script is huge or doesn't look like product data, skip
            if not script_tag.string:
                continue
            try:
                data = json.loads(script_tag.string)
                # data might be a dict with "variants"
                if isinstance(data, dict):
                    # Common structure might have data["variants"] -> list of variant objects
                    variants = data.get("variants")
                    if variants and isinstance(variants, list) and len(variants) > 0:
                        # Take the first variant's price or find the cheapest
                        first_variant = variants[0]
                        # price can be "2600" or "26.00" or "26.00 USD"
                        possible_price = first_variant.get("price")
                        # If it's something like "2600" meaning $26.00, we might parse or just store it
                        if possible_price:
                            # If it's numeric like "2600", we can convert to 26.00
                            # But let's just store it as a string
                            price = possible_price.strip()
                            break
            except (json.JSONDecodeError, TypeError):
                pass
            if price:
                break

    # (d) Final fallback
    if not price:
        price = None

    return ProductDetails(
        title=title,
        description=description,
        price=price,
        image_url=image_url
    )
