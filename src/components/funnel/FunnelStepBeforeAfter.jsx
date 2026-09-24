import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { PageShell, StepHeader, NextButton, Card, ScanCorners } from '@/components/funnel/BeautyTech';

export default function FunnelStepBeforeAfter({ selfieUrl, scores, onNext }) {
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);

  const getImprovements = () => {
    const improvements = [];
    const problems = [
      { key: 'acne', score: scores?.acne || 0, text: 'Acne reduzida' },
      { key: 'manchas', score: scores?.manchas || 0, text: 'Manchas atenuadas' },
      { key: 'poros', score: scores?.poros || 0, text: 'Poros menos visíveis' },
      { key: 'oleosidade', score: scores?.oleosidade || 0, text: 'Menos oleosidade' },
    ];
    const topProblems = problems.filter(p => p.score >= 3).sort((a, b) => b.score - a.score).slice(0, 2);
    topProblems.forEach(p => improvements.push(p.text));
    if (improvements.length < 2) improvements.push('Pele equilibrada');
    improvements.push('Textura mais uniforme');
    improvements.push('Pele sem brilho');
    return improvements.slice(0, 4);
  };

  const improvements = getImprovements();

  useEffect(() => { generateAfterImage(); }, [selfieUrl]);

  const generateAfterImage = async () => {
    try {
      const prompt = `Transform this face photo to show results after 21 days of acne treatment. Remove acne, blemishes, and dark spots. Smooth skin texture, reduce redness and inflammation. Even skin tone, minimize pores. Keep natural look, same face structure, same lighting, same orientation (portrait). The generated image must maintain the EXACT same vertical portrait orientation as the input selfie. Realistic, healthy glowing skin without acne. IMPORTANT: Keep portrait orientation, person facing forward, vertical image format.`;
      const result = await base44.integrations.Core.GenerateImage({ prompt, existing_image_urls: [selfieUrl] });
      setAfterImage(result.url);
      setLoading(false);
      setTimeout(() => setShowComparison(true), 1000);
    } catch (error) {
      console.error('Error generating after image:', error);
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <StepHeader
        icon={<Sparkles className="w-7 h-7" />}
        title="Veja como sua pele pode ficar em 21 dias"
        subtitle="Resultado simulado baseado na sua análise"
      />

      {loading ? (
        <Card className="text-center py-10">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-900 font-bold text-[15px]">Gerando sua simulação...</p>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Isso pode levar alguns segundos</p>
        </Card>
      ) : afterImage ? (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <Card className="p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={selfieUrl} alt="Antes" className="w-full h-full object-cover object-center" loading="eager" decoding="async" />
                <ScanCorners color="border-slate-400/70" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent py-2">
                  <p className="text-white text-center font-semibold text-[13px]">Antes</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                <img src={afterImage} alt="Depois" className="w-full h-full object-cover object-center" loading="eager" decoding="async" />
                <ScanCorners />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-900/70 to-transparent py-2">
                  <p className="text-white text-center font-semibold text-[13px]">Em 21 dias</p>
                </div>
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute top-2 right-2 bg-emerald-500 text-white px-2.5 py-1 rounded-full text-[11px] font-bold"
                >
                  NOVO
                </motion.div>
              </div>
            </div>

            {showComparison && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-slate-100"
              >
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  {improvements.map((imp, i) => (
                    <div key={i} className="flex items-center gap-2 text-emerald-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-medium">{imp}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </Card>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="bg-emerald-600 rounded-2xl p-5 text-white text-center"
            style={{ boxShadow: '0 12px 28px -12px rgba(5,150,105,0.5)' }}
          >
            <h3 className="font-bold text-[16px] mb-1.5">Essa pode ser você em 21 dias!</h3>
            <p className="text-emerald-50 text-[13px] leading-relaxed font-medium">
              Com o Desafio 21 Dias Piny, resultados reais e duradouros estão ao seu alcance.
            </p>
          </motion.div>

          <p className="text-center text-[11px] text-slate-400">* Simulação baseada em resultados médios de clientes. Resultados podem variar.</p>
        </motion.div>
      ) : (
        <Card className="text-center py-8">
          <p className="text-slate-500 text-[14px]">Não foi possível gerar a simulação.</p>
          <button onClick={onNext} className="mt-4 text-emerald-600 font-bold text-[14px]">Continuar mesmo assim</button>
        </Card>
      )}

      {!loading && afterImage && <NextButton onClick={onNext} delay={0.8}>Quero esse resultado</NextButton>}
    </PageShell>
  );
}
