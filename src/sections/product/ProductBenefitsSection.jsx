import ProductBenefitItem from '../../components/product/ProductBenefitItem';
import patternBackground from '../../assets/product/benefits/pattern-background.svg';
import iconMarcasManchas from '../../assets/product/benefits/icon-marcas-manchas.svg';
import iconOleosidade from '../../assets/product/benefits/icon-oleosidade.svg';
import iconTomPele from '../../assets/product/benefits/icon-tom-pele.svg';
import iconBestSeller from '../../assets/product/benefits/icon-best-seller.svg';
import './ProductBenefitsSection.css';

const benefits = [
  { key: 'marcas', icon: iconMarcasManchas, label: 'Trata marcas e manchas' },
  { key: 'oleosidade', icon: iconOleosidade, label: <>Absorve a<br />Oleosidade</> },
  { key: 'tom', icon: iconTomPele, label: <>Uniformiza o<br />tom de pele</> },
  { key: 'bestseller', icon: iconBestSeller, label: <>Best-Seller:<br />+200mil Vendas</> },
];

export default function ProductBenefitsSection() {
  return (
    <section className="product-benefits" aria-label="Benefícios do produto">
      <img className="product-benefits__pattern" src={patternBackground} alt="" aria-hidden="true" />
      <div className="product-benefits__container">
        {benefits.map((benefit) => (
          <ProductBenefitItem key={benefit.key} icon={benefit.icon} label={benefit.label} />
        ))}
      </div>
    </section>
  );
}
