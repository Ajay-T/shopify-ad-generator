import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/scrape/?url=${encodeURIComponent(url)}`
      );
      console.log("API Response:", response.data); // Log response
      setProduct(response.data);
    } catch (err) {
      console.error("API Error:", err);  // Log any errors
      setError("Failed to fetch product details.");
    }

    setLoading(false);
  };


  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Shopify Product Scraper</h1>
      <input
        type="text"
        placeholder="Enter Shopify product URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "300px", padding: "10px", marginRight: "10px" }}
      />
      <button onClick={fetchProduct} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Product"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
        </div>
      )}
    </div>
  );
}

export default App;
