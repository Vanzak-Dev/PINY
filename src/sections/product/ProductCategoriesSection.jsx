import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import ProductCategoriesPineapple from './ProductCategoriesPineapple';
import './ProductCategoriesSection.css';

const categories = ['Antiacne', 'Antioleosidade', 'Calmante & Detox', 'Cuidado Diário'];
const DRAG_THRESHOLD = 4;

function cardsPerPageForWidth(width) {
  if (width > 768) return 4;
  return 2;
}

function buildPages(items, perPage) {
  const total = items.length;
  if (total === 0) return [];
  if (total <= perPage) {
    return [Array.from({ length: perPage }, (_, i) => items[i % total])];
  }
  const pageCount = Math.ceil(total / perPage);
  const pages = [];
  for (let page = 0; page < pageCount; page += 1) {
    const start = page * perPage;
    const end = start + perPage;
    // Underfilled last page: slide the window back so it still shows `perPage`
    // whole cards, reusing the tail end of the previous page instead of
    // stretching the few remaining cards to fill the row.
    pages.push(end <= total ? items.slice(start, end) : items.slice(total - perPage));
  }
  return pages;
}

export default function ProductCategoriesSection({ products, onAdd }) {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activePage, setActivePage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(() => (
    typeof window === 'undefined' ? 4 : cardsPerPageForWidth(window.innerWidth)
  ));
  const trackRef = useRef(null);
  const dragRef = useRef(null);
  const isProgrammaticScroll = useRef(null);

  const categoryProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [products, activeCategory],
  );

  const pages = useMemo(
    () => buildPages(categoryProducts, cardsPerPage),
    [categoryProducts, cardsPerPage],
  );

  const trackItems = useMemo(() => (
    pages.flatMap((page, pageIndex) => page.map((product, index) => ({
      product,
      key: `${pageIndex}-${index}-${product.id}`,
      isPageStart: index === 0,
    })))
  ), [pages]);

  useEffect(() => {
    setActivePage(0);
    trackRef.current?.scrollTo({ left: 0 });
  }, [activeCategory, cardsPerPage]);

  useEffect(() => {
    const onResize = () => setCardsPerPage(cardsPerPageForWidth(window.innerWidth));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pageCount = pages.length;
  const currentPage = Math.min(activePage, Math.max(pageCount - 1, 0));

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || isProgrammaticScroll.current || !pageCount) return;
    const pageWidth = track.clientWidth;
    if (!pageWidth) return;
    const page = Math.min(pageCount - 1, Math.max(0, Math.round(track.scrollLeft / pageWidth)));
    setActivePage(page);
  };

  const goToPage = (page) => {
    const track = trackRef.current;
    if (!track) return;
    window.clearTimeout(isProgrammaticScroll.current);
    // CSS scroll-snap fights a JS-driven smooth scrollTo (Chrome/Safari can
    // resolve the snap instantly, skipping the animation), so snapping is
    // suspended for the duration of the animated scroll and restored after.
    track.classList.add('is-settling');
    isProgrammaticScroll.current = window.setTimeout(() => {
      isProgrammaticScroll.current = null;
      track.classList.remove('is-settling');
    }, 600);
    track.scrollTo({ left: page * track.clientWidth, behavior: 'smooth' });
    setActivePage(page);
  };

  const handlePointerDown = (event) => {
    const track = trackRef.current;
    if (!track) return;
    window.clearTimeout(isProgrammaticScroll.current);
    isProgrammaticScroll.current = null;
    track.classList.add('is-settling');
    dragRef.current = { startX: event.clientX, startScrollLeft: track.scrollLeft, moved: false };
    track.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    if (!track || !drag) return;
    const delta = event.clientX - drag.startX;
    if (Math.abs(delta) > DRAG_THRESHOLD) drag.moved = true;
    track.scrollLeft = drag.startScrollLeft - delta;
  };

  const endDrag = (event) => {
    const track = trackRef.current;
    const drag = dragRef.current;
    dragRef.current = null;
    if (!track || !drag) return;
    if (drag.moved) {
      const pageWidth = track.clientWidth;
      const page = pageWidth
        ? Math.min(pageCount - 1, Math.max(0, Math.round(track.scrollLeft / pageWidth)))
        : currentPage;
      goToPage(page);
    } else {
      track.classList.remove('is-settling');
    }
    try { track.releasePointerCapture(event.pointerId); } catch { /* pointer already released */ }
  };

  if (!categoryProducts.length) return null;

  return (
    <section className="product-categories" aria-label="Categorias de produtos">
      <h2 className="product-categories__title">
        SEU CUIDADO
        <br />
        <span className="product-categories__title-line2">
          <ProductCategoriesPineapple className="product-categories__pineapple is-left" />
          está aqui
          <ProductCategoriesPineapple className="product-categories__pineapple is-right" />
        </span>
      </h2>
      <p className="product-categories__subtitle">Compre os produtos PINY conforme sua necessidade.</p>

      <div className="product-categories__tabs" role="tablist">
        {categories.map((category) => (
          <button
            type="button"
            role="tab"
            className={`product-categories__tab${category === activeCategory ? ' is-active' : ''}`}
            key={category}
            aria-selected={category === activeCategory}
            onClick={() => setActiveCategory(category)}
          >
            <span className="product-categories__tab-label">{category}</span>
          </button>
        ))}
      </div>

      <div
        className="product-categories__row"
        ref={trackRef}
        style={{ '--cards-per-page': cardsPerPage }}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        {trackItems.map(({ product, key, isPageStart }) => (
          <div
            className={`product-categories__card${isPageStart ? ' is-page-start' : ''}`}
            key={key}
          >
            <ProductCard product={product} onAdd={onAdd} />
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="product-categories__dots" role="tablist" aria-label="Páginas de produtos">
          {pages.map((_, index) => (
            <button
              type="button"
              role="tab"
              className={`product-categories__dot${index === currentPage ? ' is-active' : ''}`}
              key={index}
              aria-selected={index === currentPage}
              aria-label={`Ir para página ${index + 1}`}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
