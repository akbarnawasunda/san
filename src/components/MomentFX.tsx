export type MomentKind = "rain" | "paper" | "star" | "candle" | "whisper" | "bloom";

export type MomentEvent = {
  id: number;
  kind: MomentKind;
};

const particleCounts: Record<MomentKind, number> = {
  rain: 7,
  paper: 5,
  star: 6,
  candle: 5,
  whisper: 4,
  bloom: 6,
};

export function MomentFX({ event }: { event: MomentEvent | null }) {
  if (!event) return null;
  const count = particleCounts[event.kind];

  return (
    <div className={`moment-fx moment-fx-${event.kind}`} key={event.id} aria-hidden="true">
      <span className="moment-core" />
      {Array.from({ length: count }, (_, index) => <i key={index} style={{ "--moment-index": index, "--moment-angle": `${(360 / count) * index}deg`, "--moment-delay": `${index * 24}ms` } as React.CSSProperties} />)}
    </div>
  );
}
