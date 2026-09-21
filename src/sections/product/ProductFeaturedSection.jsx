import ProductCard from '../../components/product/ProductCard';
import pineappleLeft from '../../assets/images/pineapple-scatter-left.webp';
import pineappleRight from '../../assets/images/pineapple-scatter-right.webp';
import './ProductFeaturedSection.css';

export default function ProductFeaturedSection({ products, onAdd }) {
  const items = products.slice(0, 4);

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

      <div className="product-featured__row" style={{ '--cards-count': items.length }}>
        {items.map((product) => (
          <div className="product-featured__card" key={product.id}>
            <ProductCard product={product} onAdd={onAdd} />
          </div>
        ))}
      </div>
    </section>
  );
}
