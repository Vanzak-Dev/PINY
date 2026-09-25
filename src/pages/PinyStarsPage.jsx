import CategoryPageLayout from '../components/category/CategoryPageLayout';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import categoryBanner from '../assets/images/piny-stars/category-banner.webp';

export default function PinyStarsPage() {
  const { products } = useProducts();
  const { addItem } = useCart();
  const starsProducts = products.filter((product) => product.category === 'Piny Stars');

  return (
    <CategoryPageLayout
      bannerImage={categoryBanner}
      bannerAlt="Adesivos PINY Stars em quatro cores"
      badgeLine1="PINY"
      badgeLine2="STARS"
      products={starsProducts}
      onAdd={addItem}
      emptyMessage="Em breve novos produtos Piny Stars por aqui."
    />
  );
}
