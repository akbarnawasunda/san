import { useCallback, useEffect, useMemo, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { ArrowDown, ArrowRight, AudioLines, ChevronRight, CircleHelp, Heart, Moon, RotateCcw, Sparkles, Wind } from "lucide-react";
import { ArchiveSeal, HandDrawnStar, Polaroid, Tape, Waveform } from "./components/ArchiveArtifacts";
import { ClickBursts, StickerShower, type ClickBurst } from "./components/CelebrationFX";
import { MemoryGallery } from "./components/MemoryGallery";
import { MomentFX, type MomentEvent, type MomentKind } from "./components/MomentFX";
import { Mascot, type MascotMood } from "./components/Mascot";
import { ChallengeModal } from "./components/ChallengeModal";
import { ConstellationMap } from "./components/ConstellationMap";
import { challenges, BIRTHDAY_DATE, BIRTHDAY_DAY, mascotLines, positiveMessages, secretMemories, successMessages } from "./data/content";
import { useAudio } from "./effects/useAudio";
import { useMicrophoneBlow } from "./effects/useMicrophoneBlow";
import "./styles/app.css";

type Scene = "prologue" | "opening" | "welcome" | "constellation" | "victory" | "surprise" | "message";

const sceneOrder: Scene[] = ["prologue", "opening", "welcome", "constellation", "victory", "surprise", "message"];
const sceneLabels: Record<Scene, string> = {
  prologue: "Sampul",
  opening: "Catatan",
  welcome: "Bab satu",
  constellation: "Rasi bintang",
  victory: "Harapan",
  surprise: "Kejutan",
  message: "Surat",
};

function App() {
  const audio = useAudio();
  const [scene, setScene] = useState<Scene>("prologue");
  const [completed, setCompleted] = useState<boolean[]>(() => challenges.map(() => false));
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [clickProgress, setClickProgress] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [secretIndex, setSecretIndex] = useState(0);
  const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
  const [mascotIndex, setMascotIndex] = useState(0);
  const [positiveIndex, setPositiveIndex] = useState(0);
  const [blown, setBlown] = useState(false);
  const [candleReady, setCandleReady] = useState(false);
  const [toast, setToast] = useState("");
  const [bursts, setBursts] = useState<ClickBurst[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [moment, setMoment] = useState<MomentEvent | null>(null);

  const announce = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }, []);
  const navigateTo = useCallback((nextScene: Scene) => {
    if (transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => setScene(nextScene), 460);
    window.setTimeout(() => setTransitioning(false), 1150);
  }, [transitioning]);

  const prepareCandle = useCallback(() => {
    if (candleReady || blown) return;
    setCandleReady(true);
    audio.play("chime");
    announce("Tarik napas. Pikirkan satu hal baik.");
  }, [announce, audio, blown, candleReady]);

  const blowCandle = useCallback(() => {
    if (blown) return;
    if (!candleReady) {
      prepareCandle();
      return;
    }
    setBlown(true);
    audio.fadeOut("bgm", 720);
    audio.play("airBlow");
    window.setTimeout(() => audio.play("bubble"), 520);
    window.setTimeout(() => {
      audio.play("afterBlow");
      navigateTo("surprise");
    }, 1220);
  }, [audio, blown, candleReady, navigateTo, prepareCandle]);
  const microphone = useMicrophoneBlow(blowCandle);

  const completedCount = completed.filter(Boolean).length;
  const active = activeChallenge === null ? null : challenges[activeChallenge];

  const openOpening = () => {
    audio.play("click");
    audio.play("whoosh");
    navigateTo("opening");
  };

  const openWelcome = () => {
    audio.play("click");
    audio.play("whoosh");
    navigateTo("welcome");
  };

  const startConstellation = () => {
    audio.play("magic");
    if (!audio.musicOn) audio.toggleMusic();
    navigateTo("constellation");
  };

  const selectChallenge = (index: number) => {
    if (completed[index]) {
      announce("Orbit ini sudah menyala.");
      audio.play("click");
      return;
    }
    audio.play("click");
    setActiveChallenge(index);
    setClickProgress(0);
    setInputValue("");
    setFeedback("");
  };

  const completeChallenge = () => {
    if (activeChallenge === null || completed[activeChallenge]) return;
    setCompleted((current) => current.map((value, index) => index === activeChallenge ? true : value));
    flashMascot("cheer", 1600);
    setActiveChallenge(null);
    setClickProgress(0);
    setInputValue("");
    setFeedback("");
    audio.play("success");
    window.setTimeout(() => audio.play("passed"), 160);
    announce(successMessages[Math.floor(Math.random() * successMessages.length)]);
  };

  const submitInput = () => {
    if (!active) return;
    const value = inputValue.trim().toLowerCase();
    if (active.type !== "input") return;
    const isCorrect = active.answers?.some((answer) => value.includes(answer)) ?? false;
    const passes = active.minLength ? value.length >= active.minLength : isCorrect;
    if (passes) completeChallenge();
    else {
      setFeedback("Belum cocok. Coba sekali lagi dengan santai.");
      audio.play("error");
    }
  };

  const chooseOption = (index: number) => {
    if (!active || active.type !== "choice") return;
    if (index === active.correct) completeChallenge();
    else {
      setFeedback("Belum yang ini. Pilih lagi.");
      audio.play("error");
    }
  };

  const progressClick = () => {
    if (!active || active.type !== "click") return;
    const next = clickProgress + 1;
    setClickProgress(next);
    audio.play("click");
    if (next >= active.target) completeChallenge();
  };

  const continueToVictory = () => {
    if (completedCount < challenges.length) {
      announce("Belum semua orbit menyala.");
      audio.play("error");
      return;
    }
    audio.fadeOut("bgm", 420);
    audio.play("victory");
    navigateTo("victory");
  };

  const skipToVictory = () => {
    setCompleted(challenges.map(() => true));
    audio.fadeOut("bgm", 420);
    audio.play("victory");
    navigateTo("victory");
    announce("Jalur cepat terbuka.");
  };

  const reset = () => {
    audio.stop("bgm");
    audio.stop("afterBlow");
    setCompleted(challenges.map(() => false));
    setActiveChallenge(null);
    setClickProgress(0);
    setInputValue("");
    setFeedback("");
    setBlown(false);
    setCandleReady(false);
    navigateTo("prologue");
    announce("Kita kembali ke awal.");
  };

  const revealPositive = () => {
    audio.play("chime");
    setPositiveIndex((index) => (index + 1) % positiveMessages.length);
  };

  const changeSecret = () => {
    audio.play("click");
    setSecretIndex((index) => (index + 1) % secretMemories.length);
  };

  const flashMascot = useCallback((mood: MascotMood, duration: number) => {
    setMascotMood(mood);
    window.setTimeout(() => setMascotMood("idle"), duration);
  }, []);

  const pokeMascot = () => {
    audio.play("bubble");
    flashMascot("shy", 1400);
    setMascotIndex((index) => (index + 1) % mascotLines.length);
    announce(mascotLines[mascotIndex]);
  };

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 7;
    event.currentTarget.style.setProperty("--pointer-x", `${x.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${y.toFixed(2)}%`);
    event.currentTarget.style.setProperty("--pointer-translate-x", `${(x * 1.6).toFixed(2)}px`);
    event.currentTarget.style.setProperty("--pointer-translate-y", `${(y * 1.45).toFixed(2)}px`);
  }, []);
  const resetPointer = useCallback((event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--pointer-x", "0%");
    event.currentTarget.style.setProperty("--pointer-y", "0%");
    event.currentTarget.style.setProperty("--pointer-translate-x", "0px");
    event.currentTarget.style.setProperty("--pointer-translate-y", "0px");
  }, []);
  const handleGlobalClick = useCallback((event: MouseEvent<HTMLElement>) => {
    const target = event.target as Element;
    const interactive = target.closest("button, .constellation-node");
    if (!interactive) return;
    const momentKind: MomentKind = interactive.classList.contains("prologue-button") ? "rain" : interactive.classList.contains("text-link") || interactive.classList.contains("wordmark") ? "paper" : interactive.classList.contains("candle") ? "candle" : interactive.classList.contains("constellation-node") ? "star" : interactive.classList.contains("subtle-button") ? "whisper" : "bloom";
    const pressClass = `press-${momentKind}`;
    interactive.classList.remove("is-pressed", "press-rain", "press-paper", "press-star", "press-candle", "press-whisper", "press-bloom");
    window.requestAnimationFrame(() => interactive.classList.add("is-pressed", pressClass));
    window.setTimeout(() => interactive.classList.remove("is-pressed", pressClass), 780);
    const momentEvent = { id: Date.now() + Math.round(Math.random() * 1000), kind: momentKind };
    setMoment(momentEvent);
    window.setTimeout(() => setMoment((current) => current?.id === momentEvent.id ? null : current), 1320);
    const bounds = event.currentTarget.getBoundingClientRect();
    const burst = { id: Date.now() + Math.round(Math.random() * 1000), x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    setBursts((current) => [...current.slice(-1), burst]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== burst.id)), 1050);
  }, []);
  const sceneClass = useMemo(() => `app-shell scene-${scene}`, [scene]);

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [scene]);

  const sceneIndex = sceneOrder.indexOf(scene);
  const sceneLabel = sceneLabels[scene];

  return (
    <main className={sceneClass} onClick={handleGlobalClick} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <div className="paper-texture" aria-hidden="true" />
      <StickerShower />
      <ClickBursts bursts={bursts} />
      <MomentFX event={moment} />
      <div className={`chapter-transition${transitioning ? " is-active" : ""}`} aria-hidden="true"><span /><span /><span /></div>
      <header className="site-header">
        <button className="wordmark" type="button" onClick={reset} aria-label="Mulai dari awal">
          <span className="wordmark-mark"><Moon size={15} /></span>
          <span>19 / 09</span>
        </button>
        <div className="progress" aria-label={`Bab ${sceneIndex + 1} dari ${sceneOrder.length}: ${sceneLabel}`}>
          <div className="progress-dots" aria-hidden="true">
            {sceneOrder.map((key, index) => <span key={key} className={index <= sceneIndex ? "is-reached" : ""} />)}
          </div>
          <span className="progress-label">{String(sceneIndex + 1).padStart(2, "0")} · {sceneLabel}</span>
        </div>
        <button className={`sound-button${audio.musicOn ? " is-on" : ""}`} type="button" onClick={audio.toggleMusic} aria-label={audio.musicOn ? "Matikan musik" : "Nyalakan musik"}>
          <AudioLines size={16} />
          <span>{audio.musicOn ? "musik menyala" : "musik mati"}</span>
        </button>
      </header>

      <div className="scene-wrap">
        {scene === "prologue" && (
          <section className="prologue-scene scene-content" aria-labelledby="prologue-title">
            <div className="prologue-copy">
              <p className="kicker" data-reveal>19 September · sebuah arsip hujan</p>
              <p className="handwrite" data-reveal style={{ "--d": "1" } as CSSProperties}>sebelum doa-doa baik dimulai</p>
              <h1 id="prologue-title" data-reveal style={{ "--d": "2" } as CSSProperties}>Malam ini, hujan<br /><em>ikut menyimpan</em><br />namamu.</h1>
              <p className="lede" data-reveal style={{ "--d": "3" } as CSSProperties}>Sebuah arsip kecil dibuka pelan-pelan, sementara kota di luar terus jatuh dalam cahaya yang lembut. Tidak ada yang perlu dikejar hari ini.</p>
              <button className="prologue-button" data-reveal style={{ "--d": "4" } as CSSProperties} type="button" onClick={openOpening}>Masuk ke malam ini <ArrowRight size={17} /></button>
              <span className="prologue-hint">sentuh saat hujannya terasa pas</span>
            </div>
            <div className="prologue-art" data-reveal style={{ "--d": "2" } as CSSProperties}>
              <Polaroid className="polaroid-hero" src="/memory-assets/optimized/portrait-shadow.webp" alt="Potret Sifta dengan jilbab merah muda dan cahaya lembut" caption="tetap hangat, meski cuaca tak ramah." number="19 / 09" tilt />
              <img className="sticker sticker-heart-hero" src="/memory-assets/optimized/glitter-heart.webp" alt="" aria-hidden="true" />
            </div>
          </section>
        )}

        {scene === "opening" && (
          <section className="opening-scene scene-content" aria-labelledby="opening-title">
            <div className="opening-copy">
              <p className="eyebrow" data-reveal>Catatan 001</p>
              <h1 id="opening-title" data-reveal style={{ "--d": "1" } as CSSProperties}>Ada hari yang pantas punya <em>langitnya sendiri.</em></h1>
              <p className="lede" data-reveal style={{ "--d": "2" } as CSSProperties}>Kumpulan harapan baik, dibuat untuk satu orang yang cahayanya selalu terasa hangat, dan untuk tanggal yang selalu membawa kabar baik setiap tahunnya.</p>
              <div className="opening-meta" data-reveal style={{ "--d": "3" } as CSSProperties}><span>19 September 2005</span><span className="meta-dot" /><span>dengan niat baik</span></div>
              <button className="text-link" data-reveal style={{ "--d": "4" } as CSSProperties} type="button" onClick={openWelcome}>Buka catatannya <ArrowRight size={17} /></button>
            </div>
            <div className="opening-stack" aria-hidden="true" data-reveal style={{ "--d": "2" } as CSSProperties}>
              <div className="note-paper">
                <Tape className="tape-top" />
                <p className="handwrite">Untuk Sifta,</p>
                <p className="handwrite small">semoga hari ini manis, pelan, dan penuh hal-hal kecil yang bikin kamu tersenyum.</p>
                <span className="handwrite sign">— A.</span>
              </div>
              <Polaroid className="polaroid-back" src="/memory-assets/optimized/portrait-wood.webp" caption="disimpan untuk hari ini" tilt />
              <img className="sticker sticker-stripe" src="/memory-assets/optimized/striped-heart.webp" alt="" />
            </div>
            <div className="scroll-cue"><ArrowDown size={15} /><span>pelan-pelan saja</span></div>
          </section>
        )}

        {scene === "welcome" && (
          <section className="welcome-scene scene-content" aria-labelledby="welcome-title">
            <div className="section-kicker" data-reveal><span>Bab satu</span><span>19.09</span></div>
            <div className="welcome-grid">
              <div>
                <p className="eyebrow" data-reveal>Malam ini langitnya sepenuhnya milikmu</p>
                <h1 id="welcome-title" data-reveal style={{ "--d": "1" } as CSSProperties}>Untuk <em>Sifta</em>,<br />dengan sedikit cahaya.</h1>
              </div>
              <div className="paper-card welcome-note" data-reveal style={{ "--d": "2" } as CSSProperties}>
                <Tape className="tape-top" />
                <p>Ada orang yang kehadirannya tidak perlu dijelaskan panjang. Kamu salah satunya, dan hari ini layak mendapat ruang yang lebih lapang.</p>
                <p>Sepuluh orbit kecil. Satu harapan utama. Tidak ada tekanan, tidak ada tenggat; hanya ucapan, tawa kecil, dan doa yang dikirim tanpa pamrih.</p>
                <div className="welcome-actions">
                  <button className="action-button" type="button" onClick={startConstellation}>Masuki rasi bintang <ArrowRight size={16} /></button>
                  <button className="subtle-button" type="button" onClick={() => announce(secretMemories[secretIndex])}><CircleHelp size={15} /> catatan rahasia</button>
                </div>
              </div>
            </div>
            <div className="welcome-scrap" data-reveal>
              <div className="washi">19.09 · simpan ini</div>
              <div className="hand-note"><HandDrawnStar /><span className="handwrite">ada hal yang layak<br />selalu disimpan.</span></div>
              <Waveform />
              <img className="sticker sticker-bow" src="/memory-assets/optimized/gingham-bow.webp" alt="" aria-hidden="true" />
            </div>
            <div className="welcome-footer"><span>dibuat oleh Akbar</span><span>tanpa tekanan, hanya doa baik</span></div>
          </section>
        )}

        {scene === "constellation" && (
          <section className="constellation-scene scene-content" aria-labelledby="constellation-title">
            <div className="section-kicker" data-reveal><span>Bab dua · {String(completedCount).padStart(2, "0")} dari 10 orbit menyala</span><span>{BIRTHDAY_DAY}</span></div>
            <div className="constellation-heading" data-reveal>
              <div>
                <p className="eyebrow">Permainan kecil yang pelan</p>
                <h1 id="constellation-title">Biarkan langit<br /><em>membentuk dirinya.</em></h1>
              </div>
              <p>Sentuh satu orbit, jawab saat kamu siap, dan biarkan malam pelan-pelan berubah menjadi pesan.</p>
            </div>
            <div data-reveal style={{ "--d": "1" } as CSSProperties}>
              <ConstellationMap challenges={challenges} completed={completed} onSelect={selectChallenge} />
            </div>
            <div className="constellation-actions" data-reveal>
              <button className="action-button" type="button" onClick={continueToVictory} disabled={completedCount < challenges.length}>Lanjut <ChevronRight size={16} /></button>
              <button className="subtle-button" type="button" onClick={skipToVictory}>Lewati orbit <ArrowRight size={15} /></button>
            </div>
          </section>
        )}

        {scene === "victory" && (
          <section className="victory-scene scene-content" aria-labelledby="victory-title">
            <p className="kicker" data-reveal><Sparkles size={14} /> Bab tiga · sebuah harapan</p>
            <h1 id="victory-title" data-reveal style={{ "--d": "1" } as CSSProperties}>Kamu sampai<br /><em>di bagian yang tenang.</em></h1>
            <p className="lede" data-reveal style={{ "--d": "2" } as CSSProperties}>{candleReady ? "Tahan harapanmu sebentar, lalu lepaskan cahayanya perlahan." : "Sebelum kejutan, buat satu harapan yang hanya milikmu."}</p>
            <div className={`cake-stage${blown ? " is-blown" : ""}${candleReady ? " is-prepared" : ""}`} data-reveal style={{ "--d": "2" } as CSSProperties}>
              <div className="cake-glow" /><div className="candle-halo" /><div className="cake-plate" />
              <div className="cake"><div className="cake-top"><span>19</span><i>SEP</i></div><div className="cake-body"><b /><b /><b /></div><div className="cake-base" /></div>
              <button className="candle" type="button" onClick={blowCandle} aria-label={candleReady ? "Tiup lilinnya" : "Siapkan harapan"}><span className="flame" /><span className="candle-glint" /><span className="candle-stick" /></button>
            </div>
            <p className="wish-instruction" aria-live="polite">{blown ? "Harapannya sudah sampai." : candleReady ? "Sekarang, pelan-pelan." : "Buat harapanmu dulu."}</p>
            <button className="action-button action-button-large" type="button" onClick={candleReady ? blowCandle : prepareCandle} data-reveal>{blown ? <><Wind size={17} /> Cahayanya sudah padam</> : candleReady ? <><Wind size={17} /> Tiup lilinnya</> : <><Sparkles size={17} /> Buat harapan</>}</button>
            {microphone.supported && <button className="subtle-button mic-button" type="button" data-reveal onClick={async () => { if (!candleReady) { prepareCandle(); announce("Mic siap setelah harapanmu dibuat."); return; } const ok = await microphone.start(); announce(ok ? "Mic aktif. Tiup pelan ke ponselmu." : "Mic belum tersedia. Pakai tombol saja."); }}>{microphone.active ? <><AudioLines size={15} /> Mic mendengarkan…</> : <><Wind size={15} /> Atau tiup lewat mikrofon</>}</button>}
            <p className="microcopy" data-reveal>{BIRTHDAY_DATE} · satu tahun lebih lembut, satu tahun lebih terang.</p>
          </section>
        )}

        {scene === "surprise" && (
          <section className="surprise-scene scene-content" aria-labelledby="surprise-title">
            <div className="surprise-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--n": index } as CSSProperties} />)}</div>
            <div className="surprise-seal" data-reveal><ArchiveSeal /><span>HARAPANMU<br />SUDAH TERKIRIM</span></div>
            <p className="eyebrow" data-reveal style={{ "--d": "1" } as CSSProperties}>Kejutan kecil · disimpan dengan tenang</p>
            <h1 id="surprise-title" data-reveal style={{ "--d": "2" } as CSSProperties}>Lilinnya padam.<br /><em>Tapi bagian baiknya tetap tinggal.</em></h1>
            <p className="lede" data-reveal style={{ "--d": "3" } as CSSProperties}>Tidak ada foto besar, tidak ada penjelasan panjang. Hanya satu harapan kecil yang dikirim dengan hati-hati ke langit malam.</p>
            <div className="surprise-ticket" data-reveal style={{ "--d": "4" } as CSSProperties}><span>19 SEP</span><strong>SELAMAT<br />ULANG TAHUN</strong><small>untuk Sifta · dengan niat baik</small></div>
            <button className="action-button action-button-large" type="button" data-reveal onClick={() => { audio.play("magicWish"); navigateTo("message"); }}><Heart size={17} /> Buka catatannya</button>
            <p className="microcopy">tunggu sebentar sampai hening.</p>
          </section>
        )}

        {scene === "message" && (
          <section className="message-scene scene-content" aria-labelledby="message-title">
            <div className="message-layout">
              <div className="message-index" data-reveal>Catatan<br /><strong>004</strong></div>
              <div className="paper-card message-card" data-reveal style={{ "--d": "1" } as CSSProperties}>
                <Tape className="tape-top" />
                <p className="eyebrow">Dari Akbar · dengan niat baik</p>
                <h1 id="message-title">Selamat ulang tahun,<br /><em>Sifta.</em></h1>
                <div className="message-copy">
                  <p className="reveal-line" style={{ "--d": "0" } as CSSProperties}>Hari ini kamu bertambah satu tahun, dan aku ingin kamu tahu bahwa hari ini pantas dirayakan pelan-pelan. Bukan karena kamu harus hebat, tapi karena kamu sudah sejauh ini dengan caramu sendiri.</p>
                  <p className="reveal-line" style={{ "--d": "1" } as CSSProperties}>Semoga di bab baru ini, impianmu menemukan jalannya, pelan tapi pasti. Semoga kamu dikelilingi orang-orang yang tulus, diberi ruang untuk tumbuh, dan tetap bisa menemukan hal-hal kecil yang membuatmu tersenyum.</p>
                  <p className="reveal-line" style={{ "--d": "2" } as CSSProperties}>Cerita kita sudah berada di bab yang berbeda, dan itu tidak apa-apa. Ada hal yang selesai dengan baik, dan doa baik tetap boleh dikirim ke langit, tanpa perlu dibalas.</p>
                  <p className="signature reveal-line" style={{ "--d": "3" } as CSSProperties}>— Akbar</p>
                </div>
                <div className="message-actions">
                  <button className="action-button" type="button" onClick={revealPositive}><Heart size={16} /> kirim satu pikiran baik</button>
                  <button className="subtle-button" type="button" onClick={reset}><RotateCcw size={15} /> ulangi dari awal</button>
                </div>
                <div className="positive-message" aria-live="polite" key={positiveIndex}>{positiveMessages[positiveIndex]}</div>
              </div>
            </div>
            <div className="message-footer" data-reveal><span>19 / 09 / 2005</span><span><HandDrawnStar /> beberapa ucapan tidak pernah perlu dibalas</span></div>
            <MemoryGallery />
          </section>
        )}
      </div>

      <Mascot mood={mascotMood} onPoke={pokeMascot} />
      <footer className="site-footer"><span>AKBAR · CATATAN PRIBADI</span><span>dibuat pelan-pelan untuk hari yang cerah</span></footer>
      {toast && <div className="toast" role="status">{toast}</div>}
      <ChallengeModal challenge={active} clickProgress={clickProgress} inputValue={inputValue} feedback={feedback} onInputChange={setInputValue} onClickProgress={progressClick} onSubmitInput={submitInput} onChoose={chooseOption} onClose={() => setActiveChallenge(null)} />
    </main>
  );
}

export default App;
