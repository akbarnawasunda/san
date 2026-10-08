import { Polaroid } from "./ArchiveArtifacts";

const portraits = [
  {
    src: "/memory-assets/optimized/portrait-shadow.webp",
    alt: "Potret Sifta dengan jilbab merah muda dan cahaya lembut",
    caption: "lagi cerah",
    className: "polaroid-a",
    tilt: true,
  },
  {
    src: "/memory-assets/optimized/portrait-soft-blue.webp",
    alt: "Potret Sifta dengan jilbab merah di latar biru lembut",
    caption: "langitnya lumayan",
    className: "polaroid-b",
    tilt: true,
  },
  {
    src: "/memory-assets/optimized/portrait-close.webp",
    alt: "Potret dekat Sifta dengan jilbab merah tua",
    caption: "yang ini favorit",
    className: "polaroid-c",
    tilt: true,
  },
];

export function MemoryGallery() {
  return (
    <section className="memory-gallery" aria-labelledby="memory-gallery-title">
      <img className="sticker gallery-sticker" src="/memory-assets/optimized/ivory-bow.webp" alt="" aria-hidden="true" />
      <div className="gallery-intro">
        <p className="eyebrow">Beberapa foto</p>
        <h2 id="memory-gallery-title">Yang paling <em>aku simpan.</em></h2>
        <p>Nggak banyak. Cuma beberapa.</p>
      </div>
      <div className="polaroid-row">
        {portraits.map((portrait, index) => (
          <Polaroid key={portrait.src} src={portrait.src} alt={portrait.alt} caption={portrait.caption} className={portrait.className} number={`0${index + 1}`} tilt={portrait.tilt} />
        ))}
      </div>
      <p className="gallery-stamp">19 SEPTEMBER · SIFTA</p>
    </section>
  );
}
