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
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [afterImageLoading, setAfterImageLoading] = useState(false);
  const [afterImageError, setAfterImageError] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    sectionRef.current?.scrollIntoView({ block: 'start' });
  }, [step]);

  // Start "after" image generation in background as soon as the
  // skin analysis returns a selfie_url — well before the user
  // reaches Step 9.  Runs exactly once per analysis.
  useEffect(() => {
    if (!analysisResult?.selfie_url) return;

    let cancelled = false;
    setAfterImageLoading(true);
    setAfterImageError(false);

    fetch('/api/generate-after-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selfie_url: analysisResult.selfie_url,
        top_problem: analysisResult.top_problem,
        scores: analysisResult.scores,
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (!cancelled && data.url) {
          setAfterImage(data.url);
          setAfterImageLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAfterImageError(true);
          setAfterImageLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [analysisResult?.selfie_url]);

  const handlePhotoSelected = async (file) => {
    setAnalysisError(null);
    setStep(2);

    const formData = new FormData();
    formData.append('selfie', file);

    try {
      const res = await fetch('/api/skin-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Erro ${res.status}`);
      }

      const json = await res.json();

      const analysisData = {
        selfie_url: json.selfie_url,
        scores: json.scores,
        condicoes_identificadas: json.condicoes_identificadas,
        tipo_pele: json.tipo_pele,
        gravidade_geral: json.gravidade_geral,
        observacoes: json.observacoes || null,
        top_problem: json.top_problem,
        top_score: json.top_score,
        rotina: json.rotina || null,
        timestamp: new Date().toISOString(),
      };

      setAnalysisResult(analysisData);
      localStorage.setItem('piny_latest_analysis', JSON.stringify(analysisData));
      setStep(3);
    } catch (err) {
      console.error('[SkinAnalysis] Erro na API:', err?.message || err);
      setAnalysisError(err?.message || 'Não foi possível processar sua análise. Tente novamente.');
    }
  };

  const handleRetry = () => {
    setAnalysisError(null);
    setStep(1);
  };

  return (
    <section ref={sectionRef} className="skin-quiz" aria-label="Análise de pele por IA">
      <img className="skin-quiz__bg" src={bgPattern} alt="" aria-hidden="true" />
      <div className="skin-quiz__card">
        {step === 1 && <QuizStepPhoto onPhotoSelected={handlePhotoSelected} />}
        {step === 2 && (
          <QuizStepAnalyzing
            error={analysisError}
            onRetry={handleRetry}
          />
        )}
        {step === 3 && <QuizStepResult result={analysisResult} onNext={() => setStep(4)} />}
        {step === 4 && <QuizStepCauses analysisResult={analysisResult} onNext={() => setStep(5)} />}
        {step === 5 && <QuizStepBenefits analysisResult={analysisResult} onNext={() => setStep(6)} />}
        {step === 6 && <QuizStepActives analysisResult={analysisResult} onNext={() => setStep(7)} />}
        {step === 7 && <QuizStepProductFit analysisResult={analysisResult} onNext={() => setStep(8)} />}
        {step === 8 && <QuizStepSocialProof analysisResult={analysisResult} onNext={() => setStep(9)} />}
        {step === 9 && (
          <QuizStepBeforeAfter
            analysisResult={analysisResult}
            afterImage={afterImage}
            afterImageLoading={afterImageLoading}
            afterImageError={afterImageError}
            onNext={() => setStep(10)}
          />
        )}
        {step === 10 && <QuizStepOffer />}
      </div>
    </section>
  );
}
