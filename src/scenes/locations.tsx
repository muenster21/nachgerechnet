import React from "react";
import { useCurrentFrame } from "remotion";
import { useVideo } from "../lib/anim";
import { H, W } from "../lib/theme";
import {
  Armchair, BarCounter, BottleShelf, Bookshelf, Brownstone, CoffeeTable, FloorBoards, Frame, Highrise, Hydrant, Lamp, Mirror, Moon, NeonSign,
  PendantLamp, Plant, Rug, Skyline, Sofa, Stool, Streetlamp, Taxi, TrashCan, TV, Window, Cloud, Booth, shade, GrandPiano, Palm, Coupe, GasPump, MotelSign, Bed, PoolTable, Door, Boat, Dock, Microscope, Whiteboard, PrintingPress,
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


/* ================= Supernatural ================= */
/** Landstraße im Mittleren Westen, Abenddämmerung: Felder, Strommasten, Straße. */
const Highway: Loc = {
  floorY: 1640,
  Back: ({ p }) => {
    const f = useCurrentFrame();
    return (
      <g>
        <Gradient id="hwSky" a={p("skyTop", "#2E3A6B")} b={p("skyBottom", "#F09A5A")} y2={1250} />
        <circle cx="760" cy="1150" r="150" fill="#FFD27A" opacity=".9" />
        <Cloud x={260 + f * 0.2} y={520} s={1.2} color="#F6C29A" />
        <Cloud x={840 - f * 0.12} y={700} s={0.8} color="#F6C29A" />
        <path d="M-80 1200 Q260 1150 540 1190 T1160 1180 V1420 H-80Z" fill={p("hill", "#5B6B4A")} stroke="#1C1830" strokeWidth="5" />
        <rect x="-80" y="1300" width={W + 160} height="200" fill={p("field", "#8C8A4E")} />
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`translate(${((i * 260 - f * 3) % 1560 + 1560) % 1560 - 240} 0)`}>
            <path d="M0 1420 V1000 M-50 1040 H50" stroke="#3A2A20" strokeWidth="12" />
          </g>
        ))}
        <path d="M-80 1022 Q540 1060 1160 1022" fill="none" stroke="#3A2A20" strokeWidth="3" opacity=".6" />
      </g>
    );
  },
  Mid: ({ p }) => {
    const f = useCurrentFrame();
    return (
      <g>
        <rect x="-40" y="1480" width={W + 80} height={H - 1480} fill={p("road", "#3E3E48")} stroke="#1C1830" strokeWidth="5" />
        <rect x="-40" y="1480" width={W + 80} height="24" fill={p("field", "#8C8A4E")} />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={((i * 220 - f * 14) % 1760 + 1760) % 1760 - 300} y="1720" width="120" height="18" rx="6" fill="#F2D35A" />)}
      </g>
    );
  },
  Fore: () => <g />,
};

/** Tankstelle an der Landstraße. */
const GasStation: Loc = {
  floorY: 1620,
  Back: ({ p }) => (
    <g>
      <Gradient id="gsSky" a={p("skyTop", "#2E3A6B")} b={p("skyBottom", "#F09A5A")} y2={1250} />
      <Cloud x={240} y={520} s={1.1} color="#F6C29A" />
      <rect x="-80" y="1250" width={W + 160} height="300" fill={p("field", "#8C8A4E")} />
      {/* Shop */}
      <rect x="540" y="980" width="560" height="440" fill={p("shop", "#E8DCC0")} stroke="#1C1830" strokeWidth="6" />
      <rect x="600" y="1080" width="240" height="200" fill="#FFE6A8" stroke="#1C1830" strokeWidth="6" />
      <rect x="880" y="1100" width="140" height="320" fill="#8A5A3A" stroke="#1C1830" strokeWidth="6" />
      {/* Dach über den Säulen */}
      <rect x="-60" y="760" width="760" height="90" fill={p("canopy", "#C8423A")} stroke="#1C1830" strokeWidth="6" />
      <rect x="-60" y="850" width="760" height="22" fill="#FFF8EA" stroke="#1C1830" strokeWidth="5" />
      {[80, 560].map((x) => <rect key={x} x={x} y="872" width="34" height="560" fill="#D9D4CA" stroke="#1C1830" strokeWidth="5" />)}
      <rect x="-60" y="1420" width={W + 120} height="200" fill="#B9B3A6" stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
  Mid: () => (
    <g>
      <GasPump x={330} y={1440} s={1.2} />
      <rect x="-40" y="1560" width={W + 80} height={H - 1560} fill="#A8A296" stroke="#1C1830" strokeWidth="5" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${i * 200 - 40} 1560 L${i * 260 - 300} ${H}`} stroke="#1C1830" strokeOpacity=".12" strokeWidth="4" />)}
    </g>
  ),
  Fore: () => <g />,
};

/** Billig-Motel bei Nacht: Zimmertüren, Leuchtschild, Parkplatz. */
const Motel: Loc = {
  floorY: 1640,
  Back: ({ p }) => (
    <g>
      <Gradient id="mtSky" a={p("night", "#141A3A")} b={p("nightLow", "#3A3466")} y2={1200} />
      <Moon x={820} y={380} s={1.1} />
      {Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(i * 197) % 1080} cy={(i * 131) % 700 + 120} r="3" fill="#fff" opacity=".6" />)}
      <rect x="-60" y="900" width={W + 120} height="560" fill={p("motel", "#D9B98A")} stroke="#1C1830" strokeWidth="6" />
      <path d="M-80 900 H1160 L1120 840 H-40Z" fill={p("motelRoof", "#7A3A2E")} stroke="#1C1830" strokeWidth="6" />
      {[40, 300, 560, 820].map((x, i) => (
        <g key={x}>
          <Door x={x + 70} y={1460} w={120} h={330} color={["#3E6E8E", "#7A3A2E", "#3E6E8E", "#7A3A2E"][i]} />
          <rect x={x + 150} y="1040" width="90" height="120" fill={i === 1 ? "#FFD98A" : "#2B2F4A"} stroke="#1C1830" strokeWidth="5" />
          <text x={x + 70} y="1110" textAnchor="middle" fontFamily="Anton" fontSize="40" fill="#1C1830">{i + 6}</text>
        </g>
      ))}
      <rect x="-60" y="1460" width={W + 120} height="40" fill="#8E8576" stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
  Mid: () => (
    <g>
      <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill="#4A4852" stroke="#1C1830" strokeWidth="5" />
      {[100, 420, 740].map((x) => <path key={x} d={`M${x} 1520 L${x - 80} ${H}`} stroke="#F4F0E4" strokeWidth="10" opacity=".6" />)}
    </g>
  ),
  Fore: () => (
    <g>
      <MotelSign x={980} y={1900} s={1.0} />
    </g>
  ),
};

/** Motelzimmer: Tapete, zwei Betten, Notizen an der Wand. */
const MotelRoom: Loc = {
  floorY: 1560,
  Back: ({ p }) => {
    const wall = p("wallpaper", "#A88E5A");
    return (
      <g>
        <Gradient id="mrWall" a={shade(wall, 0.05)} b={shade(wall, -0.25)} y2={1500} />
        {Array.from({ length: 10 }, (_, i) => Array.from({ length: 14 }, (_, j) => (
          <path key={i + "-" + j} d={`M${i * 120 + (j % 2) * 60} ${j * 110} q20 -30 40 0 q-20 30 -40 0Z`} fill={shade(wall, -0.18)} opacity=".6" />
        )))}
        <Window x={790} y={1000} w={300} h={380} sky={[p("night", "#141A3A"), p("nightLow", "#3A3466")]} skyline={false} />
        {/* Zeitungsausschnitte an der Wand */}
        {[[150, 640, -4], [300, 600, 3], [230, 780, 2], [380, 760, -3]].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <rect x="-60" y="-75" width="120" height="150" fill="#F4EEDC" stroke="#1C1830" strokeWidth="4" />
            {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M-44 ${-50 + k * 24} H44`} stroke="#1C1830" strokeOpacity=".35" strokeWidth="5" />)}
          </g>
        ))}
        <path d="M150 640 L300 600 L380 760 L230 780Z" fill="none" stroke="#D62839" strokeWidth="4" />
        <rect x="-20" y="1460" width={W + 40} height="50" fill={shade(wall, -0.35)} stroke="#1C1830" strokeWidth="4" />
        <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill={p("carpet", "#6E5A4A")} stroke="#1C1830" strokeWidth="5" />
      </g>
    );
  },
  Mid: ({ p }) => (
    <g>
      <Bed x={210} y={1640} s={1.0} color={p("spread", "#8E5A3A")} />
    </g>
  ),
  Fore: () => <g />,
};

/** Diner: Theke, Kuchenvitrine, Karo-Boden. */
const Diner: Loc = {
  floorY: 1560,
  Back: ({ p }) => (
    <g>
      <Gradient id="dnWall" a={p("dinerWall", "#E9E2CF")} b={shade(p("dinerWall", "#E9E2CF"), -0.15)} y2={1500} />
      <rect x="-40" y="880" width={W + 80} height="60" fill={p("dinerStripe", "#C8423A")} stroke="#1C1830" strokeWidth="5" />
      <NeonSign x={540} y={720} text="DINER" color="#5BC8E8" />
      {[180, 900].map((x) => <PendantLamp key={x} x={x} y={-10} drop={300} />)}
      <BarCounter x={540} y={1480} w={1240} color={p("counter", "#5BA8B8")} color2={shade(p("counter", "#5BA8B8"), -0.25)} />
      {Array.from({ length: 12 }, (_, i) => Array.from({ length: 6 }, (_, j) => (
        <rect key={i + "-" + j} x={i * 100 - 40} y={1500 + j * 80} width="100" height="80" fill={(i + j) % 2 ? "#1C1830" : "#F4F0E4"} />
      )))}
    </g>
  ),
  Mid: () => <g />,
  Fore: () => (
    <g>
      <Stool x={70} y={2060} s={2.2} color="#C8423A" />
      <Stool x={1010} y={2080} s={2.4} color="#C8423A" />
    </g>
  ),
};

/** Billardkneipe: dunkles Holz, Neonschild, Tisch im Mittelgrund. */
const PoolHall: Loc = {
  floorY: 1600,
  Back: ({ p }) => {
    const wood = p("wood", "#4A2E20");
    return (
      <g>
        <Gradient id="phWall" a={shade(wood, -0.1)} b={shade(wood, -0.4)} y2={1500} />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${i * 140} 0 V1500`} stroke="#1C1830" strokeOpacity=".3" strokeWidth="4" />)}
        <NeonSign x={300} y={560} text="POOL" color="#FF5B6E" />
        <NeonSign x={800} y={700} text="BEER" color="#F6C945" />
        <ellipse cx="540" cy="1200" rx="560" ry="300" fill="#FFD98A" opacity=".14" />
        <FloorBoards y={1500} h={H - 1500} color={p("floor", "#3A2418")} line="#24160E" />
      </g>
    );
  },
  Mid: () => (
    <g>
      <PendantLamp x={540} y={-10} drop={900} />
      <PoolTable x={540} y={1500} s={1.25} />
    </g>
  ),
  Fore: () => <g />,
};

/* ================= Dexter ================= */
/** Forensik-Labor: kühles Licht, Blutspuren-Tafel, Arbeitstisch mit Mikroskop. */
const Lab: Loc = {
  floorY: 1600,
  Back: ({ p }) => (
    <g>
      <Gradient id="lbWall" a={p("labWall", "#DCE6EA")} b={shade(p("labWall", "#DCE6EA"), -0.2)} y2={1500} />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 150} y="0" width="140" height="40" fill="#F4FAFC" opacity=".8" />)}
      {/* Tafel mit Blutspritzer-Mustern (stilisiert) */}
      <rect x="560" y="560" width="440" height="560" fill="#FFFFFF" stroke="#1C1830" strokeWidth="6" />
      {[[660, 700, 30], [720, 760, 14], [800, 690, 20], [880, 820, 26], [700, 900, 18], [860, 960, 12], [760, 1000, 22]].map(([x, y, r], i) => (
        <g key={i}><circle cx={x} cy={y} r={r} fill="#C8323A" /><path d={`M${x} ${y} l${r * 1.6} ${r * 0.9}`} stroke="#C8323A" strokeWidth={r / 2} strokeLinecap="round" /></g>
      ))}
      {[[660, 700], [880, 820], [700, 900]].map(([x, y], i) => <path key={i} d={`M${x} ${y} L${780} ${1080}`} stroke="#2B4F8C" strokeWidth="3" strokeDasharray="10 8" />)}
      <rect x="-40" y="1240" width={W + 80} height="60" fill="#B9C6CC" stroke="#1C1830" strokeWidth="5" />
      <rect x="-40" y="1300" width={W + 80} height="260" fill="#8FA2AC" stroke="#1C1830" strokeWidth="5" />
      <Microscope x={860} y={1240} s={1.0} />
      <rect x="-40" y="1560" width={W + 80} height={H - 1560} fill={p("labFloor", "#9AA8AE")} stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
  Mid: () => <g />,
  Fore: () => <g />,
};

/** Wohnanlage in Miami: zweistöckig, Außengang, Pool, Palmen. */
const Condo: Loc = {
  floorY: 1640,
  Back: ({ p }) => (
    <g>
      <Gradient id="cdSky" a={p("skyTop", "#5EC2E6")} b={p("skyBottom", "#FFE3B0")} y2={1200} />
      <circle cx="860" cy="360" r="90" fill="#FFE7A8" />
      <Cloud x={260} y={420} s={1.0} color="#FFFFFF" />
      <rect x="-40" y="640" width={W + 80} height="820" fill={p("condo", "#F2E6CF")} stroke="#1C1830" strokeWidth="6" />
      <path d="M-60 640 H1140 L1100 600 H-20Z" fill={p("condoRoof", "#D98A5A")} stroke="#1C1830" strokeWidth="6" />
      {/* Außengang mit Geländer (2. Stock) */}
      <rect x="-40" y="1010" width={W + 80} height="24" fill="#FFFFFF" stroke="#1C1830" strokeWidth="5" />
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${i * 48 - 20} 1034 V1110`} stroke="#1C1830" strokeWidth="4" />)}
      <rect x="-40" y="1110" width={W + 80} height="18" fill="#FFFFFF" stroke="#1C1830" strokeWidth="5" />
      {[90, 360, 630, 900].map((x, i) => (
        <g key={x}>
          <rect x={x} y="780" width="110" height="200" fill={i === 1 ? "#5A7A8E" : "#E0D2B6"} stroke="#1C1830" strokeWidth="5" />
          <rect x={x + 140} y="800" width="100" height="90" fill="#9FD7F2" stroke="#1C1830" strokeWidth="5" />
          <rect x={x} y="1200" width="110" height="200" fill="#E0D2B6" stroke="#1C1830" strokeWidth="5" />
        </g>
      ))}
      <text x="415" y="760" textAnchor="middle" fontFamily="Anton" fontSize="34" fill="#1C1830">10B</text>
      <rect x="-40" y="1460" width={W + 80} height="80" fill="#E8DFCC" stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
  Mid: () => (
    <g>
      <rect x="-40" y="1540" width={W + 80} height={H - 1540} fill="#E8DFCC" stroke="#1C1830" strokeWidth="5" />
      <Palm x={1010} y={1560} s={1.25} />
      <rect x="120" y="1700" width="840" height="200" rx="20" fill="#5EC2E6" stroke="#1C1830" strokeWidth="6" />
      <path d="M180 1760 q40 -16 80 0 t80 0 M520 1820 q40 -16 80 0 t80 0" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="6" />
    </g>
  ),
  Fore: () => <g />,
};

/** Marina: Steg, Wasser, Masten im Hintergrund. */
const Marina: Loc = {
  floorY: 1560,
  Back: ({ p }) => {
    const f = useCurrentFrame();
    return (
      <g>
        <Gradient id="mrSky" a={p("skyTop", "#5EC2E6")} b={p("skyBottom", "#FFE3B0")} y2={1100} />
        <Cloud x={300 + f * 0.2} y={400} s={1.1} color="#FFFFFF" />
        <Skyline x={540} y={1060} w={1300} color="#9DB4C6" seed={5} maxH={360} />
        {[120, 260, 820, 980].map((x) => <path key={x} d={`M${x} 1060 V700`} stroke="#E8ECEF" strokeWidth="8" />)}
        <rect x="-40" y="1060" width={W + 80} height={H - 1060} fill={p("sea", "#2E8FB8")} />
        {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${((i * 230 + f * 2) % 1300) - 150} ${1120 + (i % 4) * 90} q30 -18 60 0 t60 0`} fill="none" stroke="#fff" strokeOpacity=".35" strokeWidth="6" strokeLinecap="round" />)}
      </g>
    );
  },
  Mid: () => (
    <g>
      <Dock x={540} y={1560} w={1300} />
      <rect x="-40" y="1600" width={W + 80} height={H - 1600} fill="#2A7CA4" />
    </g>
  ),
  Fore: () => <g />,
};

/** Offenes Meer vor Miami: Horizont, Wellen. */
const OpenSea: Loc = {
  floorY: 1560,
  Back: ({ p }) => {
    const f = useCurrentFrame();
    return (
      <g>
        <Gradient id="osSky" a={p("skyTop", "#5EC2E6")} b={p("skyBottom", "#FFE3B0")} y2={1000} />
        <circle cx="820" cy="560" r="110" fill="#FFE7A8" />
        <Cloud x={240 - f * 0.15} y={420} s={1.0} color="#FFFFFF" />
        <Skyline x={160} y={990} w={420} color="#B6C6D4" seed={2} maxH={120} />
        <rect x="-40" y="990" width={W + 80} height={H - 990} fill={p("sea", "#2E8FB8")} />
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${((i * 190 - f * 4) % 1300 + 1300) % 1300 - 150} ${1050 + (i % 6) * 140} q30 -18 60 0 t60 0`} fill="none" stroke="#fff" strokeOpacity=".4" strokeWidth="7" strokeLinecap="round" />)}
      </g>
    );
  },
  Mid: () => <g />,
  Fore: () => <g />,
};

/* ================= Breaking Bad ================= */
/** Wüste bei Albuquerque: Tafelberge, Gestrüpp, Sand. */
const Desert: Loc = {
  floorY: 1620,
  Back: ({ p }) => {
    const f = useCurrentFrame();
    return (
      <g>
        <Gradient id="dsSky" a={p("skyTop", "#4FA3D8")} b={p("skyBottom", "#F6D9A8")} y2={1200} />
        <circle cx="820" cy="380" r="100" fill="#FFF1C2" />
        <Cloud x={220 + f * 0.15} y={420} s={0.9} color="#FFFFFF" />
        <path d="M-80 1150 L120 1150 L170 960 L420 960 L470 1150 L700 1150 L760 1020 L960 1020 L1010 1150 L1160 1150 V1300 H-80Z" fill={p("mesa", "#C46A42")} stroke="#1C1830" strokeWidth="6" strokeLinejoin="round" />
        <path d="M170 1010 H420 M760 1060 H960" stroke="#1C1830" strokeOpacity=".25" strokeWidth="6" />
        <rect x="-80" y="1250" width={W + 160} height={H - 1250} fill={p("sand", "#E3B97A")} stroke="#1C1830" strokeWidth="5" />
        {[[120, 1420], [880, 1380], [420, 1700], [980, 1760], [60, 1820]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <ellipse cx="0" cy="0" rx="60" ry="22" fill="#8C8A4E" stroke="#1C1830" strokeWidth="4" />
            <ellipse cx="-20" cy="-14" rx="30" ry="16" fill="#9C9A5A" stroke="#1C1830" strokeWidth="3" />
          </g>
        ))}
      </g>
    );
  },
  Mid: () => <g />,
  Fore: () => <g />,
};

/** Lagerraum: Betonwand, Rolltor, Neonröhre. */
const Storage: Loc = {
  floorY: 1640,
  Back: ({ p }) => (
    <g>
      <Gradient id="sgWall" a={p("concrete", "#9A9AA2")} b={shade(p("concrete", "#9A9AA2"), -0.35)} y2={1500} />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-40 ${200 + i * 220} H${W + 40}`} stroke="#1C1830" strokeOpacity=".15" strokeWidth="4" />)}
      <rect x="140" y="80" width="800" height="26" rx="10" fill="#F4FAFC" stroke="#1C1830" strokeWidth="5" />
      <ellipse cx="540" cy="400" rx="560" ry="420" fill="#F4FAFC" opacity=".12" />
      {/* Rolltor oben angeschnitten */}
      <rect x="-40" y="160" width={W + 80} height="160" fill="#C8C8CE" stroke="#1C1830" strokeWidth="5" />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M-40 ${190 + i * 28} H${W + 40}`} stroke="#1C1830" strokeOpacity=".3" strokeWidth="4" />)}
      <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill={p("floorC", "#7A7A82")} stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
  Mid: () => <g />,
  Fore: () => <g />,
};

/** Men-of-Letters-Bunker: dunkles Holz, Bücherregale, leuchtender Kartentisch. */
const Bunker: Loc = {
  floorY: 1620,
  Back: ({ p }) => (
    <g>
      <Gradient id="bkWall" a={p("bunkerWall", "#4A3A2C")} b={shade(p("bunkerWall", "#4A3A2C"), -0.4)} y2={1500} />
      {[160, 920].map((x) => <Bookshelf key={x} x={x} y={1300} s={1.6} color="#5A3A22" />)}
      {[300, 780].map((x) => <PendantLamp key={x} x={x} y={-10} drop={420} />)}
      <ellipse cx="540" cy="1360" rx="520" ry="200" fill="#FFD98A" opacity=".14" />
      {/* Kartentisch mit Leuchtfläche */}
      <rect x="140" y="1300" width="800" height="70" rx="10" fill="#6E4A2E" stroke="#1C1830" strokeWidth="6" />
      <rect x="170" y="1310" width="740" height="40" rx="6" fill="#BFE6F2" opacity=".85" />
      <path d="M260 1330 q60 -10 120 0 t120 0 M560 1325 q50 8 100 0 t100 4" stroke="#2B4F8C" strokeWidth="4" fill="none" opacity=".6" />
      <path d="M180 1370 V1500 M900 1370 V1500" stroke="#1C1830" strokeWidth="26" />
      <path d="M180 1370 V1500 M900 1370 V1500" stroke="#6E4A2E" strokeWidth="18" />
      <FloorBoards y={1500} h={H - 1500} color="#3A2A1E" line="#24180E" />
    </g>
  ),
  Mid: () => <g />,
  Fore: () => <g />,
};

/** Gefängniszelle: Ziegelwand, Pritsche, Gitter im Vordergrund. */
const Cell: Loc = {
  floorY: 1620,
  Back: () => (
    <g>
      <Gradient id="clWall" a="#8C8C96" b="#55555F" y2={1500} />
      {Array.from({ length: 18 }, (_, r) => Array.from({ length: 7 }, (_, c) => (
        <rect key={r + "-" + c} x={c * 170 - 60 + (r % 2) * 85} y={r * 84} width="160" height="76" rx="6" fill="#9A9AA4" opacity=".35" />
      )))}
      <rect x="760" y="520" width="200" height="140" fill="#2B3463" stroke="#1C1830" strokeWidth="6" />
      {[800, 850, 900].map((x) => <path key={x} d={`M${x} 520 V660`} stroke="#1C1830" strokeWidth="10" />)}
      <rect x="620" y="1280" width="440" height="60" rx="8" fill="#D9D4CA" stroke="#1C1830" strokeWidth="5" />
      <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill="#6A6A72" stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
  Mid: () => <g />,
  Fore: () => (
    <g>
      {[30, 150, 527, 905, 1025].map((x) => <rect key={x} x={x} y="-40" width="26" height={H + 80} fill="#3A3A44" stroke="#1C1830" strokeWidth="5" opacity=".9" />)}
      <rect x="-40" y="260" width={W + 80} height="26" fill="#3A3A44" stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
};

/* ================= The Big Bang Theory ================= */
/** Wohnung 4A: warme Wände, Whiteboards, Fenster, Sofa. */
const Apt4A: Loc = {
  floorY: 1560,
  Back: ({ p }) => {
    const wall = p("wall4a", "#C9A27A");
    return (
      <g>
        <Gradient id="a4Wall" a={shade(wall, 0.05)} b={shade(wall, -0.3)} y2={1500} />
        <Window x={230} y={1000} w={300} h={420} sky={[p("skyTop", "#3E5C8A"), p("skyBottom", "#E8A26A")]} />
        <Whiteboard x={720} y={900} w={420} h={260} />
        <Whiteboard x={760} y={1240} w={300} h={200} />
        <Frame x={460} y={760} w={120} h={160} color="#2B4F8C" />
        <rect x="-20" y="1460" width={W + 40} height="50" fill={shade(wall, -0.35)} stroke="#1C1830" strokeWidth="4" />
        <FloorBoards y={1500} h={H - 1500} color={p("floor4a", "#8A5A3A")} />
      </g>
    );
  },
  Mid: ({ p }) => (
    <g>
      <Sofa x={540} y={1620} s={1.5} color={p("sofa4a", "#6E5A3A")} />
    </g>
  ),
  Fore: () => <g />,
};

/** Treppenhaus: Stufen, Geländer, Aufzug mit „Außer Betrieb“. */
const Stairwell: Loc = {
  floorY: 1620,
  Back: ({ p }) => {
    const wall = p("stairWall", "#D9C8A6");
    return (
      <g>
        <Gradient id="swWall" a={shade(wall, 0.05)} b={shade(wall, -0.3)} y2={1500} />
        {/* Aufzug */}
        <rect x="620" y="720" width="360" height="760" fill="#9AA2AC" stroke="#1C1830" strokeWidth="6" />
        <path d="M800 720 V1480" stroke="#1C1830" strokeWidth="6" />
        <g transform="translate(800 1000) rotate(-6)">
          <rect x="-150" y="-60" width="300" height="120" fill="#FFF8EA" stroke="#1C1830" strokeWidth="5" />
          <text x="0" y="-8" textAnchor="middle" fontFamily="Anton" fontSize="40" fill="#D62839">AUSSER</text>
          <text x="0" y="40" textAnchor="middle" fontFamily="Anton" fontSize="40" fill="#D62839">BETRIEB</text>
        </g>
        {/* Treppe links */}
        {Array.from({ length: 9 }, (_, i) => <rect key={i} x={-40 + i * 50} y={1460 - i * 70} width="560" height="70" fill={shade(wall, -0.15 - i * 0.01)} stroke="#1C1830" strokeWidth="4" />)}
        <path d="M-40 1380 L460 820" stroke="#5A3A22" strokeWidth="18" strokeLinecap="round" />
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-20 + i * 60} ${1358 - i * 67} V${1450 - i * 70}`} stroke="#5A3A22" strokeWidth="8" />)}
        <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill="#8A7A62" stroke="#1C1830" strokeWidth="5" />
      </g>
    );
  },
  Mid: () => <g />,
  Fore: () => <g />,
};

/** Restaurant: warme Säulen, Hängelampen, Nischen. */
const Restaurant: Loc = {
  floorY: 1580,
  Back: ({ p }) => {
    const wall = p("restWall", "#C88A4A");
    return (
      <g>
        <Gradient id="rsWall" a={shade(wall, 0.1)} b={shade(wall, -0.35)} y2={1500} />
        {[120, 540, 960].map((x) => (
          <g key={x}>
            <rect x={x - 50} y="300" width="100" height="1200" fill="#E8D2A8" stroke="#1C1830" strokeWidth="5" />
            <rect x={x - 70} y="280" width="140" height="40" fill="#D9BE8A" stroke="#1C1830" strokeWidth="5" />
          </g>
        ))}
        {[330, 750].map((x) => <PendantLamp key={x} x={x} y={-10} drop={520} />)}
        <ellipse cx="540" cy="900" rx="560" ry="500" fill="#FFD98A" opacity=".12" />
        <Booth x={330} y={1500} s={1.4} color="#7A2E3A" />
        <Booth x={750} y={1500} s={1.4} color="#7A2E3A" />
        <FloorBoards y={1500} h={H - 1500} color="#5A3A22" line="#3A2414" />
      </g>
    );
  },
  Mid: () => <g />,
  Fore: () => <g />,
};

/* ================= Squid Game ================= */
/** Schlafsaal: weiße Halle, Etagenbetten bis zur Decke, Sparschwein hängt oben. */
const Dorm: Loc = {
  floorY: 1640,
  Back: () => (
    <g>
      <Gradient id="dmWall" a="#E9EEF0" b="#B9C4C8" y2={1500} />
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "translate(1080 0) scale(-1 1)" : ""}>
          {Array.from({ length: 6 }, (_, r) => (
            <g key={r}>
              <rect x="-40" y={300 + r * 190} width="380" height="24" fill="#3E9C8A" stroke="#1C1830" strokeWidth="4" />
              <rect x="-40" y={276 + r * 190} width="360" height="24" fill="#F4F2EC" stroke="#1C1830" strokeWidth="3" />
              {[20, 160, 300].map((x) => <path key={x} d={`M${x} ${324 + r * 190} V${470 + r * 190}`} stroke="#2E7A6A" strokeWidth="10" />)}
            </g>
          ))}
          <path d="M340 260 V1500" stroke="#2E7A6A" strokeWidth="12" />
        </g>
      ))}
      <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill="#C9CFD2" stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
  Mid: () => <g />,
  Fore: () => <g />,
};

/** Spielfeld: Wand mit gemaltem Himmel, sandiger Boden. */
const GameField: Loc = {
  floorY: 1660,
  Back: () => (
    <g>
      <Gradient id="gfSky" a="#7CC6EC" b="#CDEBF7" y2={1300} />
      {[[200, 400], [700, 300], [900, 620], [380, 760]].map(([x, y], i) => <Cloud key={i} x={x} y={y} s={1.1} color="#FFFFFF" />)}
      <path d="M-40 1260 Q300 1200 540 1250 T1120 1240 V1320 H-40Z" fill="#7BAA5A" stroke="#1C1830" strokeWidth="5" />
      <rect x="-40" y="1300" width={W + 80} height={H - 1300} fill="#E3C79A" stroke="#1C1830" strokeWidth="5" />
      <path d="M-40 1420 H1120" stroke="#C8423A" strokeWidth="8" strokeDasharray="30 18" />
    </g>
  ),
  Mid: () => <g />,
  Fore: () => <g />,
};

/* ================= Haus des Geldes ================= */
/** Druckerei der Münze: Industriehalle, laufende Druckmaschine. */
const PrintRoom: Loc = {
  floorY: 1640,
  Back: () => {
    const f = useCurrentFrame();
    return (
      <g>
        <Gradient id="prWall" a="#5A606C" b="#2E323A" y2={1500} />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 150 - 20} y="0" width="120" height="60" fill="#FFF6D6" opacity=".25" />)}
        <ellipse cx="540" cy="700" rx="600" ry="420" fill="#FFF6D6" opacity=".06" />
        <PrintingPress x={540} y={1300} s={1.1} phase={f / 6} />
        <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill="#3E4450" stroke="#1C1830" strokeWidth="5" />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${i * 200 - 40} 1500 L${i * 260 - 300} ${H}`} stroke="#F6C945" strokeOpacity=".25" strokeWidth="6" />)}
      </g>
    );
  },
  Mid: () => <g />,
  Fore: () => <g />,
};

/* ================= Prison Break ================= */
/** Tattoo-Studio: dunkelrote Wände, Vorlagen, Liege, Lampe. */
const TattooStudio: Loc = {
  floorY: 1620,
  Back: () => (
    <g>
      <Gradient id="tsWall" a="#6E2A2E" b="#3A1618" y2={1500} />
      {Array.from({ length: 8 }, (_, i) => (
        <g key={i} transform={`translate(${80 + (i % 4) * 240} ${380 + Math.floor(i / 4) * 300}) rotate(${(i % 3) - 1})`}>
          <rect x="-90" y="-110" width="180" height="220" fill="#F4EEDC" stroke="#1C1830" strokeWidth="4" />
          <path d={`M-50 -40 q50 -60 100 0 q-50 60 -100 0 M-30 40 h60`} stroke="#1C1830" strokeWidth="5" fill="none" />
        </g>
      ))}
      <PendantLamp x={540} y={-10} drop={480} />
      <rect x="160" y="1340" width="760" height="70" rx="20" fill="#2A2A2A" stroke="#1C1830" strokeWidth="5" />
      <path d="M240 1410 V1500 M840 1410 V1500" stroke="#1C1830" strokeWidth="18" />
      <FloorBoards y={1500} h={H - 1500} color="#2A1E1A" line="#140E0C" />
    </g>
  ),
  Mid: () => <g />,
  Fore: () => <g />,
};

/** Laser-Praxis: weiß, klinisch, Liege. */
const Clinic: Loc = {
  floorY: 1620,
  Back: () => (
    <g>
      <Gradient id="clnWall" a="#F2F6F8" b="#C9D6DC" y2={1500} />
      {[0, 1, 2].map((i) => <rect key={i} x={140 + i * 300} y="420" width="220" height="300" rx="10" fill="#DCEFF6" stroke="#1C1830" strokeWidth="5" />)}
      <rect x="-40" y="1240" width={W + 80} height="24" fill="#B9C6CC" stroke="#1C1830" strokeWidth="4" />
      <rect x="560" y="1350" width="460" height="60" rx="16" fill="#E8ECEF" stroke="#1C1830" strokeWidth="5" />
      <path d="M620 1410 V1500 M960 1410 V1500" stroke="#1C1830" strokeWidth="14" />
      <rect x="-40" y="1500" width={W + 80} height={H - 1500} fill="#DCE3E6" stroke="#1C1830" strokeWidth="5" />
    </g>
  ),
  Mid: () => <g />,
  Fore: () => <g />,
};

export const LOCATIONS: Record<string, Loc> = { apartment: Apartment, bar: Bar, street: Street, beachhouse: BeachHouse, deck: Deck, driveway: Driveway, highway: Highway, gasstation: GasStation, motel: Motel, motelroom: MotelRoom, diner: Diner, poolhall: PoolHall, lab: Lab, condo: Condo, marina: Marina, sea: OpenSea, desert: Desert, storage: Storage, bunker: Bunker, cell: Cell, apt4a: Apt4A, stairwell: Stairwell, restaurant: Restaurant, dorm: Dorm, gamefield: GameField, printroom: PrintRoom, tattoostudio: TattooStudio, clinic: Clinic };

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
