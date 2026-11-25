import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Dim } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { Sparkle } from "../assets";
import { fmtDE, rand, usePop, useScene } from "../lib/anim";
import { BRAND, FONT_DISPLAY, FONT_TEXT, LINE } from "../lib/theme";
import { Stage, StageSpec } from "./Stage";

export type VerdictKind = "UNMÖGLICH" | "KNAPP" | "REALISTISCH";
const COL: Record<string, string> = { UNMÖGLICH: "#D62839", KNAPP: "#F08A1C", REALISTISCH: "#2FA36B" };

/** Urteil: Stempel knallt ins Bild (Schütteln, Blitz, Sound-Logo), die Serienfiguren reagieren darunter. */
export const VerdictScene: React.FC<{ s: { stage?: StageSpec; verdict: VerdictKind | string; at?: string | number; calc?: string; sub?: string } }> = ({ s }) => {
  const { at } = useScene();
  const frame = useCurrentFrame();
  const hit = typeof s.at === "number" ? s.at : at(s.at, 20);
  const k = frame - hit;
  const col = COL[s.verdict] ?? BRAND.stamp;
  const scale = k < 0 ? 0 : k < 6 ? interpolate(k, [0, 6], [3.2, 0.94]) : k < 12 ? interpolate(k, [6, 12], [0.94, 1.0]) : 1;
  const shake = k >= 0 && k < 14 ? Math.sin(k * 2.6) * (14 - k) * 1.6 : 0;
  const flash = k >= 5 && k < 11 ? interpolate(k, [5, 11], [0.8, 0]) : 0;
  const calcP = usePop(Math.max(0, hit - 40), 11);
  return (
    <>
      {s.stage && <Stage spec={s.stage} />}
      <Dim amount={0.35} />
      {s.calc && (
        <div style={{ position: "absolute", left: 70, width: 860, top: 330, textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 80, whiteSpace: "nowrap", color: "#fff", WebkitTextStroke: `12px ${BRAND.ink}`, paintOrder: "stroke fill", transform: `scale(${Math.min(1.05, calcP)})`, opacity: Math.min(1, calcP * 2), zIndex: 14 }}>{s.calc}</div>
      )}
      <Sfx name="stamp" at={hit} volume={0.9} />
      <div style={{ position: "absolute", left: 40, width: 890, top: 560, display: "flex", justifyContent: "center", zIndex: 30 }}>
        {k >= 0 && (
          <div style={{
            transform: `translate(${shake}px, ${Math.abs(shake) * 0.4}px) rotate(-8deg) scale(${scale})`,
            border: `20px solid ${col}`, color: col, background: "rgba(255,248,234,.94)", borderRadius: 30, padding: "10px 60px 0",
            fontFamily: FONT_DISPLAY, fontSize: s.verdict.length > 8 ? 170 : 220, letterSpacing: 6, lineHeight: 1.08, whiteSpace: "nowrap",
            boxShadow: `0 0 0 8px ${BRAND.ink}, 14px 20px 0 8px rgba(28,24,48,.5)`,
          }}>
            {s.verdict}
            <div style={{ position: "absolute", inset: 14, border: `6px solid ${col}`, borderRadius: 16, opacity: 0.5 }} />
          </div>
        )}
      </div>
      {s.sub && k > 10 && (
        <div style={{ position: "absolute", left: 70, width: 860, top: 890, textAlign: "center", fontFamily: FONT_TEXT, fontWeight: 900, fontSize: 52, color: "#fff", WebkitTextStroke: `9px ${BRAND.ink}`, paintOrder: "stroke fill", opacity: Math.min(1, (k - 10) / 8), zIndex: 30 }}>{s.sub}</div>
      )}
      {/* Funkeln um den Stempel */}
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0, zIndex: 31, pointerEvents: "none" }}>
        {k >= 6 && k < 40 && Array.from({ length: 6 }, (_, i) => {
          const a = rand(i + 3) * Math.PI * 2, d = 340 + rand(i) * 120 + k * 3;
          return <Sparkle key={i} x={500 + Math.cos(a) * d * 0.9} y={720 + Math.sin(a) * d * 0.35} s={interpolate(k, [6, 40], [1, 0.2]) * (0.7 + rand(i + 9))} opacity={interpolate(k, [6, 40], [1, 0])} />;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash, zIndex: 40, pointerEvents: "none" }} />
    </>
  );
};
