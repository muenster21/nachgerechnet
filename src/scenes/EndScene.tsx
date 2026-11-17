import React from "react";
import { useCurrentFrame } from "remotion";
import { Sfx } from "../components/Sfx";
import { Coin, G, Sparkle } from "../assets";
import { rand, useScene, useVideo, usePop } from "../lib/anim";
import { BRAND, FONT_DISPLAY, FONT_TEXT, LINE } from "../lib/theme";
import { Stage, StageSpec } from "./Stage";
import { Dim } from "../components/Overlays";

/** Endcard (letzte 2 s): „Welche Serie als Nächstes? 👇“ + Kanalname, Konfetti. */
export const EndScene: React.FC<{ s: { stage?: StageSpec; line?: string } }> = ({ s }) => {
  const v = useVideo();
  const frame = useCurrentFrame();
  const { start } = useScene();
  const p = usePop(start + 2, 10);
  const c = usePop(start + 12, 10);
  const bob = Math.sin(frame / 7) * 10;
  return (
    <>
      {s.stage && <Stage spec={s.stage} />}
      <Dim amount={0.55} />
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, zIndex: 10 }}>
        {Array.from({ length: 22 }, (_, i) => {
          const sp = 3 + rand(i) * 4, x = rand(i + 4) * 1080, ph = rand(i + 9) * 800;
          const y = ((frame * sp + ph) % 2100) - 100;
          return i % 3 === 0 ? <Coin key={i} x={x} y={y} s={0.9} rot={frame * (2 + rand(i) * 4)} /> : <Sparkle key={i} x={x} y={y} s={0.5 + rand(i + 2) * 0.6} opacity={0.7} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: 60, right: 150, top: 560, textAlign: "center", zIndex: 20, transform: `scale(${0.7 + 0.3 * Math.min(1.08, p)})`, opacity: Math.min(1, p * 2) }}>
        <Sfx name="pop" at={start + 2} />
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 150, lineHeight: 1.02, textTransform: "uppercase", color: "#fff", WebkitTextStroke: `18px ${BRAND.ink}`, paintOrder: "stroke fill", textShadow: "0 10px 0 rgba(28,24,48,.5)" }}>
          {s.line ?? "Welche Serie als"} <span style={{ color: BRAND.signature }}>Nächstes?</span>
        </div>
        <div style={{ fontSize: 170, transform: `translateY(${bob}px)`, marginTop: 10 }}>👇</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 150, top: 300, display: "flex", justifyContent: "center", zIndex: 20, transform: `scale(${Math.min(1.05, c)}) rotate(-3deg)`, opacity: Math.min(1, c * 2) }}>
        <div style={{ background: BRAND.signature, color: BRAND.ink, border: `6px solid ${BRAND.ink}`, borderRadius: 24, fontFamily: FONT_DISPLAY, fontSize: 84, letterSpacing: 3, padding: "8px 44px", boxShadow: "8px 10px 0 rgba(28,24,48,.55)" }}>{v.channel}</div>
      </div>
    </>
  );
};
