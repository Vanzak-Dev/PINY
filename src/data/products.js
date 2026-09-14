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
  reviewCount: '2k+',
  description: 'Cuidado diário para uma pele mais saudável e uniforme.',
  badges: [{ label: 'Antimanchas', tone: 'outline', color: '#1c8c3c' }],
  quantityOptions: [
    { quantity: 3, price: 99.9, discountLabel: '15% off' },
    { quantity: 2, price: 99.9, discountLabel: '10% off' },
    { quantity: 1, price: 99.9 },
  ],
};

export const featuredProducts = [
  {
    ...sharedProductPresentation,
    id: 'argila-preta-1',
    name: 'Argila Preta',
    category: 'Calmante & Detox',
    featurePrice: 89.9,
    featureBackgroundCenter: '#CFCFCF',
    featureBackgroundEdge: '#4A4A4A',
  },
  {
    ...sharedProductPresentation,
    id: 'argila-rosa',
    name: 'Argila Rosa',
    category: 'Cuidado Diário',
    featurePrice: 89.9,
    featureBackgroundCenter: '#FFE1EC',
    featureBackgroundEdge: '#FF8FB8',
  },
  {
    ...sharedProductPresentation,
    id: 'argila-branca',
    name: 'Argila Branca',
    category: 'Antiacne',
    featureEnabled: true,
    featureLabel: 'ANTIMANCHAS',
    featurePrice: 89.9,
    featureBackgroundCenter: '#F3FD5A',
    featureBackgroundEdge: '#FFD72F',
    featureLeftImage: '/catalog-assets/pineapple-scatter-left.webp',
    featureRightImage: '/catalog-assets/pineapple-scatter-right.webp',
    featureProductImage: whiteClayMask,
    description: '+200 mil vendidas! A clássica com ácido salicílico e glicólico que trata acne e clareia manchas.',
    badges: [
      { label: 'Antimanchas', tone: 'outline', color: '#1c8c3c' },
      { label: 'Best-Seller', tone: 'solid', color: '#1c8c44' },
    ],
  },
  {
    ...sharedProductPresentation,
    id: 'argila-verde',
    name: 'Argila Verde',
    category: 'Antioleosidade',
    featurePrice: 89.9,
    featureBackgroundCenter: '#E3FFC2',
    featureBackgroundEdge: '#7BD957',
  },
  { ...sharedProductPresentation, id: 'argila-preta-2', name: 'Argila Preta' },
  // TODO: duplicatas temporárias só para visualizar a paginação (dots) da seção de categorias — remover quando houver produtos reais de Antiacne.
  { ...sharedProductPresentation, id: 'argila-branca-copy-1', name: 'Argila Branca', category: 'Antiacne' },
  { ...sharedProductPresentation, id: 'argila-branca-copy-2', name: 'Argila Branca', category: 'Antiacne' },
  { ...sharedProductPresentation, id: 'argila-branca-copy-3', name: 'Argila Branca', category: 'Antiacne' },
  { ...sharedProductPresentation, id: 'argila-branca-copy-4', name: 'Argila Branca', category: 'Antiacne' },
];
