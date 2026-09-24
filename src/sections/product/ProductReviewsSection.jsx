import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import StarRating from '../../components/product/StarRating';
import SortMenu from '../../components/product/SortMenu';
import { catalogApi } from '../../services/catalogApi';
import './ProductReviewsSection.css';

const DESKTOP_PAGE_SIZE = 6;
const MOBILE_PAGE_SIZE = 2;

function usePageSize() {
  const [pageSize, setPageSize] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth <= 767 ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE
  );
  useEffect(() => {
    const onResize = () => {
      setPageSize(window.innerWidth <= 767 ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return pageSize;
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || '')
    .join('');
}

function timeAgo(dateString) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'hoje';
  if (days === 1) return '1 dia atrás';
  if (days < 30) return `${days} dias atrás`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 mês atrás';
  return `${months} meses atrás`;
}

function DistributionBar({ label, count, total, max, isActive, onClick }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <button
      type="button"
      className={`pr-dist__row${isActive ? ' is-active' : ''}`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span className="pr-dist__label">{label}</span>
      <div className="pr-dist__bar-track">
        <div className="pr-dist__bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="pr-dist__count">{count}</span>
    </button>
  );
}

function ReviewCard({ review, productImage, productName }) {
  const cardImage = review.photo || productImage;
  return (
    <article className="pr-card">
      {cardImage && (
        <div className="pr-card__image">
          <img src={cardImage} alt={productName || ''} />
        </div>
      )}
      <div className="pr-card__rating-row">
        <StarRating stars={review.stars} size={20} />
        <span className="pr-card__date">{timeAgo(review.createdAt)}</span>
      </div>
      <div className="pr-card__user-row">
        <span className="pr-card__avatar">{getInitials(review.userName)}</span>
        <span className="pr-card__username">{review.userName}</span>
      </div>
      <h4 className="pr-card__title">{review.title}</h4>
      <p className="pr-card__body">{review.body}</p>
    </article>
  );
}

function WriteReviewModal({ productId, onClose, onSubmitted }) {
  const [form, setForm] = useState({ stars: 5, userName: '', title: '', body: '' });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [hoverStars, setHoverStars] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!photo) { setPhotoPreview(''); return; }
    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('stars', form.stars);
      formData.append('userName', form.userName);
      formData.append('title', form.title);
      formData.append('body', form.body);
      if (photo) formData.append('photoFile', photo);
      await catalogApi.submitProductReview(formData);
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pr-modal-backdrop" onClick={onClose}>
      <div className="pr-modal" onClick={(e) => e.stopPropagation()}>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setPhoto(e.target.files[0] || null)}
          className="pr-modal__photo-input"
        />
        <button className="pr-modal__close" onClick={onClose} aria-label="Fechar">×</button>
        <h3 className="pr-modal__title">Escrever uma avaliação</h3>
        <form onSubmit={submit}>
          <label className="pr-modal__label">Sua nota</label>
          <div className="pr-modal__stars">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setForm({ ...form, stars: i + 1 })}
                onMouseEnter={() => setHoverStars(i + 1)}
                onMouseLeave={() => setHoverStars(0)}
                className="pr-modal__star-btn"
              >
                <svg width="32" height="30.72" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.1197 0.780243C11.5995 -0.259871 13.0777 -0.25987 13.5575 0.780243L16.1897 6.48696C16.3853 6.91087 16.787 7.20275 17.2506 7.25771L23.4914 7.99766C24.6289 8.13253 25.0857 9.53844 24.2447 10.3161L19.6307 14.583C19.288 14.9 19.1345 15.3722 19.2255 15.8301L20.4503 21.9942C20.6735 23.1176 19.4776 23.9865 18.4781 23.427L12.9942 20.3574C12.5869 20.1294 12.0903 20.1294 11.683 20.3574L6.19909 23.427C5.19959 23.9865 4.00365 23.1176 4.22689 21.9942L5.45167 15.8301C5.54265 15.3722 5.3892 14.9 5.04647 14.583L0.432464 10.3161C-0.408489 9.53844 0.0483191 8.13253 1.18578 7.99766L7.4266 7.25771C7.89019 7.20275 8.29192 6.91087 8.48745 6.48696L11.1197 0.780243Z" fill={i < (hoverStars || form.stars) ? '#FFA800' : '#E0E0E0'} />
                </svg>
              </button>
            ))}
          </div>
          <label className="pr-modal__label">Seu nome</label>
          <input
            className="pr-modal__input"
            value={form.userName}
            onChange={(e) => setForm({ ...form, userName: e.target.value })}
            placeholder="Como devemos te chamar?"
            required
          />
          <label className="pr-modal__label">Título</label>
          <input
            className="pr-modal__input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Resuma sua experiência"
            required
          />
          <label className="pr-modal__label">Avaliação</label>
          <textarea
            className="pr-modal__textarea"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Conte sua experiência com o produto"
            rows={4}
            required
          />
          <label className="pr-modal__label">Foto (opcional)</label>
          <div className="pr-modal__photo-upload">
            <button
              type="button"
              className="pr-modal__photo-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Pré-visualização" className="pr-modal__photo-preview" />
              ) : (
                <span className="pr-modal__photo-placeholder">Clique para enviar uma foto</span>
              )}
            </button>
            {photo && (
              <button
                type="button"
                className="pr-modal__photo-remove"
                onClick={() => setPhoto(null)}
                aria-label="Remover foto"
              >
                ×
              </button>
            )}
          </div>
          {error && <p className="pr-modal__error">{error}</p>}
          <button type="submit" className="pr-modal__submit" disabled={saving}>
            {saving ? 'Enviando…' : 'Publicar avaliação'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ProductReviewsSection({ product }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWrite, setShowWrite] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('featured');
  const [starFilter, setStarFilter] = useState(null);
  const pageSize = usePageSize();

  const loadReviews = useCallback(async () => {
    if (!product?.id) return;
    setLoading(true);
    try {
      const data = await catalogApi.listProductReviews(product.id);
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [product?.id]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.stars, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      label: `${star} ${star === 1 ? 'Star' : 'Stars'}`,
      count: reviews.filter((r) => r.stars === star).length,
    }));
    const max = Math.max(...dist.map((d) => d.count), 1);
    return { total, avg, dist, max };
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    let result = [...reviews];
    if (starFilter !== null) {
      result = result.filter((r) => r.stars === starFilter);
    }
    if (sortOrder === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === 'highest') {
      result.sort((a, b) => b.stars - a.stars);
    } else if (sortOrder === 'lowest') {
      result.sort((a, b) => a.stars - b.stars);
    }
    return result;
  }, [reviews, sortOrder, starFilter]);

  const totalPages = Math.ceil(sortedReviews.length / pageSize);
  const clampedPage = Math.min(page, Math.max(totalPages, 1));
  const pageReviews = sortedReviews.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);

  const handleStarFilterClick = (star) => {
    setStarFilter((prev) => (prev === star ? null : star));
    setPage(1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setPage(1);
  };

  if (loading) return null;

  return (
    <section className="product-reviews page-width" aria-label="Avaliações do produto">
      <h2 className="product-reviews__title">AVALIAÇÕES</h2>

      <div className="product-reviews__dashboard">
        <div className="product-reviews__left">
          <div className="product-reviews__summary">
            <span className="product-reviews__avg">{stats.avg.toFixed(1)}</span>
            <StarRating stars={Math.round(stats.avg)} size={25} />
            <span className="product-reviews__count">{stats.total} {stats.total === 1 ? 'Review' : 'Reviews'}</span>
          </div>

          <div className="product-reviews__divider" />

          <div className="product-reviews__dist">
            {stats.dist.map((d) => (
              <DistributionBar
                key={d.star}
                label={d.label}
                count={d.count}
                total={stats.total}
                max={stats.max}
                isActive={starFilter === d.star}
                onClick={() => handleStarFilterClick(d.star)}
              />
            ))}
          </div>
        </div>

        <div className="product-reviews__actions">
          <button className="product-reviews__write-btn" onClick={() => setShowWrite(true)}>
            Write a review
          </button>
          <div className="product-reviews__filter-wrapper">
            <button
              className="product-reviews__filter-btn"
              onClick={() => setShowSortMenu((prev) => !prev)}
              aria-label="Filtrar avaliações"
            >
              <img src="/filtro.svg" alt="" />
            </button>
            {showSortMenu && (
              <SortMenu
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                onClose={() => setShowSortMenu(false)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="product-reviews__grid">
        {pageReviews.length === 0 && (
          <p className="product-reviews__empty">
            {starFilter !== null
              ? `Nenhuma avaliação com ${starFilter} estrela${starFilter === 1 ? '' : 's'}.`
              : 'Ainda não há avaliações. Seja o primeiro a avaliar!'}
          </p>
        )}
        {pageReviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            productImage={product?.image}
            productName={product?.name}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="product-reviews__pagination">
          <button
            className="product-reviews__page-btn"
            disabled={clampedPage === 1}
            onClick={() => setPage(clampedPage - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`product-reviews__page-num${clampedPage === i + 1 ? ' is-active' : ''}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="product-reviews__page-btn"
            disabled={clampedPage === totalPages}
            onClick={() => setPage(clampedPage + 1)}
          >
            ›
          </button>
        </div>
      )}

      {showWrite && (
        <WriteReviewModal
          productId={product.id}
          onClose={() => setShowWrite(false)}
          onSubmitted={loadReviews}
        />
      )}
    </section>
  );
}
