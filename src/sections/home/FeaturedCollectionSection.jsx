import { useMemo, useState } from 'react';
import ProductCard from '../../components/product/ProductCard';
import pineappleLeft from '../../assets/images/pineapple-scatter-left.webp';
import pineappleRight from '../../assets/images/pineapple-scatter-right.webp';
import './FeaturedCollectionSection.css';

export default function FeaturedCollectionSection({ products, onAdd }) {
  const categories = useMemo(
    () => {
      const seen = new Set();
      const list = [];
      products.forEach((product) => {
        if (product.category && !seen.has(product.category)) {
          seen.add(product.category);
          list.push(product.category);
        }
      });
      return list;
    },
    [products],
  );

  const [activeCategory, setActiveCategory] = useState(categories[0] ?? null);

  const items = useMemo(
    () => products.filter((product) => product.category === activeCategory).slice(0, 4),
    [products, activeCategory],
  );

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

      {categories.length > 1 && (
        <div className="featured-collection__tabs" role="tablist">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={category === activeCategory}
              className={`featured-collection__tab${category === activeCategory ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              <span className="featured-collection__tab-label">{category}</span>
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
