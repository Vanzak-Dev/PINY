const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const displayPrice = (value) => typeof value === 'number' ? currency.format(value) : value;

function AddToCartIcon() {
  return (
    <svg viewBox="0 0 70 55" fill="none" aria-hidden="true">
      <rect x="1.42" y="2.14" width="68.33" height="51.96" rx="11.39" fill="#1C8C44" />
      <g className="ugc-product__add-front">
        <rect x="1.42" y="1.42" width="65.48" height="49.11" rx="9.97" fill="#FEFEFD" stroke="#1C8C44" strokeWidth="2.85" />
        <path d="M49.72 23.76 46.99 37.3c-.34 1.67-.5 2.51-.95 3.14-.38.55-.91.98-1.53 1.25-.71.31-1.57.31-3.28.31h-12.4c-1.72 0-2.57 0-3.28-.31a4.3 4.3 0 0 1-1.54-1.25c-.44-.63-.6-1.47-.94-3.14l-2.73-13.54m-1.83 0h33.04M27.69 29.23v.02m14.68-.02v.02M24.01 23.76l5.51-10.95m16.52 10.95-5.5-10.95" stroke="#1C8C44" strokeWidth="2.85" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.51 8.54v8.07m3.8-4.15h-8.07" stroke="#1C8C44" strokeWidth="2.85" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default function UgcProductPanel({ product, onAdd, isActive = true }) {
  if (!product) return null;

  return (
    <div className={`ugc-product${isActive ? '' : ' is-preloaded'}`} aria-hidden={!isActive}>
      <div className="ugc-product__visual">
        <img src={product.image} alt="" decoding="sync" />
      </div>
      <div className="ugc-product__information">
        <strong>{product.name}</strong>
        <div>
          <span>{displayPrice(product.price)}</span>
          {product.oldPrice && <del>{displayPrice(product.oldPrice)}</del>}
        </div>
      </div>
      <button type="button" className="ugc-product__add" aria-label={`Adicionar ${product.name} ao carrinho`} disabled={!isActive} tabIndex={isActive ? undefined : -1} onClick={() => onAdd?.(product)}>
        <AddToCartIcon />
      </button>
    </div>
  );
}
