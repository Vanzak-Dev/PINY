import { useMemo } from 'react';
import CategoryPageLayout from '../components/category/CategoryPageLayout';
import { featuredProducts } from '../data/products';
import { useCart } from '../hooks/useCart';

function matchesQuery(product, query) {
  const haystack = [product.name, product.category, ...(product.badges?.map((badge) => badge.label) || [])]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

export default function SearchResultsPage({ query = '' }) {
  const { addItem } = useCart();
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(
    () => (normalizedQuery ? featuredProducts.filter((product) => matchesQuery(product, normalizedQuery)) : []),
    [normalizedQuery],
  );

  return (
    <CategoryPageLayout
      heading={`Resultados para "${query}"`}
      products={results}
      onAdd={addItem}
      emptyMessage="Nenhum produto encontrado."
    />
  );
}
