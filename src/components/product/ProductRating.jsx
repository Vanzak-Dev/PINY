import ratingStars from '../../assets/product/rating-stars.svg';
import './ProductRating.css';

export default function ProductRating({ count }) {
  return (
    <div className="product-rating">
      <img className="product-rating__stars" src={ratingStars} alt="" aria-hidden="true" />
      <span className="product-rating__count">({count})</span>
    </div>
  );
}
