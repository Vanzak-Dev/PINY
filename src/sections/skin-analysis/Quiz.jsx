import { useEffect, useRef, useState } from 'react';
import bgPattern from '../../assets/images/skin-analysis-quiz/bg-pattern.svg';
import QuizStepPhoto from './QuizStepPhoto';
import QuizStepAnalyzing from './QuizStepAnalyzing';
import QuizStepResult from './QuizStepResult';
import QuizStepCauses from './QuizStepCauses';
import QuizStepBenefits from './QuizStepBenefits';
import QuizStepActives from './QuizStepActives';
import QuizStepProductFit from './QuizStepProductFit';
import QuizStepSocialProof from './QuizStepSocialProof';
import QuizStepBeforeAfter from './QuizStepBeforeAfter';
import QuizStepOffer from './QuizStepOffer';
import './Quiz.css';

export default function Quiz() {
  const [step, setStep] = useState(1);
  const sectionRef = useRef(null);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ block: 'start' });
  }, [step]);

  return (
    <section ref={sectionRef} className="skin-quiz" aria-label="Análise de pele por IA">
      <img className="skin-quiz__bg" src={bgPattern} alt="" aria-hidden="true" />
      <div className="skin-quiz__card">
        {step === 1 && <QuizStepPhoto onPhotoSelected={() => setStep(2)} />}
        {step === 2 && <QuizStepAnalyzing onComplete={() => setStep(3)} />}
        {step === 3 && <QuizStepResult onNext={() => setStep(4)} />}
        {step === 4 && <QuizStepCauses onNext={() => setStep(5)} />}
        {step === 5 && <QuizStepBenefits onNext={() => setStep(6)} />}
        {step === 6 && <QuizStepActives onNext={() => setStep(7)} />}
        {step === 7 && <QuizStepProductFit onNext={() => setStep(8)} />}
        {step === 8 && <QuizStepSocialProof onNext={() => setStep(9)} />}
        {step === 9 && <QuizStepBeforeAfter onNext={() => setStep(10)} />}
        {step === 10 && <QuizStepOffer />}
      </div>
    </section>
  );
}
