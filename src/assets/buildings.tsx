import React from "react";
import { A, G, sw, thin, shade } from "./base";
import { rand } from "../lib/anim";

/** Gebäude, Himmel, Straße. Ursprung unten Mitte. */

export const Skyline: React.FC<A & { w?: number; color?: string; lit?: string; seed?: number; maxH?: number }> = ({ w = 1400, color = "#1B2347", lit = "#FFD98A", seed = 1, maxH = 560, ...a }) => {
  const bs: { x: number; bw: number; bh: number }[] = [];
  let x = -w / 2;
  let i = 0;
  while (x < w / 2) {
    const bw = 90 + rand(seed + i) * 120;
    const bh = maxH * (0.3 + rand(seed + i * 3.1) * 0.7);
    bs.push({ x, bw, bh });
    x += bw - 6;
    i++;
  }
  return (
    <G {...a}>
      {bs.map((b, k) => (
        <g key={k}>
          <rect x={b.x} y={-b.bh} width={b.bw} height={b.bh} fill={shade(color, rand(seed + k * 7) * 0.05)} stroke="#12182F" strokeWidth="3" />
          {rand(seed + k) > 0.7 && <rect x={b.x + b.bw / 2 - 3} y={-b.bh - 46} width="6" height="46" fill="#12182F" />}
          {Array.from({ length: Math.floor(b.bh / 46) * 3 }, (_, j) => {
            const cx = b.x + 14 + (j % 3) * ((b.bw - 28) / 3);
            const cy = -b.bh + 22 + Math.floor(j / 3) * 46;
            return rand(seed + k * 31 + j) > 0.45 ? <rect key={j} x={cx} y={cy} width="14" height="20" fill={lit} opacity={0.55 + rand(j + k) * 0.4} /> : null;
          })}
        </g>
      ))}
    </G>
  );
};

export const Brownstone: React.FC<A & { color?: string; floors?: number; w?: number }> = ({ color = "#9B4F36", floors = 4, w = 440, ...a }) => {
  const fh = 150;
  const h = floors * fh;
  return (
    <G {...a}>
      <rect x={-w / 2} y={-h} width={w} height={h} fill={color} {...sw} />
      <rect x={-w / 2 - 14} y={-h - 30} width={w + 28} height="36" fill={shade(color, -0.14)} {...sw} />
      {Array.from({ length: floors - 1 }, (_, r) => (
        <g key={r} transform={`translate(0 ${-h + 28 + r * fh})`}>
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${sd * 110} 0)`}>
              <rect x="-42" y="0" width="84" height="104" rx="4" fill="#26335A" {...sw} />
              <rect x="-42" y="0" width="84" height="104" rx="4" fill="#FFD98A" opacity={(r + sd + 3) % 3 === 0 ? 0.85 : 0.18} />
              <path d="M0 0 V104 M-42 52 H42" stroke="#1C1830" strokeWidth="3" />
              <rect x="-52" y="-12" width="104" height="14" rx="3" fill={shade(color, 0.14)} {...sw} />
              <rect x="-50" y="102" width="100" height="10" fill={shade(color, 0.1)} {...thin} />
            </g>
          ))}
        </g>
      ))}
      {/* Eingang + Stufen */}
      <rect x="-56" y={-fh + 12} width="112" height={fh - 12} rx="6" fill="#4A2A1C" {...sw} />
      <path d={`M-56 ${-fh + 12} Q0 ${-fh - 36} 56 ${-fh + 12}`} fill="#26335A" {...sw} />
      <circle cx="34" cy={-fh / 2 + 10} r="6" fill="#E0B84C" {...sw} />
      {[0, 1, 2].map((i) => <rect key={i} x={-80 + i * 8} y={-20 + i * 20 - 40} width={160 - i * 16} height="20" fill="#C8C2B6" {...thin} />)}
    </G>
  );
};

export const Highrise: React.FC<A & { w?: number; h?: number; color?: string }> = ({ w = 220, h = 900, color = "#4B5C86", ...a }) => (
  <G {...a}>
    <rect x={-w / 2} y={-h} width={w} height={h} fill={color} {...sw} />
    {Array.from({ length: Math.floor(h / 60) }, (_, r) => (
      <g key={r}>{[0, 1, 2].map((c) => <rect key={c} x={-w / 2 + 22 + c * ((w - 44) / 3)} y={-h + 24 + r * 60} width={(w - 44) / 3 - 14} height="34" fill={rand(r * 3 + c) > 0.5 ? "#FFD98A" : "#8FB4D9"} opacity=".85" />)}</g>
    ))}
    <rect x={-w / 2 - 10} y={-h - 14} width={w + 20} height="16" fill={shade(color, -0.12)} {...sw} />
  </G>
);

export const Streetlamp: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-9" y="-440" width="18" height="440" fill="#2A3040" {...sw} />
    <path d="M0 -430 Q60 -450 70 -400" fill="none" stroke="#1C1830" strokeWidth="14" strokeLinecap="round" />
    <path d="M0 -430 Q60 -450 70 -400" fill="none" stroke="#2A3040" strokeWidth="8" strokeLinecap="round" />
    <path d="M50 -400 H92 L82 -380 H60Z" fill="#FFE9A8" {...sw} />
    <ellipse cx="72" cy="-340" rx="90" ry="40" fill="#FFE9A8" opacity=".16" />
    <rect x="-26" y="-18" width="52" height="18" rx="4" fill="#2A3040" {...sw} />
  </G>
);

export const Hydrant: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-26" y="-96" width="52" height="96" rx="10" fill="#D62839" {...sw} />
    <path d="M-30 -96 Q0 -128 30 -96Z" fill="#D62839" {...sw} />
    <rect x="-40" y="-70" width="80" height="22" rx="8" fill="#B01F2E" {...sw} />
    <rect x="-34" y="-12" width="68" height="12" rx="4" fill="#B01F2E" {...sw} />
  </G>
);

export const TrashCan: React.FC<A> = (a) => (
  <G {...a}>
    <path d="M-38 -110 H38 L32 0 H-32Z" fill="#6F7B8B" {...sw} />
    <path d="M-44 -112 H44" stroke="#1C1830" strokeWidth="10" strokeLinecap="round" />
    <path d="M-20 -100 V-12 M0 -100 V-12 M20 -100 V-12" stroke="#1C1830" strokeOpacity=".4" strokeWidth="4" />
  </G>
);

export const Taxi: React.FC<A> = (a) => (
  <G {...a}>
    <path d="M-210 -40 Q-210 -96 -150 -100 L-100 -150 Q-90 -160 -70 -160 H70 Q90 -160 100 -150 L150 -100 Q210 -96 210 -40 V-20 H-210Z" fill="#F6C945" {...sw} />
    <path d="M-86 -146 L-114 -104 H-8 V-146Z M8 -146 V-104 H114 L86 -146Z" fill="#8FD3FF" {...sw} />
    <rect x="-34" y="-176" width="68" height="20" rx="5" fill="#FFF8EA" {...sw} />
    <path d="M-150 -60 H150" stroke="#1C1830" strokeWidth="3" strokeDasharray="14 10" opacity=".6" />
    {[-120, 120].map((x) => <g key={x}><circle cx={x} cy="-18" r="40" fill="#2A3040" {...sw} /><circle cx={x} cy="-18" r="18" fill="#C9CED6" {...thin} /></g>)}
    <rect x="-212" y="-62" width="14" height="22" rx="4" fill="#FFE9A8" {...thin} />
  </G>
);

export const Cloud: React.FC<A & { color?: string }> = ({ color = "#FFFFFF", ...a }) => (
  <G {...a}>
    <path d="M-120 0 Q-150 0 -150 -30 Q-150 -60 -112 -56 Q-100 -96 -56 -90 Q-30 -128 16 -104 Q60 -120 78 -80 Q132 -80 132 -34 Q132 0 96 0Z" fill={color} opacity=".92" stroke="#1C1830" strokeWidth="3" strokeOpacity=".25" />
  </G>
);

export const Moon: React.FC<A> = (a) => (
  <G {...a}>
    <circle cx="0" cy="-60" r="56" fill="#FFF6D6" stroke="#1C1830" strokeWidth="3" strokeOpacity=".3" />
    <circle cx="-16" cy="-70" r="10" fill="#EBDDB0" /><circle cx="18" cy="-44" r="7" fill="#EBDDB0" /><circle cx="14" cy="-84" r="5" fill="#EBDDB0" />
  </G>
);

export const FloorBoards: React.FC<{ y: number; h: number; color: string; line?: string; w?: number }> = ({ y, h, color, line, w = 1080 }) => (
  <g>
    <rect x="0" y={y} width={w} height={h} fill={color} />
    <path d={`M0 ${y} H${w}`} stroke="#1C1830" strokeWidth="5" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 140 - 30} ${y + 6} L${i * 190 - 330} ${y + h}`} stroke={line ?? shade(color, -0.1)} strokeWidth="4" />)}
    {[0.3, 0.6].map((t) => <path key={t} d={`M0 ${y + h * t} H${w}`} stroke={line ?? shade(color, -0.1)} strokeWidth="3" />)}
  </g>
);

/** Silbernes Luxus-Coupé (generisch, ohne Marke). */
export const Coupe: React.FC<A & { color?: string }> = ({ color = "#B9C2CC", ...a }) => (
  <G {...a}>
    <path d="M-250 -46 Q-252 -92 -190 -100 L-120 -150 Q-96 -166 -60 -168 H70 Q110 -166 140 -142 L190 -104 Q252 -98 256 -50 V-24 H-250Z" fill={color} {...sw} />
    <path d="M-104 -146 L-150 -106 H-6 V-156 H-50 Q-84 -156 -104 -146Z M10 -156 V-106 H160 L120 -138 Q96 -156 66 -156Z" fill="#9FD7F2" {...sw} />
    <path d="M-236 -70 H246" stroke="#fff" strokeOpacity=".45" strokeWidth="6" />
    <path d="M-60 -96 H-34 M60 -96 H86" stroke="#1C1830" strokeWidth="5" strokeLinecap="round" opacity=".6" />
    <rect x="232" y="-82" width="22" height="20" rx="5" fill="#FFF3C4" {...thin} />
    <rect x="-252" y="-80" width="16" height="18" rx="4" fill="#E0484F" {...thin} />
    {[-150, 160].map((x) => <g key={x}><circle cx={x} cy="-22" r="44" fill="#22252E" {...sw} /><circle cx={x} cy="-22" r="22" fill="#D9DEE5" {...thin} /><circle cx={x} cy="-22" r="7" fill="#22252E" /></g>)}
  </G>
);

/** Flügel (Konzertflügel, seitlich, Deckel offen). */
export const GrandPiano: React.FC<A & { color?: string }> = ({ color = "#16141C", ...a }) => (
  <G {...a}>
    <path d="M-150 -170 L-140 0 M150 -170 L140 0 M120 -170 L116 -40" stroke="#1C1830" strokeWidth="16" strokeLinecap="round" />
    <path d="M-190 -170 H200 Q240 -170 240 -210 Q240 -260 160 -268 Q60 -276 -20 -250 L-190 -230Z" fill={color} {...sw} />
    <path d="M-170 -236 L120 -420 L140 -400 L-150 -232Z" fill={shade(color, 0.25)} {...sw} />
    <rect x="-200" y="-196" width="140" height="30" fill="#FFF8EA" {...sw} />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-194 + i * 19} y="-196" width="9" height="18" fill="#1C1830" />)}
    <path d="M-160 -248 H180" stroke="#fff" strokeOpacity=".2" strokeWidth="5" />
  </G>
);

/** Palme. */
export const Palm: React.FC<A> = (a) => (
  <G {...a}>
    <path d="M-14 0 Q-30 -220 18 -420 L38 -416 Q4 -220 16 0Z" fill="#8A5A34" {...sw} />
    {[-160, -110, -60, -10, 40].map((r, i) => (
      <path key={i} d="M28 -418 Q120 -470 210 -410 Q120 -440 28 -418Z" fill={i % 2 ? "#3E9C5A" : "#2F7F48"} {...sw} transform={`rotate(${r + 70} 28 -418)`} />
    ))}
  </G>
);

/** Langer, schwarzer Sixties-Straßenkreuzer (Viertürer, Chrom). Ohne Marke. */
export const Impala: React.FC<A & { color?: string }> = ({ color = "#17161D", ...a }) => (
  <G {...a}>
    {/* Karosserie */}
    <path d="M-330 -40 Q-334 -96 -280 -104 L-170 -110 L-110 -170 Q-92 -182 -60 -184 H110 Q140 -182 158 -166 L210 -112 L300 -106 Q340 -100 340 -52 V-30 H-330Z" fill={color} {...sw} />
    {/* Fenster */}
    <path d="M-150 -112 L-102 -160 Q-90 -170 -66 -170 H14 V-112Z M28 -170 H104 Q126 -170 138 -158 L184 -112 H28Z" fill="#6C8CA8" {...sw} />
    <path d="M-120 -150 L-90 -126 M60 -160 L90 -134" stroke="#fff" strokeOpacity=".35" strokeWidth="6" strokeLinecap="round" />
    {/* Chromleisten, Stoßstangen */}
    <path d="M-318 -78 H330" stroke="#C9D1DA" strokeWidth="6" />
    <rect x="-344" y="-50" width="40" height="22" rx="8" fill="#C9D1DA" {...thin} />
    <rect x="312" y="-50" width="40" height="22" rx="8" fill="#C9D1DA" {...thin} />
    <rect x="316" y="-96" width="22" height="18" rx="5" fill="#FFF3C4" {...thin} />
    <rect x="-336" y="-94" width="14" height="22" rx="4" fill="#E0484F" {...thin} />
    <path d="M-20 -100 H4 M150 -100 H174" stroke="#C9D1DA" strokeWidth="5" strokeLinecap="round" />
    <path d="M-230 -96 Q0 -112 260 -96" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="8" strokeLinecap="round" />
    {[-210, 220].map((x) => <g key={x}><circle cx={x} cy="-26" r="46" fill="#1C1830" {...sw} /><circle cx={x} cy="-26" r="24" fill="#C9D1DA" {...thin} /><circle cx={x} cy="-26" r="8" fill="#1C1830" /></g>)}
  </G>
);

/** Zapfsäule (alt, mit Zählwerk). */
export const GasPump: React.FC<A & { color?: string; price?: string }> = ({ color = "#C8423A", price = "2.57", ...a }) => (
  <G {...a}>
    <rect x="-70" y="-300" width="140" height="300" rx="16" fill={color} {...sw} />
    <rect x="-52" y="-270" width="104" height="70" rx="8" fill="#FFF8EA" {...sw} />
    <text x="0" y="-222" textAnchor="middle" fontFamily="Anton" fontSize="40" fill="#1C1830">{price}</text>
    <rect x="-40" y="-170" width="80" height="40" rx="6" fill={shade(color, -0.25)} {...thin} />
    <path d="M70 -220 Q120 -220 116 -120 Q112 -60 86 -60" fill="none" stroke="#1C1830" strokeWidth="10" strokeLinecap="round" />
    <rect x="60" y="-150" width="26" height="60" rx="6" fill="#3A3A44" {...thin} />
    <rect x="-80" y="-12" width="160" height="16" rx="4" fill="#7A7A86" {...sw} />
  </G>
);

/** Motel-Leuchtschild auf Mast. */
export const MotelSign: React.FC<A & { text?: string; sub?: string }> = ({ text = "MOTEL", sub = "VACANCY", ...a }) => (
  <G {...a}>
    <rect x="-14" y="-700" width="28" height="700" fill="#5A5A66" {...sw} />
    <path d="M-170 -900 H170 L190 -700 H-150Z" fill="#E8B23A" {...sw} />
    <text x="10" y="-780" textAnchor="middle" fontFamily="Anton" fontSize="96" fill="#D62839" stroke="#1C1830" strokeWidth="3" letterSpacing="4">{text}</text>
    <rect x="-120" y="-690" width="250" height="70" rx="10" fill="#1C1830" {...sw} />
    <text x="5" y="-640" textAnchor="middle" fontFamily="Anton" fontSize="44" fill="#FF5B6E" letterSpacing="4">{sub}</text>
  </G>
);

/** Center-Console-Boot (seitlich) mit zwei Außenbordern. */
export const Boat: React.FC<A & { color?: string; name?: string }> = ({ color = "#F4F2EC", name = "SLICE OF LIFE", ...a }) => (
  <G {...a}>
    {/* Rumpf */}
    <path d="M-330 -150 H300 Q330 -150 340 -120 L310 -20 Q300 0 270 0 H-230 Q-300 0 -330 -60Z" fill={color} {...sw} />
    <path d="M-326 -110 H330" stroke="#2B4F8C" strokeWidth="14" />
    <text x="-80" y="-48" textAnchor="middle" fontFamily="Anton" fontSize="34" fill="#2B4F8C" letterSpacing="2">{name}</text>
    {/* Konsole + T-Top */}
    <rect x="-40" y="-230" width="110" height="80" rx="10" fill={color} {...sw} />
    <path d="M-30 -230 L-10 -270 H60 L70 -230Z" fill="#9FD7F2" {...sw} />
    <path d="M-60 -150 V-340 M100 -150 V-340" stroke="#C9D1DA" strokeWidth="10" />
    <rect x="-90" y="-360" width="220" height="24" rx="8" fill="#2B4F8C" {...sw} />
    {/* zwei Außenborder am Heck (links) */}
    {[-352, -380].map((x, i) => (
      <g key={i}>
        <rect x={x - 18} y="-200" width="40" height="90" rx="10" fill={i ? "#3A3A44" : "#4A4A56"} {...sw} />
        <rect x={x - 6} y="-112" width="16" height="90" fill="#5A5A66" {...thin} />
      </g>
    ))}
  </G>
);

/** Steg (Holz) – Ursprung oben Mitte. */
export const Dock: React.FC<A & { w?: number }> = ({ w = 900, ...a }) => (
  <G {...a}>
    {Array.from({ length: Math.ceil(w / 150) + 1 }, (_, i) => <rect key={i} x={-w / 2 + i * 150 - 14} y="0" width="28" height="260" fill="#6E4A2E" {...sw} />)}
    <rect x={-w / 2} y="-30" width={w} height="40" fill="#A9774A" {...sw} />
    {Array.from({ length: Math.ceil(w / 60) }, (_, i) => <path key={i} d={`M${-w / 2 + i * 60} -30 V10`} stroke="#1C1830" strokeOpacity=".25" strokeWidth="3" />)}
  </G>
);

/** Banknoten-Druckmaschine (seitlich), Bogen laufen durch. */
export const PrintingPress: React.FC<A & { phase?: number }> = ({ phase = 0, ...a }) => (
  <G {...a}>
    <rect x="-380" y="-420" width="760" height="420" rx="20" fill="#8A96A6" {...sw} />
    <rect x="-380" y="-470" width="760" height="70" rx="14" fill="#6E7A8A" {...sw} />
    {[-240, -80, 80, 240].map((x, i) => (
      <g key={x}>
        <circle cx={x} cy="-260" r="62" fill="#C9D1DA" {...sw} />
        <path d={`M${x} -260 L${x + 54 * Math.cos(phase + i)} ${-260 + 54 * Math.sin(phase + i)}`} stroke="#1C1830" strokeWidth="8" strokeLinecap="round" />
      </g>
    ))}
    <rect x="-330" y="-120" width="660" height="40" fill="#E9D8B4" stroke="#1C1830" strokeWidth="4" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-320 + ((i * 90 + phase * 60) % 660)} y="-116" width="70" height="32" fill="#D9A06A" stroke="#1C1830" strokeWidth="2" />)}
    <rect x="300" y="-430" width="60" height="40" rx="6" fill="#F6C945" {...thin} />
    <circle cx="-330" cy="-440" r="12" fill="#2FA36B" />
  </G>
);

/** Drache (seitlich, schwarz-rot), Flügel schlagen mit `flap` (0..1). */
export const Dragon: React.FC<A & { flap?: number; color?: string; wing?: string }> = ({ flap = 0.5, color = "#1E1A22", wing = "#8E1E22", ...a }) => {
  const wy = -260 - flap * 160;
  return (
    <G {...a}>
      {/* Schwanz */}
      <path d="M-180 -120 Q-360 -100 -460 -40 Q-380 -80 -200 -90Z" fill={color} {...sw} />
      <path d="M-470 -40 L-420 -70 L-430 -20Z" fill={wing} {...sw} />
      {/* hinterer Flügel */}
      <path d={`M-40 -200 L-120 ${wy - 40} L-40 ${wy + 10} L40 ${wy - 60} L60 -200Z`} fill={wing} opacity=".75" {...sw} />
      {/* Körper */}
      <ellipse cx="-40" cy="-140" rx="200" ry="90" fill={color} {...sw} />
      <path d="M-200 -120 Q-40 -60 140 -110" fill="none" stroke="#3A3440" strokeWidth="10" />
      {/* Beine */}
      {[-140, 60].map((x) => <path key={x} d={`M${x} -80 L${x - 10} 0 H${x + 30}`} fill="none" stroke={color} strokeWidth="34" strokeLinecap="round" strokeLinejoin="round" />)}
      {/* Hals + Kopf */}
      <path d="M120 -180 Q220 -260 250 -330 L300 -310 Q270 -230 170 -130Z" fill={color} {...sw} />
      <path d="M240 -360 Q300 -380 380 -340 L390 -320 Q330 -310 300 -300 Q260 -300 240 -330Z" fill={color} {...sw} />
      <path d="M250 -360 L230 -410 L270 -370 M280 -366 L280 -414 L300 -366" fill={color} stroke="#1C1830" strokeWidth="5" />
      <circle cx="320" cy="-345" r="7" fill="#F6C945" />
      <path d="M350 -322 L384 -322" stroke="#8E1E22" strokeWidth="5" />
      {/* Rückenstacheln */}
      {[-180, -120, -60, 0, 60].map((x) => <path key={x} d={`M${x - 16} -224 L${x} -258 L${x + 16} -224Z`} fill={wing} {...thin} />)}
      {/* vorderer Flügel */}
      <path d={`M0 -190 L-60 ${wy} L40 ${wy + 40} L120 ${wy - 30} L200 ${wy + 60} L120 -190Z`} fill={wing} {...sw} />
      <path d={`M60 -190 L40 ${wy + 40} M100 -190 L120 ${wy - 30}`} stroke="#1C1830" strokeWidth="6" />
    </G>
  );
};
