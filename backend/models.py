from pydantic import BaseModel
from typing import Optional

class ProductDetails(BaseModel):
    title: str
    description: str
    price: Optional[str] = None
    image_url: Optional[str] = None
