import { useState } from "react";
import ProductInput from "./components/ProductInput";
import ProductDisplay from "./components/ProductDisplay";

function App() {
  const [product, setProduct] = useState(null);

  return (
    <div>
      <h1>Shopify Ad Generator</h1>
      <ProductInput onProductFetched={setProduct} />
      <ProductDisplay product={product} />
    </div>
  );
}

export default App;
