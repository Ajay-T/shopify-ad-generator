from fastapi import FastAPI
from shopify_scraper import scrape_shopify_product
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import requests

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
# Set your OpenAI API key here
# ----------------------------------------------------------------
openai.api_key = ""

# ----------------------------------------------------------------
# Ad Copy (Ad Text) Generation Endpoint
# ----------------------------------------------------------------
class AdCopyRequest(BaseModel):
    title: str
    description: str
    price: str
    refine: bool = False  # optional parameter to refine text

@app.post("/generate_ad/")
def generate_ad(request: AdCopyRequest):
    print(f"Received ad copy request: {request}")
    
    if request.refine:
        prompt = f"""
        Previously, you generated an ad for this product. Now provide a second variation 
        that is better. Keep it short and persuasive.

        **Product:** {request.title}
        **Description:** {request.description}
        **Price:** {request.price}
        """
    else:
        prompt = f"""
        In need of an engaging and captivating ad copy for my product: {request.title}.
        Please create a compelling headline and a unique selling proposition that 
        differentiates this product from competitors. Keep it short, persuasive, 
        and include a clear call-to-action.

        Key features: {request.description}
        Price: {request.price}
        """
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional marketing copywriter."},
                {"role": "user", "content": prompt}
            ]
        )
        ad_text = response.choices[0].message.content
        return {"ad_text": ad_text}
    except Exception as e:
        print(f"Error in generate_ad: {e}")
        return {"error": str(e)}

# ----------------------------------------------------------------
# Ad Image Generation Endpoint with GPT Two-Step Approach
# ----------------------------------------------------------------
class AdImageRequest(BaseModel):
    prompt: str  # The product description
    refine: bool = False  # If true, we ask GPT to refine/regenerate the image prompt

@app.post("/generate_image/")
def generate_image(request: AdImageRequest):
    """
    1) Use GPT to craft a detailed DALL·E prompt based on the product description.
    2) Call the DALL·E endpoint with that prompt.
    3) Return the image URL.
    """
    print(f"Received ad image request: {request}")
    
    # Step 1: Generate a DALL·E prompt using GPT
    try:
        if request.refine:
            # If we're regenerating, ask for a second variation
            gpt_prompt = f"""
            Previously, you created a DALL·E prompt for this product.
            Now provide a second variation with a more playful or different style,
            but keep the entire prompt under 500 characters.

            Product details: {request.prompt}

            Make sure the new prompt is descriptive, realistic, 
            and yields a brand-friendly, coherent ad image.
            """
        else:
            # First-time generation
            gpt_prompt = f"""
            You are an AI prompt writer for DALL·E. 
            Please create a short (Keep it under 500 characters), detailed prompt that produces a coherent, 
            visually appealing advertisement image for the following product:

            Product details: {request.prompt}

            The style should be realistic, brand-friendly, 
            and highlight the product in a lifestyle context.
            Avoid large textual overlays in the image itself.
            """

        # Call GPT to get the final DALL·E prompt
        gpt_response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a creative AI prompt writer for DALL·E."},
                {"role": "user", "content": gpt_prompt}
            ]
        )
        dall_e_prompt = gpt_response.choices[0].message.content.strip()
        print("DALL·E prompt from GPT:", dall_e_prompt)
    except Exception as e:
        print(f"Error generating DALL·E prompt via GPT: {e}")
        return {"error": str(e)}

    # Step 2: Call the DALL·E endpoint with the generated prompt
    try:
        url = "https://api.openai.com/v1/images/generations"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {openai.api_key}"
        }
        data = {
            "prompt": dall_e_prompt,
            "n": 1,
            "size": "1024x1024"
        }
        response = requests.post(url, json=data, headers=headers)
        print("RAW JSON response:", response.text)
        image_response = response.json()

        if "data" in image_response and len(image_response["data"]) > 0:
            image_url = image_response["data"][0]["url"]
            return {"image_url": image_url}
        else:
            return {
                "error": "No image data returned",
                "response": image_response
            }
    except Exception as e:
        print(f"Error calling DALL·E endpoint: {e}")
        return {"error": str(e)}
