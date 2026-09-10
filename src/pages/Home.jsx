import { useState } from "react";
import Hero from "../sections/home/Hero";
import ProductCarouselSection from "../sections/product/ProductCarouselSection";
import PineappleFeatureSection from "../sections/brand/PineappleFeatureSection";
import UgcReviewsSection from "../sections/ugc/UgcReviewsSection";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const [addedProduct, setAddedProduct] = useState(null);
  const { products, error } = useProducts();

  return (
    <main>
      <Hero />
      <ProductCarouselSection
        products={products}
        initialIndex={2}
        onAdd={setAddedProduct}
      />
      <PineappleFeatureSection products={products} />
      <UgcReviewsSection products={products} onAdd={setAddedProduct} />
      <p role="status" aria-live="polite" hidden={!error}>{error}</p>
      <p role="status" aria-live="polite" hidden={!addedProduct}>
        {addedProduct ? `${addedProduct.name} adicionada ao carrinho.` : ""}
      </p>
    </main>
  );
}
