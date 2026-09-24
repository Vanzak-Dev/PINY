import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
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

  const handleSelfieComplete = async (url) => {
    track('analise_step', { step: 'foto_enviada' });
    setSelfieUrl(url);
    setStep('analyzing');
    await handleAnalysis(url);
  };

  const handleAnalysis = async (url) => {
    const startTime = Date.now();
    const minDisplayTime = 15000;
    setError(null);
    setAnalysisStage('analyzing');

    try {
      setAnalysisStage('analyzing_image');
      track('analise_step', { step: 'processando' });
      const analysisPrompt = `Você é um dermatologista especialista em análise visual de pele. Analise esta selfie com precisão e detalhe.

      ANÁLISE REQUERIDA:

      1. SCORES (0-10 para cada):
      - acne: quantidade e severidade de espinhas ativas (pápulas, pústulas, nódulos)
      - manchas: hiperpigmentação, melasma, manchas pós-inflamatórias
      - poros: visibilidade e dilatação dos poros
      - oleosidade: brilho excessivo, textura oleosa na zona T ou rosto todo
      - vermelhidao: eritema, rosácea, irritação visível
      - textura: rugosidade, irregularidades, cicatrizes

      2. CONDIÇÕES IDENTIFICADAS (lista as condições presentes):
      Identifique claramente se há:
      - Acne ativa (leve/moderada/severa)
      - Acne interna (lesões sob a pele, nódulos)
      - Manchas de melasma (hiperpigmentação em maçãs do rosto/testa)
      - Manchas pós-acne (hiperpigmentação pós-inflamatória)
      - Poros dilatados
      - Oleosidade excessiva
      - Vermelhidão/sensibilidade
      - Dermatite (pele descamando, irritada)
      - Foliculite (inflamação nos folículos, comum em áreas com pelos)
      - Textura irregular ou cicatrizes

      3. TIPO DE PELE:
      Classifique como: oleosa, mista, seca, sensível, normal

      4. GRAVIDADE GERAL:
      Classifique como: leve, moderada, severa

      Seja preciso e baseie-se apenas no que é visível na imagem.`;

      const routinePrompt = (analysisData) => `Você é o motor de recomendação de rotina da marca Piny (especializada em pele oleosa e acneica).

      ANÁLISE COMPLETA DA PELE:

      SCORES:
      - Acne: ${analysisData.scores.acne}/10
      - Manchas: ${analysisData.scores.manchas}/10
      - Poros: ${analysisData.scores.poros}/10
      - Oleosidade: ${analysisData.scores.oleosidade}/10
      - Vermelhidão: ${analysisData.scores.vermelhidao}/10
      - Textura: ${analysisData.scores.textura}/10

      CONDIÇÕES IDENTIFICADAS:
      ${analysisData.condicoes_identificadas.join(', ')}

      TIPO DE PELE: ${analysisData.tipo_pele}
      GRAVIDADE: ${analysisData.gravidade_geral}
      ${analysisData.observacoes ? `OBSERVAÇÕES: ${analysisData.observacoes}` : ''}

PRODUTOS PINY DISPONÍVEIS:
1. Gel de Limpeza Piny - limpeza suave, controle de oleosidade
2. Tônico Piny - equilibra pH, prepara a pele
3. Sérum Piny - tratamento concentrado para acne
4. Hidratante Piny - hidratação oil-free
5. Protetor Solar Piny - FPS 50, toque seco
6. Máscara Piny - tratamento intensivo semanal (1-3x/semana)
7. Booster Piny - potencializador para manchas
8. Adesivos Secativos Piny - uso pontual em espinhas

REGRAS:
1. NÃO diagnosticar doenças ou usar termos médicos
2. Falar como recomendação cosmética
3. Se sensibilidade alta: rotina mais gradual
4. Se acne muito alta: priorizar controle de oleosidade e consistência
5. Linguagem confiante, moderna e simples
6. Seja específico: dias da semana, quantidade, tempo de uso

Gere a rotina completa seguindo o schema.`;

      const scoresPromise = base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        file_urls: [url],
        response_json_schema: {
          type: "object",
          properties: {
            scores: {
              type: "object",
              properties: {
                acne: { type: "number" },
                manchas: { type: "number" },
                poros: { type: "number" },
                oleosidade: { type: "number" },
                vermelhidao: { type: "number" },
                textura: { type: "number" }
              }
            },
            condicoes_identificadas: {
              type: "array",
              items: { type: "string" }
            },
            tipo_pele: { type: "string" },
            gravidade_geral: { type: "string" },
            observacoes: { type: "string" }
          },
          required: ["scores", "condicoes_identificadas", "tipo_pele", "gravidade_geral"]
        }
      });

      const analysisResult = await scoresPromise;
      const scoresResult = analysisResult.scores;

      setAnalysisStage('generating_routine');

      const routinePromise = base44.integrations.Core.InvokeLLM({
        prompt: routinePrompt(analysisResult),
        response_json_schema: {
          type: "object",
          properties: {
            resumo: {
              type: "object",
              properties: {
                titulo: { type: "string" },
                descricao: { type: "string" },
                principais_achados: { type: "array", items: { type: "string" } },
                nivel_cuidado: { type: "string" }
              }
            },
            rotina_manha: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  passo: { type: "number" },
                  produto: { type: "string" },
                  instrucao: { type: "string" },
                  tempo: { type: "string" },
                  dica: { type: "string" }
                }
              }
            },
            rotina_noite: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  passo: { type: "number" },
                  produto: { type: "string" },
                  instrucao: { type: "string" },
                  tempo: { type: "string" },
                  dica: { type: "string" }
                }
              }
            },
            frequencia_semanal: {
              type: "object",
              properties: {
                mascara: {
                  type: "object",
                  properties: {
                    vezes_semana: { type: "number" },
                    dias_sugeridos: { type: "array", items: { type: "string" } },
                    duracao: { type: "string" }
                  }
                },
                booster: {
                  type: "object",
                  properties: {
                    vezes_semana: { type: "number" },
                    dias_sugeridos: { type: "array", items: { type: "string" } },
                    como_usar: { type: "string" }
                  }
                },
                adesivos: {
                  type: "object",
                  properties: {
                    quando_usar: { type: "string" },
                    instrucao: { type: "string" }
                  }
                }
              }
            },
            plano_21_dias: {
              type: "object",
              properties: {
                semana_1: {
                  type: "object",
                  properties: {
                    foco: { type: "string" },
                    meta: { type: "string" },
                    dicas: { type: "array", items: { type: "string" } }
                  }
                },
                semana_2: {
                  type: "object",
                  properties: {
                    foco: { type: "string" },
                    meta: { type: "string" },
                    dicas: { type: "array", items: { type: "string" } }
                  }
                },
                semana_3: {
                  type: "object",
                  properties: {
                    foco: { type: "string" },
                    meta: { type: "string" },
                    dicas: { type: "array", items: { type: "string" } }
                  }
                },
                checkpoints: { type: "array", items: { type: "string" } }
              }
            },
            kits_sugeridos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  produtos: { type: "array", items: { type: "string" } },
                  ideal_para: { type: "string" },
                  destaque: { type: "boolean" }
                }
              }
            },
            cta: { type: "string" }
          }
        }
      });

      const routineResult = await routinePromise;

      const analysisData = {
        selfie_url: url,
        scores: scoresResult,
        condicoes_identificadas: analysisResult.condicoes_identificadas,
        tipo_pele: analysisResult.tipo_pele,
        gravidade_geral: analysisResult.gravidade_geral,
        observacoes: analysisResult.observacoes || null,
        questionnaire: null,
        routine_result: routineResult,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('piny_latest_analysis', JSON.stringify(analysisData));

      // Save skin analysis data internally for product research
      const topProblems = Object.entries(scoresResult);
      topProblems.sort((a, b) => b[1] - a[1]);
      const [topKey, topValue] = topProblems[0];

      base44.entities.SkinAnalysisData.create({
        selfie_url: url,
        scores: scoresResult,
        condicoes_identificadas: analysisResult.condicoes_identificadas,
        tipo_pele: analysisResult.tipo_pele,
        gravidade_geral: analysisResult.gravidade_geral,
        observacoes: analysisResult.observacoes || null,
        top_problem: topKey,
        top_score: topValue,
      }).catch(err => console.error('Failed to save skin analysis data:', err));

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
      
      track('analise_step', { step: 'resultado_pronto' });

      await new Promise(resolve => setTimeout(resolve, remainingTime));

      navigate(createPageUrl('Results'));
      
    } catch (error) {
      console.error('Analysis error:', error);
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
