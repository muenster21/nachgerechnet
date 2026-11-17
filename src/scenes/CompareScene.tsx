import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Title } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { DollarIcon, EuroIcon, G, HouseIcon, BeerIcon, PersonIcon, shade } from "../assets";
import { fmtDE, useCountUp, usePop, useScene } from "../lib/anim";
import { BRAND, FONT_DISPLAY, FONT_TEXT, LINE } from "../lib/theme";

type Side = { label: string; value: number; display?: string; color: string; icon?: "dollar" | "euro" | "house" | "beer" | "person"; unit?: string; at?: string | number; decimals?: number };

const ICONS: Record<string, React.FC<any>> = { dollar: DollarIcon, euro: EuroIcon, house: HouseIcon, beer: BeerIcon, person: PersonIcon };

/** Vergleich: Split-Screen, Balken wachsen gegeneinander. */
export const CompareScene: React.FC<{ s: { title?: string; left: Side; right: Side; verdict?: string; verdictAt?: string | number } }> = ({ s }) => {
  const { at } = useScene();
  const cue = (c?: string | number, fb = 0) => (typeof c === "number" ? c : at(c, fb));
  const frame = useCurrentFrame();
  const max = Math.max(s.left.value, s.right.value);
  const Half: React.FC<{ d: Side; x: number; fb: number; flip?: boolean }> = ({ d, x, fb, flip }) => {
    const st = cue(d.at, fb);
    const p = interpolate(frame, [st, st + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const e = 1 - Math.pow(1 - p, 3);
    const pop = usePop(st, 11);
    const n = useCountUp(0, d.value, st + 2, 26);
    const Icon = ICONS[d.icon ?? "euro"];
    const maxH = 470;
    const h = (maxH * d.value) / max * e;
    const base = 1200;
    return (
      <g transform={`translate(${x} 0)`}>
        {/* Balken */}
        <rect x="-120" y={base - h} width="240" height={h} rx="20" fill={d.color} stroke={LINE} strokeWidth="6" />
        <rect x="-120" y={base - h} width="240" height="34" rx="20" fill="#fff" opacity=".22" />
        {/* Icon auf dem Balken */}
        <g transform={`translate(0 ${base - h - 14}) scale(${Math.min(1.05, pop)})`}><Icon s={2.4} /></g>
        {/* Zahl über dem Icon */}
        <text x="0" y={base - h - 190} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="104" fill="#fff" stroke={LINE} strokeWidth="18" paintOrder="stroke" opacity={Math.min(1, pop * 2)}>
          {d.display ?? `${fmtDE(n, d.decimals ?? 0)} ${d.unit ?? ""}`}
        </text>
        <text x="0" y={base + 70} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="66" fill="#fff" stroke={LINE} strokeWidth="12" paintOrder="stroke">{d.label}</text>
      </g>
    );
  };
  const vp = usePop(cue(s.verdictAt, 60), 9);
  return (
    <>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="cmpL" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={shade(s.left.color, -0.15)} /><stop offset="1" stopColor={shade(s.left.color, -0.4)} /></linearGradient>
          <linearGradient id="cmpR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={shade(s.right.color, -0.15)} /><stop offset="1" stopColor={shade(s.right.color, -0.4)} /></linearGradient>
        </defs>
        <rect width="1080" height="1920" fill="url(#cmpR)" />
        <path d="M-40 -40 H620 L440 1960 H-40Z" fill="url(#cmpL)" />
        <path d="M620 -40 L440 1960" stroke={LINE} strokeWidth="14" />
        {/* Muster */}
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={(i % 4) * 300 + 100} cy={Math.floor(i / 4) * 560 + 400} r="170" fill="#fff" opacity=".035" />)}
        <Half d={s.left} x={250} fb={12} />
        <Half d={s.right} x={780} fb={30} />
        <text x="520" y="760" textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="120" fill={BRAND.signature} stroke={LINE} strokeWidth="18" paintOrder="stroke" transform="rotate(-8 520 760)">VS</text>
      </svg>
      {s.title && <Title text={s.title} />}
      {s.verdict && <Chip text={s.verdict} at={s.verdictAt ?? 60} top={540} left={70} size={64} color="#D62839" fg="#fff" rot={-4} />}
    </>
  );
};
