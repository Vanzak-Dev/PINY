import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ASSETS } from '@/components/config/assets';

import SelfieUpload from '@/components/analysis/SelfieUpload';
import AnalyzingLoader from '@/components/analysis/AnalyzingLoader';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Analysis() {
  const navigate = useNavigate();
  const [step, setStep] = useState('selfie'); // selfie, analyzing, error
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [error, setError] = useState(null);
  const [analysisStage, setAnalysisStage] = useState('analyzing');
  const { track } = useAnalytics('Analysis');

  const handleSelfieComplete = async (jsonResult) => {
    track('analise_step', { step: 'foto_enviada' });
    setSelfieUrl(jsonResult.selfie_url);
    setStep('analyzing');
    setAnalysisStage('analyzing');

    try {
      const analysisData = {
        selfie_url: jsonResult.selfie_url,
        scores: jsonResult.scores,
        condicoes_identificadas: jsonResult.condicoes_identificadas,
        tipo_pele: jsonResult.tipo_pele,
        gravidade_geral: jsonResult.gravidade_geral,
        observacoes: jsonResult.observacoes || null,
        top_problem: jsonResult.top_problem,
        top_score: jsonResult.top_score,
        questionnaire: null,
        routine_result: jsonResult.rotina,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('piny_latest_analysis', JSON.stringify(analysisData));

      track('analise_step', { step: 'resultado_pronto' });

      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate(createPageUrl('Results'));
    } catch (error) {
      setError({
        title: 'Ops! Algo deu errado',
        message: 'Não conseguimos processar sua análise. Por favor, tente novamente.',
        details: error.message || 'Erro desconhecido'
      });
      setStep('error');
    }
  };

  const handleRetry = () => {
    setError(null);
    setStep('selfie');
    setSelfieUrl(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/40">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to={createPageUrl('Home')}>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1 text-center pr-10">
            <img 
              src={ASSETS.logos.main}
              alt="PINY"
              className="h-8 mx-auto"
            />
          </div>
        </div>

        {/* Steps Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['selfie', 'analyzing', 'error'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all border ${
                step === s 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : ['selfie', 'analyzing'].indexOf(step) > i
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-400 border-slate-200'
              }`}>
                {i + 1}
              </div>
              {i < 1 && (
                <div className={`w-12 h-1 rounded-full ${
                  ['selfie', 'analyzing'].indexOf(step) > i
                    ? 'bg-emerald-400'
                    : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-slate-200/70"
        >
          {step === 'selfie' && (
            <SelfieUpload onComplete={handleSelfieComplete} />
          )}

          {step === 'analyzing' && (
            <AnalyzingLoader currentStage={analysisStage} />
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6"
              >
                <AlertCircle className="w-10 h-10 text-red-500" />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {error?.title || 'Erro na análise'}
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {error?.message || 'Ocorreu um erro ao processar sua selfie.'}
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleRetry}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-6 text-[16px] font-bold transition-all"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Tentar novamente
                </Button>

                <a
                  href__="mailto:contato@piny.com.br"
                  className="block text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Precisa de ajuda? <span className="underline font-medium">Fale com a gente</span>
                </a>
              </div>

              {error?.details && (
                <details className="mt-6 text-left">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                    Detalhes técnicos
                  </summary>
                  <p className="text-xs text-gray-500 mt-2 font-mono bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {error.details}
                  </p>
                </details>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
