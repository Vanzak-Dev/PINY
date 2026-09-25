import TextureHero from '../sections/texture/Hero';
import GuaranteeSection from '../sections/global/GuaranteeSection';
import AiAnalysisSection from '../sections/global/AiAnalysisSection';
import KitPickerSection from '../sections/global/KitPickerSection';
import GuaranteeBanner from '../sections/global/GuaranteeBanner';
import Journey21DaysSection from '../sections/product/Journey21DaysSection';
import HowToUseSection from '../sections/product/HowToUseSection';
import ProductComparisonSection from '../sections/product/ProductComparisonSection';
import ProductPresentationSection from '../sections/product/ProductPresentationSection';
import ProductBeforeAfterSection from '../sections/product/ProductBeforeAfterSection';
import ProductFaqSection from '../sections/product/ProductFaqSection';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

export default function MonteSuaTexturaPage() {
  const { products, error } = useProducts();
  const { addItem } = useCart();

  const mainProduct = products[0] || null;
  const beforeAfterProduct = products.find((product) => product.beforeAfterEnabled);
  const crossSellProducts = products.filter((product) => product.id !== mainProduct?.id).slice(0, 2);

  return (
    <main>
      <TextureHero />
      <KitPickerSection />
      <GuaranteeSection />
      <AiAnalysisSection />
      <Journey21DaysSection />
      <HowToUseSection />
      <ProductComparisonSection product={mainProduct} />
      <ProductPresentationSection
        product={mainProduct}
        categoryLabel={mainProduct?.category || 'PINY MASK'}
        crossSellProducts={crossSellProducts}
        onAdd={addItem}
      />
      {beforeAfterProduct && <ProductBeforeAfterSection product={beforeAfterProduct} />}
      <ProductFaqSection />
      <GuaranteeBanner />
      <p role="status" aria-live="polite" hidden={!error}>{error}</p>
    </main>
  );
}
