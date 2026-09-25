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
  price: '', oldPrice: '', costPrice: '', stock: 0, trackStock: true, tags: '', image: '', backgroundImage: '', presentationBackgroundImage: '', presentationMobileBackgroundImage: '', presentationProductImage: '',
  backgroundColor: '#b8efad', badgeGradientColor1: '', badgeGradientColor2: '', badgeGradientAngle: '180', imageRestRotation: 0, imageActiveRotation: 15,
  featureEnabled: false, featureLabel: '', featurePrice: '', featureBackgroundCenter: '#F3FD5A', featureBackgroundEdge: '#FFD72F',
  featureLeftImage: '', featureRightImage: '', featureProductImage: '', featureProductInfoMobileBackground: '', featureTextColor: '', featureVariant: '', featurePerks: [], weight: '',
  dimensions: { length: '', width: '', height: '' }, seoTitle: '', seoDescription: '',
  comparisonEnabled: true, comparisonTitle: '', comparisonSubtitle: '', comparisonPinyLabel: '', comparisonOtherLabel: '',
  comparisonImage1: '', comparisonImage2: '', comparisonImage3: '', comparisonImage4: '', comparisonProductIcon: '',
  comparisonHeaderLabelColor: '#1c8c44', comparisonHighlightColor: '#85e86f', comparisonTableColor: '#e8fce0', comparisonCellColor: '#1c8c44',
  comparisonCheckIcon: '',
  comparisonXIcon: '', comparisonDividerColor: '#1c8c44',
  comparisonRows: [
    { label: '12 combinações diferentes', piny: 'check', other: 'x' },
    { label: 'Booster concentrado 2 em 1', piny: 'check', other: 'x' },
    { label: 'Análise de pele por IA', piny: 'check', other: 'x' },
    { label: 'Garantia de 21 dias', piny: 'check', other: 'x' },
    { label: 'Ácido salicílico + glicólico de fábrica', piny: 'check', other: 'Raro' },
    { label: 'Vegano e cruelty free', piny: 'check', other: 'Nem Sempre' },
  ],
  activesEnabled: true, activesProductImage: '', activesTextureImage: '', activesBrushImage: '',
  activesCallouts: [
    { title: 'Caulim', lines: ['A argila mais suave,', 'absorve sem irritar'] },
    { title: 'Óxido de Zinco', lines: ['Ação secativa'] },
    { title: 'Extrato de Abacaxi', lines: ['O símbolo da PINY'] },
    { title: 'Salicílico + Glicólico', lines: ['Motor antiacne', 'de fábrica'] },
  ],
  benefitsEnabled: true, benefitsPatternImage: '', benefitsBackgroundColor: '#fef8dd',
  benefitsItems: [
    { icon: '', label: 'Trata marcas e manchas' },
    { icon: '', label: 'Absorve a\nOleosidade' },
    { icon: '', label: 'Uniformiza o\ntom de pele' },
    { icon: '', label: 'Best-Seller:\n+200mil Vendas' },
  ],
  howToUseEnabled: true, howToUseBackgroundColor: '#fef8dd', howToUseBackgroundImage: '',
  howToUseImages: ['', '', '', ''],
  howToUseSteps: [
    { text: 'Aplique uma camada generosa do produto' },
    { text: 'Deixe agir por 15-20min e enxágue' },
    { text: 'Use 1-2x ao dia, conforme a condição da sua pele' },
    { text: 'De dia, finalize com protetor solar — a fórmula tem ácidos.' },
  ],
  aiAnalysisBackgroundColor: '#fef8dd',
  faqBackgroundColor: '#fef8dd', faqPatternImage: '',
  beforeAfterEnabled: false, beforeAfterTitle: 'ANTES & DEPOIS', beforeAfterTitleAccent: 'Reais',
  beforeAfterSubtitle: '', beforeAfterBeforeLabel: 'ANTES', beforeAfterAfterLabel: 'DEPOIS',
  beforeAfterItems: [],
};

const comparisonValueOptions = [
  { value: 'check', label: 'Check (✓)' },
  { value: 'x', label: 'X (✕)' },
  { value: 'custom', label: 'Texto personalizado' },
];
const comparisonValueKind = (value) => (value === 'check' || value === 'x' ? value : 'custom');

export default function ProductForm({ product, products = [], onSave, onCancel }) {
  const [values, setValues] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [featureLeftImageFile, setFeatureLeftImageFile] = useState(null);
  const [featureRightImageFile, setFeatureRightImageFile] = useState(null);
  const [featureProductImageFile, setFeatureProductImageFile] = useState(null);
  const [featureProductInfoMobileBgFile, setFeatureProductInfoMobileBgFile] = useState(null);
  const [featurePerkIconFiles, setFeaturePerkIconFiles] = useState({});
  const [comparisonImage1File, setComparisonImage1File] = useState(null);
  const [comparisonImage2File, setComparisonImage2File] = useState(null);
  const [comparisonImage3File, setComparisonImage3File] = useState(null);
  const [comparisonImage4File, setComparisonImage4File] = useState(null);
  const [comparisonProductIconFile, setComparisonProductIconFile] = useState(null);
  const [comparisonCheckIconFile, setComparisonCheckIconFile] = useState(null);
  const [comparisonXIconFile, setComparisonXIconFile] = useState(null);
  const [presentationBackgroundFile, setPresentationBackgroundFile] = useState(null);
  const [presentationMobileBackgroundFile, setPresentationMobileBackgroundFile] = useState(null);
  const [presentationProductFile, setPresentationProductFile] = useState(null);
  const [quantityOptionIconFile, setQuantityOptionIconFile] = useState(null);
  const [activesProductFile, setActivesProductFile] = useState(null);
  const [activesTextureFile, setActivesTextureFile] = useState(null);
  const [activesBrushFile, setActivesBrushFile] = useState(null);
  const [benefitsPatternFile, setBenefitsPatternFile] = useState(null);
  const [benefitIconFiles, setBenefitIconFiles] = useState({});
  const [faqPatternFile, setFaqPatternFile] = useState(null);
  const [howToUseBackgroundFile, setHowToUseBackgroundFile] = useState(null);
  const [howToUseImageFiles, setHowToUseImageFiles] = useState([null, null, null, null]);
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
      comparisonRows: product.comparisonRows?.length ? product.comparisonRows : emptyProduct.comparisonRows,
    } : emptyProduct);
    setImageFile(null); setBackgroundFile(null); setFeatureLeftImageFile(null); setFeatureRightImageFile(null); setFeatureProductImageFile(null); setFeatureProductInfoMobileBgFile(null); setFeaturePerkIconFiles({});
    setComparisonImage1File(null); setComparisonImage2File(null); setComparisonImage3File(null); setComparisonImage4File(null); setComparisonProductIconFile(null); setComparisonCheckIconFile(null); setComparisonXIconFile(null);
    setPresentationBackgroundFile(null); setPresentationMobileBackgroundFile(null); setPresentationProductFile(null);
    setQuantityOptionIconFile(null);
    setActivesProductFile(null); setActivesTextureFile(null); setActivesBrushFile(null);
    setBenefitsPatternFile(null); setBenefitIconFiles({});
    setFaqPatternFile(null);
    setHowToUseBackgroundFile(null); setHowToUseImageFiles([null, null, null, null]);
    setError('');
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
    if (featureProductInfoMobileBgFile) data.append('featureProductInfoMobileBackgroundFile', featureProductInfoMobileBgFile);
    Object.entries(featurePerkIconFiles).forEach(([index, file]) => { if (file) data.append(`featurePerkIconFile_${index}`, file); });
    if (comparisonImage1File) data.append('comparisonImage1File', comparisonImage1File);
    if (comparisonImage2File) data.append('comparisonImage2File', comparisonImage2File);
    if (comparisonImage3File) data.append('comparisonImage3File', comparisonImage3File);
    if (comparisonImage4File) data.append('comparisonImage4File', comparisonImage4File);
    if (comparisonProductIconFile) data.append('comparisonProductIconFile', comparisonProductIconFile);
    if (comparisonCheckIconFile) data.append('comparisonCheckIconFile', comparisonCheckIconFile);
    if (comparisonXIconFile) data.append('comparisonXIconFile', comparisonXIconFile);
    if (presentationBackgroundFile) data.append('presentationBackgroundFile', presentationBackgroundFile);
    if (presentationMobileBackgroundFile) data.append('presentationMobileBackgroundFile', presentationMobileBackgroundFile);
    if (presentationProductFile) data.append('presentationProductFile', presentationProductFile);
    if (quantityOptionIconFile) data.append('quantityOptionIconFile', quantityOptionIconFile);
    if (activesProductFile) data.append('activesProductFile', activesProductFile);
    if (activesTextureFile) data.append('activesTextureFile', activesTextureFile);
    if (activesBrushFile) data.append('activesBrushFile', activesBrushFile);
    if (benefitsPatternFile) data.append('benefitsPatternFile', benefitsPatternFile);
    Object.entries(benefitIconFiles).forEach(([index, file]) => { if (file) data.append(`benefitIconFile_${index}`, file); });
    if (faqPatternFile) data.append('faqPatternFile', faqPatternFile);
    if (howToUseBackgroundFile) data.append('howToUseBackgroundFile', howToUseBackgroundFile);
    howToUseImageFiles.forEach((file, index) => { if (file) data.append(`howToUseImage${index + 1}File`, file); });
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

        <div className="admin-grid admin-grid--2">
          <label>URL da imagem de fundo da página<input type="text" value={values.presentationBackgroundImage} onChange={(e) => change('presentationBackgroundImage', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
          <label>URL da imagem do produto (página)<input type="text" value={values.presentationProductImage} onChange={(e) => change('presentationProductImage', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
          <label>Upload da imagem de fundo da página<input type="file" accept="image/*" onChange={(e) => setPresentationBackgroundFile(e.target.files[0])} />{values.presentationBackgroundImage && <small>Atual: {values.presentationBackgroundImage}</small>}</label>
          <label>Upload da imagem do produto (página)<input type="file" accept="image/*" onChange={(e) => setPresentationProductFile(e.target.files[0])} />{values.presentationProductImage && <small>Atual: {values.presentationProductImage}</small>}</label>
          <label>URL do fundo mobile da página<input type="text" value={values.presentationMobileBackgroundImage} onChange={(e) => change('presentationMobileBackgroundImage', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
          <label>Upload do fundo mobile da página<input type="file" accept="image/*" onChange={(e) => setPresentationMobileBackgroundFile(e.target.files[0])} />{values.presentationMobileBackgroundImage && <small>Atual: {values.presentationMobileBackgroundImage}</small>}</label>
        </div>

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

        <label>Ícone das opções de quantidade<input type="file" accept="image/*" onChange={(e) => setQuantityOptionIconFile(e.target.files[0])} />{values.quantityOptionIcon && !quantityOptionIconFile && <small>Atual: {values.quantityOptionIcon}</small>}<small>Imagem única usada como ícone em todas as opções de quantidade. Se vazio, usa a imagem principal do produto.</small></label>

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
        <label>Gradiente do selo — cor 1<input type="color" value={values.badgeGradientColor1} onChange={(e) => change('badgeGradientColor1', e.target.value)} /></label>
        <label>Gradiente do selo — cor 2<input type="color" value={values.badgeGradientColor2} onChange={(e) => change('badgeGradientColor2', e.target.value)} /></label>
        <label>Gradiente do selo — ângulo (deg)<input type="number" min="0" max="360" value={values.badgeGradientAngle} onChange={(e) => change('badgeGradientAngle', e.target.value)} /></label>
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
          <label>Variante (product-info)<input value={values.featureVariant} onChange={(e) => change('featureVariant', e.target.value)} placeholder="Original" /></label>
        </div>
        <div className="admin-grid admin-grid--3">
          <label>URL da imagem esquerda<input value={values.featureLeftImage} onChange={(e) => change('featureLeftImage', e.target.value)} /></label>
          <label>URL da imagem do produto<input value={values.featureProductImage} onChange={(e) => change('featureProductImage', e.target.value)} /></label>
          <label>URL da imagem direita<input value={values.featureRightImage} onChange={(e) => change('featureRightImage', e.target.value)} /></label>
          <label>Upload da imagem esquerda<input type="file" accept="image/*" onChange={(e) => setFeatureLeftImageFile(e.target.files[0])} />{values.featureLeftImage && <small>Atual: {values.featureLeftImage}</small>}</label>
          <label>Upload da imagem do produto<input type="file" accept="image/*" onChange={(e) => setFeatureProductImageFile(e.target.files[0])} />{values.featureProductImage && <small>Atual: {values.featureProductImage}</small>}</label>
          <label>Upload da imagem direita<input type="file" accept="image/*" onChange={(e) => setFeatureRightImageFile(e.target.files[0])} />{values.featureRightImage && <small>Atual: {values.featureRightImage}</small>}</label>
        </div>
        <div className="admin-grid admin-grid--2">
          <label>URL do fundo do product info (mobile)<input type="text" value={values.featureProductInfoMobileBackground} onChange={(e) => change('featureProductInfoMobileBackground', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
          <label>Upload do fundo do product info (mobile)<input type="file" accept="image/*" onChange={(e) => setFeatureProductInfoMobileBgFile(e.target.files[0])} />{values.featureProductInfoMobileBackground && <small>Atual: {values.featureProductInfoMobileBackground}</small>}</label>
        </div>
        <label>Cor dos textos da seção<input type="color" value={values.featureTextColor} onChange={(e) => change('featureTextColor', e.target.value)} /><small>Aplicada nos rótulos dos perks, no wordmark PINY e no divisor.</small></label>
        <div className="admin-repeater">
          <div className="admin-repeater__heading"><strong>Perks (ícones e textos)</strong><button type="button" className="admin-button" onClick={() => addCollectionItem('featurePerks', { icon: '', label: '' })}>Adicionar perk</button></div>
          {values.featurePerks.length === 0 && <small>Nenhum perk cadastrado — os perks padrão serão exibidos.</small>}
          {values.featurePerks.map((perk, index) => (
            <div className="admin-repeater__row admin-repeater__row--perks" key={`perk-${index}`}>
              <label>Upload do ícone<input type="file" accept="image/*" onChange={(e) => setFeaturePerkIconFiles((prev) => ({ ...prev, [index]: e.target.files[0] }))} />{perk.icon && !featurePerkIconFiles[index] && <small>Atual: {perk.icon}</small>}</label>
              <label>Texto<input value={perk.label} onChange={(e) => changeCollectionItem('featurePerks', index, 'label', e.target.value)} placeholder="Ex.: Trata acne e manchas" /></label>
              <button type="button" className="admin-repeater__remove" onClick={() => removeCollectionItem('featurePerks', index)} aria-label={`Remover perk ${index + 1}`}>×</button>
            </div>
          ))}
        </div>
      </section>
      <section className="admin-form__section">
        <div className="admin-form__section-heading">
          <div><h3>Comparação com concorrentes</h3><small>Seção "Kit PINY vs. Máscara Comum" da página do produto. Imagens e tópicos são específicos de cada produto.</small></div>
        </div>
        <label className="admin-check"><input type="checkbox" checked={values.comparisonEnabled} onChange={(e) => change('comparisonEnabled', e.target.checked)} /> Exibir esta seção na página do produto</label>
        <div className="admin-grid admin-grid--2">
          <label>Título<input value={values.comparisonTitle} onChange={(e) => change('comparisonTitle', e.target.value)} placeholder="Kit PINY vs. Máscara Comum" /></label>
          <label>Subtítulo<input value={values.comparisonSubtitle} onChange={(e) => change('comparisonSubtitle', e.target.value)} placeholder="Mais de 44 mil peles transformadas desde 2021, com uma selfie de cada vez." /></label>
          <label>Rótulo da coluna PINY<input value={values.comparisonPinyLabel} onChange={(e) => change('comparisonPinyLabel', e.target.value)} placeholder="Máscaras Faciais" /></label>
          <label>Rótulo da coluna concorrente<input value={values.comparisonOtherLabel} onChange={(e) => change('comparisonOtherLabel', e.target.value)} placeholder="Outras Marcas" /></label>
        </div>
        <div className="admin-grid admin-grid--2">
          <label>Upload imagem 1 (topo esquerda)<input type="file" accept="image/*" onChange={(e) => setComparisonImage1File(e.target.files[0])} />{values.comparisonImage1 && <small>Atual: {values.comparisonImage1}</small>}</label>
          <label>Upload imagem 2 (base esquerda)<input type="file" accept="image/*" onChange={(e) => setComparisonImage2File(e.target.files[0])} />{values.comparisonImage2 && <small>Atual: {values.comparisonImage2}</small>}</label>
          <label>Upload imagem 3 (topo direita)<input type="file" accept="image/*" onChange={(e) => setComparisonImage3File(e.target.files[0])} />{values.comparisonImage3 && <small>Atual: {values.comparisonImage3}</small>}</label>
          <label>Upload imagem 4 (base direita)<input type="file" accept="image/*" onChange={(e) => setComparisonImage4File(e.target.files[0])} />{values.comparisonImage4 && <small>Atual: {values.comparisonImage4}</small>}</label>
          <label>Upload ícone circular (cabeçalho da tabela)<input type="file" accept="image/*" onChange={(e) => setComparisonProductIconFile(e.target.files[0])} />{values.comparisonProductIcon && <small>Atual: {values.comparisonProductIcon}</small>}<small>Use uma foto reta/frontal do produto — evite fotos com o pote rotacionado, pois ficam tortas no círculo pequeno.</small></label>
        </div>
        <div className="admin-grid admin-grid--2">
          <label>Cor do rótulo do cabeçalho<input type="color" value={values.comparisonHeaderLabelColor} onChange={(e) => change('comparisonHeaderLabelColor', e.target.value)} /></label>
          <label>Cor do destaque (highlight)<input type="color" value={values.comparisonHighlightColor} onChange={(e) => change('comparisonHighlightColor', e.target.value)} /></label>
          <label>Cor de fundo da tabela<input type="color" value={values.comparisonTableColor} onChange={(e) => change('comparisonTableColor', e.target.value)} /></label>
          <label>Cor das células<input type="color" value={values.comparisonCellColor} onChange={(e) => change('comparisonCellColor', e.target.value)} /></label>
          <label>Upload ícone de check<input type="file" accept="image/*" onChange={(e) => setComparisonCheckIconFile(e.target.files[0])} />{values.comparisonCheckIcon && <small>Atual: {values.comparisonCheckIcon}</small>}<small>Imagem exibida nas células de "check" da tabela. Se vazio, usa o ícone padrão.</small></label>
          <label>Upload ícone de X<input type="file" accept="image/*" onChange={(e) => setComparisonXIconFile(e.target.files[0])} />{values.comparisonXIcon && <small>Atual: {values.comparisonXIcon}</small>}<small>Imagem exibida nas células de "X" da tabela. Se vazio, usa o ícone padrão.</small></label>
          <label>Cor do divisor<input type="color" value={values.comparisonDividerColor} onChange={(e) => change('comparisonDividerColor', e.target.value)} /></label>
        </div>

        <div className="admin-repeater">
          <div className="admin-repeater__heading"><strong>Tópicos comparados</strong><button type="button" className="admin-button" onClick={() => addCollectionItem('comparisonRows', { label: '', piny: 'check', other: 'x' })}>Adicionar tópico</button></div>
          {values.comparisonRows.length === 0 && <small>Nenhum tópico cadastrado.</small>}
          {values.comparisonRows.map((row, index) => {
            const pinyKind = comparisonValueKind(row.piny);
            const otherKind = comparisonValueKind(row.other);
            return (
              <div className="admin-repeater__row admin-repeater__row--comparison" key={`comparison-${index}`}>
                <label>Tópico<input value={row.label} onChange={(e) => changeCollectionItem('comparisonRows', index, 'label', e.target.value)} placeholder="Ex.: Garantia de 21 dias" /></label>
                <label>PINY
                  <select value={pinyKind} onChange={(e) => changeCollectionItem('comparisonRows', index, 'piny', e.target.value === 'custom' ? '' : e.target.value)}>
                    {comparisonValueOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  {pinyKind === 'custom' && <input value={row.piny === 'check' || row.piny === 'x' ? '' : row.piny} onChange={(e) => changeCollectionItem('comparisonRows', index, 'piny', e.target.value)} placeholder="Ex.: Sempre" />}
                </label>
                <label>Outras marcas
                  <select value={otherKind} onChange={(e) => changeCollectionItem('comparisonRows', index, 'other', e.target.value === 'custom' ? '' : e.target.value)}>
                    {comparisonValueOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                  {otherKind === 'custom' && <input value={row.other === 'check' || row.other === 'x' ? '' : row.other} onChange={(e) => changeCollectionItem('comparisonRows', index, 'other', e.target.value)} placeholder="Ex.: Raro" />}
                </label>
                <button type="button" className="admin-repeater__remove" onClick={() => removeCollectionItem('comparisonRows', index)} aria-label={`Remover tópico ${index + 1}`}>×</button>
              </div>
            );
          })}
        </div>
      </section>
      <section className="admin-form__section">
        <div className="admin-form__section-heading">
          <div><h3>Ativos (product-actives)</h3><small>Imagens e textos da seção de ativos exibida na página do produto.</small></div>
        <label className="admin-check"><input type="checkbox" checked={values.activesEnabled} onChange={(e) => change('activesEnabled', e.target.checked)} /> Exibir esta seção na página do produto</label>
        </div>
        <div className="admin-grid admin-grid--3">
          <label>Upload imagem do produto (product-actives__product)<input type="file" accept="image/*" onChange={(e) => setActivesProductFile(e.target.files[0])} />{values.activesProductImage && <small>Atual: {values.activesProductImage}</small>}</label>
          <label>Upload imagem da textura (product-actives__texture)<input type="file" accept="image/*" onChange={(e) => setActivesTextureFile(e.target.files[0])} />{values.activesTextureImage && <small>Atual: {values.activesTextureImage}</small>}</label>
          <label>Upload imagem do pincel (product-actives__brush)<input type="file" accept="image/*" onChange={(e) => setActivesBrushFile(e.target.files[0])} />{values.activesBrushImage && <small>Atual: {values.activesBrushImage}</small>}</label>
        </div>
        <div className="admin-repeater">
          <div className="admin-repeater__heading"><strong>Textos dos ativos</strong><button type="button" className="admin-button" onClick={() => addCollectionItem('activesCallouts', { title: '', lines: [] })}>Adicionar ativo</button></div>
          {values.activesCallouts.length === 0 && <small>Nenhum ativo cadastrado.</small>}
          {values.activesCallouts.map((callout, index) => (
            <div className="admin-repeater__row admin-repeater__row--actives" key={`actives-${index}`}>
              <label>Título<input value={callout.title} onChange={(e) => changeCollectionItem('activesCallouts', index, 'title', e.target.value)} placeholder="Ex.: Caulim" /></label>
              <label>Linhas (uma por linha)<textarea rows="3" value={callout.lines.join('\n')} onChange={(e) => changeCollectionItem('activesCallouts', index, 'lines', e.target.value.split('\n'))} placeholder="A argila mais suave,&#10;absorve sem irritar" /></label>
              <button type="button" className="admin-repeater__remove" onClick={() => removeCollectionItem('activesCallouts', index)} aria-label={`Remover ativo ${index + 1}`}>×</button>
            </div>
          ))}
        </div>
      </section>
      <section className="admin-form__section">
        <div className="admin-form__section-heading">
          <div><h3>Benefícios (product-benefits)</h3><small>Imagem de fundo, ícones e textos dos benefícios exibidos na página do produto.</small></div>
        </div>
        <label className="admin-check"><input type="checkbox" checked={values.benefitsEnabled} onChange={(e) => change('benefitsEnabled', e.target.checked)} /> Exibir esta seção na página do produto</label>
        <div className="admin-grid admin-grid--2">
          <label>Upload imagem de fundo (product-benefits__pattern)<input type="file" accept="image/*" onChange={(e) => setBenefitsPatternFile(e.target.files[0])} />{values.benefitsPatternImage && <small>Atual: {values.benefitsPatternImage}</small>}</label>
          <label>Cor de fundo da seção<input type="color" value={values.benefitsBackgroundColor} onChange={(e) => change('benefitsBackgroundColor', e.target.value)} /></label>
        </div>
        <div className="admin-repeater">
          <div className="admin-repeater__heading"><strong>Itens de benefício</strong><button type="button" className="admin-button" onClick={() => addCollectionItem('benefitsItems', { icon: '', label: '' })}>Adicionar benefício</button></div>
          {values.benefitsItems.length === 0 && <small>Nenhum benefício cadastrado.</small>}
          {values.benefitsItems.map((benefit, index) => (
            <div className="admin-repeater__row admin-repeater__row--benefits" key={`benefit-${index}`}>
              <label>Ícone (URL)<input type="text" value={benefit.icon} onChange={(e) => changeCollectionItem('benefitsItems', index, 'icon', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
              <label>Upload do ícone<input type="file" accept="image/*" onChange={(e) => setBenefitIconFiles((prev) => ({ ...prev, [index]: e.target.files[0] }))} />{benefit.icon && !benefitIconFiles[index] && <small>Atual: {benefit.icon}</small>}</label>
              <label>Texto (use Enter para quebrar linha)<textarea rows="2" value={benefit.label} onChange={(e) => changeCollectionItem('benefitsItems', index, 'label', e.target.value)} placeholder="Ex.: Trata marcas e manchas" /></label>
              <button type="button" className="admin-repeater__remove" onClick={() => removeCollectionItem('benefitsItems', index)} aria-label={`Remover benefício ${index + 1}`}>×</button>
            </div>
          ))}
        </div>
      </section>
      <section className="admin-form__section">
        <div className="admin-form__section-heading">
          <div><h3>Como usar (how-to-use)</h3><small>Imagens, textos dos passos, imagem de fundo e cor de fundo da seção "Como usar" da página do produto.</small></div>
        </div>
        <label className="admin-check"><input type="checkbox" checked={values.howToUseEnabled} onChange={(e) => change('howToUseEnabled', e.target.checked)} /> Exibir esta seção na página do produto</label>
        <div className="admin-grid admin-grid--2">
          <label>Upload imagem de fundo<input type="file" accept="image/*" onChange={(e) => setHowToUseBackgroundFile(e.target.files[0])} />{values.howToUseBackgroundImage && <small>Atual: {values.howToUseBackgroundImage}</small>}</label>
          <label>Cor de fundo da seção<input type="color" value={values.howToUseBackgroundColor} onChange={(e) => change('howToUseBackgroundColor', e.target.value)} /></label>
        </div>
        <div className="admin-grid admin-grid--2">
          <label>Upload imagem 1 (sup. esquerda)<input type="file" accept="image/*" onChange={(e) => setHowToUseImageFiles((prev) => prev.map((f, i) => i === 0 ? e.target.files[0] : f))} />{values.howToUseImages[0] && <small>Atual: {values.howToUseImages[0]}</small>}</label>
          <label>Upload imagem 2 (inf. esquerda)<input type="file" accept="image/*" onChange={(e) => setHowToUseImageFiles((prev) => prev.map((f, i) => i === 1 ? e.target.files[0] : f))} />{values.howToUseImages[1] && <small>Atual: {values.howToUseImages[1]}</small>}</label>
          <label>Upload imagem 3 (sup. direita)<input type="file" accept="image/*" onChange={(e) => setHowToUseImageFiles((prev) => prev.map((f, i) => i === 2 ? e.target.files[0] : f))} />{values.howToUseImages[2] && <small>Atual: {values.howToUseImages[2]}</small>}</label>
          <label>Upload imagem 4 (inf. direita)<input type="file" accept="image/*" onChange={(e) => setHowToUseImageFiles((prev) => prev.map((f, i) => i === 3 ? e.target.files[0] : f))} />{values.howToUseImages[3] && <small>Atual: {values.howToUseImages[3]}</small>}</label>
        </div>
        <div className="admin-repeater">
          <div className="admin-repeater__heading"><strong>Passos</strong><button type="button" className="admin-button" onClick={() => addCollectionItem('howToUseSteps', { text: '' })}>Adicionar passo</button></div>
          {values.howToUseSteps.length === 0 && <small>Nenhum passo cadastrado.</small>}
          {values.howToUseSteps.map((step, index) => (
            <div className="admin-repeater__row admin-repeater__row--how-to-use" key={`how-to-use-${index}`}>
              <label>Texto do passo {index + 1}<textarea rows="2" value={step.text} onChange={(e) => changeCollectionItem('howToUseSteps', index, 'text', e.target.value)} placeholder="Ex.: Aplique uma camada generosa do produto" /></label>
              <button type="button" className="admin-repeater__remove" onClick={() => removeCollectionItem('howToUseSteps', index)} aria-label={`Remover passo ${index + 1}`}>×</button>
            </div>
          ))}
        </div>
      </section>
      <section className="admin-form__section">
        <div className="admin-form__section-heading">
          <div><h3>Não sabe qual é a máscara ideal para você? (ai-analysis)</h3><small>Cor de fundo da seção de análise de pele por IA exibida na página do produto.</small></div>
        </div>
        <label>Cor de fundo da seção<input type="color" value={values.aiAnalysisBackgroundColor} onChange={(e) => change('aiAnalysisBackgroundColor', e.target.value)} /></label>
      </section>
      <section className="admin-form__section">
        <div className="admin-form__section-heading">
          <div><h3>FAQ (product-faq)</h3><small>Cor de fundo e imagem de padrão da seção de FAQ exibida na página do produto.</small></div>
        </div>
        <div className="admin-grid admin-grid--2">
          <label>Cor de fundo da seção<input type="color" value={values.faqBackgroundColor} onChange={(e) => change('faqBackgroundColor', e.target.value)} /></label>
          <label>Upload imagem de fundo (product-faq__pattern)<input type="file" accept="image/*" onChange={(e) => setFaqPatternFile(e.target.files[0])} />{values.faqPatternImage && <small>Atual: {values.faqPatternImage}</small>}</label>
        </div>
      </section>
      <section className="admin-form__section">
        <div className="admin-form__section-heading">
          <div><h3>Antes e Depois (before-after)</h3><small>Seção de depoimentos com slider de antes/depois exibida na página do produto.</small></div>
        </div>
        <label className="admin-check"><input type="checkbox" checked={values.beforeAfterEnabled} onChange={(e) => change('beforeAfterEnabled', e.target.checked)} /> Exibir esta seção na página do produto</label>
        <div className="admin-grid admin-grid--2">
          <label>Título<input value={values.beforeAfterTitle} onChange={(e) => change('beforeAfterTitle', e.target.value)} placeholder="ANTES & DEPOIS" /></label>
          <label>Título destaque<input value={values.beforeAfterTitleAccent} onChange={(e) => change('beforeAfterTitleAccent', e.target.value)} placeholder="Reais" /></label>
          <label>Label "antes"<input value={values.beforeAfterBeforeLabel} onChange={(e) => change('beforeAfterBeforeLabel', e.target.value)} placeholder="ANTES" /></label>
          <label>Label "depois"<input value={values.beforeAfterAfterLabel} onChange={(e) => change('beforeAfterAfterLabel', e.target.value)} placeholder="DEPOIS" /></label>
        </div>
        <label>Subtítulo<input value={values.beforeAfterSubtitle} onChange={(e) => change('beforeAfterSubtitle', e.target.value)} placeholder="Mais de 44 mil peles transformadas…" /></label>
        <div className="admin-repeater">
          <div className="admin-repeater__heading"><strong>Itens (antes/depois)</strong><button type="button" className="admin-button" onClick={() => addCollectionItem('beforeAfterItems', { name: '', usage: '', beforeImage: '', afterImage: '' })}>Adicionar item</button></div>
          {values.beforeAfterItems.length === 0 && <small>Nenhum item cadastrado.</small>}
          {values.beforeAfterItems.map((item, index) => (
            <div className="admin-repeater__row admin-repeater__row--before-after" key={`before-after-${index}`}>
              <label>Nome<input value={item.name} onChange={(e) => changeCollectionItem('beforeAfterItems', index, 'name', e.target.value)} placeholder="Ex.: Ana Simas" /></label>
              <label>Uso<input value={item.usage} onChange={(e) => changeCollectionItem('beforeAfterItems', index, 'usage', e.target.value)} placeholder="Ex.: 21 dias de uso" /></label>
              <label>URL imagem "antes"<input type="text" value={item.beforeImage} onChange={(e) => changeCollectionItem('beforeAfterItems', index, 'beforeImage', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
              <label>URL imagem "depois"<input type="text" value={item.afterImage} onChange={(e) => changeCollectionItem('beforeAfterItems', index, 'afterImage', e.target.value)} placeholder="https://… ou /catalog-assets/…" /></label>
              <button type="button" className="admin-repeater__remove" onClick={() => removeCollectionItem('beforeAfterItems', index)} aria-label={`Remover item ${index + 1}`}>×</button>
            </div>
          ))}
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
