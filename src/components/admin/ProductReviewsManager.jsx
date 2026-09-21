import { useEffect, useState } from 'react';
import StarRating from '../product/StarRating';
import { catalogApi } from '../../services/catalogApi';
import './ProductReviewsManager.css';

function getInitials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');
}

export default function ProductReviewsManager({ products }) {
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [filterProductId, setFilterProductId] = useState('');

  const loadReviews = async () => setReviews(await catalogApi.listProductReviewsAdmin());

  useEffect(() => {
    loadReviews().catch((error) => setMessage(error.message));
  }, []);

  const remove = async (review) => {
    if (!window.confirm(`Excluir a avaliação de "${review.userName}"?`)) return;
    try {
      await catalogApi.removeProductReview(review.id);
      await loadReviews();
      setMessage('Avaliação excluída.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const toggleActive = async (review) => {
    try {
      await catalogApi.toggleProductReview(review.id, { ...review, active: !review.active });
      await loadReviews();
      setMessage(review.active ? 'Avaliação ocultada.' : 'Avaliação publicada.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const filtered = filterProductId
    ? reviews.filter((r) => r.productId === filterProductId)
    : reviews;

  const productName = (id) => products.find((p) => p.id === id)?.name || 'Produto removido';

  return (
    <section className="admin-pr">
      <div className="admin-pr__heading">
        <div>
          <p className="admin-eyebrow">Avaliações de produtos</p>
          <h2>{reviews.length} avaliações cadastradas</h2>
        </div>
        <select
          className="admin-pr__filter"
          value={filterProductId}
          onChange={(e) => setFilterProductId(e.target.value)}
        >
          <option value="">Todos os produtos</option>
          {products.map((p) => (
            <option value={p.id} key={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {message && <p className="admin-message admin-pr__message" role="status">{message}</p>}

      {filtered.length === 0 ? (
        <p className="admin-pr__empty">Nenhuma avaliação encontrada.</p>
      ) : (
        <div className="admin-pr__list">
          {filtered.map((review) => (
            <article className="admin-pr__row" key={review.id}>
              <div className="admin-pr__row-main">
                <div className="admin-pr__row-header">
                  <span className="admin-pr__avatar">{getInitials(review.userName)}</span>
                  <div>
                    <strong>{review.userName}</strong>
                    <small>{productName(review.productId)} · {review.active ? 'Ativo' : 'Oculto'}</small>
                  </div>
                </div>
                <div className="admin-pr__row-rating">
                  <StarRating stars={review.stars} size={16} />
                </div>
                <p className="admin-pr__row-title">{review.title}</p>
                <p className="admin-pr__row-body">{review.body}</p>
              </div>
              <div className="admin-pr__row-actions">
                <button
                  className="admin-button"
                  type="button"
                  onClick={() => toggleActive(review)}
                >
                  {review.active ? 'Ocultar' : 'Publicar'}
                </button>
                <button
                  className="admin-button admin-button--danger"
                  type="button"
                  onClick={() => remove(review)}
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
