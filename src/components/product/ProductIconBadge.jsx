import './ProductIconBadge.css';

export function buildBadgeGradient(product) {
  if (!product?.badgeGradientColor1 || !product?.badgeGradientColor2) return undefined;
  return `linear-gradient(${product.badgeGradientAngle || 180}deg, ${product.badgeGradientColor1} 50%, ${product.badgeGradientColor2} 100%)`;
}

export default function ProductIconBadge({ image, alt = '', size = 96, radius, gradient }) {
  return (
    <span
      className="product-icon-badge"
      style={{
        '--badge-size': `${size}px`,
        ...(radius != null && { '--badge-radius': `${radius}px` }),
        ...(gradient && { '--badge-gradient': gradient }),
      }}
    >
      <img src={image} alt={alt} draggable="false" />
    </span>
  );
}
