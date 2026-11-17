import React from "react";
import { A, G, sw, thin, shade } from "./base";

type C = { color?: string; color2?: string };

/** Möbel/Räume. Ursprung unten Mitte (Wandobjekte: unten Mitte der Unterkante). */

export const Window: React.FC<A & { w?: number; h?: number; sky?: [string, string]; glow?: string; skyline?: boolean }> = ({
  w = 360, h = 460, sky = ["#27355F", "#E88F4B"], glow = "#FFD98A", skyline = true, ...a
}) => {
  const id = `sky${Math.round(w)}${Math.round(h)}`;
  return (
    <G {...a}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <rect x={-w / 2 - 16} y={-h - 16} width={w + 32} height={h + 32} rx="10" fill="#EADFC8" {...sw} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill={`url(#${id})`} {...sw} />
      {skyline && (
        <g>
          {[[-0.42, 0.32, 0.5], [-0.28, 0.2, 0.7], [-0.1, 0.26, 0.42], [0.08, 0.18, 0.62], [0.24, 0.24, 0.5], [0.4, 0.18, 0.36]].map(([cx, bw, bh], i) => (
            <g key={i}>
              <rect x={w * cx - (w * bw) / 2} y={-h * (bh * 0.55) } width={w * bw} height={h * bh * 0.55} fill="#1B2347" opacity=".92" />
              {Array.from({ length: 6 }, (_, j) => <rect key={j} x={w * cx - (w * bw) / 2 + 8 + (j % 2) * (w * bw * 0.4)} y={-h * (bh * 0.55) + 12 + Math.floor(j / 2) * 22} width="9" height="12" fill={glow} opacity={j % 3 === 0 ? 0.95 : 0.35} />)}
            </g>
          ))}
        </g>
      )}
      <path d={`M0 ${-h} V0 M${-w / 2} ${-h / 2} H${w / 2}`} stroke="#EADFC8" strokeWidth="14" />
      <path d={`M0 ${-h} V0 M${-w / 2} ${-h / 2} H${w / 2}`} stroke="#1C1830" strokeWidth="3" opacity=".7" />
      <rect x={-w / 2 - 22} y="0" width={w + 44} height="16" rx="5" fill="#D8C9A8" {...sw} />
    </G>
  );
};

export const Door: React.FC<A & C & { w?: number; h?: number }> = ({ w = 220, h = 460, color = "#8A4B2B", ...a }) => (
  <G {...a}>
    <rect x={-w / 2 - 14} y={-h - 14} width={w + 28} height={h + 14} fill={shade(color, -0.12)} {...sw} />
    <rect x={-w / 2} y={-h} width={w} height={h} fill={color} {...sw} />
    <rect x={-w / 2 + 22} y={-h + 28} width={w - 44} height={h * 0.34} rx="6" fill={shade(color, -0.08)} {...thin} />
    <rect x={-w / 2 + 22} y={-h * 0.5} width={w - 44} height={h * 0.4} rx="6" fill={shade(color, -0.08)} {...thin} />
    <circle cx={w / 2 - 30} cy={-h * 0.46} r="9" fill="#E0B84C" {...sw} />
  </G>
);

export const Sofa: React.FC<A & C> = ({ color = "#B5524A", ...a }) => (
  <G {...a}>
    <rect x="-210" y="-210" width="420" height="140" rx="44" fill={shade(color, -0.08)} {...sw} />
    <rect x="-250" y="-130" width="80" height="130" rx="34" fill={color} {...sw} />
    <rect x="170" y="-130" width="80" height="130" rx="34" fill={color} {...sw} />
    <rect x="-176" y="-112" width="352" height="112" rx="30" fill={color} {...sw} />
    <path d="M0 -108 V-4" stroke="#1C1830" strokeWidth="3" opacity=".5" />
    <rect x="-150" y="-10" width="16" height="22" rx="4" fill="#3A2417" {...sw} /><rect x="134" y="-10" width="16" height="22" rx="4" fill="#3A2417" {...sw} />
    <rect x="-130" y="-200" width="84" height="74" rx="18" fill="#E8B84C" {...sw} transform="rotate(-8 -88 -160)" />
  </G>
);

export const Armchair: React.FC<A & C> = ({ color = "#4E7A6B", ...a }) => (
  <G {...a}>
    <rect x="-110" y="-230" width="220" height="190" rx="48" fill={shade(color, -0.1)} {...sw} />
    <rect x="-140" y="-120" width="60" height="120" rx="28" fill={color} {...sw} />
    <rect x="80" y="-120" width="60" height="120" rx="28" fill={color} {...sw} />
    <rect x="-84" y="-100" width="168" height="88" rx="26" fill={color} {...sw} />
    <rect x="-100" y="-14" width="16" height="22" rx="4" fill="#3A2417" {...sw} /><rect x="84" y="-14" width="16" height="22" rx="4" fill="#3A2417" {...sw} />
  </G>
);

export const CoffeeTable: React.FC<A & C> = ({ color = "#9A6B43", ...a }) => (
  <G {...a}>
    <rect x="-130" y="-84" width="260" height="24" rx="8" fill={color} {...sw} />
    <rect x="-112" y="-60" width="18" height="60" fill={shade(color, -0.12)} {...sw} /><rect x="94" y="-60" width="18" height="60" fill={shade(color, -0.12)} {...sw} />
    <rect x="-94" y="-34" width="188" height="12" fill={shade(color, -0.1)} {...thin} />
  </G>
);

export const Table: React.FC<A & C & { w?: number }> = ({ color = "#8B5A33", w = 300, ...a }) => (
  <G {...a}>
    <rect x={-w / 2} y="-120" width={w} height="26" rx="8" fill={color} {...sw} />
    <rect x={-w / 2 + 20} y="-94" width="20" height="94" fill={shade(color, -0.12)} {...sw} /><rect x={w / 2 - 40} y="-94" width="20" height="94" fill={shade(color, -0.12)} {...sw} />
  </G>
);

export const TV: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-150" y="-98" width="300" height="98" rx="10" fill="#4A3426" {...sw} />
    <rect x="-186" y="-300" width="372" height="214" rx="16" fill="#2B2B3D" {...sw} />
    <rect x="-170" y="-284" width="340" height="182" rx="8" fill="#8FD3FF" />
    <path d="M-170 -150 L-60 -230 L40 -170 L170 -250 V-102 H-170Z" fill="#6FB0E6" opacity=".6" />
    <circle cx="150" cy="-92" r="4" fill="#D62839" />
  </G>
);

export const Plant: React.FC<A & { pot?: string }> = ({ pot = "#C8693C", ...a }) => (
  <G {...a}>
    <path d="M0 -70 Q-70 -170 -92 -270 M0 -70 Q10 -190 4 -330 M0 -70 Q76 -170 100 -280" stroke="#1C1830" strokeWidth="6" fill="none" strokeLinecap="round" />
    <ellipse cx="-92" cy="-270" rx="34" ry="66" fill="#5DB36A" {...sw} transform="rotate(-22 -92 -270)" />
    <ellipse cx="4" cy="-330" rx="34" ry="72" fill="#48A05A" {...sw} />
    <ellipse cx="100" cy="-280" rx="34" ry="66" fill="#5DB36A" {...sw} transform="rotate(22 100 -280)" />
    <ellipse cx="-44" cy="-200" rx="26" ry="50" fill="#6BC47A" {...sw} transform="rotate(-48 -44 -200)" />
    <ellipse cx="52" cy="-196" rx="26" ry="50" fill="#6BC47A" {...sw} transform="rotate(48 52 -196)" />
    <path d="M-56 -76 H56 L44 0 H-44Z" fill={pot} {...sw} />
    <rect x="-62" y="-90" width="124" height="20" rx="6" fill={shade(pot, 0.06)} {...sw} />
  </G>
);

export const Lamp: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-44" y="-10" width="88" height="14" rx="6" fill="#3A2417" {...sw} />
    <rect x="-6" y="-250" width="12" height="244" fill="#6E4A2C" {...sw} />
    <path d="M-60 -250 L-34 -330 H34 L60 -250Z" fill="#F5D88A" {...sw} />
    <path d="M-60 -250 L60 -250" stroke="#1C1830" strokeWidth="3" />
  </G>
);

export const PendantLamp: React.FC<A & { drop?: number }> = ({ drop = 260, ...a }) => (
  <G {...a}>
    <path d={`M0 0 V${drop - 70}`} stroke="#1C1830" strokeWidth="5" />
    <path d={`M-62 ${drop} Q-62 ${drop - 66} 0 ${drop - 70} Q62 ${drop - 66} 62 ${drop}Z`} fill="#2F6B4B" {...sw} />
    <ellipse cx="0" cy={drop} rx="62" ry="10" fill="#FFE9A8" {...sw} />
    <ellipse cx="0" cy={drop + 24} rx="120" ry="26" fill="#FFE9A8" opacity=".18" />
  </G>
);

export const Rug: React.FC<A & C & { w?: number }> = ({ color = "#9C4A3A", color2 = "#E8B84C", w = 560, ...a }) => (
  <G {...a}>
    <ellipse cx="0" cy="-18" rx={w / 2} ry="34" fill={color} {...sw} />
    <ellipse cx="0" cy="-18" rx={w / 2 - 36} ry="20" fill="none" stroke={color2} strokeWidth="6" />
  </G>
);

export const Bookshelf: React.FC<A & C> = ({ color = "#7A4B2B", ...a }) => {
  const cols = ["#B5524A", "#4E7FB0", "#E8B84C", "#5DA06A", "#7C5AA6", "#D9774A"];
  return (
    <G {...a}>
      <rect x="-140" y="-400" width="280" height="400" fill={color} {...sw} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <rect x="-126" y={-380 + r * 124} width="252" height="106" fill={shade(color, -0.12)} {...thin} />
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-120 + i * 27} y={-376 + r * 124 + ((i * 7) % 3) * 8} width="22" height={96 - ((i * 7) % 3) * 8} fill={cols[(i + r) % cols.length]} {...thin} />)}
        </g>
      ))}
    </G>
  );
};

export const Frame: React.FC<A & { w?: number; h?: number; color?: string }> = ({ w = 140, h = 180, color = "#E8B84C", ...a }) => (
  <G {...a}>
    <rect x={-w / 2} y={-h} width={w} height={h} fill="#2B3A55" {...sw} strokeWidth={8} stroke="#1C1830" />
    <rect x={-w / 2 + 12} y={-h + 12} width={w - 24} height={h - 24} fill={color} />
    <path d={`M${-w / 2 + 12} ${-24} L${-w / 4} ${-h / 2} L0 ${-44} L${w / 4} ${-h / 2 - 20} L${w / 2 - 12} -24Z`} fill="#6A8E5B" />
    <circle cx={w / 4} cy={-h + 44} r="14" fill="#FFF6C8" />
  </G>
);

/* ---------- Bar ---------- */
export const BarCounter: React.FC<A & C & { w?: number }> = ({ color = "#6E3F24", color2 = "#3A2417", w = 1100, ...a }) => (
  <G {...a}>
    <rect x={-w / 2} y="-250" width={w} height="250" fill={color} {...sw} />
    <rect x={-w / 2 - 20} y="-276" width={w + 40} height="34" rx="10" fill={shade(color, 0.12)} {...sw} />
    {Array.from({ length: Math.round(w / 160) }, (_, i) => <rect key={i} x={-w / 2 + 24 + i * 160} y="-214" width="128" height="170" rx="8" fill={color2} {...thin} />)}
    <rect x={-w / 2} y="-30" width={w} height="30" fill={color2} {...sw} />
  </G>
);

export const Stool: React.FC<A & C> = ({ color = "#B5524A", ...a }) => (
  <G {...a}>
    <ellipse cx="0" cy="-196" rx="56" ry="18" fill={color} {...sw} />
    <path d="M-50 -190 V-176 Q0 -160 50 -176 V-190" fill={shade(color, -0.12)} {...sw} />
    <path d="M-34 -170 L-48 0 M34 -170 L48 0 M0 -166 V0" stroke="#1C1830" strokeWidth="9" strokeLinecap="round" />
    <path d="M-34 -170 L-48 0 M34 -170 L48 0 M0 -166 V0" stroke="#8D949E" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="0" cy="-70" rx="44" ry="10" fill="none" stroke="#1C1830" strokeWidth="5" />
  </G>
);

export const BottleShelf: React.FC<A & C & { w?: number }> = ({ color = "#6E3F24", w = 980, ...a }) => {
  const cols = ["#2F7D3E", "#C9893A", "#7C5AA6", "#B5524A", "#4E7FB0", "#D9B24A", "#4F9A8A"];
  const rows = 3;
  return (
    <G {...a}>
      <rect x={-w / 2} y={-rows * 190 - 20} width={w} height={rows * 190 + 20} fill={shade(color, -0.22)} {...sw} />
      {Array.from({ length: rows }, (_, r) => (
        <g key={r} transform={`translate(0 ${-r * 190 - 20})`}>
          <rect x={-w / 2} y="-12" width={w} height="22" fill={color} {...sw} />
          {Array.from({ length: Math.round(w / 78) }, (_, i) => {
            const h = 90 + ((i * 13 + r * 7) % 5) * 14;
            const col = cols[(i + r * 2) % cols.length];
            return (
              <g key={i} transform={`translate(${-w / 2 + 44 + i * 78} -12)`}>
                <path d={`M-14 0 V${-h * 0.6} Q-14 ${-h * 0.78} -6 ${-h * 0.9} V${-h} H6 V${-h * 0.9} Q14 ${-h * 0.78} 14 ${-h * 0.6} V0Z`} fill={col} {...thin} />
                <path d={`M-8 ${-h * 0.55} V-8`} stroke="#fff" strokeOpacity=".3" strokeWidth="4" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      ))}
    </G>
  );
};

export const Booth: React.FC<A & C> = ({ color = "#9B3B33", ...a }) => (
  <G {...a}>
    <rect x="-230" y="-330" width="460" height="330" rx="44" fill={shade(color, -0.1)} {...sw} />
    <rect x="-190" y="-250" width="380" height="110" rx="34" fill={color} {...sw} />
    {[-120, -40, 40, 120].map((x) => <circle key={x} cx={x} cy="-195" r="6" fill={shade(color, -0.25)} />)}
    <rect x="-230" y="-120" width="460" height="120" rx="20" fill={color} {...sw} />
  </G>
);

export const NeonSign: React.FC<A & { text?: string; color?: string }> = ({ text = "BAR", color = "#FF5B6E", ...a }) => (
  <G {...a}>
    <rect x="-110" y="-84" width="220" height="84" rx="14" fill="#1C1830" {...sw} />
    <text x="0" y="-22" textAnchor="middle" fontFamily="Anton" fontSize="58" fill={color} stroke={color} strokeWidth="1" letterSpacing="6">{text}</text>
    <text x="0" y="-22" textAnchor="middle" fontFamily="Anton" fontSize="58" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2" letterSpacing="6">{text}</text>
    <rect x="-110" y="-84" width="220" height="84" rx="14" fill={color} opacity=".12" />
  </G>
);

export const Mirror: React.FC<A & { w?: number; h?: number }> = ({ w = 360, h = 260, ...a }) => (
  <G {...a}>
    <rect x={-w / 2 - 14} y={-h - 14} width={w + 28} height={h + 28} rx="16" fill="#C9893A" {...sw} />
    <rect x={-w / 2} y={-h} width={w} height={h} rx="8" fill="#BFD9E6" {...sw} />
    <path d={`M${-w / 2 + 20} ${-h + 60} L${-w / 2 + 120} ${-h + 10} M${-w / 2 + 20} ${-h + 120} L${-w / 2 + 180} ${-h + 10}`} stroke="#fff" strokeOpacity=".5" strokeWidth="14" strokeLinecap="round" />
  </G>
);
