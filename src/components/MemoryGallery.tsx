const portraits = [
  {
    src: "/memory-assets/portrait-shadow.jpg",
    alt: "Portrait of Sifta in a pink-red hijab with soft dramatic light",
    caption: "a little light",
    className: "portrait-card portrait-card-shadow",
  },
  {
    src: "/memory-assets/portrait-soft-blue.jpg",
    alt: "Portrait of Sifta in a red hijab against a soft blue background",
    caption: "the sky was kind",
    className: "portrait-card portrait-card-blue",
  },
  {
    src: "/memory-assets/portrait-close.jpg",
    alt: "Close portrait of Sifta in a deep red hijab",
    caption: "kept close",
    className: "portrait-card portrait-card-close",
  },
];

export function MemoryGallery() {
  return (
    <section className="memory-gallery" aria-labelledby="memory-gallery-title">
      <img className="gallery-bow gallery-bow-ivory" src="/memory-assets/ivory-bow.png" alt="" aria-hidden="true" />
      <img className="gallery-heart" src="/memory-assets/glitter-heart.png" alt="" aria-hidden="true" />
      <div className="gallery-intro">
        <p className="eyebrow">A few frames for the archive</p>
        <h2 id="memory-gallery-title">A little proof<br /><em>of a bright day.</em></h2>
        <p>Not a grand album. Just a few small frames, placed here with care.</p>
      </div>
      <div className="portrait-grid">
        {portraits.map((portrait, index) => (
          <figure className={portrait.className} key={portrait.src}>
            <div className="portrait-image-wrap">
              <img src={portrait.src} alt={portrait.alt} loading="lazy" />
              <span className="portrait-number">0{index + 1}</span>
            </div>
            <figcaption>{portrait.caption}</figcaption>
          </figure>
        ))}
      </div>
      <p className="gallery-stamp">19 SEPTEMBER / FOR SIFTA</p>
    </section>
  );
}
