import './ProductBenefitItem.css';

export default function ProductBenefitItem({ icon, label }) {
  return (
    <div className="product-benefit-item">
      <span className="product-benefit-item__icon">
        <span className="product-benefit-item__icon-inner">
          <img src={icon} alt="" aria-hidden="true" />
        </span>
      </span>
      <p className="product-benefit-item__label">{label}</p>
    </div>
  );
}
