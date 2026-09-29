import { formatPrice } from '../../lib/formatPrice';
import './ProductQuantityOption.css';

export default function ProductQuantityOption({
  quantity,
  price,
  discountLabel,
  extraLabel,
  label,
  productImage,
  image,
  selected = false,
  onSelect,
}) {
  const visualQuantity = Math.min(Math.max(Number(quantity) || 1, 1), 3);
  const optionImage = image || productImage;

  return (
    <div className="quantity-option">
      <button
        type="button"
        className={`quantity-option__box${selected ? ' quantity-option__box--selected' : ''}`}
        aria-pressed={selected}
        onClick={onSelect}
      >
        <span className={`quantity-option__icons quantity-option__icons--${visualQuantity}`} aria-hidden="true">
          {image ? (
            <img className="quantity-option__icon quantity-option__icon--single" src={image} alt="" draggable="false" />
          ) : (
            Array.from({ length: visualQuantity }).map((_, index) => (
              <img
                key={index}
                className="quantity-option__icon"
                src={optionImage}
                alt=""
                draggable="false"
              />
            ))
          )}
        </span>
        <span className="quantity-option__label">
          <strong>{label ?? `${quantity} und.`}</strong>
          <span>{formatPrice(price)}</span>
        </span>
      </button>
      {(discountLabel || extraLabel) && (
        <span className={`quantity-option__tags${discountLabel && extraLabel ? ' quantity-option__tags--multi' : ''}`}>
          {discountLabel && (
            <span className={`quantity-option__tag${selected ? ' quantity-option__tag--selected' : ''}`}>
              {discountLabel}
            </span>
          )}
          {extraLabel && <span className="quantity-option__tag quantity-option__tag--extra">{extraLabel}</span>}
        </span>
      )}
    </div>
  );
}
