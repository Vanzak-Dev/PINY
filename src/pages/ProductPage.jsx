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
import { pinyMaskFaq, pinyStarsFaq } from '../data/faq';
import { pinyMaskJourney, pinyStarsJourney, pinyStarsJourneyHeading } from '../data/journey';
import { catalogApi } from '../services/catalogApi';
import { useCart } from '../hooks/useCart';
import { useCollections } from '../hooks/useCollections';
import { isProductInCollection } from '../lib/collections';
import { setProductAnnouncement } from '../lib/productAnnouncement';

export default function ProductPage({ productIdentifier }) {
  const [product, setProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { collections } = useCollections();
  const isPinyStars = isProductInCollection(product, collections, 'Piny Stars');

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

  const productAnnouncementColors = {};
  if (product?.announcementBarBackgroundColor) productAnnouncementColors.backgroundColor = product.announcementBarBackgroundColor;
  if (product?.announcementBarTextColor) productAnnouncementColors.textColor = product.announcementBarTextColor;
  const productAnnouncementSettings = Object.keys(productAnnouncementColors).length
    ? { announcementBar: productAnnouncementColors }
    : null;

  useEffect(() => {
    setProductAnnouncement(productAnnouncementSettings);
    return () => setProductAnnouncement(null);
  }, [productAnnouncementSettings]);

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
          {product.benefitsEnabled !== false && <ProductBenefitsSection product={product} />}
          {product.boosterEnabled !== false && <ProductBoosterSection onAdd={handleAdd} />}
          {isPinyStars
            ? <Journey21DaysSection cards={pinyStarsJourney} {...pinyStarsJourneyHeading} />
            : <Journey21DaysSection cards={pinyMaskJourney} />}
          {product.howToUseEnabled !== false && <HowToUseSection product={product} />}
          <ProductBeforeAfterSection
            product={product?.beforeAfterItems?.length
              ? product
              : products.find((item) => item.id === 'argila-branca') || product}
          />
          {product.aiAnalysisEnabled !== false && <AiAnalysisSection product={product} />}
          <ProductComparisonSection product={product} />
          <ProductFaqSection product={product} items={isPinyStars ? pinyStarsFaq : pinyMaskFaq} />
          <ProductReviewsSection product={product} />
          <ProductFeaturedSection products={products} onAdd={handleAdd} />
        </>
      )}
      {!loading && error && <p className="page-width" role="alert">{error}</p>}
    </main>
  );
}
