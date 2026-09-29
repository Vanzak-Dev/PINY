import { useEffect, useRef, useState } from 'react';
import PineappleProductInfo from './PineappleProductInfo';
import PineapplePerks from './PineapplePerks';
import './PineappleFeatureSection.css';

const transitionDuration = 900;

function priceParts(value) {
  const numeric = typeof value === 'string' ? Number(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : Number(value);
  const [integer, decimal] = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric).split(',');

  return { integer, decimal };
}

function PineappleFeaturePanel({ product, isIncoming, isEntered, panelRef }) {
  const price = priceParts(product.featurePrice ?? product.price);
  const productImage = product.featureProductImage || product.image;
  const panelClass = ['pineapple-feature__panel'];
  if (isIncoming) panelClass.push('is-incoming');
  if (isEntered) panelClass.push('is-entered');

  return (
    <div ref={panelRef} className={panelClass.join(' ')}>
      <svg
        className="pineapple-feature__background pineapple-feature__background--desktop"
        viewBox="0 0 1920 681"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M1920 280.164C1989.8 254.318 2029 225.242 2029 194.5C2029 87.0806 1550.39 0 960 0C369.608 0 -109 87.0806 -109 194.5C-109 225.242 -69.8006 254.318 0 280.164V681H1920V280.164Z"
          fill={`url(#pineapple-feature-gradient-${product.id})`}
        />
        <defs>
          <radialGradient
            id={`pineapple-feature-gradient-${product.id}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(960 340.5) scale(1069 952.594)"
          >
            <stop offset="0.399388" stopColor={product.featureBackgroundCenter || '#F3FD5A'} />
            <stop offset="1" stopColor={product.featureBackgroundEdge || '#FFD72F'} />
          </radialGradient>
        </defs>
      </svg>

      <svg
        className="pineapple-feature__background pineapple-feature__background--mobile"
        viewBox="0 0 393 683"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M393.364 280.987C407.859 255.065 416 225.904 416 195.071C416 87.3364 316.607 0 194 0C71.3928 0 -28 87.3364 -28 195.071C-28 225.904 -19.8594 255.065 -5.36389 280.987V683H393.364V280.987Z"
          fill={`url(#pineapple-feature-gradient-mobile-${product.id})`}
        />
        <defs>
          <radialGradient
            id={`pineapple-feature-gradient-mobile-${product.id}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(194 341.5) scale(222 955.391)"
          >
            <stop offset="0.399388" stopColor={product.featureBackgroundCenter || '#F3FD5A'} />
            <stop offset="1" stopColor={product.featureBackgroundEdge || '#FFD72F'} />
          </radialGradient>
        </defs>
      </svg>

      {product.featureLeftImage && (
        <img
          className="pineapple-feature__scatter pineapple-feature__scatter--left"
          src={product.featureLeftImage}
          alt=""
          aria-hidden="true"
        />
      )}
      {product.featureRightImage && (
        <img
          className="pineapple-feature__scatter pineapple-feature__scatter--right"
          src={product.featureRightImage}
          alt=""
          aria-hidden="true"
        />
      )}
      <img
        className="pineapple-feature__scatter-mobile"
        src="/catalog-assets/pineapple-feature-scatter-mobile.webp"
        alt=""
        aria-hidden="true"
      />

      <div
        className="pineapple-feature__content"
        style={product.featureTextColor ? { '--feature-text-color': product.featureTextColor } : undefined}
      >
        <PineappleProductInfo mobileBackgroundImage={product.featureProductInfoMobileBackground} variant={product.featureVariant} />
        <PineapplePerks customPerks={product.featurePerks} />
        {product.featureLabel && <p className="pineapple-feature__label">{product.featureLabel}</p>}
        <div className="pineapple-feature__product-lockup">
          <img className="pineapple-feature__product" src={productImage} alt={product.name} />
          <p
            className="pineapple-feature__price"
            aria-label={`R$ ${price.integer},${price.decimal}`}
          >
            <span className="pineapple-feature__currency">R$</span>
            <span>{price.integer}</span>
            <small>,{price.decimal}</small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PineappleFeatureSection({ products = [], selectedProductId }) {
  const selectedProduct = products.find((item) => item.id === selectedProductId)
    || products.find((item) => item.featureEnabled);

  const [displayedProduct, setDisplayedProduct] = useState(selectedProduct);
  const [incomingProduct, setIncomingProduct] = useState(null);
  const [isEntered, setIsEntered] = useState(false);
  const displayedProductRef = useRef(selectedProduct);
  const incomingPanelRef = useRef(null);

  // Phase 1: notice the selection changed and kick the new panel off-screen,
  // then flip it to "entered" shortly after so the clip-path transition
  // actually runs (rather than snapping straight to its end state).
  useEffect(() => {
    if (!selectedProduct) return undefined;

    if (!displayedProductRef.current || displayedProductRef.current.id === selectedProduct.id) {
      displayedProductRef.current = selectedProduct;
      setDisplayedProduct(selectedProduct);
      return undefined;
    }

    setIncomingProduct(selectedProduct);
    setIsEntered(false);

    const timer = window.setTimeout(() => setIsEntered(true), 50);

    return () => window.clearTimeout(timer);
    // Depend on the id (a stable primitive), not the product object itself:
    // `products.find(...)` can hand back a differently-referenced-but-
    // logically-identical object on unrelated re-renders (e.g. retries from
    // the catalog fetch), which would otherwise cancel and restart this
    // effect before it settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct?.id]);

  // Phase 2: once the incoming panel exists, promote it to "displayed" the
  // moment its clip-path transition actually finishes (transitionend),
  // instead of guessing at a matching setTimeout duration. A fallback
  // timer (well past the CSS duration) covers the rare case where the
  // browser never fires the event, e.g. the tab was backgrounded.
  useEffect(() => {
    if (!incomingProduct) return undefined;
    const node = incomingPanelRef.current;

    const finish = () => {
      displayedProductRef.current = incomingProduct;
      setDisplayedProduct(incomingProduct);
      setIncomingProduct(null);
      setIsEntered(false);
    };

    const handleTransitionEnd = (event) => {
      if (event.target === node && event.propertyName === 'clip-path') finish();
    };

    node?.addEventListener('transitionend', handleTransitionEnd);
    const fallback = window.setTimeout(finish, transitionDuration + 300);

    return () => {
      node?.removeEventListener('transitionend', handleTransitionEnd);
      window.clearTimeout(fallback);
    };
  }, [incomingProduct]);

  if (!displayedProduct) return null;

  return (
    <section
      className={`pineapple-feature${incomingProduct ? ' is-transitioning' : ''}`}
      aria-label={`Destaque ${displayedProduct.name}`}
    >
      <PineappleFeaturePanel product={displayedProduct} />
      {incomingProduct && (
        <PineappleFeaturePanel
          product={incomingProduct}
          isIncoming
          isEntered={isEntered}
          panelRef={incomingPanelRef}
          key={incomingProduct.id}
        />
      )}
    </section>
  );
}
