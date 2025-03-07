   import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const [adText, setAdText] = useState("");
  const [adImage, setAdImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Shopify product details
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/scrape/?url=${encodeURIComponent(url)}`
      );
      console.log("Product Response:", response.data);
      setProduct(response.data);
    } catch (err) {
      console.error("Fetch Product Error:", err);
      alert("Failed to fetch product details.");
    }
    setLoading(false);
  };

  // Generate AI ad copy (GPT-3.5-turbo)
  const generateAdText = async () => {
    if (!product) return alert("Fetch product details first!");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate_ad/",
        {
          title: product.title || "Unknown Product",
          description: product.description || "No description available.",
          price: product.price || "N/A",
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Ad Copy Response:", response.data);
      if (response.data.ad_text) {
        setAdText(response.data.ad_text);
      } else {
        alert("No ad text returned.");
      }
    } catch (err) {
      console.error("Generate Ad Text Error:", err.response?.data || err);
      alert("Failed to generate ad text.");
    }
    setLoading(false);
  };

  // Generate AI ad image (DALL·E)
  const generateAdImage = async () => {
    if (!product) return alert("Fetch product details first!");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/generate_image/",
        { prompt: product.description || "An exciting product" },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Ad Image Response:", response.data);
      if (response.data.image_url) {
        setAdImage(response.data.image_url);
      } else {
        alert("No image URL returned.");
      }
    } catch (err) {
      console.error("Generate Ad Image Error:", err.response?.data || err);
      alert("Failed to generate ad image.");
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Shopify Product Scraper</h1>
      <input
        type="text"
        placeholder="Enter Shopify product URL (include https://)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={fetchProduct} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Product"}
      </button>

      {product && (
        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          {product.image_url && (
            <img src={product.image_url} alt={product.title} width="200" />
          )}
          <p>
            <strong>Price:</strong> {product.price}
          </p>

          <button onClick={generateAdText} disabled={loading}>
            Generate Ad Copy
          </button>
          <button onClick={generateAdImage} disabled={loading}>
            Generate Ad Image
          </button>

          {adText && (
            <p style={{ fontWeight: "bold", marginTop: "20px" }}>{adText}</p>
          )}
          {adImage && (
            <img
              src={adImage}
              alt="Generated Ad"
              width="300"
              style={{ display: "block", marginTop: "20px" }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;