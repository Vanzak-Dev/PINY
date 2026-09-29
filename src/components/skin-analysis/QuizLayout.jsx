import React from "react";
import { Check } from "lucide-react";
import "./QuizLayout.css";

/**
 * Progress indicator: 3 numbered circles with connectors.
 * Completed steps show a checkmark; active step is filled.
 */
export function QuizProgress({ step, total = 3 }) {
  return (
    <div className="quiz-progress">
      {Array.from({ length: total }, (_, i) => {
        const num = i + 1;
        const isCompleted = num < step;
        const isActive = num === step;
        return (
          <React.Fragment key={num}>
            <div
              className={`quiz-progress__circle${
                isActive ? " is-active" : ""
              }${isCompleted ? " is-completed" : ""}`}
            >
              {isCompleted ? <Check className="quiz-progress__check" /> : num}
            </div>
            {i < total - 1 && (
              <div
                className={`quiz-progress__line${isCompleted ? " is-completed" : ""}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * White card container with rounded corners and shadow.
 */
export function QuizCard({ children, className = "" }) {
  return <div className={`quiz-card ${className}`}>{children}</div>;
}

/**
 * Shared layout for the entire Skin Analysis quiz flow.
 *
 * Props:
 *  - step:   current step number (1, 2, 3) for the progress indicator
 *  - total:  total steps (default 3)
 *  - card:   wrap children in a QuizCard (default true)
 *  - children: step-specific content
 *
 * Usage:
 *   <QuizLayout step={1}><SelfieStep /></QuizLayout>
 *   <QuizLayout step={2}><AnalyzingStep /></QuizLayout>
 *   <QuizLayout step={3} card={false}><ResultStep /></QuizLayout>
 */
export default function QuizLayout({ step, total = 3, card = true, children }) {
  return (
    <div className="quiz-flow">
      <div className="quiz-flow__container">
        <QuizProgress step={step} total={total} />
        {card ? <QuizCard>{children}</QuizCard> : children}
      </div>
    </div>
  );
}
