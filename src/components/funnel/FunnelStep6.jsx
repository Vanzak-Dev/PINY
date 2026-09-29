import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { PageShell, StepHeader, NextButton, Card } from '@/components/funnel/BeautyTech';

export default function FunnelStep6({ onNext, scores, condicoes }) {
  const testimonialsByProblem = {
    acne: [
      { name: 'Marina, 24 anos', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', rating: 5, text: 'Em 15 dias já vi uma diferença incrível! Minha pele ficou menos oleosa e as espinhas secaram sem deixar marcas.', result: 'Redução de 80% da acne' },
      { name: 'Carla, 29 anos', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', rating: 5, text: 'Sofria com acne adulta há anos. Com o Desafio 21 Dias, finalmente encontrei algo que funciona de verdade.', result: 'Pele sem espinhas e inflamações' },
      { name: 'Beatriz, 26 anos', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', rating: 5, text: 'Minha acne hormonal estava fora de controle. Depois do tratamento, minha pele está limpa e saudável.', result: 'Acne controlada em 3 semanas' },
    ],
    manchas: [
      { name: 'Júlia, 22 anos', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200', rating: 5, text: 'As manchas escuras que eu tinha há meses clarearam muito! Minha pele está uniforme e iluminada.', result: 'Manchas 70% mais claras' },
      { name: 'Fernanda, 28 anos', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200', rating: 5, text: 'Sofria com marcas de acne antiga. Em 21 dias, as manchas roxas e escuras diminuíram tanto!', result: 'Manchas pós-acne clareadas' },
      { name: 'Amanda, 25 anos', image: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=200', rating: 5, text: 'Tinha hiperpigmentação que me incomodava muito. A máscara realmente funciona!', result: 'Tom de pele uniforme' },
    ],
    poros: [
      { name: 'Rafaela, 23 anos', image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', rating: 5, text: 'Meus poros eram super visíveis, parecia textura de laranja. Agora estão refinados e a pele muito mais lisa!', result: 'Poros 60% menos visíveis' },
      { name: 'Patrícia, 30 anos', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200', rating: 5, text: 'Tinha poros dilatados e cravos constantes. Minha pele ficou mais refinada e os poros diminuíram muito!', result: 'Poros refinados e textura lisa' },
      { name: 'Camila, 27 anos', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', rating: 5, text: 'Os poros do meu nariz e bochechas eram enormes. Agora estão bem menores e a textura melhorou demais!', result: 'Textura refinada' },
    ],
    oleosidade: [
      { name: 'Larissa, 21 anos', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200', rating: 5, text: 'Minha pele era super oleosa, tinha que usar papel matificante toda hora. Agora está equilibrada o dia todo!', result: 'Oleosidade controlada' },
      { name: 'Gabriela, 26 anos', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', rating: 5, text: 'Tinha brilho excessivo até no inverno. Com o tratamento, minha pele ficou matinha e saudável.', result: 'Pele equilibrada sem brilho' },
      { name: 'Priscila, 24 anos', image: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200', rating: 5, text: 'Sofria com oleosidade extrema que causava espinhas. Agora minha pele está balanceada e sem inflamações!', result: 'Pele matinha o dia todo' },
    ],
    melasma: [
      { name: 'Claudia, 38 anos', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694c2e722cea8fc8eb9d0002/1720dec74_1.png', rating: 5, text: 'Meu melasma estava me tirando a autoestima. Em 21 dias, as manchas clarearam visivelmente!', result: 'Melasma clareado em 3 semanas' },
      { name: 'Renata, 42 anos', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694c2e722cea8fc8eb9d0002/ad077abbf_4.png', rating: 5, text: 'Tentei diversos tratamentos para melasma e nada funcionava. Com a Piny, finalmente vi resultados reais!', result: 'Tom mais uniforme e iluminado' },
      { name: 'Fernanda, 35 anos', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694c2e722cea8fc8eb9d0002/ecdd646e8_2.png', rating: 5, text: 'As manchas escuras do meu rosto diminuíram tanto que mal precisei usar base. Estou muito mais confiante!', result: 'Hiperpigmentação reduzida' },
    ],
    vermelhidao: [
      { name: 'Sofia, 30 anos', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694c2e722cea8fc8eb9d0002/1720dec74_1.png', rating: 5, text: 'Minha pele vivia vermelha e irritada. Em 21 dias, a vermelhidão diminuiu muito e minha pele está calma!', result: 'Vermelhidão reduzida em 70%' },
      { name: 'Carolina, 33 anos', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694c2e722cea8fc8eb9d0002/ad077abbf_4.png', rating: 5, text: 'Tinha pele super sensível e reativa. Agora consigo usar produtos sem medo e minha pele não fica mais irritada!', result: 'Sensibilidade controlada' },
      { name: 'Isabela, 28 anos', image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/694c2e722cea8fc8eb9d0002/ecdd646e8_2.png', rating: 5, text: 'Sofria com rosácea e minha pele estava sempre inflamada. O tratamento acalmou minha pele de forma incrível!', result: 'Pele calma e equilibrada' },
    ],
  };

  const getRelevantTestimonials = () => {
    const hasAcne = condicoes?.some(c => c.toLowerCase().includes('acne'));
    const hasMelasma = condicoes?.some(c => c.toLowerCase().includes('melasma'));
    const hasVermelhidao = condicoes?.some(c => c.toLowerCase().includes('vermelhidão') || c.toLowerCase().includes('vermelhidao') || c.toLowerCase().includes('sensibilidade'));
    const hasManchas = condicoes?.some(c => c.toLowerCase().includes('manchas'));
    const hasPoros = condicoes?.some(c => c.toLowerCase().includes('poros'));

    let mainCategory = 'acne';
    if (hasAcne) mainCategory = 'acne';
    else if (hasMelasma) mainCategory = 'melasma';
    else if (hasVermelhidao) mainCategory = 'vermelhidao';
    else if (hasManchas) mainCategory = 'manchas';
    else if (hasPoros) mainCategory = 'poros';
    else if (scores) {
      if ((scores.acne || 0) >= 40) mainCategory = 'acne';
      else {
        const problems = [
          { key: 'acne', score: scores.acne || 0 },
          { key: 'manchas', score: scores.manchas || 0 },
          { key: 'poros', score: scores.poros || 0 },
          { key: 'oleosidade', score: scores.oleosidade || 0 },
        ];
        mainCategory = problems.sort((a, b) => b.score - a.score)[0].key;
      }
    }
    return (testimonialsByProblem[mainCategory] || testimonialsByProblem.acne).slice(0, 3);
  };

  const testimonials = getRelevantTestimonials();

  return (
    <PageShell className="min-h-[auto]">
      <StepHeader title="Resultados reais em 21 dias" subtitle="Veja o que nossos clientes alcançaram com o Desafio 21 Dias" />

      <div className="space-y-3 mb-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
          >
            <Card>
              <div className="flex items-center gap-3 mb-3">
                <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                <div>
                  <h3 className="font-bold text-slate-900 text-[14px]">{t.name}</h3>
                  <div className="flex gap-0.5 mt-0.5">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <Quote className="w-7 h-7 text-slate-100 ml-auto" />
              </div>
              <p className="text-slate-700 leading-relaxed mb-3 text-[13px] font-medium">"{t.text}"</p>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5">
                <span className="text-emerald-700 text-[12px] font-bold">{t.result}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
      >
        <Card>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[26px] font-bold text-emerald-600">94%</div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">Viram resultados em 21 dias</div>
            </div>
            <div className="border-x border-slate-100">
              <div className="text-[26px] font-bold text-emerald-600">15k+</div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">Clientes satisfeitas</div>
            </div>
            <div>
              <div className="text-[26px] font-bold text-emerald-600">4.9★</div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">Avaliação média</div>
            </div>
          </div>
        </Card>
      </motion.div>

      <NextButton onClick={onNext} delay={0.6}>Quero esses resultados</NextButton>
    </PageShell>
  );
}
