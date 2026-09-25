import CategoryPageLayout from '../components/category/CategoryPageLayout';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import categoryBanner from '../assets/images/piny-mask/category-banner.webp';

export default function PinyMaskPage() {
  const { products } = useProducts();
  const { addItem } = useCart();

  return (
    <CategoryPageLayout
      bannerImage={categoryBanner}
      bannerAlt="Máscaras faciais PINY nas quatro variações de argila"
      badgeLine1="PINY"
      badgeLine2="MASKS"
      products={products}
      onAdd={addItem}
      emptyMessage="Nenhum produto encontrado nessa categoria."
    />
  );
}
