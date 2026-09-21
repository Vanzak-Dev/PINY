import { useMemo, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import pineappleLeft from '../../assets/images/pineapple-scatter-left.webp';
import pineappleRight from '../../assets/images/pineapple-scatter-right.webp';
import { useCollections } from '../../hooks/useCollections';
import './FeaturedCollectionSection.css';

export default function FeaturedCollectionSection({ products, onAdd }) {
  const { collections } = useCollections();
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  const activeCollection = useMemo(
    () => collections.find((collection) => collection.id === activeCollectionId) || collections[0] || null,
    [collections, activeCollectionId],
  );

  const items = useMemo(() => {
    if (!activeCollection) return [];
    return (activeCollection.productIds || [])
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [activeCollection, products]);

  if (!items.length) return null;

  return (
    <section className="featured-collection" aria-label="Kits para sua pele">
      <h2 className="featured-collection__title">
        KITS PARA
        <br />
        <span className="featured-collection__title-line2">
          <img className="featured-collection__pineapple is-left" src={pineappleLeft} alt="" draggable="false" />
          Sua Pele
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

      <div className="featured-collection__row" style={{ '--cards-count': items.length }}>
        {items.map((product) => (
          <div className="featured-collection__card" key={product.id}>
            <ProductCard product={product} onAdd={onAdd} />
          </div>
        ))}
      </div>
    </section>
  );
}
