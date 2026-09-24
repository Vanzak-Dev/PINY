import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import ProductCard from '../../components/product/ProductCard';
import pineappleLeft from '../../assets/images/pineapple-scatter-left.webp';
import pineappleRight from '../../assets/images/pineapple-scatter-right.webp';
import { useCollections } from '../../hooks/useCollections';
import './FeaturedCollectionSection.css';

const DESKTOP_PAGE_SIZE = 4;
const MOBILE_PAGE_SIZE = 2;
const MOBILE_BREAKPOINT = 768;

function usePageSize() {
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
      ? MOBILE_PAGE_SIZE
      : DESKTOP_PAGE_SIZE,
  );
  useEffect(() => {
    const onResize = () => {
      setPageSize(window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return pageSize;
}

export default function FeaturedCollectionSection({ products, onAdd }) {
  const { collections } = useCollections();
  const pageSize = usePageSize();
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [index, setIndex] = useState(1);
  const [noTransition, setNoTransition] = useState(false);
  const isAnimating = useRef(false);
  const touchStartX = useRef(0);

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

  // Build pages of exactly pageSize, wrapping around to fill the last page
  const pages = useMemo(() => {
    if (items.length <= pageSize) return [items];
    const result = [];
    for (let i = 0; i < items.length; i += pageSize) {
      const page = [];
      for (let j = 0; j < pageSize; j++) {
        page.push(items[(i + j) % items.length]);
      }
      result.push(page);
    }
    return result;
  }, [items, pageSize]);

  const pageCount = pages.length;
  const hasCarousel = pageCount > 1;

  // Extended pages: [last, ...all, first] for seamless loop
  const extendedPages = useMemo(() => {
    if (!hasCarousel) return pages;
    return [pages[pageCount - 1], ...pages, pages[0]];
  }, [pages, hasCarousel, pageCount]);

  const goTo = useCallback((target) => {
    setNoTransition(false);
    setIndex(target);
  }, []);

  const goToDot = useCallback((dotIndex) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    goTo(dotIndex + 1);
  }, [goTo]);

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

  useEffect(() => {
    setNoTransition(true);
    setIndex(1);
  }, [activeCollectionId]);

  const currentDot = hasCarousel ? (index - 1 + pageCount) % pageCount : 0;

  // Touch swipe support
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!hasCarousel || isAnimating.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) < 40) return;
    isAnimating.current = true;
    const direction = deltaX < 0 ? 1 : -1;
    const newDot = (currentDot + direction + pageCount) % pageCount;
    goTo(newDot + 1);
  }, [hasCarousel, currentDot, pageCount, goTo]);

  if (!items.length) return null;

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
              onClick={() => setActiveCollectionId(collection.id)}
            >
              <span className="featured-collection__tab-label">{collection.name}</span>
            </button>
          ))}
        </div>
      )}

      <div
        className="featured-collection__viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="featured-collection__track"
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
              style={{ '--cards-count': pageSize }}
            >
              {pageItems.map((product, cardIndex) => (
                <div className="featured-collection__card" key={`${pageIndex}-${cardIndex}`}>
                  <ProductCard product={product} onAdd={onAdd} />
                </div>
              ))}
            </div>
          ))}
        </div>
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
