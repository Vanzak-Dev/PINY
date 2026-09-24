import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Camera, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { ASSETS } from '@/components/config/assets';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function SkinAnalysisHome() {
  const { track } = useAnalytics('Home');
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-24">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <img 
              src={ASSETS.logos.main}
              alt="PINY"
              className="h-16 md:h-20 mx-auto"
              loading="eager"
              decoding="async"
            />
            <p className="text-slate-500 text-sm tracking-[0.2em] mt-3 font-bold">SKINCARE INTELIGENTE</p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 border border-slate-200/70">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-50 border border-emerald-100 mb-6">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                  Descubra sua rotina<br />
                  <span className="text-emerald-600">personalizada</span>
                </h2>
                
                <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                  Analise sua pele em segundos e receba uma rotina completa 
                  de skincare focada em acne, manchas e oleosidade.
                </p>

                <Link to={createPageUrl('Analysis')} onClick={() => track('cta_iniciar_analise_click', { origem: 'home' })}>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-6 text-lg font-bold transition-all"
                    style={{ boxShadow: '0 12px 28px -12px rgba(5,150,105,0.55)' }}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Começar análise
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <p className="text-xs text-slate-400 mt-6">
                  Resultado em menos de 2 minutos
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-12"
          >
            {[
              { label: 'Análise IA', desc: 'Selfie scan' },
              { label: 'Rotina AM/PM', desc: 'Personalizada' },
              { label: 'Plano 21 dias', desc: 'Com checkpoints' }
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white border border-slate-200/70 shadow-sm">
                <p className="text-slate-900 font-bold text-sm">{item.label}</p>
                <p className="text-slate-500 text-xs mt-1 font-medium">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
