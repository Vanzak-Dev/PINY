import PineappleProductInfo from './PineappleProductInfo';
import './PineappleFeatureSection.css';

function priceParts(value) {
  const [integer, decimal] = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value)).split(',');

  return { integer, decimal };
}

export default function PineappleFeatureSection({ products = [] }) {
  const product = products.find((item) => item.featureEnabled);
  if (!product) return null;

  const price = priceParts(product.featurePrice ?? product.price);
  const productImage = product.featureProductImage || product.image;

  return (
    <section className="pineapple-feature" aria-label={`Destaque ${product.name}`}>
      <svg
        className="pineapple-feature__background"
        viewBox="0 0 1920 681"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M1920 280.164C1989.8 254.318 2029 225.242 2029 194.5C2029 87.0806 1550.39 0 960 0C369.608 0 -109 87.0806 -109 194.5C-109 225.242 -69.8006 254.318 0 280.164V681H1920V280.164Z"
          fill="url(#pineapple-feature-gradient)"
        />
        <defs>
          <radialGradient
            id="pineapple-feature-gradient"
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

      <div className="pineapple-feature__content">
        <PineappleProductInfo />
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
    </section>
  );
}
