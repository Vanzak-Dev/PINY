import { formatPrice } from '../../lib/formatPrice';
import './ProductQuantityOption.css';

export default function ProductQuantityOption({ quantity, price, discountLabel, productImage, selected = false, onSelect }) {
  const visualQuantity = Math.min(Math.max(Number(quantity) || 1, 1), 3);

  return (
    <div className="quantity-option">
      <button
        type="button"
        className={`quantity-option__box${selected ? ' quantity-option__box--selected' : ''}`}
        aria-pressed={selected}
        onClick={onSelect}
      >
        <span className={`quantity-option__icons quantity-option__icons--${visualQuantity}`} aria-hidden="true">
          {Array.from({ length: visualQuantity }).map((_, index) => (
            <img
              key={index}
              className="quantity-option__icon"
              src={productImage}
              alt=""
              draggable="false"
            />
          ))}
        </span>
        <span className="quantity-option__label">
          <strong>{quantity} und.</strong>
          <span>{formatPrice(price)}</span>
        </span>
      </button>
      {discountLabel && (
        <span className={`quantity-option__tag${selected ? ' quantity-option__tag--selected' : ''}`}>
          {discountLabel}
        </span>
      )}
    </div>
  );
}
