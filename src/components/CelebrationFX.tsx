import { useMemo, type CSSProperties } from "react";

export type ClickBurst = {
  id: number;
  x: number;
  y: number;
};

const stickerAssets = [
  "/memory-assets/glitter-heart.png",
  "/memory-assets/striped-heart.png",
  "/memory-assets/gingham-bow.png",
  "/memory-assets/ivory-bow.png",
];

export function StickerShower() {
  const stickers = useMemo(() => Array.from({ length: 30 }, (_, index) => {
    const size = 42 + ((index * 19) % 58);
    return {
      id: index,
      src: stickerAssets[index % stickerAssets.length],
      x: ((index * 43) % 106) - 3,
      size,
      delay: `-${((index * 0.79) % 9.5).toFixed(2)}s`,
      duration: `${(11 + ((index * 1.37) % 7)).toFixed(2)}s`,
      drift: `${((index % 2 === 0 ? 1 : -1) * (22 + ((index * 7) % 28))).toFixed(0)}px`,
      rotate: `${((index * 37) % 50) - 25}deg`,
    };
  }), []);

  return (
    <div className="sticker-shower" aria-hidden="true">
      {stickers.map((sticker) => (
        <img
          className="shower-sticker"
          key={sticker.id}
          src={sticker.src}
          alt=""
          style={{
            "--sticker-x": `${sticker.x}%`,
            "--sticker-size": `${sticker.size}px`,
            "--sticker-delay": sticker.delay,
            "--sticker-duration": sticker.duration,
            "--sticker-drift": sticker.drift,
            "--sticker-rotate": sticker.rotate,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

export function ClickBursts({ bursts }: { bursts: ClickBurst[] }) {
  return (
    <div className="click-bursts" aria-hidden="true">
      {bursts.map((burst) => (
        <span className="click-burst" key={burst.id} style={{ "--burst-x": `${burst.x}px`, "--burst-y": `${burst.y}px` } as CSSProperties}>
          {Array.from({ length: 8 }, (_, index) => <i key={index} style={{ "--burst-angle": `${index * 45}deg`, "--burst-distance": `${25 + (index % 3) * 8}px` } as CSSProperties} />)}
          <b />
        </span>
      ))}
    </div>
  );
}
