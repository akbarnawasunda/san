import { useCallback, useEffect, useRef, useState } from "react";
import { createAudio, type SoundName } from "../data/audio";

export function useAudio() {
  const sounds = useRef(new Map<SoundName, HTMLAudioElement>());
  const [musicOn, setMusicOn] = useState(false);

  const getSound = useCallback((name: SoundName) => {
    const existing = sounds.current.get(name);
    if (existing) return existing;
    const audio = createAudio(name);
    sounds.current.set(name, audio);
    return audio;
  }, []);

  const play = useCallback((name: SoundName) => {
    const audio = getSound(name);
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, [getSound]);

  const stop = useCallback((name: SoundName) => {
    const audio = sounds.current.get(name);
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const fadeOut = useCallback((name: SoundName, duration = 500) => {
    const audio = sounds.current.get(name);
    if (!audio) return;
    const startVolume = audio.volume;
    const startedAt = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      audio.volume = startVolume * (1 - progress);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        audio.pause();
        audio.currentTime = 0;
        audio.volume = startVolume;
      }
    };
    requestAnimationFrame(tick);
  }, []);

  const toggleMusic = useCallback(() => {
    const next = !musicOn;
    setMusicOn(next);
    if (next) play("bgm");
    else stop("bgm");
  }, [musicOn, play, stop]);

  useEffect(() => {
    return () => {
      sounds.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      sounds.current.clear();
    };
  }, []);

  return { musicOn, play, stop, fadeOut, toggleMusic };
}
