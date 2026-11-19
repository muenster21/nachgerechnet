import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Title } from "../components/Overlays";
import { usePop, useProgress, useScene } from "../lib/anim";
import { BRAND, FONT_DISPLAY, FONT_TEXT, LINE } from "../lib/theme";
import { Sofa, TV, shade } from "../assets";

type MapSpec = {
  kind: "map" | "floorplan" | "usa";
  /** USA: Stationen [Länge, Breite, Label?], Route zeichnet sich ab drawAt über drawFrames */
  stops?: [number, number, string?][];
  drawAt?: string | number;
  drawFrames?: number;
  counter?: { to: number; unit: string; at?: string | number; frames?: number };
  title?: string;
  /** Karte: Zielpunkt (in Karten-Koordinaten) + Label */
  target?: { x: number; y: number; label: string };
  chips?: { text: string; at?: string | number }[];
  zoom?: number;
  zoomAt?: string | number;
  /** Grundriss: Räume {x,y,w,h in Einheiten à 40px, label, m2} */
  u?: number;
  y0?: number;
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


/* ---- USA (stilisiert, vereinfachter Umriss) mit Route ---- */
const US_OUTLINE: [number, number][] = [[-124.7,48.4],[-123,49],[-95.2,49],[-94.8,49.4],[-89.6,48],[-84.8,46.6],[-83,46],[-82.4,43],[-79,43.2],[-76.5,44.2],[-75,45],[-71.5,45],[-70,46.7],[-67.8,47.1],[-67,44.8],[-70.2,43.6],[-70.6,41.6],[-74,40.6],[-76,38],[-75.9,35.2],[-78,33.9],[-81,31.5],[-80.1,27],[-80.4,25.2],[-81.8,25.8],[-82.8,28],[-84,30],[-85.4,29.7],[-88,30.4],[-89.6,29.3],[-91.5,29.4],[-94,29.6],[-97.2,27.8],[-97.4,25.9],[-99.2,26.5],[-101.4,29.8],[-103.3,29],[-104.5,29.7],[-106.5,31.8],[-108.2,31.8],[-111,31.3],[-114.8,32.5],[-117.1,32.5],[-118.5,34],[-120.6,34.6],[-122.5,37.5],[-124.2,40.3],[-124.4,43],[-124,46.3]];
const KX = 17.6, KY = 22.4, X0 = 30, Y0 = 400;
const proj = (lon: number, lat: number): [number, number] => [X0 + (lon + 125) * KX, Y0 + (49.5 - lat) * KY];

const USA: React.FC<{ s: MapSpec }> = ({ s }) => {
  const { at } = useScene();
  const frame = useCurrentFrame();
  const stops = (s.stops ?? []).map(([lo, la, l]) => [...proj(lo, la), l] as [number, number, string?]);
  const segs = stops.slice(1).map((pt, i) => Math.hypot(pt[0] - stops[i][0], pt[1] - stops[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  const dAt = typeof s.drawAt === "number" ? s.drawAt : at(s.drawAt, 10);
  const prog = interpolate(frame, [dAt, dAt + (s.drawFrames ?? 120)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drawn = total * prog;
  // Position des „Autos“ an der Spitze
  let acc = 0, head: [number, number] = stops[0] ? [stops[0][0], stops[0][1]] : [0, 0], reached = 0;
  for (let i = 0; i < segs.length; i++) {
    if (acc + segs[i] >= drawn) { const t = (drawn - acc) / (segs[i] || 1); head = [stops[i][0] + (stops[i + 1][0] - stops[i][0]) * t, stops[i][1] + (stops[i + 1][1] - stops[i][1]) * t]; reached = i + (t >= 0.999 ? 1 : 0); break; }
    acc += segs[i]; reached = i + 1; head = [stops[i + 1][0], stops[i + 1][1]];
  }
  const outline = US_OUTLINE.map(([lo, la]) => proj(lo, la).join(" ")).join(" L");
  const route = stops.map((pt) => `${pt[0]} ${pt[1]}`).join(" L");
  const cAt = s.counter ? (typeof s.counter.at === "number" ? s.counter.at : at(s.counter.at, dAt)) : 0;
  const cv = s.counter ? interpolate(frame, [cAt, cAt + (s.counter.frames ?? s.drawFrames ?? 120)], [0, s.counter.to], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const cp = usePop(cAt, 10);
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <rect width="1080" height="1920" fill="#1D2A52" />
      {Array.from({ length: 28 }, (_, i) => <path key={"v" + i} d={`M${i * 40} 0 V1920`} stroke="#fff" strokeOpacity=".05" strokeWidth="2" />)}
      {Array.from({ length: 48 }, (_, i) => <path key={"h" + i} d={`M0 ${i * 40} H1080`} stroke="#fff" strokeOpacity=".05" strokeWidth="2" />)}
      <path d={`M${outline}Z`} fill="#E9DDBE" stroke={LINE} strokeWidth="7" strokeLinejoin="round" />
      <path d={`M${outline}Z`} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="3" transform="translate(-4 -4)" />
      <path d={`M${route}`} fill="none" stroke={LINE} strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${drawn} ${total + 10}`} />
      <path d={`M${route}`} fill="none" stroke="#D62839" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={`${drawn} ${total + 10}`} />
      {stops.map((pt, i) => i <= reached && (
        <g key={i}>
          <circle cx={pt[0]} cy={pt[1]} r="11" fill={BRAND.signature} stroke={LINE} strokeWidth="4" />
          {pt[2] && <text x={i === 0 ? pt[0] - 14 : pt[0]} y={pt[1] + (i === 0 ? 52 : -24)} textAnchor={i === 0 ? "start" : "middle"} fontFamily={FONT_DISPLAY} fontSize="34" fill="#fff" stroke={LINE} strokeWidth="8" paintOrder="stroke">{pt[2]}</text>}
        </g>
      ))}
      {prog > 0 && <g transform={`translate(${head[0]} ${head[1]})`}><circle r={20 + Math.sin(frame / 4) * 3} fill="#D62839" opacity=".3" /><circle r="13" fill="#fff" stroke={LINE} strokeWidth="5" /></g>}
      {s.counter && (
        <g transform={`translate(540 1170) scale(${Math.min(1.05, cp)})`} opacity={Math.min(1, cp * 2)}>
          <text x="0" y="0" textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="150" fill={BRAND.signature} stroke={LINE} strokeWidth="22" paintOrder="stroke">{Math.round(cv).toLocaleString("de-DE")} {s.counter.unit}</text>
        </g>
      )}
    </svg>
  );
};

/* ---- Grundriss mit m² ---- */
const Floorplan: React.FC<{ s: MapSpec }> = ({ s }) => {
  const { at } = useScene();
  const u = s.u ?? 60;
  const rooms = s.rooms ?? [];
  const wUnits = Math.max(...(s.rooms ?? []).map((r) => r.x + r.w), 12);
  const x0 = (930 - wUnits * u) / 2 + 40, y0 = s.y0 ?? 520;
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
    {s.kind === "map" ? <Manhattan s={s} /> : s.kind === "usa" ? <USA s={s} /> : <Floorplan s={s} />}
    {s.title && <Title text={s.title} />}
    {(s.chips ?? []).map((c: any, i) => <Chip key={i} text={c.text} at={c.at} top={c.top ?? 1000 + i * 100} left={70 + (i % 2) * 40} rot={i % 2 ? 2 : -3} />)}
    {s.total && <Chip text={s.total.label} at={s.total.at} top={430} left={90} size={64} />}
  </>
);
