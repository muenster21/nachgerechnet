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
  if (look.hair.style === "marshall")
    return <path d="M-84 -450 Q-96 -530 -2 -546 Q96 -530 84 -450 L80 -410 Q72 -440 60 -440 L-60 -440 Q-72 -440 -80 -410Z" fill={look.hair.color} {...sw} />;
  return null;
}
function HairFront({ look }: { look: Look }) {
  const c = look.hair.color;
  switch (look.hair.style) {
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
    default:
      return null;
  }
}

/* ---------- Gesicht ---------- */
function Face({ look, expr, mouth, blink, look2, seedT }: { look: Look; expr: Expr; mouth?: MouthName; blink: number; look2: [number, number]; seedT: number }) {
  const e = EXPR[expr];
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
      {look.stubble && <path d="M-60 -420 Q-56 -386 0 -382 Q56 -386 60 -420 Q54 -398 0 -396 Q-54 -398 -60 -420Z" fill="#5A4034" opacity=".22" />}
    </g>
  );
}

/* ---------- Oberkörper je Outfit ---------- */
function Torso({ look, breathe }: { look: Look; breathe: number }) {
  const w = look.bodyW;
  const hw = w / 2;
  const top = -362;
  const bot = -186;
  const t = look.top;
  return (
    <g transform={`translate(0 ${bot}) scale(1 ${breathe}) translate(0 ${-bot})`}>
      {/* Hemd/Basis */}
      <path d={`M${-hw} ${top + 30} Q${-hw} ${top} ${-hw + 36} ${top} L${hw - 36} ${top} Q${hw} ${top} ${hw} ${top + 30} L${hw + 6} ${bot} L${-hw - 6} ${bot}Z`} fill={t.kind === "blazer" ? t.shirt : t.color} {...sw} />
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
      <path d={`M0 0 L0 ${upper}`} stroke={sleeve} strokeWidth="24" strokeLinecap="round" fill="none" />
      <g transform={`translate(0 ${upper}) rotate(${b})`}>
        <path d={`M0 0 L0 ${fore}`} stroke={LINE} strokeWidth="29" strokeLinecap="round" fill="none" />
        <path d={`M0 0 L0 ${fore}`} stroke={foreColor} strokeWidth="21" strokeLinecap="round" fill="none" />
        {look.sleeves === "long" && <path d={`M-12 ${fore - 4} H12`} stroke={LINE} strokeWidth="3" opacity=".5" />}
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
        <Torso look={look} breathe={breathe} />
        <g transform={`translate(0 ${bob})`}>
          {/* Hals + Kopf */}
          <rect x="-17" y="-392" width="34" height="38" fill={look.skinShade} {...sw} />
          <g transform={`rotate(${(P.tilt ?? 0) + sway} 0 -380)`}>
            <HairBack look={look} />
            <ellipse cx="-80" cy="-452" rx="13" ry="20" fill={look.skin} {...sw} />
            <ellipse cx="80" cy="-452" rx="13" ry="20" fill={look.skin} {...sw} />
            <ellipse cx="0" cy="-454" rx="82" ry="74" fill={look.skin} {...sw} />
            <Face look={look} expr={expr} mouth={mouth} blink={blink} look2={[lookX, lookY]} seedT={t} />
            <HairFront look={look} />
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
