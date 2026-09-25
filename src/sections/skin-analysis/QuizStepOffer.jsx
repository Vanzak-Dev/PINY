import { useState } from 'react';
import ProductQuantityOption from '../../components/product/ProductQuantityOption';
import { useCart } from '../../hooks/useCart';
import jarThumb from '../../assets/product/comparison/comparison-image-4.png';
import offerJar from '../../assets/images/skin-analysis-quiz/offer-jar.webp';
import offerPineapples from '../../assets/images/skin-analysis-quiz/offer-pineapples.webp';
import QuizCheckIcon from './QuizCheckIcon';
import QuizSparkleIcon from './QuizSparkleIcon';
import QuizTimeline from './QuizTimeline';
import './QuizStepOffer.css';

const INCLUDED = [
  '3 Máscaras Piny 60g para 21 dias',
  'Adesivo Secativo Piny Stars de brinde',
  'Guia completo do desafio',
  'Cronograma personalizado',
  'Suporte exclusivo no WhatsApp',
  'Bônus: Checklist diário',
];

const INCLUDED_ITEMS = INCLUDED.map((text) => ({ key: text, text, variant: 'done', markerContent: <QuizCheckIcon /> }));

// ponytail: kit e preços fixos do Figma; trocar pelo produto do catálogo quando o kit for cadastrado no admin.
const CHALLENGE_PRODUCT = { id: 'desafio-21-dias', name: 'Máscara Piny — Desafio 21 Dias', price: 89.9, image: jarThumb };

const OFFERS = [
  { quantity: 3, price: 229.25, discountLabel: '15% off', extraLabel: 'Ganhe brinde!' },
  { quantity: 2, price: 161.82, discountLabel: '10% off' },
  { quantity: 1, price: 89.9 },
];

export default function QuizStepOffer() {
  const { addItem } = useCart();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="quiz-offer">
      <div className="quiz-offer__heading">
        <span className="quiz-offer__tag">
          <QuizSparkleIcon className="quiz-offer__tag-icon" />
          Oferta especial para você
        </span>
        <h2 className="quiz-offer__title">
          <span>Transforme sua</span>
          <span>pele em 21 dias</span>
        </h2>
        <p className="quiz-offer__subtitle">Tudo que você precisa para começar hoje</p>
      </div>

      <div className="quiz-offer__body">
        <div className="quiz-offer__kit">
          <div className="quiz-offer__visual">
            <div className="quiz-offer__pineapples">
              <div className="quiz-offer__pineapples-frame">
                <img src={offerPineapples} alt="" aria-hidden="true" />
              </div>
            </div>
            <div className="quiz-offer__jar">
              <div className="quiz-offer__jar-frame">
                <img src={offerJar} alt="Máscara Facial de Argila Antiacne Piny 60g" />
              </div>
            </div>
          </div>

          <div className="quiz-offer__included">
            <QuizTimeline items={INCLUDED_ITEMS} />
          </div>
        </div>

        <div className="quiz-offer__options" role="group" aria-label="Escolha a quantidade">
          {OFFERS.map((offer, index) => (
            <ProductQuantityOption
              key={offer.quantity}
              quantity={offer.quantity}
              label={`${offer.quantity} ${offer.quantity === 1 ? 'unidade' : 'unidades'}`}
              price={offer.price}
              discountLabel={offer.discountLabel}
              extraLabel={offer.extraLabel}
              productImage={jarThumb}
              selected={index === selectedIndex}
              onSelect={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="quiz-offer__guarantee">
        <span className="quiz-timeline__marker quiz-timeline__marker--done" aria-hidden="true">
          <QuizCheckIcon />
        </span>
        <div>
          <p className="quiz-offer__guarantee-title">Garantia de 21 dias ou seu dinheiro de volta</p>
          <p className="quiz-offer__guarantee-text">
            Se você não ver resultados em 21 dias, devolvemos 100% do seu investimento.
          </p>
        </div>
      </div>

      <div className="quiz-offer__actions">
        <button
          type="button"
          className="quiz-btn-primary quiz-offer__btn"
          onClick={() => addItem({ ...CHALLENGE_PRODUCT, selectedQuantity: OFFERS[selectedIndex] })}
        >
          <QuizSparkleIcon className="quiz-offer__btn-icon" />
          Começar o desafio 21 dias agora
        </button>
        <a className="quiz-btn-secondary quiz-offer__btn" href="/produtos/piny-mask-original">
          Ver página do produto
        </a>
      </div>
    </div>
  );
}
