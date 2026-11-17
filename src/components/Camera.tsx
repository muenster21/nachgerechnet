import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { useScene } from "../lib/anim";
import { H, W } from "../lib/theme";

/** Kamera pro Szene: sanfter Push-in (100 → 106 %) + Parallaxe zwischen den Ebenen. */
const CamCtx = createContext({ progress: 0, push: 0.06, pan: 1 });

export const Camera: React.FC<{ push?: number; pan?: 1 | -1; focusY?: number; children: React.ReactNode }> = ({ push = 0.06, pan = 1, focusY = 0.52, children }) => {
  const frame = useCurrentFrame();
  const { duration, overlap } = useScene();
  const progress = Math.max(0, Math.min(1, (frame - overlap) / Math.max(1, duration)));
  return (
    <CamCtx.Provider value={{ progress, push, pan }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", transformOrigin: `50% ${focusY * 100}%` }}>{children}</div>
    </CamCtx.Provider>
  );
};

/** depth: 0.3 = weit weg (bewegt sich kaum), 1 = Mittelgrund, 1.8 = Vordergrund (bewegt sich stark) */
export const Layer: React.FC<{ depth?: number; children: React.ReactNode; svg?: boolean; style?: React.CSSProperties }> = ({ depth = 1, children, svg = true, style }) => {
  const { progress, push, pan } = useContext(CamCtx);
  const k = 0.55 + 0.45 * depth;
  const scale = 1 + push * progress * k;
  const tx = (progress - 0.5) * 70 * depth * pan;
  return (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${tx}px) scale(${scale})`, transformOrigin: "50% 52%", ...style }}>
      {svg ? (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>{children}</svg>
      ) : children}
    </div>
  );
};
