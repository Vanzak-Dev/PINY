import { useState } from "react";
import SplitMediaHero from "../sections/home/SplitMediaHero";
import ProductCarouselSection from "../sections/product/ProductCarouselSection";
import PineappleFeatureSection from "../sections/brand/PineappleFeatureSection";
import UgcReviewsSection from "../sections/ugc/UgcReviewsSection";
import { useProducts } from "../hooks/useProducts";
import heroLeft from "../assets/images/hero-left.png";
import heroRight from "../assets/images/hero-right.png";
import heroOverlay from "../assets/images/piny-overlay.png";

export default function Home() {
  const [addedProduct, setAddedProduct] = useState(null);
  const { products, error } = useProducts();

  return (
    <main>
      <SplitMediaHero
        leftMedia={{ type: "image", src: heroLeft }}
        rightMedia={{ type: "image", src: heroRight }}
        overlayImage={heroOverlay}
        leftAlt="Máscara facial PINY"
        rightAlt="Textura e embalagem da máscara PINY"
        overlayAlt="PINY"
      />
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
