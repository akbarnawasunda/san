export type SoundName =
  | "bgm"
  | "afterBlow"
  | "airBlow"
  | "bubble"
  | "chime"
  | "click"
  | "error"
  | "fire"
  | "funny"
  | "magicWish"
  | "magic"
  | "passed"
  | "sparkle"
  | "success"
  | "victory"
  | "whoosh";

export const audioFiles: Record<SoundName, { file: string; loop?: boolean; volume: number }> = {
  bgm: { file: "Happy-Birthday.mp3", loop: true, volume: 0.28 },
  afterBlow: { file: "After-blow.mp3", loop: true, volume: 0.32 },
  airBlow: { file: "Air-Blow.mp3", volume: 0.7 },
  bubble: { file: "Buble-Pop-Reverb.mp3", volume: 0.45 },
  chime: { file: "Chime.mp3", volume: 0.65 },
  click: { file: "Click.mp3", volume: 0.45 },
  error: { file: "Error.mp3", volume: 0.45 },
  fire: { file: "Fire.mp3", volume: 0.72 },
  funny: { file: "Funny.mp3", volume: 0.45 },
  magicWish: { file: "Magic-Wish.mp3", volume: 0.58 },
  magic: { file: "Magic.mp3", volume: 0.58 },
  passed: { file: "Passed.mp3", volume: 0.5 },
  sparkle: { file: "Sparkle.mp3", volume: 0.58 },
  success: { file: "Success.mp3", volume: 0.55 },
  victory: { file: "Victory.mp3", volume: 0.7 },
  whoosh: { file: "Whoosh.mp3", volume: 0.55 },
};

export function createAudio(name: SoundName) {
  const config = audioFiles[name];
  const audio = new Audio(`/audio/${config.file}`);
  audio.loop = Boolean(config.loop);
  audio.volume = config.volume;
  audio.preload = "none";
  return audio;
}
