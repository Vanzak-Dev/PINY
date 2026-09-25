import { useCallback, useEffect, useState } from 'react';
import ProductPresentationSection from '../sections/product/ProductPresentationSection';
import ProductActivesSection from '../sections/product/ProductActivesSection';
import ProductBenefitsSection from '../sections/product/ProductBenefitsSection';
import ProductBoosterSection from '../sections/product/ProductBoosterSection';
import ProductComparisonSection from '../sections/product/ProductComparisonSection';
import ProductFaqSection from '../sections/product/ProductFaqSection';
import ProductFeaturedSection from '../sections/product/ProductFeaturedSection';
import ProductBeforeAfterSection from '../sections/product/ProductBeforeAfterSection';
import Journey21DaysSection from '../sections/product/Journey21DaysSection';
import HowToUseSection from '../sections/product/HowToUseSection';
import AiAnalysisSection from '../sections/global/AiAnalysisSection';
import ProductReviewsSection from '../sections/product/ProductReviewsSection';
import { catalogApi } from '../services/catalogApi';
import { useCart } from '../hooks/useCart';

export default function ProductPage({ productIdentifier }) {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  const handleAdd = (addedItem) => {
    addItem(addedItem);
  };

  const loadProduct = useCallback(() => {
    setLoading(true);
    Promise.all([
      catalogApi.getProduct(productIdentifier),
      catalogApi.listProducts(),
    ])
      .then(([selectedProduct, catalog]) => {
        setProduct(selectedProduct);
        setProducts(catalog);
        setError('');
      })
      .catch((requestError) => {
        setProduct(null);
        setError(requestError.message);
      })
      .finally(() => setLoading(false));
  }, [productIdentifier]);

  useEffect(() => {
    loadProduct();
    const handleStorage = (event) => {
      if (event.key === 'piny:catalog-version') loadProduct();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadProduct]);

  const configuredCrossSell = (product?.crossSellIds || [])
    .map((id) => products.find((item) => item.id === id))
    .filter(Boolean);
  const crossSellProducts = configuredCrossSell.length
    ? configuredCrossSell
    : products.filter((item) => item.id !== product?.id).slice(0, 2);

  return (
    <main>
      {loading && <p className="page-width" role="status">Carregando produto…</p>}
      {!loading && product && (
        <>
          <ProductPresentationSection
            product={product}
            categoryLabel={product.category || 'PINY MASK'}
            crossSellProducts={crossSellProducts}
            onAdd={handleAdd}
          />
          {product.activesEnabled !== false && <ProductActivesSection product={product} />}
          <ProductBenefitsSection />
          <ProductBoosterSection onAdd={handleAdd} />
          <Journey21DaysSection />
          <HowToUseSection />
          <ProductBeforeAfterSection product={product} />
          <AiAnalysisSection product={product} />
          <ProductComparisonSection product={product} />
          <ProductFaqSection />
          <ProductReviewsSection product={product} />
          <ProductFeaturedSection products={products} onAdd={handleAdd} />
        </>
      )}
      {!loading && error && <p className="page-width" role="alert">{error}</p>}
    </main>
  );
}
