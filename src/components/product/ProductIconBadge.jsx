import './ProductIconBadge.css';

export default function ProductIconBadge({ image, alt = '', size = 96 }) {
  return (
    <span className="product-icon-badge" style={{ '--badge-size': `${size}px` }}>
      <img src={image} alt={alt} draggable="false" />
    </span>
  );
}
