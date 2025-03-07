from fastapi import FastAPI
from shopify_scraper import scrape_shopify_product
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import requests  # We'll use requests for the direct HTTP call

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Shopify Product Scraper API is running"}

@app.get("/scrape/")
def scrape_product(url: str):
    """Fetch product details from a Shopify product URL."""
    return scrape_shopify_product(url)

# ----------------------------------------------------------------
# Openai API key goes here
# ----------------------------------------------------------------
openai.api_key = ""
# openai.organization = "" 

class AdCopyRequest(BaseModel):
    title: str
    description: str
    price: str

@app.post("/generate_ad/")
def generate_ad(request: AdCopyRequest):
    print(f"Received ad copy request: {request}")
    prompt = f"""
    Create a short, engaging advertisement for the following product:

    **Product:** {request.title}
    **Description:** {request.description}
    **Price:** {request.price}

    The ad should be optimized for social media, catchy, and persuasive.
    """
    try:
        # Using the Chat Completions endpoint for GPT-3.5-turbo
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an ad copy generator."},
                {"role": "user", "content": prompt}
            ]
        )
        ad_text = response.choices[0].message.content
        return {"ad_text": ad_text}
    except Exception as e:
        print(f"Error in generate_ad: {e}")
        return {"error": str(e)}

def generate_image_direct(prompt, n=1, size="1024x1024"):
    """
    Makes a direct POST request to the OpenAI image-generation endpoint.
    Logs the raw JSON response for debugging.
    """
    url = "https://api.openai.com/v1/images/generations"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai.api_key}"
    }
    data = {
        "prompt": prompt,
        "n": n,
        "size": size
    }

    # Make the request using 'requests'
    response = requests.post(url, json=data, headers=headers)

    # Log the raw JSON text returned by OpenAI
    print("RAW JSON response:", response.text)

    # Return the parsed JSON so we can handle it
    return response.json()

class AdImageRequest(BaseModel):
    prompt: str  # The product description

@app.post("/generate_image/")
def generate_image(request: AdImageRequest):
    print(f"Received ad image request: {request}")
    try:
        # Call our direct function
        image_response = generate_image_direct(
            f"An eye-catching advertisement for {request.prompt}"
        )

        # Log the parsed response
        print("image_response:", image_response)

        # Check if 'data' is present and not empty
        if "data" in image_response and len(image_response["data"]) > 0:
            image_url = image_response["data"][0]["url"]
            return {"image_url": image_url}
        else:
            # Possibly an error or empty data array
            return {
                "error": "No image data returned",
                "response": image_response
            }
    except Exception as e:
        print(f"Error in generate_image: {e}")
        return {"error": str(e)}