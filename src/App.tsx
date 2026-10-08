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
  welcome: "Bagian 1",
  constellation: "Bintang",
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
    announce("Tarik napas. Pikirin satu hal baik.");
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
      announce("Yang ini udah nyala.");
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
      setFeedback("Belum tepat, coba lagi.");
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
      announce("Belum semua bintang nyala.");
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
    announce("Oke, langsung ke akhir.");
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
    announce("Balik ke awal.");
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
        <button className="wordmark" type="button" onClick={reset} aria-label="Balik ke awal">
          <span className="wordmark-mark"><Moon size={15} /></span>
          <span>19 / 09</span>
        </button>
        <div className="progress" aria-label={`Bagian ${sceneIndex + 1} dari ${sceneOrder.length}: ${sceneLabel}`}>
          <div className="progress-dots" aria-hidden="true">
            {sceneOrder.map((key, index) => <span key={key} className={index <= sceneIndex ? "is-reached" : ""} />)}
          </div>
          <span className="progress-label">{String(sceneIndex + 1).padStart(2, "0")} · {sceneLabel}</span>
        </div>
        <button className={`sound-button${audio.musicOn ? " is-on" : ""}`} type="button" onClick={audio.toggleMusic} aria-label={audio.musicOn ? "Matikan musik" : "Nyalakan musik"}>
          <AudioLines size={16} />
          <span>{audio.musicOn ? "musik nyala" : "musik mati"}</span>
        </button>
      </header>

      <div className="scene-wrap">
        {scene === "prologue" && (
          <section className="prologue-scene scene-content" aria-labelledby="prologue-title">
            <div className="prologue-copy">
              <p className="kicker" data-reveal>19 September</p>
              <h1 id="prologue-title" data-reveal style={{ "--d": "1" } as CSSProperties}>Selamat ulang tahun, <em>Sifta.</em></h1>
              <p className="lede" data-reveal style={{ "--d": "2" } as CSSProperties}>Aku bikin ini kecil-kecilan. Nggak banyak, cuma beberapa hal yang pengen aku bilang.</p>
              <button className="prologue-button" data-reveal style={{ "--d": "3" } as CSSProperties} type="button" onClick={openOpening}>Lanjut <ArrowRight size={17} /></button>
              <span className="prologue-hint">santai aja</span>
            </div>
            <div className="prologue-art" data-reveal style={{ "--d": "2" } as CSSProperties}>
              <Polaroid className="polaroid-hero" src="/memory-assets/optimized/portrait-shadow.webp" alt="Potret Sifta dengan jilbab merah muda dan cahaya lembut" caption="kamu, di hari yang bagus" number="19 / 09" tilt />
              <img className="sticker sticker-heart-hero" src="/memory-assets/optimized/glitter-heart.webp" alt="" aria-hidden="true" />
            </div>
          </section>
        )}

        {scene === "opening" && (
          <section className="opening-scene scene-content" aria-labelledby="opening-title">
            <div className="opening-copy">
              <p className="eyebrow" data-reveal>Catatan 1</p>
              <h1 id="opening-title" data-reveal style={{ "--d": "1" } as CSSProperties}>Buat kamu, <em>dari aku.</em></h1>
              <p className="lede" data-reveal style={{ "--d": "2" } as CSSProperties}>Isinya nggak panjang. Aku cuma pengen hari ini kamu ngerasa diingat.</p>
              <div className="opening-meta" data-reveal style={{ "--d": "3" } as CSSProperties}><span>19 September 2005</span><span className="meta-dot" /><span>tanpa maksud lain</span></div>
              <button className="text-link" data-reveal style={{ "--d": "4" } as CSSProperties} type="button" onClick={openWelcome}>Buka <ArrowRight size={17} /></button>
            </div>
            <div className="opening-stack" aria-hidden="true" data-reveal style={{ "--d": "2" } as CSSProperties}>
              <div className="note-paper">
                <Tape className="tape-top" />
                <p className="handwrite">Sifta,</p>
                <p className="handwrite small">selamat ulang tahun. Semoga hari ini nggak ribet.</p>
                <span className="handwrite sign">Akbar</span>
              </div>
              <Polaroid className="polaroid-back" src="/memory-assets/optimized/portrait-wood.webp" caption="buat hari ini" tilt />
              <img className="sticker sticker-stripe" src="/memory-assets/optimized/striped-heart.webp" alt="" />
            </div>
            <div className="scroll-cue"><ArrowDown size={15} /><span>scroll aja</span></div>
          </section>
        )}

        {scene === "welcome" && (
          <section className="welcome-scene scene-content" aria-labelledby="welcome-title">
            <div className="section-kicker" data-reveal><span>Bagian 1</span><span>19.09</span></div>
            <div className="welcome-grid">
              <div>
                <p className="eyebrow" data-reveal>Ini bagian yang santai</p>
                <h1 id="welcome-title" data-reveal style={{ "--d": "1" } as CSSProperties}>Untuk <em>Sifta.</em></h1>
              </div>
              <div className="paper-card welcome-note" data-reveal style={{ "--d": "2" } as CSSProperties}>
                <Tape className="tape-top" />
                <p>Aku siapin sedikit. Ada 10 bagian kecil, nggak ada yang susah.</p>
                <p>Nggak ada nilai atau target. Kamu bisa berhenti kapan aja.</p>
                <div className="welcome-actions">
                  <button className="action-button" type="button" onClick={startConstellation}>Mulai <ArrowRight size={16} /></button>
                  <button className="subtle-button" type="button" onClick={() => announce(secretMemories[secretIndex])}><CircleHelp size={15} /> ada satu lagi</button>
                </div>
              </div>
            </div>
            <div className="welcome-scrap" data-reveal>
              <div className="washi">19.09</div>
              <div className="hand-note"><HandDrawnStar /><span className="handwrite">sebagian hal memang<br />enak disimpan.</span></div>
              <Waveform />
              <img className="sticker sticker-bow" src="/memory-assets/optimized/gingham-bow.webp" alt="" aria-hidden="true" />
            </div>
            <div className="welcome-footer"><span>dibuat sama Akbar</span><span>nggak ada tekanan</span></div>
          </section>
        )}

        {scene === "constellation" && (
          <section className="constellation-scene scene-content" aria-labelledby="constellation-title">
            <div className="section-kicker" data-reveal><span>Bagian 2 · {String(completedCount).padStart(2, "0")} dari 10</span><span>{BIRTHDAY_DAY}</span></div>
            <div className="constellation-heading" data-reveal>
              <div>
                <p className="eyebrow">Mainan kecil</p>
                <h1 id="constellation-title">Pilih <em>satu-satu.</em></h1>
              </div>
              <p>Tap bintangnya, jawab kalau udah siap. Nggak perlu buru-buru.</p>
            </div>
            <div data-reveal style={{ "--d": "1" } as CSSProperties}>
              <ConstellationMap challenges={challenges} completed={completed} onSelect={selectChallenge} />
            </div>
            <div className="constellation-actions" data-reveal>
              <button className="action-button" type="button" onClick={continueToVictory} disabled={completedCount < challenges.length}>Lanjut <ChevronRight size={16} /></button>
              <button className="subtle-button" type="button" onClick={skipToVictory}>Lewati <ArrowRight size={15} /></button>
            </div>
          </section>
        )}

        {scene === "victory" && (
          <section className="victory-scene scene-content" aria-labelledby="victory-title">
            <p className="kicker" data-reveal>Bagian 3</p>
            <h1 id="victory-title" data-reveal style={{ "--d": "1" } as CSSProperties}>Sekarang <em>bikin harapan.</em></h1>
            <p className="lede" data-reveal style={{ "--d": "2" } as CSSProperties}>{candleReady ? "Tahan sebentar, terus tiup." : "Satu harapan aja, yang kamu simpan buat diri sendiri."}</p>
            <div className={`cake-stage${blown ? " is-blown" : ""}${candleReady ? " is-prepared" : ""}`} data-reveal style={{ "--d": "2" } as CSSProperties}>
              <div className="cake-glow" /><div className="candle-halo" /><div className="cake-plate" />
              <div className="cake"><div className="cake-top"><span>19</span><i>SEP</i></div><div className="cake-body"><b /><b /><b /></div><div className="cake-base" /></div>
              <button className="candle" type="button" onClick={blowCandle} aria-label={candleReady ? "Tiup lilinnya" : "Siapkan harapan"}><span className="flame" /><span className="candle-glint" /><span className="candle-stick" /></button>
            </div>
            <p className="wish-instruction" aria-live="polite">{blown ? "Udah ditiup." : candleReady ? "Tiup pelan." : "Buat harapan dulu."}</p>
            <button className="action-button action-button-large" type="button" onClick={candleReady ? blowCandle : prepareCandle} data-reveal>{blown ? <><Wind size={17} /> Udah ditiup</> : candleReady ? <><Wind size={17} /> Tiup</> : <><Sparkles size={17} /> Buat harapan</>}</button>
            {microphone.supported && <button className="subtle-button mic-button" type="button" data-reveal onClick={async () => { if (!candleReady) { prepareCandle(); announce("Mic bisa dipakai setelah harapannya dibuat."); return; } const ok = await microphone.start(); announce(ok ? "Mic aktif, tiup pelan ya." : "Mic nggak bisa dipakai, pakai tombol aja."); }}>{microphone.active ? <><AudioLines size={15} /> Mic lagi dengerin…</> : <><Wind size={15} /> Tiup pakai mic</>}</button>}
            <p className="microcopy" data-reveal>{BIRTHDAY_DATE}</p>
          </section>
        )}

        {scene === "surprise" && (
          <section className="surprise-scene scene-content" aria-labelledby="surprise-title">
            <div className="surprise-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--n": index } as CSSProperties} />)}</div>
            <div className="surprise-seal" data-reveal><ArchiveSeal /><span>HARAPANNYA<br />UDAH KEKIRIM</span></div>
            <p className="eyebrow" data-reveal style={{ "--d": "1" } as CSSProperties}>Ada satu lagi</p>
            <h1 id="surprise-title" data-reveal style={{ "--d": "2" } as CSSProperties}>Lilinnya mati. <em>Harapannya aman.</em></h1>
            <p className="lede" data-reveal style={{ "--d": "3" } as CSSProperties}>Nggak ada kejutan yang heboh. Cuma satu hal kecil yang aku siapin buat kamu.</p>
            <div className="surprise-ticket" data-reveal style={{ "--d": "4" } as CSSProperties}><span>19 SEP</span><strong>SELAMAT<br />ULANG TAHUN</strong><small>untuk Sifta</small></div>
            <button className="action-button action-button-large" type="button" data-reveal onClick={() => { audio.play("magicWish"); navigateTo("message"); }}><Heart size={17} /> Buka</button>
            <p className="microcopy">santai, nggak buru-buru.</p>
          </section>
        )}

        {scene === "message" && (
          <section className="message-scene scene-content" aria-labelledby="message-title">
            <div className="message-layout">
              <div className="message-index" data-reveal>Surat<br /><strong>004</strong></div>
              <div className="paper-card message-card" data-reveal style={{ "--d": "1" } as CSSProperties}>
                <Tape className="tape-top" />
                <p className="eyebrow">Dari Akbar</p>
                <h1 id="message-title">Selamat ulang tahun, <em>Sifta.</em></h1>
                <div className="message-copy">
                  <p className="reveal-line" style={{ "--d": "0" } as CSSProperties}>Aku nggak pinter bikin kata-kata bagus, jadi aku tulis yang jujur aja. Kamu udah banyak berjuang, dan aku harap kamu tahu itu.</p>
                  <p className="reveal-line" style={{ "--d": "1" } as CSSProperties}>Semoga tahun ini kamu dapet hal-hal yang kamu kejar, orang-orang yang baik sama kamu, dan waktu buat istirahat. Kalau bisa, yang bikin kamu ketawa lepas juga.</p>
                  <p className="reveal-line" style={{ "--d": "2" } as CSSProperties}>Sekarang kita udah jalan di cerita yang beda. Nggak apa-apa. Aku tetap pengen kamu baik-baik aja.</p>
                  <p className="signature reveal-line" style={{ "--d": "3" } as CSSProperties}>Akbar</p>
                </div>
                <div className="message-actions">
                  <button className="action-button" type="button" onClick={revealPositive}><Heart size={16} /> kirim satu harapan</button>
                  <button className="subtle-button" type="button" onClick={reset}><RotateCcw size={15} /> ulang dari awal</button>
                </div>
                <div className="positive-message" aria-live="polite" key={positiveIndex}>{positiveMessages[positiveIndex]}</div>
              </div>
            </div>
            <div className="message-footer" data-reveal><span>19 / 09 / 2005</span><span><HandDrawnStar /> nggak perlu dibales</span></div>
            <MemoryGallery />
          </section>
        )}
      </div>

      <Mascot mood={mascotMood} onPoke={pokeMascot} />
      <footer className="site-footer"><span>Akbar</span><span>dibuat buat kamu</span></footer>
      {toast && <div className="toast" role="status">{toast}</div>}
      <ChallengeModal challenge={active} clickProgress={clickProgress} inputValue={inputValue} feedback={feedback} onInputChange={setInputValue} onClickProgress={progressClick} onSubmitInput={submitInput} onChoose={chooseOption} onClose={() => setActiveChallenge(null)} />
    </main>
  );
}

export default App;
