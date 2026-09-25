import { useCallback, useEffect, useState } from 'react';
import { catalogApi } from '../services/catalogApi';

export function useProducts({ featuredOnly = true } = {}) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const loadProducts = useCallback(() => {
    catalogApi.listProducts({ featuredOnly })
      .then((items) => {
        setProducts(items);
        setError('');
      })
      .catch(() => setError('Não foi possível atualizar o catálogo.'));
  }, [featuredOnly]);

  useEffect(() => {
    loadProducts();
    const handleStorage = (event) => {
      if (event.key === 'piny:catalog-version') loadProducts();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadProducts]);

  return { products, error, reload: loadProducts };
}
