import './ProductIconBadge.css';

export default function ProductIconBadge({ image, alt = '', size = 96, radius }) {
  return (
    <span
      className="product-icon-badge"
      style={{ '--badge-size': `${size}px`, ...(radius != null && { '--badge-radius': `${radius}px` }) }}
    >
      <img src={image} alt={alt} draggable="false" />
    </span>
  );
}
