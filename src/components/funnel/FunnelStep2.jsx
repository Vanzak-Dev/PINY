import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { PageShell, StepHeader, NextButton, Card } from '@/components/funnel/BeautyTech';

export default function FunnelStep2({ scores, condicoes, onNext }) {
  const getExplanation = () => {
    const hasAcne = condicoes?.some(c => c.toLowerCase().includes('acne'));
    const hasMelasma = condicoes?.some(c => c.toLowerCase().includes('melasma'));
    const hasManchas = condicoes?.some(c => c.toLowerCase().includes('mancha'));
    const hasVermelhidao = condicoes?.some(c => c.toLowerCase().includes('vermelhidão') || c.toLowerCase().includes('vermelhidao'));
    const hasPoros = condicoes?.some(c => c.toLowerCase().includes('poros'));
    const hasOleosidade = condicoes?.some(c => c.toLowerCase().includes('oleosidade'));
    const hasDermatite = condicoes?.some(c => c.toLowerCase().includes('dermatite'));
    const hasFoliculite = condicoes?.some(c => c.toLowerCase().includes('foliculite'));

    const problems = [
      { key: 'acne', score: scores?.acne || 0 },
      { key: 'manchas', score: scores?.manchas || 0 },
      { key: 'poros', score: scores?.poros || 0 },
      { key: 'oleosidade', score: scores?.oleosidade || 0 },
      { key: 'vermelhidao', score: scores?.vermelhidao || 0 },
    ];
    const mainProblem = problems.sort((a, b) => b.score - a.score)[0].key;

    const explanations = {
      acne: {
        title: hasVermelhidao ? 'Por que sua pele está com acne e vermelhidão?' : 'Por que sua pele está com acne?',
        reasons: hasVermelhidao ? [
          'Poros obstruídos por excesso de oleosidade e células mortas',
          'Bactérias multiplicando-se causando acne e inflamação',
          'Inflamação intensa causando vermelhidão e sensibilidade',
          'Ciclo vicioso: mais inflamação = mais espinhas e vermelhidão',
        ] : [
          'Poros obstruídos por excesso de oleosidade e células mortas',
          'Bactérias que se multiplicam nos poros bloqueados causando acne',
          'Inflamação causando vermelhidão e sensibilidade',
          'Ciclo vicioso: mais inflamação = mais espinhas',
        ],
        insight: hasVermelhidao
          ? 'Acne inflamada com vermelhidão precisa de tratamento anti-inflamatório e calmante direcionado.'
          : 'A acne não é apenas estética, é um processo inflamatório que precisa ser tratado de forma direcionada.',
      },
      manchas: {
        title: hasMelasma ? 'Por que sua pele tem melasma?' : hasAcne ? 'Por que sua pele tem acne e manchas?' : 'Por que sua pele tem manchas?',
        reasons: hasMelasma ? [
          'Melasma é hiperpigmentação causada por hormônios, sol e inflamação',
          'Manchas escuras e acastanhadas em maçãs do rosto, testa e queixo',
          'Renovação celular lenta mantém as manchas visíveis',
          'Exposição solar e inflamação pioram progressivamente',
        ] : hasAcne ? [
          'Acne deixa manchas pós-inflamatórias roxas e escuras',
          'Hiperpigmentação causada por inflamações recentes',
          'Novas espinhas criam novas manchas continuamente',
          'Renovação celular lenta mantém as marcas visíveis',
        ] : [
          'Manchas pós-inflamatórias que demoram para sumir',
          'Hiperpigmentação causada por inflamações antigas',
          'Renovação celular lenta deixando marcas visíveis',
          'Falta de uniformidade no tom da pele',
        ],
        insight: hasMelasma
          ? 'Melasma precisa de tratamento específico com clareadores, esfoliantes e proteção solar rigorosa.'
          : 'Manchas exigem ativos que trabalhem na renovação celular e clareamento progressivo.',
      },
      vermelhidao: {
        title: hasAcne ? 'Por que sua pele tem vermelhidão e acne?' : 'Por que sua pele está vermelha?',
        reasons: hasAcne ? [
          'Inflamação ativa causada por acne e sensibilidade',
          'Pele reativa que inflama facilmente com novos estímulos',
          'Vermelhidão persistente mesmo sem espinhas aparentes',
          'Ciclo de irritação: produtos errados pioram a vermelhidão',
        ] : [
          'Pele sensível e reativa a produtos ou ambiente',
          'Vermelhidão difusa por inflamação ou dermatite',
          'Barreira cutânea comprometida aumentando sensibilidade',
          'Vasos sanguíneos dilatados deixando a pele avermelhada',
        ],
        insight: 'Vermelhidão precisa de tratamento calmante e anti-inflamatório para restaurar o equilíbrio da pele.',
      },
      poros: {
        title: 'Por que sua pele tem poros visíveis?',
        reasons: [
          'Poros dilatados por excesso de sebo e impurezas',
          'Acúmulo de células mortas e sujeira nos poros',
          "Textura irregular e aparência de pele 'casca de laranja'",
          'Cravos e pontos pretos que aumentam os poros',
        ],
        insight: 'Poros dilatados precisam de limpeza profunda e controle de oleosidade para refinar a textura.',
      },
      oleosidade: {
        title: 'Por que sua pele está tão oleosa?',
        reasons: [
          'Produção excessiva de sebo pelas glândulas sebáceas',
          'Barreira cutânea desequilibrada tentando compensar',
          'Brilho excessivo que aparece poucas horas após limpar',
          'Maquiagem que não fixa e poros aparentes',
        ],
        insight: 'Controlar a oleosidade não é ressecar, é equilibrar a produção natural de óleo da pele.',
      },
    };

    if (hasDermatite) {
      return {
        title: 'Por que sua pele está com dermatite?',
        reasons: [
          'Inflamação crônica deixando a pele irritada e descamando',
          'Barreira cutânea comprometida causando sensibilidade extrema',
          'Vermelhidão, coceira e desconforto persistentes',
          'Ciclo de irritação: produtos errados pioram o quadro',
        ],
        insight: 'Dermatite precisa de tratamento específico com produtos calmantes e que restaurem a barreira cutânea.',
      };
    }
    if (hasFoliculite) {
      return {
        title: 'Por que sua pele está com foliculite?',
        reasons: [
          'Inflamação nos folículos pilosos causando pequenas espinhas',
          'Bactérias ou fungos infectando os folículos',
          'Comum em áreas com atrito, suor ou depilação',
          'Vermelhidão, coceira e bolinhas que parecem acne',
        ],
        insight: 'Foliculite precisa de limpeza profunda, controle bacteriano e ingredientes que acalmem a inflamação.',
      };
    }
    return explanations[mainProblem] || explanations.acne;
  };

  const explanation = getExplanation();

  return (
    <PageShell>
      <StepHeader title={explanation.title} subtitle="Análise das causas raiz identificadas pela IA" />

      <Card className="mb-4">
        <div className="space-y-4">
          {explanation.reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-[12px] mt-0.5">
                {i + 1}
              </span>
              <p className="text-slate-700 leading-relaxed font-medium text-[14px] pt-0.5">{reason}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
        className="bg-emerald-600 rounded-3xl p-5 text-white mb-4"
        style={{ boxShadow: '0 12px 28px -12px rgba(5,150,105,0.5)' }}
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-1.5 text-[15px]">Entendemos sua pele</h3>
            <p className="text-emerald-50 text-[13px] leading-relaxed font-medium">{explanation.insight}</p>
          </div>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="text-center text-slate-500 text-[13px] font-medium mb-2"
      >
        Milhares de pessoas já resolveram esse problema com o método certo...
      </motion.p>

      <NextButton onClick={onNext}>Ver como resolver</NextButton>
    </PageShell>
  );
}
