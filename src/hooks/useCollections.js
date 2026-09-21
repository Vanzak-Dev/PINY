import { useCallback, useEffect, useState } from 'react';
import { catalogApi } from '../services/catalogApi';

export function useCollections() {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');

  const loadCollections = useCallback(() => {
    catalogApi.listCollections()
      .then((items) => {
        setCollections(items);
        setError('');
      })
      .catch(() => setError('Não foi possível carregar as coleções.'));
  }, []);

  useEffect(() => {
    loadCollections();
    const handleStorage = (event) => {
      if (event.key === 'piny:catalog-version') loadCollections();
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [loadCollections]);

  return { collections, error, reload: loadCollections };
}
