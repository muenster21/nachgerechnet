import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Title } from "../components/Overlays";
import { usePop, useProgress, useScene } from "../lib/anim";
import { BRAND, FONT_DISPLAY, FONT_TEXT, LINE } from "../lib/theme";
import { Sofa, TV, shade } from "../assets";

type MapSpec = {
  kind: "map" | "floorplan";
  title?: string;
  /** Karte: Zielpunkt (in Karten-Koordinaten) + Label */
  target?: { x: number; y: number; label: string };
  chips?: { text: string; at?: string | number }[];
  zoom?: number;
  zoomAt?: string | number;
  /** Grundriss: Räume {x,y,w,h in Einheiten à 40px, label, m2} */
  rooms?: { x: number; y: number; w: number; h: number; label: string; m2?: number; color?: string; at?: string | number }[];
  total?: { label: string; at?: string | number };
};

/* ---- Manhattan (stilisiert, ohne Kartendaten): Insel, Park, Straßenraster ---- */
const ISLAND = "M300 1520 L370 1490 L430 1330 L520 1020 L640 650 L740 320 L830 280 L860 340 L800 650 L720 990 L640 1300 L540 1520 L440 1580Z";
const AXIS = 21; // Grad Neigung der Insel gegen die Senkrechte

const Manhattan: React.FC<{ s: MapSpec }> = ({ s }) => {
  const { at } = useScene();
  const frame = useCurrentFrame();
  const zAt = typeof s.zoomAt === "number" ? s.zoomAt : at(s.zoomAt, 30);
  const z = interpolate(frame, [zAt, zAt + 40], [1, s.zoom ?? 2.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
  const tx = s.target?.x ?? 580, ty = s.target?.y ?? 760;
  const zp = interpolate(z, [1, s.zoom ?? 2.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fx = 540 + (tx - 540) * zp, fy = 930 + (ty - 930) * zp; // Blickpunkt wandert zum Ziel
  const cx = 540, cy = 860; // Zielpunkt landet leicht über der Bildmitte
  const pin = usePop(zAt + 20, 8);
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <defs>
        <clipPath id="isl"><path d={ISLAND} /></clipPath>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4FA6D8" /><stop offset="1" stopColor="#2B6FA8" /></linearGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#water)" />
      <g transform={`translate(${cx - fx * z} ${cy - fy * z}) scale(${z})`}>
        {/* Wellen */}
        {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${(i % 4) * 280 - 40} ${Math.floor(i / 4) * 480 + 120} q30 -22 60 0 t60 0`} fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="6" strokeLinecap="round" />)}
        <path d={ISLAND} fill="#F1E7CF" stroke={LINE} strokeWidth={6 / Math.sqrt(z)} strokeLinejoin="round" />
        <g clipPath="url(#isl)">
          {/* Avenues (parallel zur Achse) und Streets (quer) */}
          <g transform={`rotate(${AXIS} 580 900)`} stroke="#D6C7A1" strokeWidth="3">
            {Array.from({ length: 20 }, (_, i) => <path key={"a" + i} d={`M${330 + i * 22} 0 V1900`} />)}
            {Array.from({ length: 70 }, (_, i) => <path key={"s" + i} d={`M0 ${i * 28 - 100} H1100`} />)}
          </g>
          {/* Central Park */}
          <g transform={`rotate(${AXIS} 650 700)`}>
            <rect x="606" y="560" width="92" height="300" rx="10" fill="#7BC47F" stroke={LINE} strokeWidth="3" />
            <ellipse cx="652" cy="690" rx="26" ry="42" fill="#7FC6E8" />
          </g>
        </g>
        <text x="650" y="600" textAnchor="middle" fontFamily={FONT_TEXT} fontWeight="900" fontSize="26" fill="#2F6B3A" transform="rotate(-70 650 600)">CENTRAL PARK</text>
        {/* Pin */}
        {s.target && (
          <g transform={`translate(${tx} ${ty - 6 * (1 - Math.min(1, pin))}) scale(${Math.min(1.1, pin) / Math.sqrt(z) * 1.2})`}>
            <path d="M0 0 C-30 -34 -34 -70 0 -76 C34 -70 30 -34 0 0Z" fill="#D62839" stroke={LINE} strokeWidth="5" />
            <circle cx="0" cy="-48" r="11" fill="#fff" stroke={LINE} strokeWidth="3" />
            <circle cx="0" cy="2" r={14 + Math.sin(frame / 6) * 4} fill="#D62839" opacity=".25" />
          </g>
        )}
      </g>
    </svg>
  );
};

/* ---- Grundriss mit m² ---- */
const Floorplan: React.FC<{ s: MapSpec }> = ({ s }) => {
  const { at } = useScene();
  const u = 60;
  const rooms = s.rooms ?? [];
  const x0 = 100, y0 = 520;
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <rect width="1080" height="1920" fill="#1D3B66" />
      {Array.from({ length: 28 }, (_, i) => <path key={"v" + i} d={`M${i * 40} 0 V1920`} stroke="#fff" strokeOpacity=".06" strokeWidth="2" />)}
      {Array.from({ length: 48 }, (_, i) => <path key={"h" + i} d={`M0 ${i * 40} H1080`} stroke="#fff" strokeOpacity=".06" strokeWidth="2" />)}
      {rooms.map((r, i) => {
        const st = typeof r.at === "number" ? r.at : at(r.at, 10 + i * 14);
        const p = usePop(st, 12);
        const w = r.w * u, h = r.h * u;
        return (
          <g key={i} transform={`translate(${x0 + r.x * u} ${y0 + r.y * u}) scale(${Math.min(1, p)})`} opacity={Math.min(1, p * 2)}>
            <rect width={w} height={h} fill={r.color ?? "#F7EBD2"} stroke={LINE} strokeWidth="9" />
            <rect x="9" y="9" width={w - 18} height={h - 18} fill="none" stroke={shade(r.color ?? "#F7EBD2", -0.2)} strokeWidth="3" strokeDasharray="12 8" />
            <text x={w / 2} y={h / 2 - 14} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={Math.min(50, w / 6.5)} fill={LINE}>{r.label}</text>
            {r.m2 !== undefined && <text x={w / 2} y={h / 2 + 50} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize={Math.min(70, w / 4.6)} fill="#D62839">{r.m2} m²</text>}
          </g>
        );
      })}
    </svg>
  );
};

export const MapScene: React.FC<{ s: MapSpec }> = ({ s }) => (
  <>
    {s.kind === "map" ? <Manhattan s={s} /> : <Floorplan s={s} />}
    {s.title && <Title text={s.title} />}
    {(s.chips ?? []).map((c, i) => <Chip key={i} text={c.text} at={c.at} top={1000 + i * 100} left={70 + (i % 2) * 40} rot={i % 2 ? 2 : -3} />)}
    {s.total && <Chip text={s.total.label} at={s.total.at} top={430} left={90} size={64} />}
  </>
);
