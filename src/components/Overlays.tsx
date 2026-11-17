import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fmtDE, useCountUp, usePop, useProgress, useScene } from "../lib/anim";
import { BRAND, FONT_DISPLAY, FONT_TEXT } from "../lib/theme";
import { Sfx } from "./Sfx";

type Cue = number | string;
const useCue = () => { const { at } = useScene(); return (c?: Cue, fb = 0) => (typeof c === "number" ? c : at(c, fb)); };

/** Große Schlagzeile (Hook): erscheint wortweise, Schlüsselwörter in Signaturfarbe. Liegt in der Sicherheitszone (y ≥ 270). */
export const HookText: React.FC<{ text: string; highlight?: string[]; at?: Cue; until?: Cue; top?: number; size?: number }> = ({ text, highlight = [], at, until, top = 300, size = 118 }) => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const start = cue(at, 0);
  const end = until !== undefined ? cue(until) : Infinity;
  const words = text.split(" ");
  if (frame >= end) return null;
  const out = interpolate(frame, [end - 8, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 60, right: 150, top, display: "flex", flexWrap: "wrap", gap: "0 22px", justifyContent: "flex-start", opacity: isFinite(end) ? out : 1, zIndex: 20 }}>
      {words.map((w, i) => {
        const p = Math.max(0, Math.min(1, (frame - start - i * 2) / 6));
        const key = highlight.some((h) => w.toLowerCase().includes(h.toLowerCase()));
        const fadeIn = true;
        return (
          <span key={i} style={{
            fontFamily: FONT_DISPLAY, fontSize: size, lineHeight: 1.04, textTransform: "uppercase", color: key ? BRAND.signature : "#fff",
            WebkitTextStroke: `16px ${BRAND.ink}`, paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(28,24,48,.5)",
            transform: `translateY(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`, opacity: p,
          }}>{w}</span>
        );
      })}
    </div>
  );
};

/** Dunkler Verlauf über dem Schauplatz, damit Karten/Zahlen lesbar sind (Hintergrund bleibt sichtbar). */
export const Dim: React.FC<{ amount?: number }> = ({ amount = 0.55 }) => (
  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(20,16,40,${amount * 0.9}) 0%, rgba(20,16,40,${amount}) 60%, rgba(20,16,40,${amount * 1.1}) 100%)` }} />
);

/** Fakt-Karte (Kanal-Design): dunkle Karte, versetzter Signatur-Schatten, „FAKT“-Sticker, riesige Zahl, Quelle klein. */
export const FactCardUI: React.FC<{
  value: number | string; prefix?: string; suffix?: string; decimals?: number; label: string; source?: string; tag?: string; at?: Cue; top?: number; count?: boolean;
}> = ({ value, prefix = "", suffix = "", decimals = 0, label, source, tag = "FAKT", at, top = 560, count = true }) => {
  const cue = useCue();
  const start = cue(at, 0);
  const p = usePop(start, 11, 170);
  const num = typeof value === "number" ? value : 0;
  const n = useCountUp(0, num, start + 4, 26);
  const shown = typeof value === "number" ? fmtDE(count ? n : num, decimals) : value;
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 22) * 5;
  const chars = (prefix + shown + suffix).length;
  const numSize = Math.min(240, 730 / (chars * 0.47)); // passt in die Kartenbreite
  return (
    <div style={{ position: "absolute", left: 90, width: 840, top, transform: `translateY(${(1 - Math.min(1, p)) * 220 + float}px) scale(${0.82 + 0.18 * Math.min(1.06, p)}) rotate(${(1 - Math.min(1, p)) * -4}deg)`, opacity: Math.min(1, p * 2), zIndex: 15 }}>
      <Sfx name="pop" at={start} />
      <div style={{ position: "absolute", inset: 0, transform: "translate(16px,18px)", borderRadius: 44, background: BRAND.signature, border: `5px solid ${BRAND.ink}` }} />
      <div style={{ position: "relative", borderRadius: 44, background: "#171433", border: `5px solid ${BRAND.ink}`, padding: "86px 56px 52px", color: "#fff", textAlign: "center" }}>
        <div style={{ position: "absolute", top: -40, left: 36, transform: "rotate(-6deg)", background: BRAND.signature, color: BRAND.ink, border: `5px solid ${BRAND.ink}`, fontFamily: FONT_DISPLAY, fontSize: 52, letterSpacing: 4, padding: "6px 32px", borderRadius: 14 }}>{tag}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: numSize, lineHeight: 1, letterSpacing: 2, whiteSpace: "nowrap", color: "#fff" }}>
          <span style={{ color: BRAND.signature }}>{prefix}</span>{shown}<span style={{ color: BRAND.signature, fontSize: numSize * 0.62 }}>{suffix}</span>
        </div>
        <div style={{ fontFamily: FONT_TEXT, fontWeight: 900, fontSize: 56, lineHeight: 1.12, marginTop: 14, color: "#F3EEFF" }}>{label}</div>
        {source && <div style={{ fontFamily: FONT_TEXT, fontWeight: 800, fontSize: 32, marginTop: 26, color: "rgba(255,255,255,.62)", letterSpacing: 1 }}>QUELLE: {source}</div>}
      </div>
    </div>
  );
};

/** Chip/Label (z. B. „1 Punkt = 1.000 €“) */
export const Chip: React.FC<{ text: string; at?: Cue; top?: number; left?: number; color?: string; fg?: string; size?: number; rot?: number }> = ({ text, at, top = 300, left = 70, color = BRAND.signature, fg = BRAND.ink, size = 48, rot = -3 }) => {
  const cue = useCue();
  const p = usePop(cue(at, 0), 11);
  return (
    <div style={{ position: "absolute", left, top, transform: `scale(${Math.min(1.05, p)}) rotate(${rot}deg)`, opacity: Math.min(1, p * 2), background: color, color: fg, border: `5px solid ${BRAND.ink}`, borderRadius: 18, fontFamily: FONT_DISPLAY, fontSize: size, letterSpacing: 2, padding: "6px 28px", boxShadow: "6px 8px 0 rgba(28,24,48,.5)", zIndex: 16 }}>{text}</div>
  );
};

/** Großer Titel für Daten-/Karten-Szenen (oben in der Sicherheitszone) */
export const Title: React.FC<{ text: string; at?: Cue; top?: number; align?: "left" | "center" }> = ({ text, at, top = 290, align = "left" }) => {
  const cue = useCue();
  const p = useProgress(cue(at, 0), 14);
  return (
    <div style={{ position: "absolute", left: 60, right: 150, top, textAlign: align, fontFamily: FONT_DISPLAY, fontSize: 96, lineHeight: 1.05, textTransform: "uppercase", color: "#fff", WebkitTextStroke: `14px ${BRAND.ink}`, paintOrder: "stroke fill", opacity: p, transform: `translateY(${(1 - p) * 30}px)`, zIndex: 15 }}>{text}</div>
  );
};
