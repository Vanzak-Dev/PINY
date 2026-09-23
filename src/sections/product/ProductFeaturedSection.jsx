import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import ProductCard from '../../components/product/ProductCard';
import pineappleLeft from '../../assets/images/pineapple-scatter-left.webp';
import pineappleRight from '../../assets/images/pineapple-scatter-right.webp';
import './ProductFeaturedSection.css';

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

export default function ProductFeaturedSection({ products, onAdd }) {
  const items = products.slice(0, 4);
  const pageSize = usePageSize();
  const [index, setIndex] = useState(1);
  const [noTransition, setNoTransition] = useState(false);
  const isAnimating = useRef(false);
  const touchStartX = useRef(0);

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

  const currentDot = hasCarousel ? (index - 1 + pageCount) % pageCount : 0;

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
    <section className="product-featured" aria-label="Kits para sua pele">
      <h2 className="product-featured__title">
        KITS PARA
        <br />
        <span className="product-featured__title-line2">
          <img className="product-featured__pineapple is-left" src={pineappleLeft} alt="" draggable="false" />
          Sua Pele
          <img className="product-featured__pineapple is-right" src={pineappleRight} alt="" draggable="false" />
        </span>
      </h2>
      <p className="product-featured__subtitle">Compre os produtos PINY conforme sua necessidade.</p>

      <div
        className="product-featured__viewport"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="product-featured__track"
          style={{
            transform: `translateX(-${hasCarousel ? index : 0}%)`,
            transition: noTransition ? 'none' : 'transform 500ms ease',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedPages.map((pageItems, pageIndex) => (
            <div
              key={pageIndex}
              className="product-featured__page"
              style={{ '--cards-count': pageSize }}
            >
              {pageItems.map((product, cardIndex) => (
                <div className="product-featured__card" key={`${pageIndex}-${cardIndex}`}>
                  <ProductCard product={product} onAdd={onAdd} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {hasCarousel && (
        <div className="product-featured__dots" role="tablist">
          {pages.map((_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              aria-selected={dotIndex === currentDot}
              aria-label={`Página ${dotIndex + 1}`}
              className={`product-featured__dot${dotIndex === currentDot ? ' is-active' : ''}`}
              onClick={() => goToDot(dotIndex)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
