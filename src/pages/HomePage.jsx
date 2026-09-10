import { useState } from 'react';
import ProductCarouselSection from '../sections/product/ProductCarouselSection';
import { useProducts } from '../hooks/useProducts';

export default function HomePage() {
  const [addedProduct, setAddedProduct] = useState(null);
  const { products, error } = useProducts();

  return (
    <main>
      <ProductCarouselSection
        products={products}
        initialIndex={2}
        onAdd={setAddedProduct}
      />
      <p role="status" aria-live="polite" hidden={!error}>{error}</p>
      <p role="status" aria-live="polite" hidden={!addedProduct}>
        {addedProduct ? `${addedProduct.name} adicionada ao carrinho.` : ''}
      </p>
    </main>
  );
}
