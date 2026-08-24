import { Music2, Paperclip, Star } from "lucide-react";

export function ArchiveSeal({ small = false }: { small?: boolean }) {
  return (
    <div className={`archive-seal${small ? " archive-seal-small" : ""}`} aria-hidden="true">
      <span>19</span>
      <i>SEP</i>
    </div>
  );
}

export function EnvelopeArtifact() {
  return (
    <div className="envelope-art" aria-hidden="true">
      <div className="envelope-back" />
      <div className="envelope-paper">
        <span className="paper-rule" />
        <span className="paper-rule short" />
        <span className="paper-sign">A.</span>
        <ArchiveSeal small />
      </div>
      <div className="envelope-front"><span /></div>
      <div className="artifact-caption"><Paperclip size={14} /> filed under: good intent</div>
      <div className="artifact-pencil">a small note, not a grand gesture</div>
    </div>
  );
}

export function MemoryStrip() {
  return (
    <div className="memory-strip" aria-hidden="true">
      <div className="strip-header"><span>CONTACT / 19 SEP</span><span>NO. 04</span></div>
      <div className="strip-cells">
        <div className="strip-cell strip-cell-one"><span /></div>
        <div className="strip-cell strip-cell-two"><span /><i /></div>
        <div className="strip-cell strip-cell-three"><span /></div>
      </div>
      <div className="strip-footer"><span>some things stay soft</span><Music2 size={13} /></div>
    </div>
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
  return (
    <span className="hand-drawn-star" aria-hidden="true"><Star size={17} strokeWidth={1.2} /></span>
  );
}
