import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LINE, LW } from "../lib/theme";
import { LOOKS, Look } from "./looks";

/* Koordinaten: Füße bei (0,0), y nach oben negativ. Kopf ≈ ¼ der Körperhöhe. */

export type Pose = { lOut: number; lBend: number; rOut: number; rBend: number; lean?: number; tilt?: number; lift?: number; wave?: number };
export type PoseName =
  | "idle" | "hold" | "sip" | "point" | "shrug" | "cheer" | "think" | "facepalm" | "give" | "hips" | "wave" | "pay";

export const POSES: Record<PoseName, Pose> = {
  idle: { lOut: 9, lBend: 10, rOut: 9, rBend: 10 },
  hold: { lOut: 24, lBend: 88, rOut: 24, rBend: 88 },
  sip: { lOut: 9, lBend: 10, rOut: 34, rBend: 152 },
  point: { lOut: 9, lBend: 10, rOut: 148, rBend: 4 },
  shrug: { lOut: 30, lBend: -104, rOut: 30, rBend: -104, lift: 14 },
  cheer: { lOut: 158, lBend: 14, rOut: 158, rBend: 14, lift: 6 },
  think: { lOut: 12, lBend: 14, rOut: -12, rBend: 138 },
  facepalm: { lOut: 9, lBend: 10, rOut: -6, rBend: 168, tilt: 5 },
  give: { lOut: 9, lBend: 10, rOut: 58, rBend: 46 },
  pay: { lOut: 40, lBend: 70, rOut: 40, rBend: 70, lean: 3 },
  hips: { lOut: 42, lBend: 78, rOut: 42, rBend: 78 },
  wave: { lOut: 9, lBend: 10, rOut: 150, rBend: 30, wave: 1 },
};

export type Expr = "neutral" | "happy" | "shocked" | "skeptical" | "annoyed" | "thinking";
export type MouthName = "smile" | "grin" | "open" | "o" | "flat" | "smirk" | "frown";

type ExprDef = { browL: [number, number]; browR: [number, number]; eye: number; lid: number; pupil: [number, number]; mouth: MouthName };
/** brow: [y-Versatz, Drehung°] (positive Drehung = außen unten) */
const EXPR: Record<Expr, ExprDef> = {
  neutral: { browL: [0, 0], browR: [0, 0], eye: 1, lid: 0, pupil: [0, 0], mouth: "smile" },
  happy: { browL: [-4, -6], browR: [-4, 6], eye: 0.9, lid: 0, pupil: [0, 0], mouth: "grin" },
  shocked: { browL: [-14, -8], browR: [-14, 8], eye: 1.3, lid: 0, pupil: [0, 0], mouth: "o" },
  skeptical: { browL: [-10, -12], browR: [4, 14], eye: 0.95, lid: 0.18, pupil: [5, -1], mouth: "smirk" },
  annoyed: { browL: [4, 16], browR: [4, -16], eye: 0.85, lid: 0.42, pupil: [0, 2], mouth: "flat" },
  thinking: { browL: [-6, -10], browR: [-2, 8], eye: 1, lid: 0.1, pupil: [6, -6], mouth: "flat" },
};

const sw = { stroke: LINE, strokeWidth: LW, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/* ---------- Mund (7 Formen) ---------- */
function Mouth({ name, skin }: { name: MouthName; skin: string }) {
  const y = -414;
  switch (name) {
    case "grin":
      return (
        <g>
          <path d={`M-26 ${y - 4} Q0 ${y + 30} 26 ${y - 4} Z`} fill="#7C2A22" {...sw} />
          <path d={`M-20 ${y - 3} Q0 ${y + 3} 20 ${y - 3} L18 ${y + 5} Q0 ${y + 9} -18 ${y + 5} Z`} fill="#fff" stroke="none" />
        </g>
      );
    case "open":
      return <ellipse cx="0" cy={y + 6} rx="16" ry="12" fill="#7C2A22" {...sw} />;
    case "o":
      return <ellipse cx="0" cy={y + 10} rx="11" ry="15" fill="#7C2A22" {...sw} />;
    case "flat":
      return <path d={`M-16 ${y + 6} L16 ${y + 6}`} {...sw} strokeWidth={5} fill="none" />;
    case "smirk":
      return <path d={`M-16 ${y + 8} Q4 ${y + 12} 18 ${y - 2}`} {...sw} strokeWidth={5} fill="none" />;
    case "frown":
      return <path d={`M-18 ${y + 14} Q0 ${y - 4} 18 ${y + 14}`} {...sw} strokeWidth={5} fill="none" />;
    default:
      return <path d={`M-18 ${y} Q0 ${y + 16} 18 ${y}`} {...sw} strokeWidth={5} fill="none" />;
  }
}

/* ---------- Haare ---------- */
function HairBack({ look }: { look: Look }) {
  if (look.hair.style === "long")
    return <path d="M-88 -448 Q-98 -544 0 -556 Q98 -544 88 -448 L96 -338 Q70 -326 56 -352 L-56 -352 Q-70 -326 -96 -338Z" fill={look.hair.color} {...sw} />;
  if (look.hair.style === "marshall")
    return <path d="M-84 -450 Q-96 -530 -2 -546 Q96 -530 84 -450 L80 -410 Q72 -440 60 -440 L-60 -440 Q-72 -440 -80 -410Z" fill={look.hair.color} {...sw} />;
  if (look.hair.style === "curly")
    return (
      <g fill={look.hair.color} {...sw}>
        {[[-88, -470], [-96, -420], [88, -470], [96, -420], [-60, -528], [60, -528], [0, -548]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="34" />)}
      </g>
    );
  if (look.hair.style === "sam")
    // halblang, fransig bis zum Kiefer
    return <path d="M-90 -446 Q-98 -546 0 -556 Q98 -546 90 -446 L94 -380 Q84 -366 74 -384 L70 -360 Q58 -372 56 -400 L-56 -400 Q-58 -372 -70 -360 L-74 -384 Q-84 -366 -94 -380Z" fill={look.hair.color} {...sw} />;
  if (look.hair.style === "alan")
    return <path d="M-84 -430 Q-92 -476 -76 -492 L-62 -470 Q-70 -452 -72 -420Z M84 -430 Q92 -476 76 -492 L62 -470 Q70 -452 72 -420Z" fill={look.hair.color} {...sw} />;
  return null;
}
function HairFront({ look }: { look: Look }) {
  const c = look.hair.color;
  switch (look.hair.style) {
    case "barney":
      return (
        <g>
          <path d="M-84 -458 Q-88 -538 0 -546 Q88 -538 84 -458 Q64 -500 0 -506 Q-64 -500 -84 -458Z" fill={c} {...sw} />
          <path d="M-52 -520 Q-10 -534 40 -520" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "long":
      return (
        <g>
          <path d="M-86 -440 Q-92 -540 4 -552 Q92 -538 86 -452 Q70 -500 20 -508 Q-30 -484 -86 -440Z" fill={c} {...sw} />
          <path d="M-60 -516 Q-20 -530 20 -520" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "ted":
      return (
        <g>
          <path d="M-82 -462 Q-90 -540 -6 -548 Q80 -546 86 -474 Q70 -498 40 -502 Q50 -520 22 -524 Q-30 -500 -82 -462Z" fill={c} {...sw} />
          <path d="M22 -524 Q52 -532 70 -508" fill="none" stroke={look.skinShade} strokeWidth="0" />
          <path d="M-60 -500 Q-20 -516 18 -512" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "marshall":
      return (
        <g>
          <path d="M-86 -440 Q-92 -534 -4 -552 Q86 -534 86 -440 Q80 -482 56 -498 Q28 -480 0 -500 Q-30 -480 -56 -498 Q-80 -482 -86 -440Z" fill={c} {...sw} />
          <path d="M0 -500 Q-6 -520 -4 -548" fill="none" stroke={look.skinShade} strokeOpacity=".0" />
          <path d="M-40 -512 Q-18 -528 0 -522 M44 -512 Q22 -528 4 -522" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case "charlie":
      // kurz, dunkel, nach hinten gegelt, leichte Tolle
      return (
        <g>
          <path d="M-84 -456 Q-92 -536 -10 -550 Q80 -548 86 -466 Q78 -506 46 -516 Q10 -508 -20 -524 Q-60 -506 -84 -456Z" fill={c} {...sw} />
          <path d="M-50 -522 Q-6 -548 50 -526 M-40 -506 Q0 -526 44 -512" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "dean":
      // kurz, vorne leicht hochgestylt
      return (
        <g>
          <path d="M-84 -462 Q-90 -526 -50 -542 L-40 -566 L-22 -546 L-4 -572 L12 -548 L32 -570 L44 -544 Q86 -530 84 -462 Q76 -500 40 -510 Q0 -500 -40 -512 Q-74 -500 -84 -462Z" fill={c} {...sw} />
          <path d="M-36 -530 Q0 -544 36 -530" fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "dexter":
      // kurz, ordentlich, Seitenscheitel
      return (
        <g>
          <path d="M-84 -458 Q-90 -540 -6 -550 Q82 -546 86 -462 Q80 -496 54 -508 Q20 -500 -14 -520 Q-50 -498 -84 -458Z" fill={c} {...sw} />
          <path d="M-14 -520 Q-20 -538 -10 -548" fill="none" stroke={LINE} strokeWidth="3" opacity=".5" />
          <path d="M-56 -520 Q-30 -536 -16 -530 M10 -532 Q40 -536 62 -516" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "buzz":
      // raspelkurz: dünne Kappe mit Punkten
      return (
        <g>
          <path d="M-82 -470 Q-86 -536 0 -544 Q86 -536 82 -470 Q60 -500 0 -504 Q-60 -500 -82 -470Z" fill={c} opacity=".75" {...sw} strokeWidth={4} />
          {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={-60 + (i % 7) * 20} cy={-520 + Math.floor(i / 7) * 16} r="2.5" fill="#000" opacity=".25" />)}
        </g>
      );
    case "sheldon":
      // kurz, glatt, Seitenscheitel, etwas Volumen oben
      return (
        <g>
          <path d="M-84 -452 Q-92 -538 -10 -552 Q80 -550 86 -460 Q78 -500 50 -510 Q16 -520 -24 -514 Q-60 -500 -84 -452Z" fill={c} {...sw} />
          <path d="M-40 -540 Q10 -556 60 -530" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "leonard":
      // kurze, dunkle Locken
      return (
        <g fill={c} {...sw}>
          {[[-70, -486], [-44, -516], [-12, -530], [22, -528], [54, -512], [76, -484], [-82, -456], [84, -456]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="24" />)}
        </g>
      );
    case "sam":
      // Mittelscheitel, Strähnen zur Seite
      return (
        <g>
          <path d="M-90 -430 Q-98 -546 0 -556 Q98 -546 90 -430 Q84 -486 52 -506 Q24 -516 4 -540 Q-20 -514 -52 -506 Q-84 -486 -90 -430Z" fill={c} {...sw} />
          <path d="M4 -540 Q-30 -520 -62 -498 M4 -540 Q36 -520 66 -498" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "alan":
      // Geheimratsecken: dünner Schopf vorne, Seiten
      return (
        <g>
          <path d="M-30 -526 Q-6 -548 26 -528 Q10 -516 -8 -520 Q-20 -514 -30 -526Z" fill={c} {...sw} />
          <path d="M-80 -470 Q-86 -500 -66 -514 L-60 -490Z M80 -470 Q86 -500 66 -514 L60 -490Z" fill={c} {...sw} />
        </g>
      );
    case "curly":
      return (
        <g fill={c} {...sw}>
          {[[-62, -506], [-26, -528], [14, -530], [52, -510], [76, -480], [-80, -478]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="28" />)}
        </g>
      );
    case "kid":
      // dichter, runder Wuschelkopf
      return (
        <g>
          <path d="M-86 -440 Q-96 -546 0 -554 Q96 -546 86 -440 Q80 -488 50 -496 Q30 -478 6 -494 Q-20 -476 -44 -494 Q-74 -488 -86 -440Z" fill={c} {...sw} />
          <path d="M-46 -526 Q0 -544 46 -526" fill="none" stroke="#fff" strokeOpacity=".16" strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    default:
      return null;
  }
}

/* ---------- Maske (Wächter / Dalí) mit Kapuze ---------- */
function Mask({ look }: { look: Look }) {
  const m = look.mask!;
  return (
    <g>
      {/* Kapuze */}
      <path d="M-96 -420 Q-104 -548 0 -556 Q104 -548 96 -420 Q92 -372 60 -366 L-60 -366 Q-92 -372 -96 -420Z" fill={m.hood} {...sw} />
      {m.kind === "dali" ? (
        <g>
          <ellipse cx="0" cy="-452" rx="70" ry="74" fill="#F7F2E8" {...sw} />
          <ellipse cx="-28" cy="-470" rx="14" ry="8" fill="#1C1830" />
          <ellipse cx="28" cy="-470" rx="14" ry="8" fill="#1C1830" />
          <path d="M-40 -488 Q-28 -500 -14 -490 M14 -490 Q28 -500 40 -488" stroke="#1C1830" strokeWidth="5" fill="none" />
          <path d="M0 -462 L-8 -432 H8Z" fill="#E8D8C4" stroke="#1C1830" strokeWidth="3" />
          <path d="M-6 -422 Q-30 -428 -46 -466 Q-26 -432 0 -420 Q26 -432 46 -466 Q30 -428 6 -422Z" fill="#1C1830" />
          <path d="M-20 -404 Q0 -394 20 -404" stroke="#1C1830" strokeWidth="5" fill="none" />
          <ellipse cx="-42" cy="-430" rx="10" ry="6" fill="#E88B7B" opacity=".5" />
          <ellipse cx="42" cy="-430" rx="10" ry="6" fill="#E88B7B" opacity=".5" />
        </g>
      ) : (
        <g>
          <ellipse cx="0" cy="-452" rx="70" ry="74" fill="#14121A" {...sw} />
          <path d="M-46 -490 Q0 -506 46 -490" stroke="#fff" strokeOpacity=".15" strokeWidth="6" fill="none" />
          {m.kind === "circle" && <circle cx="0" cy="-452" r="30" fill="none" stroke="#F4F2EC" strokeWidth="9" />}
          {m.kind === "triangle" && <path d="M0 -488 L32 -430 H-32Z" fill="none" stroke="#F4F2EC" strokeWidth="9" strokeLinejoin="round" />}
          {m.kind === "square" && <rect x="-28" y="-480" width="56" height="56" fill="none" stroke="#F4F2EC" strokeWidth="9" />}
        </g>
      )}
    </g>
  );
}

/* ---------- Gesicht ---------- */
function Face({ look, expr, mouth, blink, look2, seedT }: { look: Look; expr: Expr; mouth?: MouthName; blink: number; look2: [number, number]; seedT: number }) {
  const e = EXPR[expr] ?? EXPR.neutral; // unbekannte Ausdrücke → neutral
  const eyeY = -452;
  const px = e.pupil[0] + look2[0] * 7;
  const py = e.pupil[1] + look2[1] * 5;
  const eyeSY = e.eye * blink;
  const Eye = ({ cx, sign }: { cx: number; sign: number }) => (
    <g transform={`translate(${cx} ${eyeY})`}>
      <ellipse rx="21" ry={24 * eyeSY} fill="#fff" {...sw} />
      <g clipPath="none">
        <circle cx={px} cy={py} r={9.5 * Math.min(1, 0.6 + eyeSY)} fill={LINE} />
        <circle cx={px + 3} cy={py - 3} r="3" fill="#fff" />
      </g>
      {e.lid > 0 && <path d={`M-23 ${-24 * eyeSY} L23 ${-24 * eyeSY} L23 ${-24 * eyeSY + 48 * eyeSY * e.lid} L-23 ${-24 * eyeSY + 48 * eyeSY * e.lid}Z`} fill={look.skin} {...sw} />}
    </g>
  );
  const brow = (cx: number, [dy, rot]: [number, number], sign: number) => (
    <g transform={`translate(${cx} ${eyeY - 38 + dy}) rotate(${rot * sign * -1})`}>
      <path d="M-20 0 Q0 -7 20 0" fill="none" stroke={look.brows} strokeWidth="9" strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      <ellipse cx="-50" cy="-418" rx="11" ry="7" fill="#E88B7B" opacity=".5" />
      <ellipse cx="50" cy="-418" rx="11" ry="7" fill="#E88B7B" opacity=".5" />
      <Eye cx={-34} sign={-1} />
      <Eye cx={34} sign={1} />
      {brow(-34, e.browL, 1)}
      {brow(34, e.browR, -1)}
      <path d="M-5 -440 Q0 -430 9 -434" fill="none" {...sw} strokeWidth={4} />
      <Mouth name={mouth ?? e.mouth} skin={look.skin} />
      {look.mustache && <path d="M-34 -432 Q-18 -448 0 -436 Q18 -448 34 -432 Q22 -418 0 -424 Q-22 -418 -34 -432Z" fill={look.mustache} {...sw} strokeWidth={3} />}
      {look.goatee && (
        <g>
          <path d="M-30 -426 Q-16 -440 0 -432 Q16 -440 30 -426 Q20 -418 0 -422 Q-20 -418 -30 -426Z" fill={look.goatee} {...sw} strokeWidth={3} />
          <path d="M-22 -404 Q0 -398 22 -404 Q24 -380 0 -370 Q-24 -380 -22 -404Z" fill={look.goatee} {...sw} strokeWidth={3} />
          <path d="M-30 -426 Q-34 -412 -22 -404 M30 -426 Q34 -412 22 -404" fill="none" stroke={look.goatee} strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
      {look.glasses && (
        <g fill="none" stroke={look.glasses} strokeWidth="6">
          <rect x="-62" y="-474" width="56" height="42" rx="8" />
          <rect x="6" y="-474" width="56" height="42" rx="8" />
          <path d="M-6 -456 H6 M-62 -460 L-80 -466 M62 -460 L80 -466" />
        </g>
      )}
      {look.stubble && <path d="M-60 -420 Q-56 -386 0 -382 Q56 -386 60 -420 Q54 -398 0 -396 Q-54 -398 -60 -420Z" fill="#5A4034" opacity=".22" />}
    </g>
  );
}

/* ---------- Oberkörper je Outfit ---------- */
function Torso({ look, breathe, flip }: { look: Look; breathe: number; flip?: boolean }) {
  const w = look.bodyW;
  const hw = w / 2;
  const top = -362;
  const bot = -186;
  const t = look.top;
  return (
    <g transform={`translate(0 ${bot}) scale(1 ${breathe}) translate(0 ${-bot})`}>
      {/* Hemd/Basis */}
      <path d={`M${-hw} ${top + 30} Q${-hw} ${top} ${-hw + 36} ${top} L${hw - 36} ${top} Q${hw} ${top} ${hw} ${top + 30} L${hw + 6} ${bot} L${-hw - 6} ${bot}Z`} fill={t.kind === "blazer" || t.kind === "leather" ? t.shirt : t.color} {...sw} />
      {t.kind === "blazer" && (
        <g>
          <path d={`M${-hw} ${top + 30} Q${-hw} ${top} ${-hw + 36} ${top} L-16 ${top} L2 ${top + 120} L${-hw + 4} ${bot - 4} L${-hw - 6} ${bot}Z`} fill={t.color} {...sw} />
          <path d={`M${hw} ${top + 30} Q${hw} ${top} ${hw - 36} ${top} L16 ${top} L-2 ${top + 120} L${hw - 4} ${bot - 4} L${hw + 6} ${bot}Z`} fill={t.color} {...sw} />
          <path d={`M-16 ${top} L-2 ${top + 120} L-34 ${top + 62}Z M16 ${top} L2 ${top + 120} L34 ${top + 62}Z`} fill={t.accent} {...sw} />
          {look.tie && <path d={`M0 ${top + 14} L-9 ${top + 34} L0 ${top + 130} L9 ${top + 34}Z`} fill={look.tie} {...sw} />}
          <circle cx="0" cy={bot - 38} r="5" fill={t.accent} {...sw} strokeWidth={3} />
        </g>
      )}
      {t.kind === "plaid" && (
        <g>
          <clipPath id="plaidClip"><path d={`M${-hw} ${top + 30} Q${-hw} ${top} ${-hw + 36} ${top} L${hw - 36} ${top} Q${hw} ${top} ${hw} ${top + 30} L${hw + 6} ${bot} L${-hw - 6} ${bot}Z`} /></clipPath>
          <g clipPath="url(#plaidClip)" stroke={t.accent} strokeWidth="9" opacity=".55">
            {[-1, 0, 1, 2, 3, 4].map((i) => <path key={"h" + i} d={`M${-hw - 8} ${top + 24 + i * 34} H${hw + 8}`} />)}
            {[-3, -2, -1, 0, 1, 2, 3].map((i) => <path key={"v" + i} d={`M${i * 34} ${top} V${bot}`} />)}
          </g>
          <path d={`M-14 ${top} L0 ${top + 22} L14 ${top}`} fill={t.shirt} {...sw} />
          <path d={`M0 ${top + 22} V${bot}`} fill="none" {...sw} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => <circle key={i} cx="0" cy={top + 50 + i * 34} r="4.5" fill={t.shirt} {...sw} strokeWidth={2.5} />)}
        </g>
      )}
      {t.kind === "sweater" && (
        <g>
          <path d={`M-22 ${top} Q0 ${top + 26} 22 ${top}`} fill={t.accent} {...sw} />
          <path d={`M${-hw - 6} ${bot - 16} H${hw + 6}`} {...sw} strokeWidth={3} />
        </g>
      )}
      {t.kind === "bowling" && (
        // Bowlinghemd: zwei Farbbahnen, offener Reverskragen, Knopfleiste
        <g>
          <clipPath id="bowlClip"><path d={`M${-hw} ${top + 30} Q${-hw} ${top} ${-hw + 36} ${top} L${hw - 36} ${top} Q${hw} ${top} ${hw} ${top + 30} L${hw + 6} ${bot} L${-hw - 6} ${bot}Z`} /></clipPath>
          <g clipPath="url(#bowlClip)">
            <rect x={-hw * 0.62} y={top - 4} width={hw * 0.34} height={bot - top + 8} fill={t.accent} />
            <rect x={hw * 0.28} y={top - 4} width={hw * 0.34} height={bot - top + 8} fill={t.accent} />
          </g>
          <path d={`M-30 ${top} L0 ${top + 40} L30 ${top}`} fill={t.shirt ?? "#F4F0E8"} {...sw} />
          <path d={`M-30 ${top} L-44 ${top + 30} L-4 ${top + 44}Z M30 ${top} L44 ${top + 30} L4 ${top + 44}Z`} fill={t.color} {...sw} />
          <path d={`M0 ${top + 42} V${bot}`} fill="none" {...sw} strokeWidth={3} />
          {[0, 1, 2].map((i) => <circle key={i} cx="0" cy={top + 72 + i * 36} r="4.5" fill="#F4F0E8" {...sw} strokeWidth={2.5} />)}
        </g>
      )}
      {t.kind === "vest" && (
        // Pullunder über Hemd
        <g>
          <path d={`M${-hw + 10} ${top + 10} L-4 ${top + 96} L4 ${top + 96} L${hw - 10} ${top + 10} L${hw + 4} ${bot} L${-hw - 4} ${bot}Z`} fill={t.color} {...sw} />
          <path d={`M-18 ${top} L0 ${top + 22} L18 ${top}`} fill={t.shirt ?? "#F4F0E8"} {...sw} />
          <path d={`M${-hw - 4} ${bot - 16} H${hw + 4}`} {...sw} strokeWidth={3} />
          <path d={`M-30 ${top + 50} L-4 ${top + 96} M30 ${top + 50} L4 ${top + 96}`} stroke={t.accent} strokeWidth="6" fill="none" />
        </g>
      )}
      {t.kind === "leather" && (
        // offene Lederjacke über dunklem Shirt
        <g>
          <path d={`M${-hw} ${top + 30} Q${-hw} ${top} ${-hw + 36} ${top} L-26 ${top} L-20 ${bot} L${-hw - 6} ${bot}Z`} fill={t.color} {...sw} />
          <path d={`M${hw} ${top + 30} Q${hw} ${top} ${hw - 36} ${top} L26 ${top} L20 ${bot} L${hw + 6} ${bot}Z`} fill={t.color} {...sw} />
          <path d={`M-26 ${top} L-56 ${top - 6} L-50 ${top + 54}Z M26 ${top} L56 ${top - 6} L50 ${top + 54}Z`} fill={t.accent} {...sw} />
          <path d={`M-22 ${top + 4} Q0 ${top + 24} 22 ${top + 4}`} fill="none" {...sw} strokeWidth={3} />
          <path d={`M${-hw + 18} ${top + 40} Q${-hw + 30} ${top + 120} ${-hw + 22} ${bot - 10} M${hw - 18} ${top + 40} Q${hw - 30} ${top + 120} ${hw - 22} ${bot - 10}`} stroke="#fff" strokeOpacity=".14" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      )}
      {t.kind === "track" && (
        // Trainingsjacke mit Streifen und Startnummer
        <g>
          <path d={`M0 ${top + 6} V${bot}`} stroke={t.accent} strokeWidth="6" />
          <path d={`M-30 ${top} L0 ${top + 26} L30 ${top}`} fill={t.color} {...sw} />
          <path d={`M${-hw + 6} ${top + 34} V${bot - 4} M${hw - 6} ${top + 34} V${bot - 4}`} stroke={t.accent} strokeWidth="8" />
          {t.number && (
            <g>
              <rect x={-hw + 18} y={top + 46} width="62" height="34" rx="4" fill="#F4F0E8" {...sw} strokeWidth={3} />
              <text x={-hw + 49} y={top + 72} textAnchor="middle" fontFamily="Anton" fontSize="26" fill="#1C1830" transform={flip ? `translate(${2 * (-hw + 49)} 0) scale(-1 1)` : undefined}>{t.number}</text>
            </g>
          )}
        </g>
      )}
      {t.kind === "jumpsuit" && (
        // Overall mit Reißverschluss und Kragen
        <g>
          <path d={`M-34 ${top} L-10 ${top + 30} L0 ${top + 10} L10 ${top + 30} L34 ${top}`} fill={t.accent} {...sw} />
          <path d={`M0 ${top + 12} V${bot}`} stroke={LINE} strokeWidth="4" />
          <rect x={-hw + 16} y={top + 60} width="40" height="34" rx="4" fill="none" stroke={t.accent} strokeWidth="5" />
          <path d={`M${-hw - 6} ${bot - 22} H${hw + 6}`} stroke={t.accent} strokeWidth="10" />
        </g>
      )}
      {t.kind === "tank" && (
        // Unterhemd: Schultern frei, Tattoo sichtbar
        <g>
          <path d={`M${-hw} ${top + 30} Q${-hw} ${top} ${-hw + 36} ${top} L-30 ${top} Q-34 ${top + 60} 0 ${top + 70} Q34 ${top + 60} 30 ${top} L${hw - 36} ${top} Q${hw} ${top} ${hw} ${top + 30} L${hw - 20} ${top + 40} L${hw - 22} ${top + 6} L${-hw + 22} ${top + 6} L${-hw + 20} ${top + 40}Z`} fill={look.skin} {...sw} />
          {look.tattoo && (
            <g stroke={look.tattoo} strokeWidth="4" fill="none" opacity=".85">
              <path d={`M${-hw + 8} ${top + 10} q14 10 6 26 M${hw - 8} ${top + 10} q-14 10 -6 26 M-22 ${top + 12} q10 14 0 30 M22 ${top + 12} q-10 14 0 30`} />
              <path d={`M-8 ${top + 30} h16 M-12 ${top + 44} h24`} />
            </g>
          )}
        </g>
      )}
      {t.kind === "tee" && (
        <g>
          <path d={`M-22 ${top} Q0 ${top + 22} 22 ${top}`} fill="none" {...sw} />
          <path d={`M${-hw + 14} ${top + 70} H${hw - 14} L${hw - 8} ${bot} H${-hw + 8}Z`} fill={t.accent} {...sw} />
          <path d={`M${-hw + 14} ${top + 70} L-30 ${top} M${hw - 14} ${top + 70} L30 ${top}`} stroke={LINE} strokeWidth="4" fill="none" />
          <rect x="-26" y={top + 108} width="52" height="38" rx="6" fill="none" stroke={LINE} strokeWidth="3" opacity=".6" />
        </g>
      )}
    </g>
  );
}

/* ---------- Arm ---------- */
function Arm({ look, side, out, bend, lift, children }: { look: Look; side: -1 | 1; out: number; bend: number; lift: number; children?: React.ReactNode }) {
  const hw = look.bodyW / 2;
  const sx = side * (hw - 8);
  const sy = -346 - lift;
  const upper = 76;
  const fore = 72;
  const sleeve = look.top.kind === "blazer" ? look.top.color : look.top.color;
  const foreColor = look.sleeves === "long" ? sleeve : look.skin;
  const a = side === -1 ? out : -out; // links +, rechts −
  const b = side === -1 ? -bend : bend;
  return (
    <g transform={`translate(${sx} ${sy}) rotate(${a})`}>
      <path d={`M0 0 L0 ${upper}`} stroke={LINE} strokeWidth="32" strokeLinecap="round" fill="none" />
      <path d={`M0 0 L0 ${upper}`} stroke={look.top.kind === "tank" ? look.skin : sleeve} strokeWidth="24" strokeLinecap="round" fill="none" />
      {look.tattoo && look.top.kind === "tank" && <path d={`M-6 10 q10 10 0 22 q-10 10 2 24 M6 18 l-6 12 l6 10`} stroke={look.tattoo} strokeWidth="3.5" fill="none" opacity=".85" />}
      <g transform={`translate(0 ${upper}) rotate(${b})`}>
        <path d={`M0 0 L0 ${fore}`} stroke={LINE} strokeWidth="29" strokeLinecap="round" fill="none" />
        <path d={`M0 0 L0 ${fore}`} stroke={foreColor} strokeWidth="21" strokeLinecap="round" fill="none" />
        {look.sleeves === "long" && <path d={`M-12 ${fore - 4} H12`} stroke={LINE} strokeWidth="3" opacity=".5" />}
        {look.tattoo && look.sleeves !== "long" && (
          <g stroke={look.tattoo} strokeWidth="3.5" fill="none" opacity=".85">
            <path d={`M-8 6 q10 8 0 16 q-10 8 0 16 M6 12 l-4 10 l6 8 M-6 44 q8 -6 12 4 q-4 10 -12 6 M2 58 v10`} />
          </g>
        )}
        <g transform={`translate(0 ${fore + 4})`}>
          <circle r="15" fill={look.skin} {...sw} />
          {/* gehaltenes Objekt: dreht sich mit der Hand nicht mit, bleibt aufrecht */}
          <g transform={`rotate(${-(a + b)})`}>{children}</g>
        </g>
      </g>
    </g>
  );
}

/* ---------- Idle ---------- */
function useIdle(seed: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps + seed * 1.7;
  const breathe = 1 + Math.sin(t * 2.3) * 0.011;
  const bob = Math.sin(t * 2.3) * 2.2;
  const sway = Math.sin(t * 0.9) * 0.8;
  const period = Math.round((2.6 + (seed % 3) * 0.6) * fps);
  const f = (frame + seed * 23) % period;
  const blink = f < 3 ? 0.12 : f < 5 ? 0.55 : 1;
  return { breathe, bob, sway, blink, t };
}

export type CharacterProps = {
  who: string;
  pose?: PoseName | Pose;
  expr?: Expr;
  mouth?: MouthName;
  /** Position des Fußpunkts in px (Bildkoordinaten) */
  x?: number;
  y?: number;
  /** Höhe der Figur in px (Standard 700) */
  height?: number;
  flip?: boolean;
  /** Blickrichtung −1…1 */
  lookX?: number;
  lookY?: number;
  seed?: number;
  holdL?: React.ReactNode;
  holdR?: React.ReactNode;
  shadow?: boolean;
  opacity?: number;
  style?: React.CSSProperties;
};

const FIG_H = 560; // Figurenhöhe in Rig-Einheiten (inkl. Haare)

export const Character: React.FC<CharacterProps> = ({
  who, pose = "idle", expr = "neutral", mouth, x = 540, y = 1500, height = 700, flip, lookX = 0, lookY = 0, seed = 0, holdL, holdR, shadow = true, opacity = 1, style,
}) => {
  const look = LOOKS[who] ?? LOOKS.ted;
  const P = typeof pose === "string" ? POSES[pose] : pose;
  const { breathe, bob, sway, blink, t } = useIdle(seed);
  const s = (height / FIG_H) * look.heightScale;
  const wave = P.wave ? Math.sin(t * 9) * 16 : 0;
  const hw = look.bodyW / 2;
  const legW = Math.min(46, look.bodyW / 2 - 16);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} opacity={opacity} style={style}>
      {shadow && <ellipse cx="0" cy="4" rx={look.bodyW * 0.8} ry="12" fill="#000" opacity=".16" />}
      <g transform={`rotate(${sway + (P.lean ?? 0)} 0 0)`}>
        {/* Beine */}
        {[-1, 1].map((sd) => (
          <g key={sd}>
            <rect x={sd * (legW / 2 + 2) - legW / 2} y="-196" width={legW} height="178" rx="14" fill={look.pants} {...sw} />
            <path d={`M${sd * (legW / 2 + 2) - legW / 2 - 8} -22 h${legW + 16} v18 q0 10 -10 10 h${-(legW - 4)} q-12 0 -10 -16z`} fill={look.shoes} {...sw} />
          </g>
        ))}
        {/* Hinterer Arm (links) unter Torso */}
        <Arm look={look} side={-1} out={P.lOut} bend={P.lBend} lift={P.lift ?? 0}>{holdL}</Arm>
        <Torso look={look} breathe={breathe} flip={flip} />
        <g transform={`translate(0 ${bob})`}>
          {/* Hals + Kopf */}
          <rect x="-17" y="-392" width="34" height="38" fill={look.skinShade} {...sw} />
          <g transform={`rotate(${(P.tilt ?? 0) + sway} 0 -380)`}>
            <HairBack look={look} />
            <ellipse cx="-80" cy="-452" rx="13" ry="20" fill={look.skin} {...sw} />
            <ellipse cx="80" cy="-452" rx="13" ry="20" fill={look.skin} {...sw} />
            <ellipse cx="0" cy="-454" rx="82" ry="74" fill={look.skin} {...sw} />
            {look.mask ? <Mask look={look} /> : (
              <>
                <Face look={look} expr={expr} mouth={mouth} blink={blink} look2={[lookX, lookY]} seedT={t} />
                <HairFront look={look} />
              </>
            )}
          </g>
        </g>
        {/* Vorderer Arm (rechts) */}
        <Arm look={look} side={1} out={P.rOut} bend={P.rBend + wave} lift={P.lift ?? 0}>{holdR}</Arm>
      </g>
    </g>
  );
};

/** Pose-Zeitleiste: wechselt über Keyframes mit Federung zwischen Posen/Ausdrücken. */
export type PoseKey = { at: number; pose?: PoseName | Pose; expr?: Expr; mouth?: MouthName };
const lerpPose = (a: Pose, b: Pose, t: number): Pose => {
  const keys: (keyof Pose)[] = ["lOut", "lBend", "rOut", "rBend", "lean", "tilt", "lift"];
  const o: any = { wave: t > 0.5 ? b.wave : a.wave };
  for (const k of keys) o[k] = (a[k] ?? 0) + ((b[k] ?? 0) - (a[k] ?? 0)) * t;
  return o as Pose;
};
export function usePoseTimeline(keys: PoseKey[]) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sorted = [...keys].sort((a, b) => a.at - b.at);
  const resolve = (p?: PoseName | Pose): Pose | undefined => (p ? (typeof p === "string" ? POSES[p] : p) : undefined);
  // Pose nach jedem Keyframe (ohne Angabe: Pose des vorigen behalten)
  const after: Pose[] = [];
  sorted.forEach((k, i) => after.push(resolve(k.pose) ?? after[i - 1] ?? POSES.idle));
  let active = -1;
  sorted.forEach((k, i) => { if (frame >= k.at) active = i; });
  if (active < 0) return { pose: POSES.idle, expr: "neutral" as Expr, mouth: undefined as MouthName | undefined };
  const t = spring({ frame: frame - sorted[active].at, fps, config: { damping: 13, stiffness: 140, mass: 0.7 } });
  const from = after[active - 1] ?? POSES.idle;
  const pose = lerpPose(from, after[active], Math.min(1.15, t));
  let expr: Expr = "neutral";
  sorted.forEach((k, i) => { if (i <= active && k.expr) expr = k.expr; });
  return { pose, expr, mouth: sorted[active].mouth };
}
