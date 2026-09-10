import { useEffect, useState } from 'react';
import { catalogApi } from '../../services/catalogApi';
import './UgcManager.css';

const emptyForm = { title: '', productId: '', active: true, media: '', mediaType: 'video' };

function MediaPreview({ review }) {
  if (!review?.media) return <span className="admin-ugc__empty-media">Sem mídia</span>;
  if (review.mediaType === 'video') return <video src={review.media} muted playsInline preload="metadata" />;
  return <img src={review.media} alt="" />;
}

export default function UgcManager({ products }) {
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const loadReviews = async () => setReviews(await catalogApi.listReviewsAdmin());

  useEffect(() => {
    loadReviews().catch((error) => setMessage(error.message));
  }, []);

  useEffect(() => {
    if (!form.productId && products[0]) setForm((current) => ({ ...current, productId: products[0].id }));
  }, [form.productId, products]);

  const startCreate = () => {
    setEditing(null);
    setFile(null);
    setForm({ ...emptyForm, productId: products[0]?.id || '' });
    setMessage('');
  };

  const startEdit = (review) => {
    setEditing(review);
    setFile(null);
    setForm(review);
    setMessage('');
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('productId', form.productId);
      payload.append('active', String(form.active));
      payload.append('media', form.media || '');
      payload.append('mediaType', form.mediaType || 'video');
      if (file) payload.append('mediaFile', file);
      if (editing) await catalogApi.updateReview(editing.id, payload);
      else await catalogApi.createReview(payload);
      await loadReviews();
      startCreate();
      setMessage('Review salvo na seção UGC.');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (review) => {
    if (!window.confirm(`Excluir o review “${review.title || 'sem título'}”?`)) return;
    try {
      await catalogApi.removeReview(review.id);
      await loadReviews();
      if (editing?.id === review.id) startCreate();
      setMessage('Review excluído.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <section className="admin-ugc">
      <div className="admin-ugc__heading">
        <div><p className="admin-eyebrow">Reviews e UGC</p><h2>{reviews.length} mídias cadastradas</h2></div>
        <button className="admin-button" type="button" onClick={startCreate}>Novo review</button>
      </div>

      {message && <p className="admin-message admin-ugc__message" role="status">{message}</p>}

      <div className="admin-ugc__workspace">
        <div className="admin-ugc__list">
          {reviews.length === 0 && <p className="admin-ugc__empty">Nenhum vídeo cadastrado. A loja exibirá as imagens estáticas do Figma.</p>}
          {reviews.map((review) => {
            const product = products.find((item) => item.id === review.productId);
            return (
              <article className={editing?.id === review.id ? 'is-selected' : ''} key={review.id}>
                <button type="button" className="admin-ugc__media" onClick={() => startEdit(review)}><MediaPreview review={review} /></button>
                <button type="button" className="admin-ugc__details" onClick={() => startEdit(review)}>
                  <strong>{review.title || 'Review sem título'}</strong>
                  <small>{product?.name || 'Produto removido'} · {review.active ? 'Ativo' : 'Oculto'}</small>
                </button>
                <button type="button" className="admin-product-row__delete" onClick={() => remove(review)} aria-label={`Excluir ${review.title || 'review'}`}>×</button>
              </article>
            );
          })}
        </div>

        <form className="admin-ugc__form" onSubmit={save}>
          <h3>{editing ? 'Editar review' : 'Cadastrar review'}</h3>
          <label>Título<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex.: 14 dias usando PINY" /></label>
          <label>Produto associado<select required value={form.productId} onChange={(event) => setForm({ ...form, productId: event.target.value })}><option value="">Selecione</option>{products.map((product) => <option value={product.id} key={product.id}>{product.name}</option>)}</select></label>
          <label>Vídeo ou imagem<input required={!editing} type="file" accept="video/*,image/*" onChange={(event) => setFile(event.target.files[0] || null)} /><small>Até 100 MB. Vídeos aparecem com controles de reprodução.</small></label>
          {editing?.media && <div className="admin-ugc__current"><span>Mídia atual</span><MediaPreview review={editing} /></div>}
          <label className="admin-check"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Exibir na loja</label>
          <div className="admin-ugc__actions"><button className="admin-button" type="button" onClick={startCreate}>Limpar</button><button className="admin-button admin-button--primary" disabled={saving}>{saving ? 'Salvando…' : 'Salvar review'}</button></div>
        </form>
      </div>
    </section>
  );
}
