import ProductCard from '../product/ProductCard';
import badgeEllipseOuter from '../../assets/product/faq/badge-ellipse-outer.svg';
import badgeEllipseInner from '../../assets/product/faq/badge-ellipse-inner.svg';
import pineappleLeft from '../../assets/product/faq/pineapple-left.svg';
import pineappleRight from '../../assets/product/faq/pineapple-right.svg';
import './CategoryPageLayout.css';

export default function CategoryPageLayout({
  bannerImage,
  bannerAlt,
  badgeLine1,
  badgeLine2,
  heading,
  products,
  onAdd,
  emptyMessage,
}) {
  return (
    <main className="category-page">
      {bannerImage && <img className="category-page__banner" src={bannerImage} alt={bannerAlt} />}

      {badgeLine1 && (
        <div className="category-page__badge">
          <img className="category-page__badge-ellipse category-page__badge-ellipse--outer" src={badgeEllipseOuter} alt="" aria-hidden="true" />
          <img className="category-page__badge-ellipse category-page__badge-ellipse--inner" src={badgeEllipseInner} alt="" aria-hidden="true" />
          <h1 className="category-page__badge-text">
            <span>{badgeLine1}</span>
            <span>{badgeLine2}</span>
          </h1>
          <img className="category-page__badge-pineapple category-page__badge-pineapple--left" src={pineappleLeft} alt="" aria-hidden="true" />
          <img className="category-page__badge-pineapple category-page__badge-pineapple--right" src={pineappleRight} alt="" aria-hidden="true" />
        </div>
      )}

      {heading && <h1 className="category-page__heading">{heading}</h1>}

      <div className="category-page__toolbar">
        <span className="category-page__count">{products.length} produtos</span>
        <div className="category-page__toolbar-actions">
          <span className="category-page__pill">Filtros</span>
          <span className="category-page__sort-label">Ordenar por:</span>
          <span className="category-page__pill">Em destaque</span>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="category-page__grid">
          {products.map((product) => (
            <div className="category-page__card" key={product.id}>
              <ProductCard product={product} onAdd={onAdd} />
            </div>
          ))}
        </div>
      ) : (
        <p className="category-page__empty">{emptyMessage}</p>
      )}
    </main>
  );
}
