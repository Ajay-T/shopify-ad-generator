const ProductDisplay = ({ product }) => {
  if (!product) return null;

  return (
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      {product.image_url && <img src={product.image_url} alt={product.title} width="200" />}
      <p><strong>Price:</strong> {product.price}</p>
    </div>
  );
};

export default ProductDisplay;
