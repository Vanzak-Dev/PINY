import { useEffect } from 'react';
import ProductIconBadge from '../product/ProductIconBadge';
import AddToCartIcon from '../ui/AddToCartIcon';
import { formatPrice } from '../../lib/formatPrice';
import { featuredProducts } from '../../data/products';
import mascot from '../../assets/cart/empty-cart-mascot.svg';
import iconClose from '../../assets/cart/icon-close.svg';
import iconCartBadge from '../../assets/cart/icon-cart-badge.svg';
import iconTrash from '../../assets/cart/icon-trash.svg';
import markerStarFilled from '../../assets/cart/marker-star-filled.svg';
import markerStarOutline from '../../assets/cart/marker-star-outline.svg';
import './CartDrawer.css';

const defaultRecommendedProducts = featuredProducts.slice(0, 2);

function CartRecommendedItem({ product, onAdd }) {
  return (
    <article className="cart-drawer__promo-item">
      <div className="cart-drawer__promo-item-info">
        <ProductIconBadge image={product.image} alt={product.name} size={68.122} radius={16} />
        <div className="cart-drawer__promo-item-text">
          <p className="cart-drawer__promo-item-name">{product.name}</p>
          <div className="cart-drawer__promo-item-prices">
            <span>{formatPrice(product.price)}</span>
            {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="cart-drawer__promo-item-add"
        aria-label={`Adicionar ${product.name} ao carrinho`}
        onClick={() => onAdd?.(product)}
      >
        <AddToCartIcon />
      </button>
    </article>
  );
}

function CartLineItem({ item, onRemove, onUpdateQuantity }) {
  const { product, quantity, unitPrice } = item;
  const effectiveUnitPrice = unitPrice ?? product.price;

  return (
    <li className="cart-drawer__item">
      <button
        type="button"
        className="cart-drawer__item-remove"
        aria-label={`Remover ${product.name} do carrinho`}
        onClick={() => onRemove(product.id)}
      >
        <img src={iconTrash} alt="" draggable="false" />
      </button>
      <ProductIconBadge image={product.image} alt={product.name} size={98.12} radius={12} />
      <div className="cart-drawer__item-info">
        <p className="cart-drawer__item-name">{product.name}</p>
        <div className="cart-drawer__item-prices">
          <span>{formatPrice(effectiveUnitPrice)}</span>
          {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
        </div>
      </div>
      <div className="cart-drawer__item-quantity">
        <button
          type="button"
          aria-label={`Diminuir quantidade de ${product.name}`}
          onClick={() => onUpdateQuantity(product.id, -1)}
        >
          –
        </button>
        <span>{quantity}</span>
        <button
          type="button"
          aria-label={`Aumentar quantidade de ${product.name}`}
          onClick={() => onUpdateQuantity(product.id, 1)}
        >
          +
        </button>
      </div>
    </li>
  );
}

export default function CartDrawer({
  isOpen = false,
  onClose,
  recommendedProducts = defaultRecommendedProducts,
  onAdd,
  items = [],
  onRemoveItem,
  onUpdateQuantity,
  couponCode = '',
  onCouponCodeChange,
  onApplyCoupon,
  subtotal = 0,
  discount = 0,
  total = 0,
  remainingForGift = 0,
  giftProgress = 0,
  onCheckout,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cart-drawer">
      <button type="button" className="cart-drawer__overlay" aria-label="Fechar carrinho" onClick={onClose} />
      <div className="cart-drawer__panel" role="dialog" aria-modal="true" aria-label="Carrinho de compras">
        <button type="button" className="cart-drawer__close" aria-label="Fechar carrinho" onClick={onClose}>
          <img src={iconClose} alt="" draggable="false" />
        </button>

        {items.length === 0 ? (
          <>
            <div className="cart-drawer__empty">
              <img className="cart-drawer__mascot" src={mascot} alt="" aria-hidden="true" draggable="false" />
              <div className="cart-drawer__heading">
                <p className="cart-drawer__title">
                  CARRINHO VAZIO
                  <img src={iconCartBadge} alt="" aria-hidden="true" draggable="false" />
                </p>
                <p className="cart-drawer__subtitle">Explore a PINY, descubra os produtos ideiais para você!</p>
              </div>
            </div>

            {recommendedProducts.length > 0 && (
              <div className="cart-drawer__promo">
                <p className="cart-drawer__promo-title">Você pode gostar desses produtos:</p>
                <div className="cart-drawer__promo-list">
                  {recommendedProducts.map((product) => (
                    <CartRecommendedItem key={product.id} product={product} onAdd={onAdd} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="cart-drawer__body">
              <div className="cart-drawer__head">
                <p className="cart-drawer__title">
                  MEU CARRINHO
                  <img src={iconCartBadge} alt="" aria-hidden="true" draggable="false" />
                </p>
              </div>

              <p className="cart-drawer__gift-note">
                {remainingForGift > 0 ? (
                  <>Com mais <strong>{formatPrice(remainingForGift)}</strong> você ganha um brinde exclusivo!</>
                ) : (
                  <>Você garantiu um <strong>brinde exclusivo</strong>!</>
                )}
              </p>

              <div className="cart-drawer__progress" role="progressbar" aria-valuenow={Math.round(giftProgress * 100)} aria-valuemin={0} aria-valuemax={100}>
                <div className="cart-drawer__progress-track">
                  <div className="cart-drawer__progress-fill" style={{ width: `${giftProgress * 100}%` }} />
                </div>
                <img
                  className="cart-drawer__progress-marker"
                  style={{ left: `${giftProgress * 100}%` }}
                  src={giftProgress >= 1 ? markerStarFilled : markerStarOutline}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                />
              </div>

              <ul className="cart-drawer__items">
                {items.map((item) => (
                  <CartLineItem
                    key={item.product.id}
                    item={item}
                    onRemove={onRemoveItem}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                ))}
              </ul>
            </div>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__coupon">
                <input
                  type="text"
                  className="cart-drawer__coupon-input"
                  placeholder="Cupom de Desconto"
                  value={couponCode}
                  onChange={(event) => onCouponCodeChange?.(event.target.value)}
                />
                <button type="button" className="cart-drawer__coupon-apply" onClick={() => onApplyCoupon?.(couponCode)}>
                  Aplicar
                </button>
              </div>

              <div className="cart-drawer__totals">
                <div className="cart-drawer__totals-row">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="cart-drawer__totals-row">
                    <span>Descontos:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="cart-drawer__totals-row cart-drawer__totals-row--total">
                  <span>TOTAL:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button type="button" className="cart-drawer__checkout" onClick={onCheckout}>
                FINALIZAR COMPRA
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
