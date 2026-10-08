import { Polaroid } from "./ArchiveArtifacts";

const portraits = [
  {
    src: "/memory-assets/optimized/portrait-shadow.webp",
    alt: "Portrait of Sifta in a pink-red hijab with soft dramatic light",
    caption: "a little light",
    className: "polaroid-a",
  },
  {
    src: "/memory-assets/optimized/portrait-soft-blue.webp",
    alt: "Portrait of Sifta in a red hijab against a soft blue background",
    caption: "the sky was kind",
    className: "polaroid-b",
  },
  {
    src: "/memory-assets/optimized/portrait-close.webp",
    alt: "Close portrait of Sifta in a deep red hijab",
    caption: "kept close",
    className: "polaroid-c",
  },
];

export function MemoryGallery() {
  return (
    <section className="memory-gallery" aria-labelledby="memory-gallery-title">
      <img className="sticker gallery-sticker" src="/memory-assets/optimized/ivory-bow.webp" alt="" aria-hidden="true" />
      <div className="gallery-intro">
        <p className="eyebrow">A few frames for the archive</p>
        <h2 id="memory-gallery-title">A little proof<br /><em>of a bright day.</em></h2>
        <p>Not a grand album. Just a few small frames, placed here with care.</p>
      </div>
      <div className="polaroid-row">
        {portraits.map((portrait, index) => (
          <Polaroid key={portrait.src} src={portrait.src} alt={portrait.alt} caption={portrait.caption} className={portrait.className} number={`0${index + 1}`} />
        ))}
      </div>
      <p className="gallery-stamp">19 SEPTEMBER / FOR SIFTA</p>
    </section>
  );
}
