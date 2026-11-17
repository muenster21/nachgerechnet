import React from "react";
import { A, G, sw, thin } from "./base";

/** Kleine, flache Icons für Datengrafiken (Ursprung Mitte unten, ca. 60 hoch). */

export const PersonIcon: React.FC<A & { color?: string }> = ({ color = "#4FB3C8", ...a }) => (
  <G {...a}>
    <circle cx="0" cy="-48" r="13" fill={color} {...thin} />
    <path d="M-17 0 V-18 Q-17 -32 0 -32 Q17 -32 17 -18 V0Z" fill={color} {...thin} />
  </G>
);

export const DotIcon: React.FC<A & { color?: string }> = ({ color = "#FFD23F", ...a }) => (
  <G {...a}><circle cx="0" cy="-14" r="14" fill={color} {...thin} /></G>
);

export const DollarIcon: React.FC<A & { color?: string }> = ({ color = "#6BBF7A", ...a }) => (
  <G {...a}>
    <circle cx="0" cy="-32" r="30" fill={color} {...sw} />
    <text x="0" y="-20" textAnchor="middle" fontFamily="Anton" fontSize="42" fill="#1C1830">$</text>
  </G>
);

export const EuroIcon: React.FC<A & { color?: string }> = ({ color = "#F6C945", ...a }) => (
  <G {...a}>
    <circle cx="0" cy="-32" r="30" fill={color} {...sw} />
    <text x="0" y="-20" textAnchor="middle" fontFamily="Anton" fontSize="42" fill="#1C1830">€</text>
  </G>
);

export const HouseIcon: React.FC<A & { color?: string }> = ({ color = "#E8845A", ...a }) => (
  <G {...a}>
    <path d="M-40 -36 L0 -76 L40 -36 V0 H-40Z" fill={color} {...sw} />
    <rect x="-9" y="-30" width="18" height="30" fill="#FFF8EA" {...thin} />
    <rect x="-34" y="-34" width="18" height="16" fill="#8FD3FF" {...thin} />
  </G>
);

export const BeerIcon: React.FC<A> = (a) => (
  <G {...a}>
    <rect x="-18" y="-56" width="36" height="56" rx="5" fill="#F2A71B" {...thin} />
    <path d="M-20 -56 Q-22 -70 -8 -68 Q0 -80 12 -68 Q24 -70 20 -56Z" fill="#fff" {...thin} />
    <path d="M18 -46 q16 0 16 14 q0 14 -16 14" fill="none" stroke="#1C1830" strokeWidth="4" />
  </G>
);

export const ArrowDown: React.FC<A & { color?: string }> = ({ color = "#D62839", ...a }) => (
  <G {...a}><path d="M-22 -70 H22 V-34 H44 L0 0 L-44 -34 H-22Z" fill={color} {...sw} /></G>
);
