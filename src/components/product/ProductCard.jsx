import './ProductCard.css';

function AddToCartIcon() {
  return (
    <svg viewBox="0 0 78 61" fill="none" aria-hidden="true">
      <rect x="1.58" y="2.38" width="76.01" height="57.8" rx="12.67" fill="#1C8C44" />
      <g className="product-card__add-front">
        <rect x="1.58" y="1.58" width="72.84" height="54.63" rx="11.08" fill="#FEFEFD" stroke="#1C8C44" strokeWidth="3.17" />
        <path d="M55.5 26.34 52.47 41.4c-.37 1.86-.56 2.79-1.05 3.49-.43.61-1.02 1.1-1.71 1.4-.78.34-1.74.34-3.65.34H32.27c-1.9 0-2.86 0-3.64-.34a4.75 4.75 0 0 1-1.72-1.4c-.48-.7-.67-1.63-1.05-3.49l-3.03-15.06M20.79 26.34h36.76M31 32.42v.03m16.34-.03v.03M26.92 26.34l6.12-12.18m18.38 12.18-6.12-12.18" stroke="#1C8C44" strokeWidth="3.17" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20.79 9.41v8.98m4.23-4.62h-8.98" stroke="#1C8C44" strokeWidth="3.17" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const displayPrice = (value) => typeof value === 'number' ? currency.format(value) : value;

export default function ProductCard({ product, isActive = false, isMotionLocked = false, onAdd }) {
  const words = product.name.trim().split(/\s+/);
  const firstLine = words.shift();
  const secondLine = words.join(' ');

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
        <div className="product-card__base" />
        {product.backgroundImage && (
          <div
            className="product-card__animated-background"
            style={{ backgroundImage: `url(${product.backgroundImage})` }}
          />
        )}
        <img className="product-card__image" src={product.image} alt={product.name} draggable="false" />
        <button
          className="product-card__add"
          type="button"
          aria-label={`Adicionar ${product.name} ao carrinho`}
          onClick={() => onAdd?.(product)}
        >
          <AddToCartIcon />
        </button>
      </div>

      <div className="product-card__information">
        <h2 className="product-card__name">
          <span>{firstLine}</span>
          {secondLine && <strong>{secondLine}</strong>}
        </h2>
        <div className="product-card__prices">
          {product.oldPrice && <del>{displayPrice(product.oldPrice)}</del>}
          <span>{displayPrice(product.price)}</span>
        </div>
      </div>
    </article>
  );
}
