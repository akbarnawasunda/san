import { Star } from "lucide-react";

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
};

export function Polaroid({ src, alt = "", caption, className = "", number }: PolaroidProps) {
  return (
    <figure className={`polaroid ${className}`}>
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
