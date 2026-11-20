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

export const MoneyStack: React.FC<A & { n?: number; color?: string; label?: string }> = ({ n = 4, color = "#6BBF7A", label = "€", ...a }) => (
  <G {...a}>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(0 ${-i * 16})`}>
        <rect x="-62" y="-16" width="124" height="18" rx="4" fill={color} {...sw} />
        <rect x="-62" y="-16" width="124" height="6" rx="3" fill={shade(color, 0.12)} />
        <circle cx="0" cy="-7" r="5" fill={shade(color, -0.18)} />
      </g>
    ))}
    <rect x="-18" y={-n * 16 - 2} width="36" height={n * 16 + 4} fill="#F4E7CF" opacity=".92" {...thin} />
    <text x="0" y={-n * 8 + 8} textAnchor="middle" fontFamily="Anton" fontSize="26" fill="#1C1830">{label}</text>
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

/** Diagramm-Tafel: Tortendiagramm mit kleinem Schnitz + Balken (Marshalls Charts) */
export const ChartBoard: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-150" y="-210" width="300" height="210" rx="12" fill="#FFF8EA" {...sw} />
    <rect x="-150" y="-210" width="300" height="34" rx="12" fill="#2F6DB5" {...sw} />
    <text x="0" y="-185" textAnchor="middle" fontFamily="Anton" fontSize="20" fill="#fff" letterSpacing="2">BATTING AVERAGE</text>
    <circle cx="-70" cy="-98" r="56" fill="#C9CED6" {...sw} />
    <path d="M-70 -98 L-70 -154 A56 56 0 0 1 -63 -153.6 Z" fill="#D62839" stroke="#1C1830" strokeWidth="3" />
    <path d="M30 -60 H134 M30 -88 H108 M30 -116 H70 M30 -144 H48" stroke="#1C1830" strokeWidth="10" strokeLinecap="round" opacity=".85" />
    <path d="M30 -60 H134" stroke="#D62839" strokeWidth="10" strokeLinecap="round" opacity="0" />
    <path d="M-150 -14 H150" stroke="#1C1830" strokeWidth="3" opacity=".25" />
    <path d="M-30 0 L-44 60 M30 0 L44 60" stroke="#6E4A2C" strokeWidth="10" strokeLinecap="round" />
  </G>
);

/** Tumbler mit Bourbon (Charlie). */
export const Tumbler: React.FC<A & { fill?: number }> = ({ fill = 1, ...a }) => (
  <G {...a}>
    <path d="M-40 -84 H40 L34 -6 Q33 0 26 0 H-26 Q-33 0 -34 -6 Z" fill="#F4F0E4" fillOpacity=".5" {...sw} />
    <path d={`M-37 ${-14 - 40 * fill} H37 L34 -8 Q33 -4 26 -4 H-26 Q-33 -4 -34 -8 Z`} fill="#C8752A" />
    <rect x="-22" y={-40 - 40 * fill} width="26" height="26" rx="5" fill="#EAF6FF" opacity=".85" transform="rotate(-10)" {...thin} />
    <path d="M-34 -14 H34" stroke="#1C1830" strokeWidth="5" opacity=".5" />
    <path d="M-26 -70 V-24" stroke="#fff" strokeOpacity=".45" strokeWidth="6" strokeLinecap="round" />
  </G>
);

/** Whiskeyflasche (generisch, ohne Marke). */
export const WhiskeyBottle: React.FC<A> = (a) => (
  <G {...a}>
    <path d="M-40 -4 V-150 Q-40 -176 -14 -186 V-232 H14 V-186 Q40 -176 40 -150 V-4 Q40 0 34 0 H-34 Q-40 0 -40 -4Z" fill="#B8641F" {...sw} />
    <rect x="-18" y="-252" width="36" height="24" rx="5" fill="#1C1830" />
    <rect x="-32" y="-128" width="64" height="70" rx="6" fill="#F4E7CF" {...sw} />
    <path d="M-20 -104 H20 M-20 -86 H12" stroke="#1C1830" strokeWidth="5" strokeLinecap="round" />
    <path d="M-28 -160 V-20" stroke="#fff" strokeOpacity=".3" strokeWidth="7" strokeLinecap="round" />
  </G>
);

/** Spielchip (Wetten). */
export const PokerChip: React.FC<A & { color?: string }> = ({ color = "#D62839", ...a }) => (
  <G {...a}>
    <ellipse cx="0" cy="-40" rx="46" ry="46" fill={color} {...sw} />
    {Array.from({ length: 6 }, (_, i) => { const r = (i * Math.PI) / 3; return <rect key={i} x={Math.cos(r) * 38 - 7} y={-40 + Math.sin(r) * 38 - 7} width="14" height="14" rx="3" fill="#FFF8EA" transform={`rotate(${i * 60} ${Math.cos(r) * 38} ${-40 + Math.sin(r) * 38})`} />; })}
    <circle cx="0" cy="-40" r="24" fill="#FFF8EA" {...thin} />
    <text x="0" y="-31" textAnchor="middle" fontFamily="Anton" fontSize="26" fill="#1C1830">$</text>
  </G>
);

/** Billard-Queue (senkrecht gehalten). */
export const Cue: React.FC<A> = (a) => (
  <G {...a}>
    <path d="M-8 0 L-3 -360 H3 L8 0Z" fill="#D9B27A" {...sw} />
    <path d="M-8 0 L-6 -120 H6 L8 0Z" fill="#3A2416" {...thin} />
    <rect x="-4" y="-372" width="8" height="12" fill="#5A8CC8" {...thin} />
  </G>
);

/** Kreditkarte. */
export const CreditCard: React.FC<A & { name?: string; color?: string }> = ({ name = "H. AFRAMIAN", color = "#2B4F8C", ...a }) => (
  <G {...a}>
    <rect x="-90" y="-116" width="180" height="116" rx="14" fill={color} {...sw} />
    <rect x="-66" y="-90" width="34" height="26" rx="5" fill="#E8C35A" {...thin} />
    <text x="-70" y="-44" fontFamily="Anton" fontSize="17" fill="#fff" letterSpacing="2">•••• •••• •••• 4512</text>
    <text x="-70" y="-16" fontFamily="Anton" fontSize="17" fill="#fff" letterSpacing="1">{name}</text>
    <circle cx="52" cy="-86" r="14" fill="#E0484F" opacity=".9" /><circle cx="68" cy="-86" r="14" fill="#F6C945" opacity=".9" />
  </G>
);

/** Kuchenstück auf Teller. */
export const Pie: React.FC<A> = (a) => (
  <G {...a}>
    <ellipse cx="0" cy="-10" rx="80" ry="16" fill="#FFFFFF" {...sw} />
    <path d="M-56 -18 L56 -18 L40 -70 Q0 -84 -40 -70Z" fill="#E8B061" {...sw} />
    <path d="M-50 -34 H50" stroke="#B5523A" strokeWidth="12" />
    <path d="M-40 -70 Q0 -90 40 -70" fill="none" stroke="#C88A3E" strokeWidth="8" strokeLinecap="round" />
  </G>
);

/** Rolle Plastikfolie. */
export const WrapRoll: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-90" y="-80" width="180" height="80" rx="40" fill="#DCEFF6" opacity=".95" {...sw} />
    <ellipse cx="-90" cy="-40" rx="18" ry="40" fill="#C3E2EE" {...sw} />
    <ellipse cx="-90" cy="-40" rx="7" ry="14" fill="#8A6A4A" {...thin} />
    <path d="M-60 -64 H70 M-60 -20 H70" stroke="#fff" strokeOpacity=".8" strokeWidth="6" strokeLinecap="round" />
  </G>
);

/** Mikroskop. */
export const Microscope: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-60" y="-24" width="120" height="24" rx="6" fill="#3A3A44" {...sw} />
    <path d="M20 -24 Q40 -110 0 -170" fill="none" stroke="#3A3A44" strokeWidth="24" strokeLinecap="round" />
    <rect x="-40" y="-90" width="70" height="14" fill="#C9D1DA" {...thin} />
    <g transform="rotate(-24 -10 -160)"><rect x="-26" y="-230" width="32" height="110" rx="8" fill="#F4F2EC" {...sw} /><rect x="-30" y="-244" width="40" height="22" rx="6" fill="#3A3A44" {...thin} /></g>
  </G>
);

/** Blaues Plastikfass (55 Gallonen), optional mit Geld oben. */
export const Barrel: React.FC<A & { color?: string; cash?: boolean }> = ({ color = "#2F6FB8", cash = false, ...a }) => (
  <G {...a}>
    {cash && [[-50, -330], [0, -340], [50, -328], [-24, -360], [26, -362]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${(i % 2 ? 8 : -6)})`}><rect x="-40" y="-14" width="80" height="28" rx="4" fill="#7BC68B" {...thin} /><rect x="-10" y="-14" width="20" height="28" fill="#F4E7CF" {...thin} /></g>
    ))}
    <path d="M-100 -300 Q-112 -150 -100 0 H100 Q112 -150 100 -300Z" fill={color} {...sw} />
    <ellipse cx="0" cy="-300" rx="100" ry="22" fill={shade(color, 0.15)} {...sw} />
    <path d="M-106 -200 Q0 -184 106 -200 M-106 -100 Q0 -84 106 -100" fill="none" stroke={shade(color, -0.25)} strokeWidth="8" />
    <path d="M-70 -270 Q-80 -150 -70 -30" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="12" strokeLinecap="round" />
  </G>
);

/** Geldberg (Bündel, gestapelt). */
export const MoneyPile: React.FC<A & { w?: number }> = ({ w = 700, ...a }) => {
  const rows = 9;
  return (
    <G {...a}>
      {Array.from({ length: rows }, (_, r) => {
        const rw = w * (1 - r / (rows + 1));
        const n = Math.max(1, Math.floor(rw / 84));
        return Array.from({ length: n }, (_, i) => (
          <g key={r + "-" + i} transform={`translate(${-rw / 2 + 42 + i * (rw - 84) / Math.max(1, n - 1)} ${-r * 34 - 17})`}>
            <rect x="-42" y="-17" width="84" height="34" rx="4" fill={(r + i) % 3 ? "#7BC68B" : "#6AB47A"} {...thin} />
            <rect x="-10" y="-17" width="20" height="34" fill="#F4E7CF" {...thin} />
          </g>
        ));
      })}
    </G>
  );
};

/** Blechdose (Erdnusskrokant) mit Geldscheinen. */
export const Tin: React.FC<A> = (a) => (
  <G {...a}>
    {[[-30, -120, -10], [10, -128, 8], [36, -118, 16]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}><rect x="-36" y="-20" width="72" height="40" rx="5" fill="#7BC68B" {...thin} /><text x="0" y="8" textAnchor="middle" fontFamily="Anton" fontSize="20" fill="#1C1830">$</text></g>
    ))}
    <rect x="-60" y="-110" width="120" height="110" rx="12" fill="#C8423A" {...sw} />
    <rect x="-60" y="-80" width="120" height="44" fill="#F6C945" {...thin} />
    <ellipse cx="0" cy="-110" rx="60" ry="14" fill="#D9D4CA" {...sw} />
  </G>
);

/** Riesiges Glas-Sparschwein mit Geld, hängend (Ursprung = Aufhängung oben). */
export const GlassPiggy: React.FC<A & { fill?: number }> = ({ fill = 0.6, ...a }) => (
  <G {...a}>
    <path d="M0 -900 V-260" stroke="#1C1830" strokeWidth="8" />
    <g transform="translate(0 0)">
      <clipPath id="gpClip"><ellipse cx="0" cy="-140" rx="200" ry="140" /></clipPath>
      <ellipse cx="0" cy="-140" rx="200" ry="140" fill="#F6E6B4" opacity=".35" {...sw} />
      <g clipPath="url(#gpClip)">
        <rect x="-220" y={-140 + 140 - 280 * fill} width="440" height={280 * fill} fill="#7BC68B" />
        {Array.from({ length: 18 }, (_, i) => <rect key={i} x={-190 + (i % 6) * 66} y={-10 - Math.floor(i / 6) * 40 - (280 * fill - 120)} width="56" height="26" rx="3" fill={i % 2 ? "#6AB47A" : "#8ED49B"} stroke="#1C1830" strokeWidth="2" />)}
      </g>
      <ellipse cx="0" cy="-140" rx="200" ry="140" fill="none" {...sw} />
      <path d="M-120 -230 Q-60 -262 20 -258" stroke="#fff" strokeOpacity=".6" strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* Rüssel, Ohren, Beine, Ringelschwanz */}
      <ellipse cx="200" cy="-130" rx="42" ry="34" fill="#E8F2F6" opacity=".85" {...sw} />
      <ellipse cx="190" cy="-130" rx="6" ry="9" fill="#1C1830" /><ellipse cx="212" cy="-130" rx="6" ry="9" fill="#1C1830" />
      <circle cx="130" cy="-190" r="9" fill="#1C1830" />
      <path d="M60 -262 L90 -330 L120 -258Z M100 -252 L140 -312 L156 -242Z" fill="#E8F2F6" {...sw} />
      {[-120, -50, 50, 120].map((x) => <rect key={x} x={x - 20} y="-14" width="40" height="44" rx="10" fill="#E8F2F6" {...sw} />)}
      <path d="M-200 -150 q-40 -10 -34 -40 q8 -22 26 -8 q10 14 -14 22" fill="none" stroke="#1C1830" strokeWidth="7" strokeLinecap="round" />
      <path d="M-30 -282 H40" stroke="#1C1830" strokeWidth="8" strokeLinecap="round" />
    </g>
  </G>
);

/** Laser-Handstück (Tattooentfernung) auf Gerät. */
export const LaserDevice: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-90" y="-300" width="180" height="300" rx="18" fill="#E8ECEF" {...sw} />
    <rect x="-66" y="-276" width="132" height="80" rx="8" fill="#2B4F8C" {...sw} />
    <text x="0" y="-226" textAnchor="middle" fontFamily="Anton" fontSize="34" fill="#9FD7F2">1064 nm</text>
    <path d="M60 -170 Q160 -200 150 -320" fill="none" stroke="#1C1830" strokeWidth="10" />
    <rect x="128" y="-380" width="44" height="80" rx="10" fill="#C9D1DA" {...sw} />
    <circle cx="150" cy="-386" r="10" fill="#D62839" />
    {[-40, 0, 40].map((x) => <circle key={x} cx={x} cy="-150" r="12" fill="#C9D1DA" {...thin} />)}
  </G>
);

/** Tätowiermaschine. */
export const TattooGun: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-14" y="-120" width="28" height="90" rx="8" fill="#3A3A44" {...sw} />
    <rect x="-24" y="-150" width="48" height="36" rx="8" fill="#C8423A" {...sw} />
    <path d="M0 -30 V0" stroke="#1C1830" strokeWidth="6" />
  </G>
);

/** Druckbogen mit Banknoten. */
export const NoteSheet: React.FC<A & { value?: string }> = ({ value = "50", ...a }) => (
  <G {...a}>
    <rect x="-150" y="-200" width="300" height="200" fill="#E9D8B4" {...sw} />
    {Array.from({ length: 6 }, (_, i) => (
      <g key={i} transform={`translate(${-140 + (i % 3) * 96} ${-190 + Math.floor(i / 3) * 96})`}>
        <rect width="88" height="86" fill="#D9A06A" stroke="#1C1830" strokeWidth="2" />
        <circle cx="62" cy="43" r="16" fill="#E8C08A" stroke="#1C1830" strokeWidth="2" />
        <text x="8" y="28" fontFamily="Anton" fontSize="22" fill="#1C1830">{value}</text>
      </g>
    ))}
  </G>
);
