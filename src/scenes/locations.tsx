import React from "react";
import { useCurrentFrame } from "remotion";
import { useVideo } from "../lib/anim";
import { H, W } from "../lib/theme";
import {
  Armchair, BarCounter, BottleShelf, Bookshelf, Brownstone, CoffeeTable, FloorBoards, Frame, Highrise, Hydrant, Lamp, Mirror, Moon, NeonSign,
  PendantLamp, Plant, Rug, Skyline, Sofa, Stool, Streetlamp, Taxi, TrashCan, TV, Window, Cloud, Booth, shade, GrandPiano, Palm, Coupe,
} from "../assets";

/** Jeder Schauplatz hat drei Ebenen: Back (Hintergrund), Mid (Mittelgrund), Fore (angeschnittener Vordergrund). */
type Loc = { Back: React.FC<{ p: Pal }>; Mid: React.FC<{ p: Pal }>; Fore: React.FC<{ p: Pal }>; floorY: number };
type Pal = (key: string, fallback: string) => string;

export const FLOOR_Y = 1560; // Fußpunkt der Figuren

const Gradient: React.FC<{ id: string; a: string; b: string; y1?: number; y2?: number }> = ({ id, a, b, y1 = 0, y2 = H }) => (
  <>
    <defs><linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
    <rect x="-80" y="-80" width={W + 160} height={H + 160} fill={`url(#${id})`} />
  </>
);

/* ---------------- Wohnung ---------------- */
const Apartment: Loc = {
  floorY: 1500,
  Back: ({ p }) => {
    const wall = p("wall", "#C8895A"), wallD = p("wallDark", "#8B5A3A");
    return (
      <g>
        <Gradient id="apWall" a={shade(wall, 0.04)} b={wallD} y2={1500} />
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 84 - 20} y="-80" width="30" height="1700" fill={shade(wall, -0.04)} opacity=".55" />)}
        <ellipse cx="300" cy="900" rx="520" ry="560" fill={p("lamp", "#FFD98A")} opacity=".12" />
        <Window x={300} y={1040} w={380} h={520} sky={[p("skyTop", "#26335F"), p("skyBottom", "#E88F4B")]} />
        <Frame x={800} y={1010} w={190} h={250} color={p("amber", "#E8A33D")} />
        <Frame x={960} y={880} w={110} h={140} color={shade(p("amber", "#E8A33D"), -0.15)} />
        <rect x="-20" y="1440" width={W + 40} height="64" fill={shade(wall, -0.2)} stroke="#1C1830" strokeWidth="4" />
        <FloorBoards y={1500} h={H - 1500} color={p("floor", "#7A4A2B")} />
      </g>
    );
  },
  Mid: ({ p }) => (
    <g>
      <Bookshelf x={110} y={1500} s={1.0} color={p("wood", "#7A4B2B")} />
      <TV x={620} y={1500} s={0.62} />
      <Sofa x={850} y={1560} s={0.95} color={p("sofa", "#B5524A")} />
      <Rug x={520} y={1760} w={720} color={p("rug", "#9C4A3A")} color2={p("amber", "#E8A33D")} />
    </g>
  ),
  Fore: ({ p }) => (
    <g>
      <Lamp x={1040} y={2000} s={2.3} />
      <Plant x={-10} y={2010} s={1.9} />
    </g>
  ),
};

/* ---------------- Bar (MacLaren's-artig, ohne Original-Elemente) ---------------- */
const Bar: Loc = {
  floorY: 1500,
  Back: ({ p }) => {
    const wood = p("wood", "#6E3F24");
    return (
      <g>
        <Gradient id="barWall" a={shade(wood, -0.18)} b={shade(wood, -0.34)} y2={1500} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 140} 0 V1500`} stroke="#1C1830" strokeOpacity=".25" strokeWidth="4" />)}
        <ellipse cx="540" cy="760" rx="620" ry="640" fill={p("lamp", "#FFD98A")} opacity=".12" />
        <BottleShelf x={540} y={1130} w={980} color={wood} />
        <Mirror x={300} y={470} w={320} h={210} />
        <NeonSign x={790} y={440} text="BAR" color={p("neon", "#FF5B6E")} />
        {[160, 540, 920].map((x) => <PendantLamp key={x} x={x} y={-10} drop={330} />)}
        <FloorBoards y={1500} h={H - 1500} color={p("floor", "#4A2A18")} line="#2F1A0F" />
      </g>
    );
  },
  Mid: ({ p }) => (
    <g>
      <BarCounter x={540} y={1500} w={1240} color={p("wood", "#6E3F24")} color2={shade(p("wood", "#6E3F24"), -0.2)} />
    </g>
  ),
  Fore: ({ p }) => (
    <g>
      <Stool x={60} y={2060} s={2.2} color={p("stool", "#B5524A")} />
      <Stool x={1030} y={2080} s={2.4} color={p("stool", "#B5524A")} />
    </g>
  ),
};

/* ---------------- Straße / Fassade am Abend ---------------- */
const Street: Loc = {
  floorY: 1600,
  Back: ({ p }) => {
    const f = useCurrentFrame();
    return (
      <g>
        <Gradient id="stSky" a={p("skyTop", "#26335F")} b={p("skyBottom", "#E88F4B")} y2={1300} />
        <Moon x={860} y={430} s={1.3} />
        <Cloud x={220 + f * 0.25} y={520} s={1.1} color="#F7D9B4" />
        <Cloud x={700 - f * 0.15} y={720} s={0.8} color="#F7D9B4" />
        <Skyline x={540} y={1420} w={1500} color="#2B3463" seed={3} maxH={900} />
        <Skyline x={420} y={1440} w={1500} color="#1B2347" seed={9} maxH={640} />
        <Highrise x={140} y={1440} w={200} h={1000} color="#3B4876" />
      </g>
    );
  },
  Mid: ({ p }) => {
    const f = useCurrentFrame();
    return (
      <g>
        <Brownstone x={250} y={1470} floors={5} color={p("brick", "#9B4F36")} w={460} />
        <Brownstone x={720} y={1470} floors={4} color={shade(p("brick", "#9B4F36"), -0.12)} w={420} />
        <Streetlamp x={990} y={1500} s={1.15} />
        <rect x="-40" y="1470" width={W + 80} height="170" fill="#B9B2A6" stroke="#1C1830" strokeWidth="5" />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${i * 150} 1470 V1640`} stroke="#1C1830" strokeOpacity=".25" strokeWidth="3" />)}
        <rect x="-40" y="1640" width={W + 80} height="400" fill="#3B3F4C" stroke="#1C1830" strokeWidth="5" />
        <path d="M0 1790 H1080" stroke="#F4E7CF" strokeWidth="8" strokeDasharray="70 50" />
        <Taxi x={(f * 3.2) % 1700 - 300} y={1880} s={1.15} />
      </g>
    );
  },
  Fore: () => (
    <g>
      <Hydrant x={1010} y={2050} s={2.6} />
      <TrashCan x={40} y={2040} s={2.4} />
    </g>
  ),
};

/* ---------------- Meer (gemeinsam für Strandhaus & Terrasse) ---------------- */
const Ocean: React.FC<{ p: Pal; y: number; h: number; x?: number; w?: number }> = ({ p, y, h, x = -80, w = W + 160 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={p("sea", "#2E8FB8")} />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${x - 60 + ((f * (0.6 + i * 0.15)) % 120)} ${y + 24 + i * (h / 6)} q30 -12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0`} fill="none" stroke="#fff" strokeOpacity={0.25 - i * 0.02} strokeWidth="5" />
      ))}
    </g>
  );
};

/* ---------------- Strandhaus Malibu (Wohnzimmer mit Glasfront) ---------------- */
const BeachHouse: Loc = {
  floorY: 1500,
  Back: ({ p }) => {
    const wall = p("wall", "#E9D7B5");
    return (
      <g>
        <Gradient id="bhWall" a={shade(wall, 0.05)} b={shade(wall, -0.12)} y2={1500} />
        {/* Glasfront zum Meer */}
        <g>
          <defs><linearGradient id="bhSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p("skyTop", "#7EC8E8")} /><stop offset="1" stopColor={p("skyBottom", "#FFD9A0")} /></linearGradient></defs>
          <rect x="60" y="420" width="960" height="900" fill="url(#bhSky)" stroke="#1C1830" strokeWidth="6" />
          <circle cx="780" cy="840" r="90" fill="#FFE7A8" opacity=".9" />
          <Ocean p={p} y={980} h={340} x={63} w={954} />
          {[300, 540, 780].map((x) => <rect key={x} x={x - 9} y="420" width="18" height="900" fill={p("trim", "#F6EFE2")} stroke="#1C1830" strokeWidth="5" />)}
          <rect x="44" y="404" width="992" height="30" fill={p("trim", "#F6EFE2")} stroke="#1C1830" strokeWidth="6" />
          <rect x="44" y="1310" width="992" height="40" fill={p("trim", "#F6EFE2")} stroke="#1C1830" strokeWidth="6" />
        </g>
        <rect x="-20" y="1440" width={W + 40} height="64" fill={shade(wall, -0.25)} stroke="#1C1830" strokeWidth="4" />
        <FloorBoards y={1500} h={H - 1500} color={p("floor", "#B98A5A")} />
      </g>
    );
  },
  Mid: ({ p }) => (
    <g>
      <GrandPiano x={830} y={1520} s={1.05} />
      <Sofa x={240} y={1560} s={0.95} color={p("sofa", "#D8C7A6")} />
      <Rug x={520} y={1760} w={760} color={p("rug", "#3F6E8C")} color2={p("amber", "#E8C27A")} />
    </g>
  ),
  Fore: () => (
    <g>
      <Plant x={-10} y={2010} s={1.9} />
      <Lamp x={1040} y={2000} s={2.3} />
    </g>
  ),
};

/* ---------------- Terrasse am Strand ---------------- */
const Deck: Loc = {
  floorY: 1560,
  Back: ({ p }) => {
    const f = useCurrentFrame();
    return (
      <g>
        <Gradient id="dkSky" a={p("skyTop", "#7EC8E8")} b={p("skyBottom", "#FFD9A0")} y2={1100} />
        <circle cx="300" cy="760" r="120" fill="#FFE7A8" opacity=".95" />
        <Cloud x={700 + f * 0.2} y={420} s={1.1} color="#FFFFFF" />
        <Cloud x={200 - f * 0.12} y={560} s={0.8} color="#FFFFFF" />
        <Ocean p={p} y={1000} h={420} />
        <path d="M-80 1400 Q300 1360 600 1400 T1160 1390 V1500 H-80Z" fill={p("sand", "#EBD3A0")} stroke="#1C1830" strokeWidth="5" />
      </g>
    );
  },
  Mid: ({ p }) => (
    <g>
      <Palm x={960} y={1480} s={1.5} />
      {/* Holzdeck mit Geländer */}
      <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill={p("deck", "#A9774A")} stroke="#1C1830" strokeWidth="5" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-40 ${1540 + i * 48} H${W + 40}`} stroke="#1C1830" strokeOpacity=".25" strokeWidth="4" />)}
      <rect x="-40" y="1300" width={W + 80} height="22" rx="6" fill={p("trim", "#F6EFE2")} stroke="#1C1830" strokeWidth="5" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 96 - 10} y="1320" width="16" height="180" fill={p("trim", "#F6EFE2")} stroke="#1C1830" strokeWidth="4" />)}
    </g>
  ),
  Fore: () => (
    <g>
      <Plant x={1030} y={2030} s={2.0} />
    </g>
  ),
};

/* ---------------- Einfahrt vor dem Strandhaus ---------------- */
const Driveway: Loc = {
  floorY: 1600,
  Back: ({ p }) => (
    <g>
      <Gradient id="dwSky" a={p("skyTop", "#7EC8E8")} b={p("skyBottom", "#FFD9A0")} y2={1300} />
      <Palm x={110} y={1460} s={1.7} />
      {/* Hausfassade */}
      <rect x="250" y="760" width="900" height="720" fill={p("wall", "#E9D7B5")} stroke="#1C1830" strokeWidth="6" />
      <path d="M220 770 L700 600 L1180 770Z" fill={p("roof", "#7A8C99")} stroke="#1C1830" strokeWidth="6" />
      {[380, 640, 900].map((x) => <rect key={x} x={x} y="860" width="190" height="230" fill="#9FD7F2" stroke="#1C1830" strokeWidth="6" />)}
      <rect x="560" y="1170" width="420" height="310" fill={p("garage", "#D2C3A4")} stroke="#1C1830" strokeWidth="6" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M560 ${1230 + i * 62} H980`} stroke="#1C1830" strokeOpacity=".3" strokeWidth="4" />)}
    </g>
  ),
  Mid: () => (
    <g>
      <rect x="-40" y="1480" width={W + 80} height={H - 1480} fill="#C9C2B4" stroke="#1C1830" strokeWidth="5" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 120 - 40} 1480 L${i * 160 - 300} ${H}`} stroke="#1C1830" strokeOpacity=".15" strokeWidth="4" />)}
    </g>
  ),
  Fore: () => (
    <g>
      <Plant x={-20} y={2030} s={2.0} />
    </g>
  ),
};

export const LOCATIONS: Record<string, Loc> = { apartment: Apartment, bar: Bar, street: Street, beachhouse: BeachHouse, deck: Deck, driveway: Driveway };

/** Schlichter Datenhintergrund (dunkel, mit Muster) – ebenfalls bildfüllend. */
export const Backdrop: React.FC<{ a?: string; b?: string; dots?: string }> = ({ a = "#1D2A52", b = "#0F1630", dots = "#FFFFFF" }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <Gradient id="bdGrad" a={a} b={b} />
      {Array.from({ length: 14 }, (_, r) => Array.from({ length: 8 }, (_, c) => (
        <circle key={r + "-" + c} cx={c * 150 + (r % 2) * 75 - 20 + Math.sin((f + r * 9) / 40) * 6} cy={r * 150 + 20} r="4" fill={dots} opacity=".08" />
      )))}
      <circle cx="900" cy="300" r="380" fill="#FFFFFF" opacity=".03" />
      <circle cx="120" cy="1500" r="460" fill="#FFFFFF" opacity=".03" />
    </g>
  );
};
