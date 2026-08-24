import { useEffect, useRef } from "react";
import { ArrowRight, Check, X } from "lucide-react";
import type { Challenge } from "../data/content";

type Props = {
  challenge: Challenge | null;
  clickProgress: number;
  inputValue: string;
  feedback: string;
  onInputChange: (value: string) => void;
  onClickProgress: () => void;
  onSubmitInput: () => void;
  onChoose: (index: number) => void;
  onClose: () => void;
};

export function ChallengeModal({
  challenge,
  clickProgress,
  inputValue,
  feedback,
  onInputChange,
  onClickProgress,
  onSubmitInput,
  onChoose,
  onClose,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (challenge?.type === "input") {
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [challenge]);

  useEffect(() => {
    if (!challenge) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [challenge, onClose]);

  if (!challenge) return null;

  return (
    <div className="modal-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="challenge-modal" role="dialog" aria-modal="true" aria-labelledby="challenge-title">
        <button className="modal-close" type="button" onClick={onClose} aria-label="Close challenge">
          <X size={18} />
        </button>
        <span className="eyebrow">{challenge.eyebrow}</span>
        <h2 id="challenge-title">{challenge.title}</h2>
        <p className="modal-prompt">{challenge.prompt}</p>

        {challenge.type === "click" && (
          <button className="action-button action-button-large" type="button" onClick={onClickProgress}>
            {challenge.action}
            <span>{Math.min(clickProgress, challenge.target)} / {challenge.target}</span>
          </button>
        )}

        {challenge.type === "input" && (
          <form className="input-action" onSubmit={(event) => { event.preventDefault(); onSubmitInput(); }}>
            <label className="sr-only" htmlFor="challenge-input">Your answer</label>
            <input
              ref={inputRef}
              id="challenge-input"
              value={inputValue}
              onChange={(event) => onInputChange(event.target.value)}
              placeholder={challenge.placeholder}
              autoComplete="off"
            />
            <button className="action-button" type="submit"><ArrowRight size={17} /> Send</button>
          </form>
        )}

        {challenge.type === "choice" && (
          <div className="choice-list">
            {challenge.options.map((option, index) => (
              <button className="choice-button" key={option} type="button" onClick={() => onChoose(index)}>
                <span>{option}</span>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
        )}

        {challenge.type === "input" && challenge.hint && <p className="modal-hint">{challenge.hint}</p>}
        <p className={`modal-feedback${feedback ? " is-visible" : ""}`} aria-live="polite">
          {feedback ? <><Check size={15} /> {feedback}</> : ""}
        </p>
      </section>
    </div>
  );
}
