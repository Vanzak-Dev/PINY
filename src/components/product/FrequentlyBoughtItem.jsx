import AddToCartIcon from '../ui/AddToCartIcon';
import ProductIconBadge, { buildBadgeGradient } from './ProductIconBadge';
import { formatPrice } from '../../lib/formatPrice';
import './FrequentlyBoughtItem.css';

export default function FrequentlyBoughtItem({ product, onAdd }) {
  return (
    <article className="fbt-item">
      <ProductIconBadge image={product.image} alt={product.name} size={96} gradient={buildBadgeGradient(product)} />
      <div className="fbt-item__info">
        <p className="fbt-item__name">{product.name}</p>
        <div className="fbt-item__prices">
          <span>{formatPrice(product.price)}</span>
          {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
        </div>
      </div>
      <button
        type="button"
        className="fbt-item__add"
        aria-label={`Adicionar ${product.name} ao carrinho`}
        onClick={() => onAdd?.(product)}
      >
        <AddToCartIcon />
      </button>
    </article>
  );
}
