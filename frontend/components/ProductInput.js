import { useState } from "react";
import axios from "axios";

const ProductInput = ({ onProductFetched }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/scrape/?url=${encodeURIComponent(url)}`);
      onProductFetched(response.data);
    } catch (err) {
      setError("Failed to fetch product details.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Enter a Shopify Product URL</h2>
      <input
        type="text"
        placeholder="Enter product URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={handleFetch} disabled={loading}>
        {loading ? "Fetching..." : "Fetch Product"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProductInput;
