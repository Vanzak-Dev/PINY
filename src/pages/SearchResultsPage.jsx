import { useMemo } from 'react';
import ProductCard from '../components/product/ProductCard';
import { featuredProducts } from '../data/products';
import './SearchResultsPage.css';

function matchesQuery(product, query) {
  const haystack = [product.name, product.category, ...(product.badges?.map((badge) => badge.label) || [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export default function SearchResultsPage({ query = '' }) {
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(
    () => (normalizedQuery ? featuredProducts.filter((product) => matchesQuery(product, normalizedQuery)) : []),
    [normalizedQuery],
  );

  return (
    <main className="search-results-page page-width">
      <h1 className="search-results-page__title">Resultados para "{query}"</h1>
      {results.length === 0 ? (
        <p className="search-results-page__empty">Nenhum produto encontrado.</p>
      ) : (
        <div className="search-results-page__grid">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
