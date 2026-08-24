import { useCallback, useEffect, useRef, useState } from "react";

export function useMicrophoneBlow(onBlow: () => void) {
  const [active, setActive] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | null>(null);
  const onBlowRef = useRef(onBlow);
  onBlowRef.current = onBlow;

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    void contextRef.current?.close();
    contextRef.current = null;
    setActive(false);
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let hits = 0;
      streamRef.current = stream;
      contextRef.current = context;
      setActive(true);

      const listen = () => {
        analyser.getByteFrequencyData(data);
        const average = data.reduce((sum, value) => sum + value, 0) / data.length;
        hits = average > 48 ? hits + 1 : Math.max(0, hits - 2);
        if (hits > 12) {
          stop();
          onBlowRef.current();
          return;
        }
        frameRef.current = requestAnimationFrame(listen);
      };
      frameRef.current = requestAnimationFrame(listen);
      return true;
    } catch {
      stop();
      return false;
    }
  }, [stop]);

  useEffect(() => stop, [stop]);

  return {
    active,
    supported: typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia),
    start,
    stop,
  };
}
