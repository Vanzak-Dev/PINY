import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Sparkles, Lock, Gift, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { PINY_BOOSTER_CONFIG } from '@/components/pinybooster/pinyBoosterConfig';
import UrgencyBanner from '@/components/pinybooster/UrgencyBanner';

export default function FunnelStep7({ scores }) {
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const packs = PINY_BOOSTER_CONFIG.packs.map(p => ({
    qty: p.qty,
    originalPrice: p.originalPrice,
    price: p.price,
    badge: p.tag === 'MAIS VENDIDO' ? 'MAIS VENDIDO' : (p.qty > 1 ? 'ECONOMIA' : null),
    checkoutUrl: p.checkoutUrl,
    consumerWeek: p.consumerWeek,
  }));

  const currentPack = packs.find(p => p.qty === selectedPack) || packs[2];
  const discount = Math.round(((currentPack.originalPrice - currentPack.price) / currentPack.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}
      className="max-w-lg mx-auto px-5 py-8 pb-32 bg-gradient-to-b from-slate-50 via-white to-emerald-50/40"
    >
      <div className="text-center mb-7">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3.5 py-1.5 rounded-full text-[13px] font-bold mb-4">
          <Sparkles className="w-4 h-4" /> Oferta especial para você
        </div>
        <h2 className="text-[26px] font-bold text-slate-900 mb-1.5 leading-tight">Transforme sua pele em 21 dias</h2>
        <p className="text-[14px] text-slate-500 font-medium">Tudo que você precisa para começar hoje</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="mb-3 bg-white rounded-3xl border border-slate-200/70 shadow-sm p-3 overflow-hidden"
      >
        <div className="w-full aspect-square rounded-2xl overflow-hidden">
          <img src={PINY_BOOSTER_CONFIG.productImages[0]} alt="Kit Desafio 21 Dias" className="w-full h-full object-cover" loading="eager" decoding="async" />
        </div>
      </motion.div>

      <UrgencyBanner />

      <div className="space-y-3 mb-5">
        {packs.map((pack) => {
          const active = selectedPack === pack.qty;
          return (
            <button
              key={pack.qty}
              onClick={() => setSelectedPack(pack.qty)}
              className={`w-full text-left rounded-2xl p-4 transition-all border ${
                active ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border-2 ${active ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                  {active && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-[16px] font-bold text-slate-900">{pack.qty === 1 ? 'Compra Única' : `${pack.qty}x Unidades`}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAFF00] text-[#052026] border border-[#052026]">OFERTA DA SEMANA</span>
                    {pack.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                        {pack.badge}
                      </span>
                    )}
                  </div>
                  {pack.qty > 1 && (
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Frete Grátis</span>
                      <span className="text-[12px] font-semibold text-slate-500">Economize R$ {(pack.originalPrice - pack.price).toFixed(2)}</span>
                    </div>
                  )}
                  {pack.consumerWeek?.brinde && (
                    <div className="flex items-center gap-2 mb-1">
                      <img src={pack.consumerWeek.brindeImage} alt="Brinde" className="w-9 h-9 rounded-lg object-cover border border-[#FF6B00]/30 flex-shrink-0" />
                      <div className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0" />
                        <span className="text-[11px] font-semibold text-[#FF6B00]">Ganhe brinde: Adesivo Secativo Piny Stars</span>
                      </div>
                    </div>
                  )}
                  {pack.consumerWeek?.giftText && (
                    <div className="flex items-center gap-2 mb-1">
                      <img src={pack.consumerWeek.brindeImage} alt="Brinde" className="w-9 h-9 rounded-lg object-cover border border-[#FF6B00]/30 flex-shrink-0" />
                      <div className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#FF6B00] flex-shrink-0" />
                        <span className="text-[11px] font-semibold text-[#FF6B00]">{pack.consumerWeek.giftText}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[13px] line-through text-slate-400">R$ {pack.originalPrice.toFixed(2)}</span>
                    <span className="text-[24px] font-bold text-slate-900">R$ {pack.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/70 shadow-sm p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-slate-900">Kit Desafio 21 Dias</h3>
          {currentPack.badge && (
            <div className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-100">{currentPack.badge}</div>
          )}
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
          {currentPack.qty > 1 && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-slate-400 line-through text-[13px] font-medium">De R$ {currentPack.originalPrice.toFixed(2)}</span>
              <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
            </div>
          )}
          <div className="flex items-baseline gap-2.5 mb-1.5">
            <span className="text-[13px] text-slate-500 font-semibold">Por apenas</span>
            <span className="text-[28px] font-bold text-slate-900">R$ {currentPack.price.toFixed(2)}</span>
          </div>
          <div className="text-[13px] text-slate-600 font-medium">
            ou <span className="font-bold text-slate-900">3x de R$ {(currentPack.price / 3).toFixed(2)}</span> sem juros
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-800 font-bold text-[13px] mb-0.5">Garantia de 21 dias ou seu dinheiro de volta</p>
              <p className="text-emerald-700 text-[12px] font-medium">Se você não ver resultados em 21 dias, devolvemos 100% do seu investimento</p>
            </div>
          </div>
        </div>

        <div className="space-y-2.5 mb-4">
          {[
            `${currentPack.qty === 1 ? '1 Máscara' : currentPack.qty === 2 ? '2 Máscaras' : '3 Máscaras'} Piny 60g para 21 dias`,
            ...(currentPack.consumerWeek?.brinde ? ['Adesivo Secativo Piny Stars de brinde'] : []),
            ...(currentPack.consumerWeek?.giftText ? ['4ª Máscara PINY grátis de brinde'] : []),
            'Guia completo do desafio',
            'Cronograma personalizado',
            'Suporte exclusivo no WhatsApp',
            'Bônus: Checklist diário',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-slate-700 text-[13px] font-medium">{item}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4">
          {currentPack.qty > 1 && (
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-[13px] font-medium">Frete</span>
              <span className="text-emerald-600 text-[13px] font-bold">GRÁTIS</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-900 text-[16px] font-bold">Total</span>
            <span className="text-emerald-600 text-[18px] font-bold">R$ {currentPack.price.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-5 text-[12px] text-slate-500">
        <div className="flex items-center gap-1.5"><Lock className="w-4 h-4" /><span>Compra 100% segura</span></div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /><span>Dados protegidos</span></div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
        <div className="max-w-lg mx-auto space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            onClick={() => { setIsRedirecting(true); window.location.href = currentPack.checkoutUrl; }}
            className="w-full rounded-2xl py-4 text-[16px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            style={{ boxShadow: '0 12px 28px -12px rgba(5,150,105,0.55)' }}
          >
            <Sparkles className="w-5 h-5" /> Começar Desafio 21 dias agora
          </motion.button>
          <button
            onClick={() => {
              const analysisData = localStorage.getItem('piny_latest_analysis');
              if (analysisData) localStorage.setItem('piny_user_profile', analysisData);
              navigate(createPageUrl('ProductsPinyBooster'));
            }}
            className="w-full rounded-2xl py-3.5 text-[15px] font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
          >
            Ver página do produto
          </button>
          <p className="text-center text-[12px] text-slate-500 mt-2 flex items-center justify-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Compra 100% segura, Entrega garantida
          </p>
        </div>
      </div>

      {isRedirecting && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-xl p-7 text-center max-w-sm mx-4">
            <div className="w-16 h-16 bg-emerald-50 rounded-full mx-auto mb-4 flex items-center justify-center border border-emerald-100">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-900 mb-1.5">Processando...</h3>
            <p className="text-slate-500 font-medium text-[14px]">Redirecionando para o checkout</p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
