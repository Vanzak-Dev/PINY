import ProductBenefitItem from '../../components/product/ProductBenefitItem';
import patternBackground from '../../assets/product/benefits/pattern-background.svg';
import iconMarcasManchas from '../../assets/product/benefits/icon-marcas-manchas.svg';
import iconOleosidade from '../../assets/product/benefits/icon-oleosidade.svg';
import iconTomPele from '../../assets/product/benefits/icon-tom-pele.svg';
import iconBestSeller from '../../assets/product/benefits/icon-best-seller.svg';
import './ProductBenefitsSection.css';

const defaultBenefits = [
  { key: 'marcas', icon: iconMarcasManchas, label: 'Trata marcas e manchas' },
  { key: 'oleosidade', icon: iconOleosidade, label: 'Absorve a\nOleosidade' },
  { key: 'tom', icon: iconTomPele, label: 'Uniformiza o\ntom de pele' },
  { key: 'bestseller', icon: iconBestSeller, label: 'Best-Seller:\n+200mil Vendas' },
];

function renderLabel(label) {
  const parts = String(label).split('\n');
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && <br />}
    </span>
  ));
}

export default function ProductBenefitsSection({ product }) {
  const patternImage = product?.benefitsPatternImage || patternBackground;
  const benefits = (product?.benefitsItems?.length ? product.benefitsItems : defaultBenefits).map((benefit, index) => ({
    key: `benefit-${index}`,
    icon: benefit.icon || defaultBenefits[index]?.icon || iconMarcasManchas,
    label: benefit.label,
  }));

  return (
    <section className="product-benefits" aria-label="Benefícios do produto">
      <img className="product-benefits__pattern" src={patternImage} alt="" aria-hidden="true" />
      <div className="product-benefits__container">
        {benefits.map((benefit) => (
          <ProductBenefitItem key={benefit.key} icon={benefit.icon} label={renderLabel(benefit.label)} />
        ))}
      </div>
    </section>
  );
}
