import { useCallback, useEffect, useState } from 'react';
import ProductPresentationSection from '../sections/product/ProductPresentationSection';
import ProductActivesSection from '../sections/product/ProductActivesSection';
import ProductBenefitsSection from '../sections/product/ProductBenefitsSection';
import AiAnalysisSection from '../sections/global/AiAnalysisSection';
import ProductReviewsSection from '../sections/product/ProductReviewsSection';
import { catalogApi } from '../services/catalogApi';

export default function ProductPage({ productIdentifier }) {
  const [addedProduct, setAddedProduct] = useState(null);
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(() => {
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
    setLoading(true);
    loadProduct();
    const handleStorage = (event) => {
      if (event.key === 'piny:catalog-version') loadProduct();
    };
    window.addEventListener('focus', loadProduct);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('focus', loadProduct);
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
            onAdd={setAddedProduct}
          />
          <ProductActivesSection product={product} />
          <AiAnalysisSection product={product} />
          <ProductBenefitsSection />
          <ProductReviewsSection product={product} />
        </>
      )}
      {!loading && error && <p className="page-width" role="alert">{error}</p>}
      <p role="status" aria-live="polite" hidden={!addedProduct}>
        {addedProduct ? `${addedProduct.name} adicionada ao carrinho.` : ''}
      </p>
    </main>
  );
}
