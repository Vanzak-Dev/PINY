import ProductCard from '../product/ProductCard';
import './MegaMenu.css';

export default function MegaMenu({ title, description, products, viewAllHref, emptyMessage }) {
  const items = products.slice(0, 4);

  return (
    <div className="mega-menu">
      <div className="mega-menu__info">
        <h2 className="mega-menu__title">{title}</h2>
        <div className="mega-menu__divider" />
        <p className="mega-menu__description">{description}</p>
      </div>
      <div className="mega-menu__separator" />
      <div className="mega-menu__products">
        <h3 className="mega-menu__products-label">PRODUTOS:</h3>
        {items.length > 0 ? (
          <div className="mega-menu__cards-row">
            <div className="mega-menu__cards">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <a className="mega-menu__view-all" href={viewAllHref}>Ver todos os produtos</a>
          </div>
        ) : (
          <p className="mega-menu__empty">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
