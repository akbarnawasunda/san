import { Check, Sparkles } from "lucide-react";
import type { Challenge } from "../data/content";

type Props = {
  challenges: Challenge[];
  completed: boolean[];
  onSelect: (index: number) => void;
};

export function ConstellationMap({ challenges, completed, onSelect }: Props) {
  return (
    <div className="constellation-map" aria-label="Constellation challenge map">
      <div className="orbit-line orbit-line-one" />
      <div className="orbit-line orbit-line-two" />
      {challenges.map((challenge, index) => {
        const done = completed[index];
        return (
          <button
            className={`constellation-node node-${index + 1}${done ? " is-done" : ""}`}
            key={challenge.id}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`${challenge.eyebrow}: ${challenge.title}${done ? ", selesai" : ""}`}
          >
            <span className="node-core">{done ? <Check size={15} /> : <Sparkles size={14} />}</span>
            <span className="node-number">{String(index + 1).padStart(2, "0")}</span>
          </button>
        );
      })}
      <div className="constellation-caption">
        <span>THE CONSTELLATION</span>
        <strong>10 small ways to say: you matter.</strong>
      </div>
    </div>
  );
}
