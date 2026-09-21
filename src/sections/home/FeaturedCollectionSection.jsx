import { useMemo, useState, useRef, useCallback } from 'react';
import ProductCard from '../../components/product/ProductCard';
import pineappleLeft from '../../assets/images/pineapple-scatter-left.webp';
import pineappleRight from '../../assets/images/pineapple-scatter-right.webp';
import { useCollections } from '../../hooks/useCollections';
import './FeaturedCollectionSection.css';

const PAGE_SIZE = 4;

export default function FeaturedCollectionSection({ products, onAdd }) {
  const { collections } = useCollections();
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [page, setPage] = useState(0);
  const rowRef = useRef(null);

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
  const currentPage = Math.min(page, pageCount - 1);
  const hasCarousel = items.length > PAGE_SIZE;
  const cardsPerRow = Math.min(items.length, PAGE_SIZE);

  const goToPage = useCallback((index) => {
    setPage(index);
    if (rowRef.current) {
      rowRef.current.scrollTo({ left: index * rowRef.current.clientWidth, behavior: 'smooth' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (!rowRef.current || !hasCarousel) return;
    const pageIndex = Math.round(rowRef.current.scrollLeft / rowRef.current.clientWidth);
    if (pageIndex !== currentPage) setPage(pageIndex);
  }, [currentPage, hasCarousel]);

  const handleTabChange = (collectionId) => {
    setActiveCollectionId(collectionId);
    setPage(0);
    if (rowRef.current) rowRef.current.scrollTo({ left: 0 });
  };

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
              onClick={() => handleTabChange(collection.id)}
            >
              <span className="featured-collection__tab-label">{collection.name}</span>
            </button>
          ))}
        </div>
      )}

      <div
        className={`featured-collection__viewport${hasCarousel ? ' is-carousel' : ''}`}
        ref={rowRef}
        onScroll={handleScroll}
      >
        {pages.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            className="featured-collection__page"
            style={{ '--cards-count': pageItems.length }}
          >
            {pageItems.map((product) => (
              <div className="featured-collection__card" key={product.id}>
                <ProductCard product={product} onAdd={onAdd} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {hasCarousel && (
        <div className="featured-collection__dots" role="tablist">
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === currentPage}
              aria-label={`Página ${index + 1}`}
              className={`featured-collection__dot${index === currentPage ? ' is-active' : ''}`}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
