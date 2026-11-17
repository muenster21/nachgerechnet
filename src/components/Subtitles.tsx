import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useVideo } from "../lib/anim";
import { BRAND, FONT_DISPLAY } from "../lib/theme";
import type { Word } from "../lib/types";

/** Untertitel: 1–3 Wörter, groß und fett, weiß mit dunkler Kontur, Schlüsselwörter/Zahlen in Signaturfarbe. */
function paginate(words: Word[], maxWords = 3) {
  const pages: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const long = cur.reduce((n, x) => n + x.text.length, 0) > 15;
    const brk = cur.length >= maxWords || long || /[.!?:…]$/.test(w.text) || (next && next.scene !== w.scene) || (/,$/.test(w.text) && cur.length >= 2);
    if (brk) { pages.push(cur); cur = []; }
  });
  if (cur.length) pages.push(cur);
  return pages;
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export const Subtitles: React.FC = () => {
  const spec = useVideo();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pages = React.useMemo(() => paginate(spec.words, 3), [spec]);
  const idx = pages.findIndex((p, i) => t >= p[0].start - 0.04 && t < (pages[i + 1]?.[0].start ?? Infinity) - 0.04);
  if (idx < 0) return null;
  const page = pages[idx];
  const sceneIdx = page[0].scene;
  const hl = (spec.scenes[sceneIdx]?.highlights ?? []).map(norm);
  const pop = spring({ frame: frame - Math.round(page[0].start * fps) + 1, fps, config: { damping: 11, stiffness: 260, mass: 0.5 } });
  const sb = spec.video.safe_bottom;
  // Schriftgröße so wählen, dass auch das längste Wort in die Breite passt (Anton ≈ 0.48 em pro Zeichen inkl. Kontur)
  const longest = Math.max(...page.map((w) => w.text.replace(/[„“"]/g, "").length));
  const fs = Math.max(72, Math.min(132, 840 / (longest * 0.5)));
  // Lage: mittig im unteren Drittel, innerhalb der Sicherheitszone (über den unteren 400 px)
  const centerY = 1920 - sb - 110;
  return (
    <div style={{ position: "absolute", left: 60, right: 150, top: centerY - 120, height: 240, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 26px", transform: `scale(${0.7 + 0.3 * Math.min(1.12, pop)})`, maxWidth: 870 }}>
        {page.map((w, i) => {
          const key = hl.includes(norm(w.text)) || /\d/.test(w.text);
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT_DISPLAY, fontSize: fs, lineHeight: 1.08, textTransform: "uppercase", letterSpacing: 2,
                color: key ? BRAND.signature : "#FFFFFF",
                WebkitTextStroke: `${Math.round(fs * 0.135)}px ${BRAND.ink}`, paintOrder: "stroke fill",
                textShadow: "0 8px 0 rgba(28,24,48,.55), 0 14px 24px rgba(0,0,0,.35)",
              }}
            >
              {w.text.replace(/[„“"]/g, "")}
            </span>
          );
        })}
      </div>
    </div>
  );
};
