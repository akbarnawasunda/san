import { useEffect, useRef } from "react";

export function useStarfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const stars = Array.from({ length: mobile ? 28 : 56 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: 0.3 + Math.random() * 1.25,
      speed: reducedMotion ? 0 : 0.00006 + Math.random() * 0.00013,
      twinkle: 0.004 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
      tone: Math.random() > 0.78 ? "196, 178, 255" : "255, 255, 255",
    }));
    let frame = 0;
    let lastDraw = 0;
    const frameInterval = mobile ? 1000 / 24 : 1000 / 30;
    let visible = !document.hidden;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      if (!visible) return;
      if (!reducedMotion && time - lastDraw < frameInterval) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = time;
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.phase += star.twinkle;
        star.y -= star.speed;
        if (star.y < -0.02) star.y = 1.02;
        const alpha = 0.12 + Math.abs(Math.sin(star.phase)) * 0.38;
        context.beginPath();
        context.arc(star.x * width, star.y * height, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(${star.tone}, ${alpha})`;
        context.fill();
      });

      if (!reducedMotion && Math.sin(time * 0.00014) > 0.995) {
        const x = ((time * 0.04) % (width + 180)) - 180;
        const y = height * 0.16;
        const gradient = context.createLinearGradient(x, y, x - 130, y - 56);
        gradient.addColorStop(0, "rgba(246, 219, 158, .65)");
        gradient.addColorStop(1, "rgba(246, 219, 158, 0)");
        context.strokeStyle = gradient;
        context.lineWidth = 1.5;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - 130, y - 56);
        context.stroke();
      }

      if (!reducedMotion) frame = requestAnimationFrame(draw);
      else frame = 0;
    };

    const handleVisibility = () => {
      visible = !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(draw);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return canvasRef;
}
