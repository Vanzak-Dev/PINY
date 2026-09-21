import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import ProductCard from '../../components/product/ProductCard';
import pineappleLeft from '../../assets/images/pineapple-scatter-left.webp';
import pineappleRight from '../../assets/images/pineapple-scatter-right.webp';
import { useCollections } from '../../hooks/useCollections';
import './FeaturedCollectionSection.css';

const PAGE_SIZE = 4;

export default function FeaturedCollectionSection({ products, onAdd }) {
  const { collections } = useCollections();
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [index, setIndex] = useState(1); // starts at 1 because of leading clone
  const [noTransition, setNoTransition] = useState(false);
  const trackRef = useRef(null);
  const isAnimating = useRef(false);

  const activeCollection = useMemo(
    () => collections.find((collection) => collection.id === activeCollectionId) || collections[0] || null,
    [collections, activeCollectionId],
  );

  const items = useMemo(() => {
    if (!activeCollection) return [];
    return (activeCollection.productIds || [])
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean);
  }, [activeCollection, products]);

  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < items.length; i += PAGE_SIZE) {
      result.push(items.slice(i, i + PAGE_SIZE));
    }
    return result;
  }, [items]);

  const pageCount = pages.length;
  const hasCarousel = items.length > PAGE_SIZE;

  // Build extended pages: [last, ...all, first] for seamless loop
  const extendedPages = useMemo(() => {
    if (!hasCarousel || pageCount < 2) return pages;
    return [pages[pageCount - 1], ...pages, pages[0]];
  }, [pages, hasCarousel, pageCount]);

  const goTo = useCallback((target) => {
    setNoTransition(false);
    setIndex(target);
  }, []);

  const goNext = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    goTo(index + 1);
  }, [index, goTo]);

  const goPrev = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    goTo(index - 1);
  }, [index, goTo]);

  const goToDot = useCallback((dotIndex) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    goTo(dotIndex + 1); // +1 offset for leading clone
  }, [goTo]);

  // After transition ends, silently jump to real page if on a clone
  const handleTransitionEnd = useCallback(() => {
    isAnimating.current = false;
    if (!hasCarousel) return;
    if (index === 0) {
      setNoTransition(true);
      setIndex(pageCount);
    } else if (index === pageCount + 1) {
      setNoTransition(true);
      setIndex(1);
    }
  }, [index, hasCarousel, pageCount]);

  // Reset to page 1 when collection changes
  useEffect(() => {
    setNoTransition(true);
    setIndex(1);
  }, [activeCollectionId]);

  const handleTabChange = (collectionId) => {
    setActiveCollectionId(collectionId);
  };

  if (!items.length) return null;

  const currentDot = hasCarousel ? (index - 1 + pageCount) % pageCount : 0;

  return (
    <section className="featured-collection" aria-label="Seu cuidado está aqui">
      <h2 className="featured-collection__title">
        SEU CUIDADO
        <br />
        <span className="featured-collection__title-line2">
          <img className="featured-collection__pineapple is-left" src={pineappleLeft} alt="" draggable="false" />
          está aqui
          <img className="featured-collection__pineapple is-right" src={pineappleRight} alt="" draggable="false" />
        </span>
      </h2>
      <p className="featured-collection__subtitle">Compre os produtos PINY conforme sua necessidade.</p>

      {collections.length > 1 && (
        <div className="featured-collection__tabs" role="tablist">
          {collections.map((collection) => (
            <button
              key={collection.id}
              type="button"
              role="tab"
              aria-selected={collection.id === activeCollection.id}
              className={`featured-collection__tab${collection.id === activeCollection.id ? ' is-active' : ''}`}
              onClick={() => handleTabChange(collection.id)}
            >
              <span className="featured-collection__tab-label">{collection.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="featured-collection__slider">
        {hasCarousel && (
          <button
            type="button"
            className="featured-collection__arrow is-prev"
            aria-label="Anterior"
            onClick={goPrev}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#1c8c44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        <div className="featured-collection__viewport">
          <div
            className="featured-collection__track"
            ref={trackRef}
            style={{
              transform: `translateX(-${index * 100}%)`,
              transition: noTransition ? 'none' : 'transform 500ms ease',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedPages.map((pageItems, pageIndex) => (
              <div
                key={pageIndex}
                className="featured-collection__page"
                style={{ '--cards-count': PAGE_SIZE }}
              >
                {pageItems.map((product) => (
                  <div className="featured-collection__card" key={`${pageIndex}-${product.id}`}>
                    <ProductCard product={product} onAdd={onAdd} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {hasCarousel && (
          <button
            type="button"
            className="featured-collection__arrow is-next"
            aria-label="Próximo"
            onClick={goNext}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#1c8c44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {hasCarousel && (
        <div className="featured-collection__dots" role="tablist">
          {pages.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              aria-selected={dotIndex === currentDot}
              aria-label={`Página ${dotIndex + 1}`}
              className={`featured-collection__dot${dotIndex === currentDot ? ' is-active' : ''}`}
              onClick={() => goToDot(dotIndex)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
