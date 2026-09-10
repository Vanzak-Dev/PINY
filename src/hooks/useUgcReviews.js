import { useEffect, useMemo, useState } from 'react';
import { buildStaticReviews } from '../data/ugcReviews';
import { catalogApi } from '../services/catalogApi';

export function useUgcReviews(products) {
  const [reviews, setReviews] = useState(null);
  const fallback = useMemo(() => buildStaticReviews(products), [products]);

  useEffect(() => {
    let active = true;
    catalogApi.listReviews()
      .then((items) => active && setReviews(items.length ? items : null))
      .catch(() => active && setReviews(null));
    return () => { active = false; };
  }, []);

  return reviews || fallback;
}
