import React from "react";
import { LINE, LW } from "../lib/theme";

/** Gemeinsame Props: Position (Fußpunkt/Mitte unten), Skalierung, Spiegelung */
export type A = { x?: number; y?: number; s?: number; flip?: boolean; opacity?: number; rot?: number; children?: React.ReactNode };

/** Platziert ein Asset. Ursprung (0,0) des Kindes = unten Mitte. */
export const G: React.FC<A> = ({ x = 0, y = 0, s = 1, flip, opacity = 1, rot = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`} opacity={opacity}>
    {children}
  </g>
);

/** Einheitliche Kontur */
export const sw = { stroke: LINE, strokeWidth: LW, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
export const thin = { stroke: LINE, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Farbe leicht abdunkeln/aufhellen (hex) */
export function shade(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt * 255)));
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
