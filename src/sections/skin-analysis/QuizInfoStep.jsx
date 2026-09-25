import QuizTimeline from './QuizTimeline';
import './QuizInfoStep.css';

export default function QuizInfoStep({
  titleLines,
  subtitle,
  items,
  noteIcon,
  noteTitle,
  noteText,
  footnote,
  buttonLabel,
  onNext,
  href,
}) {
  return (
    <div className="quiz-info">
      <div className="quiz-info__heading">
        <h2 className="quiz-info__title">
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>
        <p className="quiz-info__subtitle">{subtitle}</p>
      </div>

      <QuizTimeline items={items} />

      <div className={`quiz-info__note${noteIcon ? ' quiz-info__note--icon' : ''}`}>
        {noteIcon}
        <div>
          <p className="quiz-info__note-title">{noteTitle}</p>
          <p className="quiz-info__note-text">{noteText}</p>
        </div>
      </div>

      {footnote && <p className="quiz-info__footnote">{footnote}</p>}

      {href ? (
        <a href={href} className="quiz-btn-primary quiz-info__btn">
          {buttonLabel}
        </a>
      ) : (
        <button type="button" className="quiz-btn-primary quiz-info__btn" onClick={onNext}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}
