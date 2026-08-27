type SceneKey = "prologue" | "opening" | "welcome" | "constellation" | "victory" | "surprise" | "message";

type ArchiveChromeProps = {
  scene: SceneKey;
  completedCount: number;
};

const sceneDetails: Record<SceneKey, { index: string; label: string; caption: string }> = {
  prologue: { index: "00", label: "ENTRY / RAIN", caption: "open slowly" },
  opening: { index: "01", label: "ARCHIVE / NOTE", caption: "a page kept warm" },
  welcome: { index: "02", label: "FIRST LIGHT", caption: "for one bright person" },
  constellation: { index: "03", label: "ORBIT / PLAY", caption: "keep the sky close" },
  victory: { index: "04", label: "MAKE A WISH", caption: "hold it quietly" },
  surprise: { index: "05", label: "THE GOOD PART", caption: "sent into the night" },
  message: { index: "06", label: "AFTERGLOW / NOTE", caption: "kept with care" },
};

export function ArchiveChrome({ scene, completedCount }: ArchiveChromeProps) {
  const detail = sceneDetails[scene];
  return (
    <aside className={`archive-chrome archive-chrome-${scene}`} aria-hidden="true">
      <div className="archive-chrome-left"><span className="chrome-index">{detail.index}</span><i /><span>{detail.label}</span></div>
      <div className="archive-chrome-right"><span>{scene === "constellation" ? `${String(completedCount).padStart(2, "0")} / 10 LIT` : detail.caption}</span><i /><span>19.09</span></div>
      <div className="archive-orbit-meter">{Array.from({ length: 7 }, (_, index) => <b className={index <= Number(detail.index) ? "is-active" : ""} key={index} />)}</div>
    </aside>
  );
}
