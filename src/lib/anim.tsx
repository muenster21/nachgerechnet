import React, { createContext, useContext } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { VideoSpec } from "./types";

/* ---------- Kontext: Video + Szene ---------- */
export const VideoCtx = createContext<VideoSpec | null>(null);
export const useVideo = () => useContext(VideoCtx)!;

export type SceneInfo = {
  index: number;
  /** Frames dieser Szene (ohne Überlappung) */
  duration: number;
  /** Überlappung am Anfang (Übergang) */
  overlap: number;
  /** Frame (relativ zum Sequence-Start), bei dem das Wort `needle` in dieser Szene gesprochen wird */
  at: (needle?: string, fallbackSec?: number) => number;
  /** Frame des Szenenbeginns (Sprechbeginn) relativ zum Sequence-Start */
  start: number;
};
export const SceneCtx = createContext<SceneInfo | null>(null);
export const useScene = () => useContext(SceneCtx)!;

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export function makeTiming(spec: VideoSpec) {
  const fps = spec.video.fps;
  const sceneWords = (i: number) => spec.words.filter((w) => w.scene === i);
  const sceneStart = (i: number) => sceneWords(i)[0]?.start ?? 0;
  const sceneEnd = (i: number) =>
    i + 1 < spec.scenes.length ? sceneStart(i + 1) : spec.words[spec.words.length - 1].end + (spec.video.tail_seconds ?? 1);
  /** Frame (relativ zum Szenenstart) eines Wortes */
  const atWord = (i: number, needle?: string, fallbackSec = 0) => {
    const s0 = sceneStart(i);
    if (!needle) return Math.round(fallbackSec * fps);
    const n = norm(needle);
    const ws = sceneWords(i);
    const w = ws.find((x) => norm(x.text) === n) ?? ws.find((x) => norm(x.text).includes(n));
    return Math.max(0, Math.round(((w ? w.start : s0 + fallbackSec) - s0) * fps));
  };
  return { fps, sceneStart, sceneEnd, atWord };
}

/* ---------- Animations-Helfer ---------- */
/** Feder-Pop (Overshoot) ab Frame `start` */
export function usePop(start = 0, damping = 11, stiffness = 150) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, stiffness, mass: 0.7 } });
}

/** Weicher Verlauf 0→1 zwischen zwei Frames */
export function useProgress(start: number, dur = 18, easing = Easing.out(Easing.cubic)) {
  const frame = useCurrentFrame();
  return interpolate(frame, [start, start + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
}

/** Zahl zählt von `from` nach `to` hoch */
export function useCountUp(from: number, to: number, start: number, dur = 24) {
  const p = useProgress(start, dur, Easing.out(Easing.quad));
  return from + (to - from) * p;
}

export const fmtDE = (n: number, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Deterministischer Pseudo-Zufall (für Konfetti, Wackeln …) */
export function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
