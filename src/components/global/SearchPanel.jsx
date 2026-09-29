import { useEffect, useRef, useState } from 'react';
import { featuredProducts } from '../../data/products';
import ProductCard from '../product/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import './SearchPanel.css';

const suggestedSearches = ['ACNE', 'ANTIMANCHAS', 'DETOX', 'OLEOSIDADE', 'CALMANTE', 'MÁSCARA', 'ADESIVO', 'ESTRELAS'];
const defaultPanelProducts = ['Argila Branca', 'Argila Verde', 'Argila Rosa', 'Argila Preta', 'Argila Branca'];

function matchesQuery(product, query) {
  const haystack = [product.name, product.category, ...(product.badges?.map((badge) => badge.label) || [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export default function SearchPanel({ isOpen, onClose, offsetTop, onAdd }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const { products: catalogProducts } = useProducts({ featuredOnly: false });
  const catalog = catalogProducts.length > 0 ? catalogProducts : featuredProducts;
  const findProduct = (name) => catalog.find((product) => product.name === name) || catalog[0];

  useEffect(() => {
    if (!isOpen) return undefined;
    inputRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    window.location.href = `/pesquisa?q=${encodeURIComponent(query.trim())}`;
  };

  const normalizedQuery = query.trim().toLowerCase();
  const matchedSuggestions = suggestedSearches.filter((suggestion) => suggestion.toLowerCase().includes(normalizedQuery));
  const filteredSuggestions = matchedSuggestions.length > 0 ? matchedSuggestions : suggestedSearches;

  const searchResults = normalizedQuery
    ? catalog.filter((product) => matchesQuery(product, normalizedQuery)).slice(0, 5)
    : null;

  const displayProducts = searchResults && searchResults.length > 0
    ? searchResults
    : defaultPanelProducts.map(findProduct);

  const hasNoResults = normalizedQuery && searchResults && searchResults.length === 0;

  return (
    <div className="search-panel" role="dialog" aria-label="Pesquisa de produtos">
      <div className="search-panel__backdrop" onClick={onClose} />
      <div className="search-panel__surface" style={offsetTop ? { top: `${offsetTop}px` } : undefined}>
        <form className="search-panel__input-wrap" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar produtos..."
            aria-label="Pesquisar produtos"
          />
          <button type="submit" className="search-panel__submit" aria-label="Pesquisar">
            <span className="search-panel__icon" aria-hidden="true" />
          </button>
        </form>

        <div className="search-panel__columns">
          <section className="search-panel__suggestions">
            <h2>Pesquisas sugeridas</h2>
            <div className="search-panel__tags">
              {filteredSuggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>{suggestion}</button>
              ))}
            </div>
          </section>

          <section className="search-panel__products">
            <h2>Você pode gostar:</h2>
            {hasNoResults ? (
              <p className="search-panel__no-results">Nenhum produto encontrado.</p>
            ) : (
              <div className="search-panel__product-list">
                {displayProducts.map((product, index) => (
                  <div className="search-panel__product" key={`${product.id}-${index}`}>
                    <ProductCard product={product} onAdd={onAdd} />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
