import { useRef, useState } from 'react';
import ProductBadge from '../../components/product/ProductBadge';
import ProductIconBadge from '../../components/product/ProductIconBadge';
import ProductRating from '../../components/product/ProductRating';
import ProductQuantityOption from '../../components/product/ProductQuantityOption';
import FrequentlyBoughtItem from '../../components/product/FrequentlyBoughtItem';
import mobileIce from '../../assets/product/mobile-raw-3.png';
import './ProductPresentationSection.css';

export default function ProductPresentationSection({ product, categoryLabel = 'PINY MASK', crossSellProducts = [], onAdd }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const crossSellItemsRef = useRef(null);
  const crossSellDragRef = useRef({ pointerId: null, startX: 0, scrollLeft: 0, moved: false });

  const startCrossSellDrag = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    const items = crossSellItemsRef.current;
    if (!items) return;

    crossSellDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: items.scrollLeft,
      moved: false,
    };
    items.setPointerCapture(event.pointerId);
    items.classList.add('is-dragging');
  };

  const moveCrossSellDrag = (event) => {
    const items = crossSellItemsRef.current;
    const drag = crossSellDragRef.current;
    if (!items || drag.pointerId !== event.pointerId) return;

    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) drag.moved = true;
    if (drag.moved) items.scrollLeft = drag.scrollLeft - distance;
  };

  const stopCrossSellDrag = (event) => {
    const items = crossSellItemsRef.current;
    const drag = crossSellDragRef.current;
    if (!items || drag.pointerId !== event.pointerId) return;

    if (items.hasPointerCapture(event.pointerId)) items.releasePointerCapture(event.pointerId);
    drag.pointerId = null;
    items.classList.remove('is-dragging');
  };

  const preventClickAfterDrag = (event) => {
    if (!crossSellDragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    crossSellDragRef.current.moved = false;
  };

  if (!product) return null;

  const quantityOptions = product.quantityOptions?.length
    ? product.quantityOptions
    : [{ quantity: 1, price: product.price }];
  const selectedOption = quantityOptions[selectedIndex];

  return (
    <section
      className="product-presentation"
      aria-label={`Apresentação do produto ${product.name}`}
      style={product.presentationBackgroundImage ? { backgroundImage: `url('${product.presentationBackgroundImage}')` } : undefined}
    >
      <div className="product-presentation__container page-width">
        <div className="product-presentation__visual">
          <img className="product-presentation__mobile-ice" src={mobileIce} alt="" aria-hidden="true" />
          <img
            className="product-presentation__product-image"
            src={product.presentationProductImage || product.image}
            alt={`${categoryLabel} ${product.name}`}
          />
        </div>

        <div className="product-presentation__form">
          <div className="product-presentation__info">
            <p className="product-presentation__breadcrumb">
              {`Home > Produtos > ${categoryLabel} ${product.name}`}
            </p>

            <div className="product-presentation__title-row">
              <div className="product-presentation__title">
                <p className="product-presentation__category">{categoryLabel}</p>
                <p className="product-presentation__name">{product.name}</p>
              </div>
              <ProductIconBadge image={product.image} alt={product.name} size={96} />
            </div>

            <div className="product-presentation__meta">
              <div className="product-presentation__badges">
                {(product.badges || []).map((badge) => (
                  <ProductBadge key={badge.label} tone={badge.tone} color={badge.color}>
                    {badge.label}
                  </ProductBadge>
                ))}
              </div>
              {product.reviewCount && <ProductRating count={product.reviewCount} />}
            </div>
          </div>

          {product.description && (
            <div className="product-presentation__highlight">
              <p>{product.description}</p>
            </div>
          )}

          {quantityOptions.length > 0 && (
            <div className="product-presentation__options">
              {quantityOptions.map((option, index) => (
                <ProductQuantityOption
                  key={option.quantity}
                  quantity={option.quantity}
                  price={option.price}
                  discountLabel={option.discountLabel}
                  productImage={product.image}
                  selected={index === selectedIndex}
                  onSelect={() => setSelectedIndex(index)}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            className="product-presentation__buy"
            onClick={() => onAdd?.({ ...product, selectedQuantity: selectedOption })}
          >
            Comprar
          </button>

          {crossSellProducts.length > 0 && (
            <div className="product-presentation__cross-sell">
              <hr className="product-presentation__divider" />
              <p className="product-presentation__cross-sell-title">Frequentemente comprados juntos:</p>
              <div
                className="product-presentation__cross-sell-items"
                ref={crossSellItemsRef}
                onPointerDown={startCrossSellDrag}
                onPointerMove={moveCrossSellDrag}
                onPointerUp={stopCrossSellDrag}
                onPointerCancel={stopCrossSellDrag}
                onClickCapture={preventClickAfterDrag}
                role="region"
                aria-label="Produtos frequentemente comprados juntos"
                tabIndex={0}
              >
                {crossSellProducts.map((crossSellProduct) => (
                  <FrequentlyBoughtItem key={crossSellProduct.id} product={crossSellProduct} onAdd={onAdd} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
