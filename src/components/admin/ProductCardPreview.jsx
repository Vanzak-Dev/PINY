import { useState } from 'react';
import ProductCard from '../product/ProductCard';
import ProductPresentationSection from '../../sections/product/ProductPresentationSection';

export default function ProductCardPreview({ values, products = [], imagePreview, backgroundPreview }) {
  const [previewMode, setPreviewMode] = useState('carousel');
  const previewProduct = {
    id: values.id || 'preview',
    slug: values.slug || 'preview',
    name: values.name.trim() || 'Nome do produto',
    price: Number(values.price) || 0,
    oldPrice: values.oldPrice === '' || values.oldPrice == null ? null : Number(values.oldPrice),
    image: imagePreview || values.image || '/catalog-assets/product-white-clay.webp',
    backgroundImage: backgroundPreview || values.backgroundImage || '',
    backgroundColor: values.backgroundColor || '#b8efad',
    imageRestRotation: Number(values.imageRestRotation) || 0,
    imageActiveRotation: Number(values.imageActiveRotation) || 0,
    category: values.category,
    description: values.description,
    reviewCount: values.reviewCount,
    badges: values.badges || [],
    quantityOptions: (values.quantityOptions || []).map((option) => ({
      ...option,
      quantity: Number(option.quantity) || 1,
      price: Number(option.price) || Number(values.price) || 0,
      image: option.image || '',
    })),
  };
  const crossSellProducts = (values.crossSellIds || [])
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  return (
    <section className={`admin-product-preview admin-product-preview--${previewMode}`} aria-label="Prévia do produto">
      <div className="admin-product-preview__top">
        <div className="admin-product-preview__heading">
          <p className="admin-eyebrow">Prévia ao vivo</p>
          <h3>{previewMode === 'carousel' ? 'Card no carrossel' : 'Card na página do produto'}</h3>
          <small>Atualiza conforme as informações são preenchidas.</small>
        </div>
        <div className="admin-product-preview__tabs" aria-label="Tipo de prévia">
          <button type="button" className={previewMode === 'carousel' ? 'is-active' : ''} aria-pressed={previewMode === 'carousel'} onClick={() => setPreviewMode('carousel')}>Carrossel</button>
          <button type="button" className={previewMode === 'detail' ? 'is-active' : ''} aria-pressed={previewMode === 'detail'} onClick={() => setPreviewMode('detail')}>Página do produto</button>
        </div>
      </div>
      {previewMode === 'carousel' ? (
        <div className="admin-product-preview__frame">
          <ProductCard product={previewProduct} isActive isPreview />
        </div>
      ) : (
        <div className="admin-product-detail-preview">
          <ProductPresentationSection
            product={previewProduct}
            categoryLabel={values.category || 'PINY MASK'}
            crossSellProducts={crossSellProducts}
          />
        </div>
      )}
    </section>
  );
}
