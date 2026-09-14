import AddToCartIcon from '../ui/AddToCartIcon';
import { formatPrice } from '../../lib/formatPrice';
import './ProductCard.css';

export default function ProductCard({ product, isActive = false, isMotionLocked = false, isPreview = false, onAdd }) {
  const words = product.name.trim().split(/\s+/);
  const firstLine = words.shift();
  const secondLine = words.join(' ');
  const productUrl = `/produtos/${product.slug || product.id}`;

  return (
    <article
      className={`product-card${isActive ? ' product-card--active' : ''}${isMotionLocked ? ' product-card--motion-locked' : ''}`}
      data-product-id={product.id}
      style={{
        '--product-color': product.backgroundColor,
        '--image-rest-rotation': `${product.imageRestRotation ?? 0}deg`,
        '--image-active-rotation': `${product.imageActiveRotation ?? 15}deg`,
      }}
    >
      <div className="product-card__visual">
        <a className="product-card__visual-link" href={isPreview ? undefined : productUrl} tabIndex={isPreview ? -1 : undefined} aria-label={`Ver detalhes de ${product.name}`}>
          <div className="product-card__base" />
          {product.backgroundImage && (
            <div
              className="product-card__animated-background"
              style={{ backgroundImage: `url(${product.backgroundImage})` }}
            />
          )}
          <img className="product-card__image" src={product.image} alt={product.name} draggable="false" />
        </a>
        <button
          className="product-card__add"
          type="button"
          aria-label={`Adicionar ${product.name} ao carrinho`}
          disabled={isPreview}
          onClick={() => onAdd?.(product)}
        >
          <AddToCartIcon />
        </button>
      </div>

      <a className="product-card__information" href={isPreview ? undefined : productUrl} tabIndex={isPreview ? -1 : undefined} aria-label={`Ver detalhes de ${product.name}`}>
        <h2 className="product-card__name">
          <span>{firstLine}</span>
          {secondLine && <strong>{secondLine}</strong>}
        </h2>
        <div className="product-card__prices">
          {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
          <span>{formatPrice(product.price)}</span>
        </div>
      </a>
    </article>
  );
}
