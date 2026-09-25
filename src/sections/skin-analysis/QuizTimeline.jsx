import './QuizTimeline.css';

export default function QuizTimeline({ items }) {
  return (
    <ul className="quiz-timeline">
      {items.map((item, index) => (
        <li className="quiz-timeline__step" key={item.key ?? index}>
          <div className={`quiz-timeline__row${item.alignStart ? ' quiz-timeline__row--start' : ''}`}>
            <span className={`quiz-timeline__marker quiz-timeline__marker--${item.variant}`}>
              {item.markerContent}
            </span>
            <div className="quiz-timeline__text">{item.text}</div>
          </div>
          {index < items.length - 1 && <span className="quiz-timeline__connector" />}
        </li>
      ))}
    </ul>
  );
}
