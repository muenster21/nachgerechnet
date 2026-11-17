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
