import { Check, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import type { Challenge } from "../data/content";

type Props = {
  challenges: Challenge[];
  completed: boolean[];
  onSelect: (index: number) => void;
};

// Hand-placed star positions (percent of the board), loosely shaped like a constellation.
const positions: [number, number][] = [
  [9, 66], [21, 30], [36, 58], [48, 22], [61, 52],
  [74, 26], [88, 60], [28, 84], [56, 82], [82, 86],
];

export function ConstellationMap({ challenges, completed, onSelect }: Props) {
  const line = positions.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <div className="constellation-map" aria-label="Constellation challenge map">
      <svg className="constellation-path" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline points={line} />
      </svg>
      {challenges.map((challenge, index) => {
        const done = completed[index];
        const [x, y] = positions[index];
        return (
          <button
            className={`constellation-node${done ? " is-done" : ""}`}
            key={challenge.id}
            type="button"
            style={{ left: `${x}%`, top: `${y}%`, "--node": index } as CSSProperties}
            onClick={() => onSelect(index)}
            aria-label={`${challenge.eyebrow}: ${challenge.title}${done ? ", selesai" : ""}`}
          >
            <span className="node-core">{done ? <Check size={16} /> : <Sparkles size={15} />}</span>
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
