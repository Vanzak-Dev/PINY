import { useEffect, useState } from 'react';
import { featuredProducts } from '../data/products';
import { catalogApi } from '../services/catalogApi';

export function useProducts() {
  const [products, setProducts] = useState(featuredProducts);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    catalogApi.listFeatured()
      .then((items) => active && setProducts(items))
      .catch(() => active && setError('Não foi possível atualizar o catálogo.'));
    return () => { active = false; };
  }, []);

  return { products, error };
}
