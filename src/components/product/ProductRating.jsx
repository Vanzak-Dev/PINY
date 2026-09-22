import StarRating from './StarRating';
import './ProductRating.css';

export default function ProductRating({ count, stars = 5 }) {
  return (
    <div className="product-rating">
      <StarRating stars={stars} size={20} />
      <span className="product-rating__count">({count})</span>
    </div>
  );
}
