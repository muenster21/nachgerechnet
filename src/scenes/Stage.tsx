import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { Character, Expr, MouthName, PoseName, Pose, usePoseTimeline } from "../characters/Rig";
import { ASSETS, HOLD_OFFSET } from "../assets/registry";
import { G } from "../assets";
import { useScene, useVideo, usePop } from "../lib/anim";
import { LOCATIONS, FLOOR_Y, Backdrop } from "./locations";

/* ------------ JSON-Typen ------------ */
type Cue = number | string; // Frame oder Wort (Needle) der aktuellen Szene

export type ActorSpec = {
  who: string;
  x: number;
  y?: number;
  h?: number;
  flip?: boolean;
  seed?: number;
  /** Pose/Ausdruck ab einem Wort */
  keys?: { at?: Cue; pose?: PoseName | Pose; expr?: Expr; mouth?: MouthName }[];
  /** Gehaltene Objekte */
  hold?: { hand: "L" | "R"; asset: string; at?: Cue; until?: Cue; s?: number; props?: any }[];
  enter?: "left" | "right" | "up" | "pop" | "none";
  lookX?: number;
  lookY?: number;
  /** Auftritt erst ab diesem Wort */
  at?: Cue;
  /** "behind": wird vor dem Mittelgrund (z. B. Theke) gezeichnet, also dahinter */
  layer?: "behind" | "front";
};

export type ItemSpec = {
  asset: string;
  x: number;
  y: number;
  s?: number;
  rot?: number;
  flip?: boolean;
  at?: Cue;
  until?: Cue;
  /** Bewegung zu (x2,y2) ab `moveAt` über `dur` Frames */
  move?: { to: [number, number]; at?: Cue; dur?: number };
  props?: any;
  /** Ebene: "mid" (hinter Vordergrund) oder "fore" (angeschnitten, nah an der Kamera) */
  layer?: "mid" | "fore";
  /** Einblendung */
  anim?: "pop" | "drop" | "slide";
};

export type StageSpec = {
  location?: string;
  backdrop?: boolean;
  actors?: ActorSpec[];
  items?: ItemSpec[];
  push?: number;
  pan?: 1 | -1;
};

/* ------------ Hilfen ------------ */
function useCue() {
  const { at } = useScene();
  return (c?: Cue, fb = 0) => (typeof c === "number" ? c : at(c, fb));
}

const Held: React.FC<{ asset: string; s?: number; props?: any }> = ({ asset, s = 0.8, props }) => {
  const C = ASSETS[asset];
  if (!C) return null;
  const [dx, dy] = HOLD_OFFSET[asset] ?? [0, 40];
  return <C x={dx * s} y={dy * s} s={s} {...props} />;
};

const Actor: React.FC<{ a: ActorSpec }> = ({ a }) => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const keys = (a.keys ?? [{ at: 0, pose: "idle" as PoseName }]).map((k) => ({ ...k, at: cue(k.at, 0) }));
  const { pose, expr, mouth } = usePoseTimeline(keys);
  const showAt = a.at !== undefined ? cue(a.at) : 0;
  const t = usePop(showAt, 12);
  if (frame < showAt) return null;
  const enter = a.enter ?? "pop";
  const dx = enter === "left" ? (1 - t) * -700 : enter === "right" ? (1 - t) * 700 : 0;
  const dy = enter === "up" ? (1 - t) * 700 : 0;
  const sc = enter === "pop" ? 0.85 + 0.15 * Math.min(1, t) : 1;
  const holds = (hand: "L" | "R") =>
    (a.hold ?? []).filter((h) => h.hand === hand).map((h, i) => {
      const from = h.at !== undefined ? cue(h.at) : 0;
      const to = h.until !== undefined ? cue(h.until) : Infinity;
      return frame >= from && frame < to ? <Held key={i} asset={h.asset} s={h.s} props={h.props} /> : null;
    });
  return (
    <g transform={`translate(${dx} ${dy}) translate(${a.x} ${a.y ?? FLOOR_Y}) scale(${sc}) translate(${-a.x} ${-(a.y ?? FLOOR_Y)})`} opacity={Math.min(1, t * 2)}>
      <Character
        who={a.who} x={a.x} y={a.y ?? FLOOR_Y} height={a.h ?? 720} flip={a.flip} seed={a.seed ?? 0}
        pose={pose} expr={expr} mouth={mouth} lookX={a.lookX} lookY={a.lookY}
        holdL={holds("L")} holdR={holds("R")}
      />
    </g>
  );
};

const Item: React.FC<{ it: ItemSpec }> = ({ it }) => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const start = cue(it.at, 0);
  const end = it.until !== undefined ? cue(it.until) : Infinity;
  const t = usePop(start, 10);
  if (frame < start || frame >= end) return null;
  const C = ASSETS[it.asset];
  if (!C) return null;
  let x = it.x, y = it.y;
  if (it.move) {
    const m0 = cue(it.move.at, 0);
    const p = interpolate(frame, [m0, m0 + (it.move.dur ?? 14)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const e = p * p * (3 - 2 * p);
    x = it.x + (it.move.to[0] - it.x) * e;
    y = it.y + (it.move.to[1] - it.y) * e - Math.sin(p * Math.PI) * 60;
  }
  const anim = it.anim ?? "pop";
  const dy = anim === "drop" ? (1 - Math.min(1, t)) * -500 : 0;
  const sc = anim === "pop" ? t : 1;
  return <C x={x} y={y + dy} s={(it.s ?? 1) * sc} rot={it.rot} flip={it.flip} {...it.props} />;
};

/** Bühne: Schauplatz mit 3 Ebenen + Figuren + Requisiten + Kamera. */
export const Stage: React.FC<{ spec: StageSpec; extraMid?: React.ReactNode; extraFore?: React.ReactNode }> = ({ spec, extraMid, extraFore }) => {
  const v = useVideo();
  const pal = (k: string, d: string) => v.style.palette[k] ?? d;
  const loc = spec.location ? LOCATIONS[spec.location] : undefined;
  const items = spec.items ?? [];
  return (
    <Camera push={spec.push} pan={spec.pan}>
      <Layer depth={0.35}>{loc ? <loc.Back p={pal} /> : <Backdrop />}</Layer>
      <Layer depth={1}>
        {(spec.actors ?? []).filter((a) => a.layer === "behind").map((a, i) => <Actor key={"b" + i} a={a} />)}
        {loc && <loc.Mid p={pal} />}
        {items.filter((i) => i.layer !== "fore").map((it, i) => <Item key={"i" + i} it={it} />)}
        {(spec.actors ?? []).filter((a) => a.layer !== "behind").map((a, i) => <Actor key={"a" + i} a={a} />)}
        {extraMid}
      </Layer>
      <Layer depth={1.8}>
        {loc && <loc.Fore p={pal} />}
        {items.filter((i) => i.layer === "fore").map((it, i) => <Item key={"f" + i} it={it} />)}
        {extraFore}
      </Layer>
    </Camera>
  );
};
