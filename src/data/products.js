import pineappleBackground from '../assets/images/product-pineapple-background.webp';
import whiteClayMask from '../assets/images/product-white-clay.webp';

const sharedProductPresentation = {
  image: whiteClayMask,
  backgroundImage: pineappleBackground,
  backgroundColor: '#b8efad',
  imageRestRotation: -15,
  imageActiveRotation: 15,
  oldPrice: 'R$ 129,00',
  price: 'R$ 89,00',
};

export const featuredProducts = [
  { ...sharedProductPresentation, id: 'argila-preta-1', name: 'Argila Preta' },
  { ...sharedProductPresentation, id: 'argila-rosa', name: 'Argila Rosa' },
  {
    ...sharedProductPresentation,
    id: 'argila-branca',
    name: 'Argila Branca',
    featureEnabled: true,
    featureLabel: 'ANTIMANCHAS',
    featurePrice: 89.9,
    featureBackgroundCenter: '#F3FD5A',
    featureBackgroundEdge: '#FFD72F',
    featureLeftImage: '/catalog-assets/pineapple-scatter-left.webp',
    featureRightImage: '/catalog-assets/pineapple-scatter-right.webp',
    featureProductImage: whiteClayMask,
  },
  { ...sharedProductPresentation, id: 'argila-verde', name: 'Argila Verde' },
  { ...sharedProductPresentation, id: 'argila-preta-2', name: 'Argila Preta' },
];
