import { useCallback, useMemo, useState, type MouseEvent, type PointerEvent } from "react";
import { ArrowDown, ArrowRight, AudioLines, ChevronRight, CircleHelp, Heart, Moon, RotateCcw, Sparkles, Wind } from "lucide-react";
import { ArchiveSeal, EnvelopeArtifact, HandDrawnStar, MemoryStrip, Waveform } from "./components/ArchiveArtifacts";
import { ArchiveChrome } from "./components/ArchiveChrome";
import { ClickBursts, StickerShower, type ClickBurst } from "./components/CelebrationFX";
import { MemoryGallery } from "./components/MemoryGallery";
import { MomentFX, type MomentEvent, type MomentKind } from "./components/MomentFX";
import { ChallengeModal } from "./components/ChallengeModal";
import { ConstellationMap } from "./components/ConstellationMap";
import { challenges, BIRTHDAY_DATE, BIRTHDAY_DAY, positiveMessages, secretMemories, successMessages } from "./data/content";
import { useAudio } from "./effects/useAudio";
import { useMicrophoneBlow } from "./effects/useMicrophoneBlow";
import { useStarfield } from "./effects/useStarfield";
import "./styles/app.css";

type Scene = "prologue" | "opening" | "welcome" | "constellation" | "victory" | "surprise" | "message";

function App() {
  const starfieldRef = useStarfield();
  const audio = useAudio();
  const [scene, setScene] = useState<Scene>("prologue");
  const [completed, setCompleted] = useState<boolean[]>(() => challenges.map(() => false));
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [clickProgress, setClickProgress] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [secretIndex, setSecretIndex] = useState(0);
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
    audio.stop("fire");
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
    setBursts((current) => [...current.slice(-2), burst]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== burst.id)), 1050);
  }, []);
  const sceneClass = useMemo(() => `app-shell scene-${scene}`, [scene]);

  return (
    <main className={sceneClass} onClick={handleGlobalClick} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <canvas ref={starfieldRef} className="starfield" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="rain-layer" aria-hidden="true">{Array.from({ length: 26 }, (_, index) => <i key={index} style={{ "--i": index, "--x": `${(index * 37) % 101}%`, "--delay": `${(index % 11) * -0.41}s`, "--duration": `${1.4 + (index % 7) * 0.18}s` } as React.CSSProperties} />)}</div>
      <StickerShower />
      <ClickBursts bursts={bursts} />
      <MomentFX event={moment} />
      <div className={`chapter-transition${transitioning ? " is-active" : ""}`} aria-hidden="true"><span /><span /><span /></div>
      <ArchiveChrome scene={scene} completedCount={completedCount} />
      <header className="site-header">
        <button className="wordmark" type="button" onClick={reset} aria-label="Restart experience">
          <span className="wordmark-mark"><Moon size={16} /></span>
          <span>19 / 09</span>
        </button>
        <div className="header-status"><span className="status-dot" /> A SMALL CONSTELLATION</div>
        <button className={`sound-button${audio.musicOn ? " is-on" : ""}`} type="button" onClick={audio.toggleMusic} aria-label={audio.musicOn ? "Turn music off" : "Turn music on"}>
          <AudioLines size={16} />
          <span>{audio.musicOn ? "sound on" : "sound off"}</span>
        </button>
      </header>

      <div className="scene-wrap">
        {scene === "prologue" && (
          <section className="prologue-scene scene-content" aria-labelledby="prologue-title">
            <div className="prologue-copy">
              <p className="prologue-kicker">19 SEPTEMBER / A RAINY ARCHIVE</p>
              <p className="eyebrow">Before the good wishes begin</p>
              <h1 id="prologue-title">Tonight,<br /><em>the rain kept</em><br />your name.</h1>
              <p className="lede">A small birthday archive opened quietly, while the city outside kept falling into soft light.</p>
              <button className="prologue-button" type="button" onClick={openOpening}>Step into the night <ArrowRight size={17} /></button>
              <span className="prologue-hint">tap when the rain feels right</span>
            </div>
            <figure className="prologue-portrait">
              <div className="prologue-photo-frame"><img src="/memory-assets/portrait-shadow.jpg" alt="Portrait of Sifta in a pink-red hijab with soft dramatic light" /><span>19 / 09</span></div>
              <figcaption>kept warm,<br />despite the weather.</figcaption>
              <img className="prologue-heart" src="/memory-assets/glitter-heart.png" alt="" aria-hidden="true" />
            </figure>
            <div className="prologue-ripple prologue-ripple-one" aria-hidden="true" /><div className="prologue-ripple prologue-ripple-two" aria-hidden="true" />
          </section>
        )}
        {scene === "opening" && (
          <section className="opening-scene scene-content" aria-labelledby="opening-title">
            <div className="opening-index">A NOTE / 001</div>
            <EnvelopeArtifact />
            <div className="opening-photo-note" aria-hidden="true">
              <img className="opening-portrait" src="/memory-assets/portrait-wood.jpg" alt="" />
              <img className="opening-heart-sticker" src="/memory-assets/striped-heart.png" alt="" />
              <span>kept for<br />the day</span>
            </div>
            <div className="opening-copy">
              <p className="eyebrow">For a day worth remembering</p>
              <h1 id="opening-title">Some days deserve<br /><em>their own sky.</em></h1>
              <p className="lede">A small constellation of good wishes, made for one bright person and the date that belongs to her.</p>
              <div className="opening-meta"><span>19 September 2005</span><span className="meta-line" /><span>with good intent</span></div>
              <button className="text-link" type="button" onClick={openWelcome}>Open the note <ArrowRight size={17} /></button>
            </div>
            <div className="opening-aside"><span>scroll slowly</span><ArrowDown size={16} /><small>01 / 04</small></div>
          </section>
        )}

        {scene === "welcome" && (
          <section className="welcome-scene scene-content" aria-labelledby="welcome-title">
            <div className="section-kicker"><span>Chapter one</span><span>19.09</span></div>
            <div className="welcome-grid">
              <div>
                <p className="eyebrow">The constellation is private tonight</p>
                <h1 id="welcome-title">For <em>Sifta</em>,<br />with a little light.</h1>
              </div>
              <div className="welcome-note">
                <p>Di antara langit dan bumi, ada satu orang yang layak mendapat sedikit ruang ekstra hari ini.</p>
                <p>Sepuluh orbit kecil. Satu pesan. Tidak ada tekanan—hanya ucapan, tawa kecil, dan doa baik.</p>
                <div className="welcome-actions"><button className="action-button" type="button" onClick={startConstellation}>Enter the constellation <ArrowRight size={16} /></button><button className="subtle-button" type="button" onClick={() => announce(secretMemories[secretIndex])}><CircleHelp size={15} /> secret note</button></div>
              </div>
            </div>
            <img className="welcome-bow" src="/memory-assets/gingham-bow.png" alt="" aria-hidden="true" />
            <div className="welcome-art-row"><MemoryStrip /><div className="welcome-hand-note"><HandDrawnStar /><span>some things are<br />worth keeping.</span></div><Waveform /></div>
            <div className="welcome-footer"><span>made by Akbar</span><span>no pressure / only good wishes</span></div>
          </section>
        )}

        {scene === "constellation" && (
          <section className="constellation-scene scene-content" aria-labelledby="constellation-title">
            <div className="section-kicker"><span>Chapter two / {String(completedCount).padStart(2, "0")} of 10 orbits lit</span><span>{BIRTHDAY_DAY}</span></div>
            <div className="constellation-heading"><div><p className="eyebrow">A gentle little game</p><h1 id="constellation-title">Let the sky<br /><em>take shape.</em></h1></div><p>Tap an orbit, answer when you feel like it, and let the night slowly become a message.</p></div>
            <ConstellationMap challenges={challenges} completed={completed} onSelect={selectChallenge} />
            <div className="constellation-actions"><button className="action-button" type="button" onClick={continueToVictory} disabled={completedCount < challenges.length}>Continue <ChevronRight size={16} /></button><button className="subtle-button" type="button" onClick={skipToVictory}>Skip the orbit <ArrowRight size={15} /></button></div>
          </section>
        )}

        {scene === "victory" && (
          <section className="victory-scene scene-content" aria-labelledby="victory-title">
            <div className="victory-ornament" aria-hidden="true"><Sparkles size={18} /><span>the sky is open</span><Sparkles size={18} /></div>
            <p className="eyebrow">Chapter three / a small wish</p>
            <h1 id="victory-title">You made it<br /><em>to the quiet part.</em></h1>
            <p className="lede">{candleReady ? "Hold the wish for one quiet second, then let the light go." : "Before the surprise, make one wish that belongs only to you."}</p>
            <img className="victory-heart-sticker" src="/memory-assets/striped-heart.png" alt="" aria-hidden="true" />
            <div className={`cake-stage${blown ? " is-blown" : ""}${candleReady ? " is-prepared" : ""}`}>
              <div className="cake-glow" /><div className="candle-halo" /><div className="cake-plate" /><div className="cake"><div className="cake-top"><span>19</span><i>SEP</i></div><div className="cake-body"><b /><b /><b /></div><div className="cake-base" /></div>
              <button className="candle" type="button" onClick={blowCandle} aria-label={candleReady ? "Blow out the candle" : "Prepare the candle wish"}><span className="flame" /><span className="candle-glint" /><span className="candle-stick" /></button>
            </div>
            <p className="wish-instruction" aria-live="polite">{blown ? "The light has heard you." : candleReady ? "Now, gently." : "Make the wish first."}</p>
            <button className="action-button action-button-large" type="button" onClick={candleReady ? blowCandle : prepareCandle}>{blown ? <><Wind size={17} /> The light is gone</> : candleReady ? <><Wind size={17} /> Blow the candle</> : <><Sparkles size={17} /> Make a wish</>}</button>
            {microphone.supported && <button className="subtle-button mic-button" type="button" onClick={async () => { if (!candleReady) { prepareCandle(); announce("Mic siap setelah wish-mu dibuat."); return; } const ok = await microphone.start(); announce(ok ? "Mic ready. Blow gently near your phone." : "Mic unavailable. Use the button instead."); }}>{microphone.active ? <><AudioLines size={15} /> Mic listening…</> : <><Wind size={15} /> Or blow with mic</>}</button>}
            <div className="victory-art-row"><ArchiveSeal /><Waveform /></div>
            <p className="microcopy">{BIRTHDAY_DATE} / one year softer, one year brighter.</p>
          </section>
        )}

        {scene === "surprise" && (
          <section className="surprise-scene scene-content" aria-labelledby="surprise-title">
            <div className="surprise-rays" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
            <div className="surprise-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--n": index } as React.CSSProperties} />)}</div>
            <div className="surprise-seal"><ArchiveSeal /><span>THE WISH<br />WAS SENT</span></div>
            <p className="eyebrow">A little surprise / kept quiet</p>
            <h1 id="surprise-title">The light went out.<br /><em>But the good part stayed.</em></h1>
            <p className="lede">No photograph. No grand explanation. Just one small wish, sent carefully into the night.</p>
            <div className="surprise-ticket"><span>19 SEP</span><strong>HAPPY<br />BIRTHDAY</strong><small>for Sifta / with good intent</small></div>
            <button className="action-button action-button-large" type="button" onClick={() => { audio.play("magicWish"); navigateTo("message"); }}><Heart size={17} /> Open the note</button>
            <p className="microcopy">wait for the quiet to settle.</p>
          </section>
        )}

        {scene === "message" && (
          <section className="message-scene scene-content" aria-labelledby="message-title">
            <div className="message-layout"><div className="message-index">A NOTE<br /><strong>004</strong></div><div className="message-card"><p className="eyebrow">From Akbar / with good intent</p><h1 id="message-title">Happy birthday,<br /><em>Sifta.</em></h1><div className="message-copy"><p>Selamat ulang tahun untuk 19 September. Semoga di chapter baru ini, impianmu pelan-pelan menemukan jalannya.</p><p>Semoga dikelilingi orang-orang baik, punya ruang untuk tumbuh, dan tetap bisa menemukan hal-hal kecil yang membuatmu tersenyum.</p><p>Walaupun cerita kita sudah berada di bab yang berbeda, doa baik tetap boleh dikirim ke langit.</p><p className="signature">— Akbar</p></div><div className="message-actions"><button className="action-button" type="button" onClick={revealPositive}><Heart size={16} /> show a good thought</button><button className="subtle-button" type="button" onClick={reset}><RotateCcw size={15} /> replay</button></div><div className="positive-message" aria-live="polite">{positiveMessages[positiveIndex]}</div></div></div>
            <div className="message-footer"><span>19 / 09 / 2005</span><span><HandDrawnStar /> some good wishes never need a reply</span></div>
            <MemoryGallery />
          </section>
        )}
      </div>

      <footer className="site-footer"><span>AKBAR / PERSONAL NOTE</span><span>quietly made for a bright day</span></footer>
      {toast && <div className="toast" role="status">{toast}</div>}
      <ChallengeModal challenge={active} clickProgress={clickProgress} inputValue={inputValue} feedback={feedback} onInputChange={setInputValue} onClickProgress={progressClick} onSubmitInput={submitInput} onChoose={chooseOption} onClose={() => setActiveChallenge(null)} />
    </main>
  );
}

export default App;
