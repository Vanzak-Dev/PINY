import ProductCard from '../product/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import './MegaMenu.css';

export default function MegaMenu() {
  const { products } = useProducts();
  const maskProducts = products.slice(0, 4);

  return (
    <div className="mega-menu">
      <div className="mega-menu__info">
        <h2 className="mega-menu__title">PINY MASKS</h2>
        <div className="mega-menu__divider" />
        <p className="mega-menu__description">
          Argilas de tratamento ideais para cada necessidade da sua pele, da acne até ao detox, em um produto prático para sua rotina.
        </p>
      </div>
      <div className="mega-menu__separator" />
      <div className="mega-menu__products">
        <h3 className="mega-menu__products-label">PRODUTOS:</h3>
        <div className="mega-menu__cards-row">
          <div className="mega-menu__cards">
            {maskProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <a className="mega-menu__view-all" href="/piny-mask">Ver todos os produtos</a>
        </div>
      </div>
    </div>
  );
}
