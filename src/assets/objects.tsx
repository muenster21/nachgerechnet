import React from "react";
import { A, G, sw, thin, shade } from "./base";
import { BRAND } from "../lib/theme";

/* Alle Objekte: Ursprung unten Mitte, Größe in „Rig-Einheiten“ (Bierkrug ≈ 110 hoch). */

export const BeerMug: React.FC<A & { fill?: number }> = ({ fill = 1, ...a }) => (
  <G {...a}>
    <path d="M42 -86 q38 -4 38 30 q0 34 -34 34" fill="none" stroke="#1C1830" strokeWidth="14" strokeLinecap="round" />
    <path d="M42 -86 q38 -4 38 30 q0 34 -34 34" fill="none" stroke="#E7E3D8" strokeWidth="6" strokeLinecap="round" />
    <path d="M-40 -104 H40 L36 -4 Q35 0 30 0 H-30 Q-35 0 -36 -4 Z" fill="#F4F0E4" {...sw} />
    <path d={`M-36 ${-4 - 92 * fill} H36 L33 -4 Q32 -1 28 -1 H-28 Q-32 -1 -33 -4 Z`} fill="#F2A71B" />
    <path d="M-30 -20 V-92 M-14 -20 V-88" stroke="#fff" strokeOpacity=".35" strokeWidth="5" strokeLinecap="round" />
    <path d="M-42 -100 Q-44 -126 -22 -124 Q-14 -142 8 -132 Q28 -144 38 -124 Q48 -120 42 -100 Z" fill="#fff" {...sw} />
  </G>
);

export const BeerBottle: React.FC<A & { color?: string }> = ({ color = "#2F7D3E", ...a }) => (
  <G {...a}>
    <path d="M-16 0 V-88 Q-16 -104 -8 -118 V-168 H8 V-118 Q16 -104 16 -88 V0 Z" fill={color} {...sw} />
    <rect x="-17" y="-80" width="34" height="42" fill="#F4E7CF" {...thin} />
    <circle cx="0" cy="-59" r="8" fill="#D62839" />
    <rect x="-9" y="-176" width="18" height="10" rx="3" fill="#D9B24A" {...thin} />
    <path d="M-10 -90 V-20" stroke="#fff" strokeOpacity=".3" strokeWidth="4" strokeLinecap="round" />
  </G>
);

export const Coin: React.FC<A & { label?: string }> = ({ label = "€", ...a }) => (
  <G {...a}>
    <circle cx="0" cy="-30" r="30" fill="#F6C945" {...sw} />
    <circle cx="0" cy="-30" r="22" fill="none" stroke="#D49A1A" strokeWidth="4" />
    <text x="0" y="-19" textAnchor="middle" fontFamily="Anton" fontSize="34" fill="#9A6A0E">{label}</text>
    <path d="M-16 -46 Q-8 -54 6 -52" stroke="#fff" strokeOpacity=".6" strokeWidth="5" fill="none" strokeLinecap="round" />
  </G>
);

export const MoneyStack: React.FC<A & { n?: number; color?: string }> = ({ n = 4, color = "#6BBF7A", ...a }) => (
  <G {...a}>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(0 ${-i * 16})`}>
        <rect x="-62" y="-16" width="124" height="18" rx="4" fill={color} {...sw} />
        <rect x="-62" y="-16" width="124" height="6" rx="3" fill={shade(color, 0.12)} />
        <circle cx="0" cy="-7" r="5" fill={shade(color, -0.18)} />
      </g>
    ))}
    <rect x="-18" y={-n * 16 - 2} width="36" height={n * 16 + 4} fill="#F4E7CF" opacity=".92" {...thin} />
    <text x="0" y={-n * 8 + 8} textAnchor="middle" fontFamily="Anton" fontSize="26" fill="#1C1830">€</text>
  </G>
);

export const Banknote: React.FC<A & { value?: string; color?: string }> = ({ value = "50", color = "#7BC68B", ...a }) => (
  <G {...a}>
    <rect x="-70" y="-76" width="140" height="76" rx="8" fill={color} {...sw} />
    <rect x="-60" y="-66" width="120" height="56" rx="5" fill="none" stroke={shade(color, -0.2)} strokeWidth="3" />
    <circle cx="0" cy="-38" r="20" fill={shade(color, 0.14)} {...thin} />
    <text x="0" y="-30" textAnchor="middle" fontFamily="Anton" fontSize="26" fill="#1C1830">{value}</text>
    <text x="-50" y="-48" fontFamily="Anton" fontSize="16" fill="#1C1830">{value}</text>
    <text x="50" y="-20" textAnchor="end" fontFamily="Anton" fontSize="16" fill="#1C1830">{value}</text>
  </G>
);

export const Calculator: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-44" y="-122" width="88" height="122" rx="12" fill="#2B2B3D" {...sw} />
    <rect x="-34" y="-112" width="68" height="28" rx="5" fill={BRAND.signature} {...thin} />
    <text x="30" y="-91" textAnchor="end" fontFamily="Anton" fontSize="20" fill="#1C1830">0,00</text>
    {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={r + "-" + c} x={-34 + c * 24} y={-72 + r * 17} width="18" height="12" rx="3" fill={r === 3 && c === 2 ? "#D62839" : "#F4F0E4"} />))}
  </G>
);

export const Wallet: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-56" y="-70" width="112" height="70" rx="12" fill="#8B5A3C" {...sw} />
    <path d="M-56 -50 H56" stroke="#1C1830" strokeWidth="3" />
    <rect x="20" y="-44" width="38" height="26" rx="8" fill="#D9A441" {...sw} />
    <circle cx="39" cy="-31" r="4" fill="#1C1830" />
  </G>
);

export const Phone: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-34" y="-120" width="68" height="120" rx="12" fill="#2B2B3D" {...sw} />
    <rect x="-28" y="-112" width="56" height="94" rx="5" fill="#8FD3FF" />
    <circle cx="0" cy="-8" r="4" fill="#F4F0E4" />
  </G>
);

export const Clock: React.FC<A & { hour?: number; minute?: number }> = ({ hour = 3, minute = 0, ...a }) => {
  const ha = (hour % 12) * 30 + minute * 0.5, ma = minute * 6;
  return (
    <G {...a}>
      <circle cx="0" cy="-60" r="58" fill="#FFF8EA" {...sw} strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d="M0 -110 V-102" transform={`rotate(${i * 30} 0 -60)`} stroke="#1C1830" strokeWidth="4" strokeLinecap="round" />)}
      <path d="M0 -60 V-92" transform={`rotate(${ma} 0 -60)`} stroke="#1C1830" strokeWidth="4" strokeLinecap="round" />
      <path d="M0 -60 V-80" transform={`rotate(${ha} 0 -60)`} stroke="#1C1830" strokeWidth="7" strokeLinecap="round" />
      <circle cx="0" cy="-60" r="5" fill="#D62839" />
    </G>
  );
};

export const KeyRing: React.FC<A> = (a) => (
  <G {...a}>
    <circle cx="0" cy="-70" r="22" fill="none" stroke="#C9CED6" strokeWidth="9" />
    <circle cx="0" cy="-70" r="22" fill="none" stroke="#1C1830" strokeWidth="2" />
    <path d="M0 -48 V-4" stroke="#E0B84C" strokeWidth="12" strokeLinecap="round" />
    <path d="M0 -48 V-4" stroke="#1C1830" strokeWidth="3" strokeLinecap="round" opacity=".6" />
    <path d="M0 -14 H16 M0 -28 H12" stroke="#E0B84C" strokeWidth="8" strokeLinecap="round" />
  </G>
);

export const PiggyBank: React.FC<A> = (a) => (
  <G {...a}>
    <ellipse cx="0" cy="-58" rx="78" ry="56" fill="#F4A6B8" {...sw} />
    <ellipse cx="64" cy="-52" rx="22" ry="16" fill="#EE8BA2" {...sw} />
    <circle cx="58" cy="-52" r="3.5" fill="#1C1830" /><circle cx="72" cy="-52" r="3.5" fill="#1C1830" />
    <path d="M-30 -102 L-24 -124 L-6 -106Z" fill="#F4A6B8" {...sw} />
    <circle cx="42" cy="-76" r="5" fill="#1C1830" />
    <path d="M-20 -108 H12" stroke="#1C1830" strokeWidth="6" strokeLinecap="round" />
    <rect x="-52" y="-12" width="20" height="14" rx="4" fill="#EE8BA2" {...sw} /><rect x="30" y="-12" width="20" height="14" rx="4" fill="#EE8BA2" {...sw} />
    <path d="M-78 -64 q-18 -4 -14 -22" fill="none" stroke="#1C1830" strokeWidth="5" strokeLinecap="round" />
  </G>
);

/** Kassenzettel als Deko (Papierrolle) */
export const Receipt: React.FC<A & { w?: number; h?: number }> = ({ w = 120, h = 150, ...a }) => (
  <G {...a}>
    <path d={`M${-w / 2} 0 V${-h} H${w / 2} V0 L${w / 2 - 10} -8 L${w / 2 - 20} 0 L${w / 2 - 30} -8 L${w / 2 - 40} 0 L${-w / 2 + 40} -8 L${-w / 2 + 30} 0 L${-w / 2 + 20} -8 L${-w / 2 + 10} 0 Z`} fill="#FFF8EA" {...sw} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-w / 2 + 14} ${-h + 22 + i * 20} h${w - 40 - (i % 2) * 22}`} stroke="#1C1830" strokeOpacity=".5" strokeWidth="4" strokeLinecap="round" />)}
  </G>
);

export const Calendar: React.FC<A & { day?: string; month?: string }> = ({ day = "1", month = "JAN", ...a }) => (
  <G {...a}>
    <rect x="-60" y="-120" width="120" height="120" rx="12" fill="#FFF8EA" {...sw} />
    <path d="M-60 -92 V-108 Q-60 -120 -48 -120 H48 Q60 -120 60 -108 V-92 Z" fill="#D62839" {...sw} />
    <text x="0" y="-98" textAnchor="middle" fontFamily="Anton" fontSize="20" fill="#fff">{month}</text>
    <text x="0" y="-26" textAnchor="middle" fontFamily="Anton" fontSize={day.length > 2 ? 44 : 64} fill="#1C1830">{day}</text>
    <circle cx="-30" cy="-120" r="5" fill="#1C1830" /><circle cx="30" cy="-120" r="5" fill="#1C1830" />
  </G>
);

export const Sparkle: React.FC<A> = (a) => (
  <G {...a}><path d="M0 -50 Q4 -4 50 0 Q4 4 0 50 Q-4 4 -50 0 Q-4 -4 0 -50Z" fill="#FFF6C8" {...thin} /></G>
);

export const SweatDrop: React.FC<A> = (a) => (
  <G {...a}><path d="M0 -40 Q22 -8 14 8 Q0 20 -14 8 Q-22 -8 0 -40Z" fill="#9AD8FF" {...thin} /><path d="M-6 -6 Q-8 4 -2 8" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></G>
);

export const Books: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-70" y="-34" width="140" height="34" rx="5" fill="#7A2E22" {...sw} />
    <rect x="-62" y="-68" width="126" height="34" rx="5" fill="#2F6DB5" {...sw} />
    <rect x="-74" y="-102" width="132" height="34" rx="5" fill="#2FA36B" {...sw} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${-50 + i * 6} ${-17 - i * 34} H${44 - i * 2}`} stroke="#F4E7CF" strokeWidth="5" strokeLinecap="round" opacity=".7" />)}
    <path d="M-30 -102 V-68 M-30 -68 V-34" stroke="#1C1830" strokeWidth="3" opacity=".4" />
  </G>
);

export const Blueprint: React.FC<A> = (a) => (
  <G {...a}>
    <g transform="rotate(-18)">
      <rect x="-26" y="-130" width="52" height="130" rx="22" fill="#7FB3E6" {...sw} />
      <ellipse cx="0" cy="-130" rx="26" ry="12" fill="#BCD9F2" {...sw} />
      <path d="M-14 -100 H14 M-14 -80 H8 M-14 -60 H14 M-14 -40 H10" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8" />
      <rect x="-28" y="-92" width="56" height="12" fill="#D62839" opacity=".85" stroke="#1C1830" strokeWidth="3" />
    </g>
  </G>
);

/** Vodka Cranberry: hohes Glas, rotes Getränk, Eis, Limettenscheibe, Strohhalm */
export const CocktailGlass: React.FC<A & { fill?: number }> = ({ fill = 1, ...a }) => (
  <G {...a}>
    <path d="M-34 -118 H34 L28 -4 Q27 0 22 0 H-22 Q-27 0 -28 -4 Z" fill="#F4F0E4" fillOpacity=".55" {...sw} />
    <path d={`M${-33 + 5 * (1 - fill)} ${-8 - 100 * fill} H${33 - 5 * (1 - fill)} L27 -5 Q26 -2 22 -2 H-22 Q-26 -2 -27 -5 Z`} fill="#D6304F" />
    <path d={`M-32 ${-8 - 100 * fill} H32`} stroke="#fff" strokeOpacity=".35" strokeWidth="4" />
    <rect x="-18" y="-86" width="22" height="22" rx="4" fill="#EAF6FF" opacity=".8" transform="rotate(-12 -7 -75)" {...thin} />
    <rect x="2" y="-62" width="20" height="20" rx="4" fill="#EAF6FF" opacity=".8" transform="rotate(14 12 -52)" {...thin} />
    <path d="M14 -4 L30 -150" stroke="#1C1830" strokeWidth="9" strokeLinecap="round" />
    <path d="M14 -4 L30 -150" stroke="#F4E7CF" strokeWidth="4" strokeLinecap="round" />
    <circle cx="32" cy="-114" r="22" fill="#9BD66B" {...sw} />
    <circle cx="32" cy="-114" r="12" fill="#CDEE9E" stroke="#1C1830" strokeWidth="2" />
    <path d="M32 -114 L32 -134 M32 -114 L48 -106 M32 -114 L16 -106" stroke="#7FB84E" strokeWidth="3" />
    <path d="M-24 -100 V-20" stroke="#fff" strokeOpacity=".4" strokeWidth="5" strokeLinecap="round" />
  </G>
);
