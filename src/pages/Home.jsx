import { useState } from "react";
import Hero from "../sections/home/Hero";
import TestimonialsSection from "../sections/global/TestimonialsSection";
import InstafeedSection from "../sections/home/InstafeedSection";
import ProductCategoriesSection from "../sections/product/ProductCategoriesSection";
import ProductCarouselSection from "../sections/product/ProductCarouselSection";
import PineappleFeatureSection from "../sections/brand/PineappleFeatureSection";
import UgcReviewsSection from "../sections/ugc/UgcReviewsSection";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";

export default function Home() {
  const [addedProduct, setAddedProduct] = useState(null);
  const [featuredProductId, setFeaturedProductId] = useState(null);
  const { products, error } = useProducts();
  const { addItem } = useCart();

  const handleAdd = (product) => {
    addItem(product);
    setAddedProduct(product);
  };

  return (
    <main>
      <Hero />
      <ProductCarouselSection
        products={products}
        initialIndex={2}
        onAdd={handleAdd}
      />
      <PineappleFeatureSection products={products} selectedProductId={featuredProductId} />
      <UgcReviewsSection
        products={products}
        onAdd={handleAdd}
        selectedProductId={featuredProductId}
        onSelectProduct={setFeaturedProductId}
      />
      <ProductCategoriesSection products={products} onAdd={handleAdd} />
      <div className="testimonials-backdrop">
        <TestimonialsSection />
      </div>
      <InstafeedSection />
      <p role="status" aria-live="polite" hidden={!error}>{error}</p>
      <p role="status" aria-live="polite" hidden={!addedProduct}>
        {addedProduct ? `${addedProduct.name} adicionada ao carrinho.` : ""}
      </p>
    </main>
  );
}
