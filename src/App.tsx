import { useCallback, useMemo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, AudioLines, CakeSlice, ChevronRight, CircleHelp, Heart, Moon, RotateCcw, Sparkles, Star, Wind, X } from "lucide-react";
import { ChallengeModal } from "./components/ChallengeModal";
import { ConstellationMap } from "./components/ConstellationMap";
import { challenges, BIRTHDAY_DATE, BIRTHDAY_DAY, positiveMessages, secretMemories, successMessages } from "./data/content";
import { useAudio } from "./effects/useAudio";
import { useStarfield } from "./effects/useStarfield";
import "./styles/app.css";

type Scene = "opening" | "welcome" | "constellation" | "victory" | "message";

function App() {
  const starfieldRef = useStarfield();
  const audio = useAudio();
  const [scene, setScene] = useState<Scene>("opening");
  const [completed, setCompleted] = useState<boolean[]>(() => challenges.map(() => false));
  const [activeChallenge, setActiveChallenge] = useState<number | null>(null);
  const [clickProgress, setClickProgress] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [secretIndex, setSecretIndex] = useState(0);
  const [positiveIndex, setPositiveIndex] = useState(0);
  const [blown, setBlown] = useState(false);
  const [toast, setToast] = useState("");

  const completedCount = completed.filter(Boolean).length;
  const active = activeChallenge === null ? null : challenges[activeChallenge];

  const announce = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  }, []);

  const openWelcome = () => {
    audio.play("click");
    audio.play("whoosh");
    setScene("welcome");
  };

  const startConstellation = () => {
    audio.play("magic");
    if (!audio.musicOn) audio.toggleMusic();
    setScene("constellation");
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
    setScene("victory");
  };

  const skipToVictory = () => {
    setCompleted(challenges.map(() => true));
    audio.fadeOut("bgm", 420);
    audio.play("victory");
    setScene("victory");
    announce("Jalur cepat terbuka.");
  };

  const blowCandle = () => {
    if (blown) return;
    setBlown(true);
    audio.play("airBlow");
    window.setTimeout(() => audio.play("bubble"), 520);
    window.setTimeout(() => {
      audio.play("afterBlow");
      setScene("message");
    }, 1080);
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
    setScene("opening");
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

  const sceneClass = useMemo(() => `app-shell scene-${scene}`, [scene]);

  return (
    <main className={sceneClass}>
      <canvas ref={starfieldRef} className="starfield" aria-hidden="true" />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
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
        {scene === "opening" && (
          <section className="opening-scene scene-content" aria-labelledby="opening-title">
            <div className="opening-index">A NOTE / 001</div>
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
            <p className="lede">Now make one wish before the last light changes shape.</p>
            <div className={`cake-stage${blown ? " is-blown" : ""}`}>
              <div className="cake-glow" /><div className="cake-plate" /><div className="cake"><div className="cake-top"><span>19</span></div><div className="cake-body" /><div className="cake-base" /></div>
              <button className="candle" type="button" onClick={blowCandle} aria-label="Blow out the candle"><span className="flame" /><span className="candle-stick" /></button>
            </div>
            <button className="action-button action-button-large" type="button" onClick={blowCandle}>{blown ? <><Wind size={17} /> The light is gone</> : <><Wind size={17} /> Blow the candle</>}</button>
            <p className="microcopy">{BIRTHDAY_DATE} / one year softer, one year brighter.</p>
          </section>
        )}

        {scene === "message" && (
          <section className="message-scene scene-content" aria-labelledby="message-title">
            <div className="message-layout"><div className="message-index">A NOTE<br /><strong>004</strong></div><div className="message-card"><p className="eyebrow">From Akbar / with good intent</p><h1 id="message-title">Happy birthday,<br /><em>Sifta.</em></h1><div className="message-copy"><p>Selamat ulang tahun untuk 19 September. Semoga di chapter baru ini, impianmu pelan-pelan menemukan jalannya.</p><p>Semoga dikelilingi orang-orang baik, punya ruang untuk tumbuh, dan tetap bisa menemukan hal-hal kecil yang membuatmu tersenyum.</p><p>Walaupun cerita kita sudah berada di bab yang berbeda, doa baik tetap boleh dikirim ke langit.</p><p className="signature">— Akbar</p></div><div className="message-actions"><button className="action-button" type="button" onClick={revealPositive}><Heart size={16} /> show a good thought</button><button className="subtle-button" type="button" onClick={reset}><RotateCcw size={15} /> replay</button></div><div className="positive-message" aria-live="polite">{positiveMessages[positiveIndex]}</div></div></div>
            <div className="message-footer"><span>19 / 09 / 2005</span><span>some good wishes never need a reply</span></div>
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
