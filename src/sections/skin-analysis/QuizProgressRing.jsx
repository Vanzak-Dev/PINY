import './QuizProgressRing.css';

export default function QuizProgressRing({ children, ariaLabel }) {
  return (
    <div className="quiz-ring" role="img" aria-label={ariaLabel}>
      {children}
    </div>
  );
}
