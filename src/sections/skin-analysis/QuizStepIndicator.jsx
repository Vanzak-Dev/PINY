import './QuizStepIndicator.css';

export default function QuizStepIndicator({ current }) {
  return (
    <div className="quiz-steps" role="img" aria-label={`Etapa ${current} de 3`}>
      <span className={`quiz-steps__dot${current === 1 ? ' is-active' : ''}`}>1</span>
      <span className="quiz-steps__line" />
      <span className={`quiz-steps__dot${current === 2 ? ' is-active' : ''}`}>2</span>
      <span className="quiz-steps__line" />
      <span className={`quiz-steps__dot${current === 3 ? ' is-active' : ''}`}>3</span>
    </div>
  );
}
