import { Star } from "lucide-react";
import type { PointerEvent } from "react";

export function ArchiveSeal({ small = false }: { small?: boolean }) {
  return (
    <div className={`archive-seal${small ? " archive-seal-small" : ""}`} aria-hidden="true">
      <span>19</span>
      <i>SEP</i>
    </div>
  );
}

export function Tape({ className = "" }: { className?: string }) {
  return <span className={`tape ${className}`} aria-hidden="true" />;
}

type PolaroidProps = {
  src: string;
  alt?: string;
  caption: string;
  className?: string;
  number?: string;
  tilt?: boolean;
};

export function Polaroid({ src, alt = "", caption, className = "", number, tilt = false }: PolaroidProps) {
  // Pointer-driven 3D tilt with a soft glare; pure transform + CSS variables, no re-render.
  const onMove = (event: PointerEvent<HTMLElement>) => {
    if (!tilt) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    const el = event.currentTarget;
    el.style.setProperty("--ry", `${((px - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 12).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--ry", "0deg");
    event.currentTarget.style.setProperty("--rx", "0deg");
  };
  return (
    <figure className={`polaroid${tilt ? " is-tiltable" : ""} ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <Tape className="tape-top" />
      <div className="polaroid-photo">
        <img src={src} alt={alt} loading="lazy" />
        {number && <span className="polaroid-number">{number}</span>}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function Waveform() {
  const bars = [14, 26, 42, 22, 31, 16, 47, 25, 37, 20, 30, 14, 39, 24, 17, 32, 21, 13, 28, 18];
  return (
    <div className="waveform" aria-hidden="true">
      {bars.map((height, index) => <span key={`${height}-${index}`} style={{ height }} />)}
    </div>
  );
}

export function HandDrawnStar() {
  return <span className="hand-drawn-star" aria-hidden="true"><Star size={18} strokeWidth={1.6} /></span>;
}
