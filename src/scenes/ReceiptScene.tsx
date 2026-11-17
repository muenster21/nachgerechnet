import React from "react";
import { useCurrentFrame } from "remotion";
import { Sfx } from "../components/Sfx";
import { Dim } from "../components/Overlays";
import { fmtDE, useCountUp, usePop, useProgress, useScene } from "../lib/anim";
import { BRAND, FONT_TEXT, FONT_DISPLAY } from "../lib/theme";
import { Stage, StageSpec } from "./Stage";

type Line = { label: string; value: number; unit?: string; sign?: "+" | "-"; at?: string | number; decimals?: number };

/** Rechnung: Kassenbon, Positionen erscheinen nacheinander, Summe zählt hoch, Minus rot. */
export const ReceiptScene: React.FC<{ s: { stage?: StageSpec; title?: string; sub?: string; lines: Line[]; total: { label: string; value: number; unit?: string; at?: string | number; decimals?: number; sign?: "-" | "+" }; top?: number } }> = ({ s }) => {
  const { at } = useScene();
  const cue = (c?: string | number, fb = 0) => (typeof c === "number" ? c : at(c, fb));
  const frame = useCurrentFrame();
  const slide = useProgress(0, 16);
  const top = s.top ?? 400;
  const ZZ = 24;
  const zig = (up: boolean) => Array.from({ length: ZZ + 1 }, (_, i) => `${(i * 100) / ZZ}% ${up ? (i % 2 ? 0 : 14) : `calc(100% - ${i % 2 ? 0 : 14}px)`}`);
  const clip = `polygon(${[...zig(true), ...zig(false).reverse()].join(",")})`;
  const t0 = cue(s.total.at, 20);
  const tot = useCountUp(0, s.total.value, t0, 22);
  const unit = s.total.unit ?? "€";
  return (
    <>
      {s.stage && <Stage spec={s.stage} />}
      <Dim amount={0.5} />
      <div style={{ position: "absolute", left: 130, width: 820, top: top - (1 - slide) * 600, transform: `rotate(${-1.2 + (1 - slide) * 4}deg)`, zIndex: 15, filter: "drop-shadow(0 26px 30px rgba(0,0,0,.45))" }}>
        <Sfx name="receipt" at={0} />
        <div style={{ background: BRAND.paper, clipPath: clip, padding: "64px 54px 74px", fontFamily: "'Courier New', monospace", color: BRAND.ink }}>
          <div style={{ textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 64, letterSpacing: 8 }}>{s.title ?? "RECHNUNG"}</div>
          {s.sub && <div style={{ textAlign: "center", fontFamily: FONT_TEXT, fontWeight: 800, fontSize: 32, opacity: 0.6, marginTop: 4 }}>{s.sub}</div>}
          <div style={{ borderTop: `6px dashed ${BRAND.ink}`, opacity: 0.4, margin: "26px 0" }} />
          {s.lines.map((l, i) => {
            const st = cue(l.at, 10 + i * 14);
            const p = usePop(st, 12);
            const neg = l.sign === "-";
            const v = useCountUp(0, l.value, st + 2, 14);
            const col = neg ? "#D62839" : BRAND.ink;
            return (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 20, fontSize: 54, fontWeight: 700, lineHeight: 1.7, whiteSpace: "nowrap", opacity: Math.min(1, p * 2), transform: `translateX(${(1 - Math.min(1, p)) * -60}px)`, color: col }}>
                <Sfx name="tick" at={st} volume={0.35} />
                <span>{l.label}</span>
                <span>{neg ? "−" : l.sign === "+" ? "+" : ""}{fmtDE(frame >= st ? v : 0, l.decimals ?? 0)} {l.unit ?? "€"}</span>
              </div>
            );
          })}
          <div style={{ borderTop: `8px double ${BRAND.ink}`, margin: "20px 0 10px", opacity: usePop(t0 - 4) }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, whiteSpace: "nowrap", transform: `scale(${0.85 + 0.15 * Math.min(1.05, usePop(t0, 9))})`, transformOrigin: "left center", opacity: Math.min(1, usePop(t0) * 2) }}>
            <Sfx name="ding" at={t0} volume={0.4} />
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 80 }}>{s.total.label}</span>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 96, background: BRAND.signature, border: `5px solid ${BRAND.ink}`, borderRadius: 10, padding: "0 20px", color: s.total.sign === "-" ? "#D62839" : BRAND.ink }}>
              {s.total.sign === "-" ? "−" : ""}{fmtDE(tot, s.total.decimals ?? 0)} {unit}
            </span>
          </div>
          <div style={{ marginTop: 30, height: 64, background: `repeating-linear-gradient(90deg, ${BRAND.ink} 0 4px, transparent 4px 9px, ${BRAND.ink} 9px 11px, transparent 11px 18px)`, opacity: 0.8 }} />
        </div>
      </div>
    </>
  );
};
