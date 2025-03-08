from pydantic import BaseModel
from typing import Optional

# Model for holding product details scraped from a Shopify product page
class ProductDetails(BaseModel):
    title: str
    description: str
    price: Optional[str] = None
    image_url: Optional[str] = None
