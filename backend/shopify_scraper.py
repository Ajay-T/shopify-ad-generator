import requests
from bs4 import BeautifulSoup
from models import ProductDetails

def scrape_shopify_product(url: str) -> ProductDetails:
    """Extracts product details from a Shopify product page."""
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to fetch page: {str(e)}"}

    soup = BeautifulSoup(response.text, "html.parser")

    # Extract product details
    title = soup.find("meta", {"property": "og:title"})["content"]
    description = soup.find("meta", {"property": "og:description"})["content"]
    image_url = soup.find("meta", {"property": "og:image"})["content"]
    price = soup.find("meta", {"property": "product:price:amount"})

    return ProductDetails(
        title=title,
        description=description,
        image_url=image_url,
        price=price["content"] if price else "N/A"
    )
