import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

import QuizLayout from '@/components/skin-analysis/QuizLayout';
import FunnelStep1 from '@/components/funnel/FunnelStep1';
import FunnelStepBeforeAfter from '@/components/funnel/FunnelStepBeforeAfter';
import FunnelStep2 from '@/components/funnel/FunnelStep2';
import FunnelStep3 from '@/components/funnel/FunnelStep3';
import FunnelStep4 from '@/components/funnel/FunnelStep4';
import FunnelStep5 from '@/components/funnel/FunnelStep5';
import FunnelStep6 from '@/components/funnel/FunnelStep6';
import FunnelStep7 from '@/components/funnel/FunnelStep7';

export default function Results() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const loadAnalysis = () => {
      const saved = localStorage.getItem('piny_latest_analysis');
      if (saved) {
        setAnalysis(JSON.parse(saved));
      }
      setLoading(false);
    };
    loadAnalysis();
  }, []);

  const handleNext = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <QuizLayout step={3}>
        <div className="text-center py-20">
          <div className="animate-pulse text-emerald-500">Carregando...</div>
        </div>
      </QuizLayout>
    );
  }

  if (!analysis) {
    return (
      <QuizLayout step={3}>
        <div className="text-center py-20">
          <p className="text-slate-500 mb-4">Análise não encontrada</p>
          <Link to={createPageUrl('Home')}>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
              Fazer nova análise
            </Button>
          </Link>
        </div>
      </QuizLayout>
    );
  }

  const { scores, selfie_url, condicoes_identificadas, tipo_pele, gravidade_geral, observacoes } = analysis;

  return (
    <QuizLayout step={3} card={false}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <FunnelStep1 
            key="step1" 
            scores={scores} 
            condicoes={condicoes_identificadas}
            tipoPele={tipo_pele}
            gravidade={gravidade_geral}
            observacoes={observacoes}
            onNext={handleNext} 
          />
        )}
        {step === 2 && (
          <FunnelStep2 
            key="step2" 
            scores={scores} 
            condicoes={condicoes_identificadas}
            onNext={handleNext} 
          />
        )}
        {step === 3 && (
          <FunnelStep3 
            key="step3" 
            scores={scores} 
            condicoes={condicoes_identificadas}
            onNext={handleNext} 
          />
        )}
        {step === 4 && (
          <FunnelStep4 
            key="step4" 
            scores={scores} 
            condicoes={condicoes_identificadas}
            onNext={handleNext} 
          />
        )}
        {step === 5 && (
          <FunnelStep5 
            key="step5" 
            scores={scores} 
            condicoes={condicoes_identificadas}
            onNext={handleNext} 
          />
        )}
        {step === 6 && (
          <FunnelStep6 
            key="step6" 
            scores={scores} 
            condicoes={condicoes_identificadas}
            onNext={handleNext} 
          />
        )}
        {step === 7 && (
          <FunnelStepBeforeAfter key="step7" selfieUrl={selfie_url} scores={scores} onNext={handleNext} />
        )}
        {step === 8 && (
          <FunnelStep7 key="step8" scores={scores} />
        )}
      </AnimatePresence>
    </QuizLayout>
  );
}
