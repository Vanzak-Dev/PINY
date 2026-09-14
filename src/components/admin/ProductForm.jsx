import { useEffect, useState } from 'react';
import ProductCardPreview from './ProductCardPreview';

function useObjectUrl(file) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!file) {
      setUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
}

const emptyProduct = {
  name: '', slug: '', sku: '', status: 'active', featured: true, category: '', shortDescription: '', description: '',
  reviewCount: '', badges: [], quantityOptions: [{ quantity: 1, price: '', discountLabel: '' }], crossSellIds: [],
  price: '', oldPrice: '', costPrice: '', stock: 0, trackStock: true, tags: '', image: '', backgroundImage: '',
  backgroundColor: '#b8efad', imageRestRotation: 0, imageActiveRotation: 15,
  featureEnabled: false, featureLabel: '', featurePrice: '', featureBackgroundCenter: '#F3FD5A', featureBackgroundEdge: '#FFD72F',
  featureLeftImage: '', featureRightImage: '', featureProductImage: '', weight: '',
  dimensions: { length: '', width: '', height: '' }, seoTitle: '', seoDescription: '',
};

export default function ProductForm({ product, products = [], onSave, onCancel }) {
  const [values, setValues] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [featureLeftImageFile, setFeatureLeftImageFile] = useState(null);
  const [featureRightImageFile, setFeatureRightImageFile] = useState(null);
  const [featureProductImageFile, setFeatureProductImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const imagePreview = useObjectUrl(imageFile);
  const backgroundPreview = useObjectUrl(backgroundFile);

  useEffect(() => {
    setValues(product ? {
      ...emptyProduct,
      ...product,
      tags: product.tags?.join(', ') || '',
      badges: product.badges || [],
      quantityOptions: product.quantityOptions?.length
        ? product.quantityOptions
        : [{ quantity: 1, price: product.price ?? '', discountLabel: '' }],
      crossSellIds: product.crossSellIds || [],
      dimensions: { ...emptyProduct.dimensions, ...product.dimensions },
    } : emptyProduct);
    setImageFile(null); setBackgroundFile(null); setFeatureLeftImageFile(null); setFeatureRightImageFile(null); setFeatureProductImageFile(null); setError('');
  }, [product]);

  const change = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  const changeDimension = (key, value) => setValues((current) => ({ ...current, dimensions: { ...current.dimensions, [key]: value } }));
  const changeCollectionItem = (key, index, field, value) => setValues((current) => ({
    ...current,
    [key]: current[key].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item),
  }));
  const addCollectionItem = (key, item) => setValues((current) => ({ ...current, [key]: [...current[key], item] }));
  const removeCollectionItem = (key, index) => setValues((current) => ({
    ...current,
    [key]: current[key].filter((_, itemIndex) => itemIndex !== index),
  }));
  const toggleCrossSell = (id) => setValues((current) => ({
    ...current,
    crossSellIds: current.crossSellIds.includes(id)
      ? current.crossSellIds.filter((productId) => productId !== id)
      : [...current.crossSellIds, id],
  }));

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'dimensions') Object.entries(value).forEach(([dimension, amount]) => data.append(dimension, amount));
      else if (Array.isArray(value)) data.append(key, JSON.stringify(value));
      else data.append(key, value);
    });
    if (imageFile) data.append('imageFile', imageFile);
    if (backgroundFile) data.append('backgroundFile', backgroundFile);
    if (featureLeftImageFile) data.append('featureLeftImageFile', featureLeftImageFile);
    if (featureRightImageFile) data.append('featureRightImageFile', featureRightImageFile);
    if (featureProductImageFile) data.append('featureProductImageFile', featureProductImageFile);
    try { await onSave(data); }
    catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  return (
    <form className="admin-form" onSubmit={submit}>
      <div className="admin-form__heading"><div><p className="admin-eyebrow">{product ? 'Editar produto' : 'Novo produto'}</p><h2>{values.name || 'Produto sem nome'}</h2></div><button type="button" className="admin-button" onClick={onCancel}>Fechar</button></div>
      <ProductCardPreview values={values} products={products} imagePreview={imagePreview} backgroundPreview={backgroundPreview} />
      <section className="admin-form__section"><h3>Informações principais</h3><div className="admin-grid admin-grid--2">
        <label>Nome<input value={values.name} onChange={(e) => change('name', e.target.value)} required /></label>
        <label>SKU<input value={values.sku} onChange={(e) => change('sku', e.target.value)} /></label>
        <label>Slug<input value={values.slug} onChange={(e) => change('slug', e.target.value)} placeholder="Gerado pelo nome" /></label>
        <label>Categoria<input value={values.category} onChange={(e) => change('category', e.target.value)} /></label>
        <label>Status<select value={values.status} onChange={(e) => change('status', e.target.value)}><option value="active">Ativo</option><option value="draft">Rascunho</option></select></label>
        <label className="admin-check"><input type="checkbox" checked={values.featured} onChange={(e) => change('featured', e.target.checked)} /> Destacar no carrossel</label>
      </div><label>Descrição curta<input value={values.shortDescription} onChange={(e) => change('shortDescription', e.target.value)} /></label><label>Descrição completa<textarea rows="4" value={values.description} onChange={(e) => change('description', e.target.value)} /></label><label>Tags<input value={values.tags} onChange={(e) => change('tags', e.target.value)} placeholder="argila, skincare" /></label></section>
      <section className="admin-form__section"><h3>Preço e estoque</h3><div className="admin-grid admin-grid--3">
        <label>Preço (R$)<input type="number" min="0" step="0.01" value={values.price} onChange={(e) => change('price', e.target.value)} required /></label>
        <label>Preço anterior<input type="number" min="0" step="0.01" value={values.oldPrice ?? ''} onChange={(e) => change('oldPrice', e.target.value)} /></label>
        <label>Custo<input type="number" min="0" step="0.01" value={values.costPrice ?? ''} onChange={(e) => change('costPrice', e.target.value)} /></label>
        <label>Estoque<input type="number" min="0" value={values.stock} onChange={(e) => change('stock', e.target.value)} /></label>
        <label className="admin-check"><input type="checkbox" checked={values.trackStock} onChange={(e) => change('trackStock', e.target.checked)} /> Controlar estoque</label>
      </div></section>
      <section className="admin-form__section">
        <div className="admin-form__section-heading">
          <div><h3>Página do produto</h3><small>Selos, opções de compra e produtos relacionados exibidos na página individual.</small></div>
        </div>
        <label>Quantidade de avaliações<input value={values.reviewCount} onChange={(e) => change('reviewCount', e.target.value)} placeholder="Ex.: 2k+" /></label>

        <div className="admin-repeater">
          <div className="admin-repeater__heading"><strong>Selos</strong><button type="button" className="admin-button" onClick={() => addCollectionItem('badges', { label: '', tone: 'outline', color: '#1c8c44' })}>Adicionar selo</button></div>
          {values.badges.length === 0 && <small>Nenhum selo cadastrado.</small>}
          {values.badges.map((badge, index) => (
            <div className="admin-repeater__row admin-repeater__row--badge" key={`badge-${index}`}>
              <label>Texto<input value={badge.label} onChange={(e) => changeCollectionItem('badges', index, 'label', e.target.value)} placeholder="Antimanchas" /></label>
              <label>Estilo<select value={badge.tone} onChange={(e) => changeCollectionItem('badges', index, 'tone', e.target.value)}><option value="outline">Contorno</option><option value="solid">Preenchido</option></select></label>
              <label>Cor<input type="color" value={badge.color || '#1c8c44'} onChange={(e) => changeCollectionItem('badges', index, 'color', e.target.value)} /></label>
              <button type="button" className="admin-repeater__remove" onClick={() => removeCollectionItem('badges', index)} aria-label={`Remover selo ${index + 1}`}>×</button>
            </div>
          ))}
        </div>

        <div className="admin-repeater">
          <div className="admin-repeater__heading"><strong>Opções de quantidade</strong><button type="button" className="admin-button" onClick={() => addCollectionItem('quantityOptions', { quantity: 1, price: values.price || '', discountLabel: '' })}>Adicionar opção</button></div>
          {values.quantityOptions.map((option, index) => (
            <div className="admin-repeater__row admin-repeater__row--quantity" key={`quantity-${index}`}>
              <label>Quantidade<input type="number" min="1" value={option.quantity} onChange={(e) => changeCollectionItem('quantityOptions', index, 'quantity', e.target.value)} /></label>
              <label>Preço total<input type="number" min="0" step="0.01" value={option.price} onChange={(e) => changeCollectionItem('quantityOptions', index, 'price', e.target.value)} /></label>
              <label>Desconto<input value={option.discountLabel || ''} onChange={(e) => changeCollectionItem('quantityOptions', index, 'discountLabel', e.target.value)} placeholder="15% off" /></label>
              <button type="button" className="admin-repeater__remove" onClick={() => removeCollectionItem('quantityOptions', index)} aria-label={`Remover opção ${index + 1}`}>×</button>
            </div>
          ))}
        </div>

        <fieldset className="admin-related-products">
          <legend>Frequentemente comprados juntos</legend>
          <div className="admin-related-products__options">
            {products.filter((item) => item.id !== product?.id).map((item) => (
              <label className="admin-check" key={item.id}>
                <input type="checkbox" checked={values.crossSellIds.includes(item.id)} onChange={() => toggleCrossSell(item.id)} />
                {item.name}
              </label>
            ))}
          </div>
          {products.filter((item) => item.id !== product?.id).length === 0 && <small>Cadastre outro produto para criar recomendações.</small>}
        </fieldset>
      </section>
      <section className="admin-form__section"><h3>Imagens e apresentação</h3><div className="admin-grid admin-grid--2">
        <label>URL da imagem principal<input type="text" value={values.image} onChange={(e) => change('image', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
        <label>URL do fundo animado<input type="text" value={values.backgroundImage} onChange={(e) => change('backgroundImage', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
        <label>Upload da imagem principal<input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />{values.image && <small>Atual: {values.image}</small>}</label>
        <label>Upload do fundo animado<input type="file" accept="image/*" onChange={(e) => setBackgroundFile(e.target.files[0])} />{values.backgroundImage && <small>Atual: {values.backgroundImage}</small>}</label>
        <label>Cor do card<input type="color" value={values.backgroundColor} onChange={(e) => change('backgroundColor', e.target.value)} /></label>
        <label>Rotação inicial<input type="number" value={values.imageRestRotation} onChange={(e) => change('imageRestRotation', e.target.value)} /></label>
        <label>Rotação ativa<input type="number" value={values.imageActiveRotation} onChange={(e) => change('imageActiveRotation', e.target.value)} /></label>
      </div></section>
      <section className="admin-form__section"><h3>Destaque da seção</h3>
        <label className="admin-check"><input type="checkbox" checked={values.featureEnabled} onChange={(e) => change('featureEnabled', e.target.checked)} /> Exibir este produto na seção de destaque</label>
        <div className="admin-grid admin-grid--3">
          <label>Selo<input value={values.featureLabel} onChange={(e) => change('featureLabel', e.target.value)} placeholder="ANTIMANCHAS" /></label>
          <label>Preço do destaque (R$)<input type="number" min="0" step="0.01" value={values.featurePrice ?? ''} onChange={(e) => change('featurePrice', e.target.value)} /></label>
          <label>Cor central<input type="color" value={values.featureBackgroundCenter} onChange={(e) => change('featureBackgroundCenter', e.target.value)} /></label>
          <label>Cor das bordas<input type="color" value={values.featureBackgroundEdge} onChange={(e) => change('featureBackgroundEdge', e.target.value)} /></label>
        </div>
        <div className="admin-grid admin-grid--3">
          <label>URL da imagem esquerda<input value={values.featureLeftImage} onChange={(e) => change('featureLeftImage', e.target.value)} /></label>
          <label>URL da imagem do produto<input value={values.featureProductImage} onChange={(e) => change('featureProductImage', e.target.value)} /></label>
          <label>URL da imagem direita<input value={values.featureRightImage} onChange={(e) => change('featureRightImage', e.target.value)} /></label>
          <label>Upload da imagem esquerda<input type="file" accept="image/*" onChange={(e) => setFeatureLeftImageFile(e.target.files[0])} />{values.featureLeftImage && <small>Atual: {values.featureLeftImage}</small>}</label>
          <label>Upload da imagem do produto<input type="file" accept="image/*" onChange={(e) => setFeatureProductImageFile(e.target.files[0])} />{values.featureProductImage && <small>Atual: {values.featureProductImage}</small>}</label>
          <label>Upload da imagem direita<input type="file" accept="image/*" onChange={(e) => setFeatureRightImageFile(e.target.files[0])} />{values.featureRightImage && <small>Atual: {values.featureRightImage}</small>}</label>
        </div>
      </section>
      <section className="admin-form__section"><h3>Logística e SEO</h3><div className="admin-grid admin-grid--3">
        <label>Peso (g)<input type="number" min="0" value={values.weight} onChange={(e) => change('weight', e.target.value)} /></label>
        <label>Comprimento (cm)<input type="number" min="0" step="0.1" value={values.dimensions.length} onChange={(e) => changeDimension('length', e.target.value)} /></label>
        <label>Largura (cm)<input type="number" min="0" step="0.1" value={values.dimensions.width} onChange={(e) => changeDimension('width', e.target.value)} /></label>
        <label>Altura (cm)<input type="number" min="0" step="0.1" value={values.dimensions.height} onChange={(e) => changeDimension('height', e.target.value)} /></label>
      </div><label>Título SEO<input value={values.seoTitle} onChange={(e) => change('seoTitle', e.target.value)} /></label><label>Descrição SEO<textarea rows="3" value={values.seoDescription} onChange={(e) => change('seoDescription', e.target.value)} /></label></section>
      {error && <p className="admin-message admin-message--error" role="alert">{error}</p>}
      <div className="admin-form__actions"><button type="button" className="admin-button" onClick={onCancel}>Cancelar</button><button className="admin-button admin-button--primary" disabled={saving}>{saving ? 'Salvando…' : 'Salvar produto'}</button></div>
    </form>
  );
}
