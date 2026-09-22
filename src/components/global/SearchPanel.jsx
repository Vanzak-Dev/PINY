import { useEffect, useMemo, useState } from 'react';
import { catalogApi } from '../../services/catalogApi';
import { formatPrice } from '../../lib/formatPrice';
import './SearchPanel.css';

export default function SearchPanel({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
    setLoading(true);
    catalogApi.listProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter((p) =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="search-panel">
      <button type="button" className="search-panel__backdrop" aria-label="Fechar busca" onClick={onClose} />
      <div className="search-panel__container">
        <div className="search-panel__header">
          <div className="search-panel__input-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 29 29" fill="none" className="search-panel__icon">
              <circle cx="11.6667" cy="11.6667" r="10.6667" stroke="#1C8C44" strokeWidth="2" />
              <path d="M19.8333 19.8333L27.9999 28" stroke="#1C8C44" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="search-panel__input"
              placeholder="Buscar produtos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button type="button" className="search-panel__close" aria-label="Fechar" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1L17 17M17 1L1 17" stroke="#1C8C44" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div className="search-panel__results">
          {loading && <p className="search-panel__status">Carregando...</p>}
          {!loading && query.trim() && results.length === 0 && (
            <p className="search-panel__status">Nenhum produto encontrado.</p>
          )}
          {!loading && results.length > 0 && (
            <ul className="search-panel__list">
              {results.map((product) => (
                <li key={product.id}>
                  <a className="search-panel__result" href={`/produtos/${product.slug || product.id}`} onClick={onClose}>
                    {product.image && <img className="search-panel__result-img" src={product.image} alt={product.name} />}
                    <div className="search-panel__result-info">
                      <span className="search-panel__result-name">{product.name}</span>
                      <div className="search-panel__result-prices">
                        {product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}
                        <span>{formatPrice(product.price)}</span>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
