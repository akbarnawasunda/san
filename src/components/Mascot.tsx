import { useMemo } from "react";

export type MascotMood = "idle" | "cheer" | "shy";

type Props = {
  mood?: MascotMood;
  label?: string;
  onPoke?: () => void;
};

// Build a rounded five-point star once (stroke-linejoin round gives soft corners).
function starPath(cx: number, cy: number, outer: number, inner: number) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return `M${points.join(" L")} Z`;
}

const BODY = starPath(50, 54, 38, 22);

const mouths: Record<MascotMood, string> = {
  idle: "M43 60 Q50 67 57 60",
  cheer: "M42 58 Q50 74 58 58 Z",
  shy: "M45 63 Q50 60 55 63",
};

export function Mascot({ mood = "idle", label = "Bintang", onPoke }: Props) {
  const body = useMemo(() => BODY, []);
  const content = (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path className="mascot-body" d={body} />
      <path className="mascot-shine" d="M30 42 Q32 34 40 33" />
      <circle className="mascot-cheek" cx="32" cy="60" r="5" />
      <circle className="mascot-cheek" cx="68" cy="60" r="5" />
      <g className="mascot-eyes">
        <ellipse className="mascot-eye" cx="40" cy="52" rx="3.6" ry="4.6" />
        <ellipse className="mascot-eye" cx="60" cy="52" rx="3.6" ry="4.6" />
      </g>
      <path className="mascot-mouth" d={mouths[mood]} />
      <path className="mascot-sparkle" d="M84 14 L86 20 L92 22 L86 24 L84 30 L82 24 L76 22 L82 20 Z" />
    </svg>
  );

  if (!onPoke) {
    return <span className={`mascot mood-${mood}`} role="img" aria-label={label}>{content}</span>;
  }

  return (
    <button className={`mascot mascot-button mood-${mood}`} type="button" onClick={onPoke} aria-label={`${label}, tekan untuk ngobrol`}>
      {content}
    </button>
  );
}
