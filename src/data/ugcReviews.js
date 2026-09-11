import reviewOne from '../assets/images/ugc/review-1.webp';
import reviewTwo from '../assets/images/ugc/review-2.webp';
import reviewThree from '../assets/images/ugc/review-3.webp';
import reviewFour from '../assets/images/ugc/review-4.webp';
import reviewFive from '../assets/images/ugc/review-5.webp';

const staticMedia = [reviewOne, reviewTwo, reviewThree, reviewFour, reviewFive, reviewOne];

export function buildStaticReviews(products = []) {
  return staticMedia.map((media, index) => ({
    id: `static-review-${index + 1}`,
    title: `Review PINY ${index + 1}`,
    media,
    mediaType: 'image',
    productId: products[index % Math.max(products.length, 1)]?.id || '',
    active: true,
  }));
}
