import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Camera, Layer } from "../components/Camera";
import { Chip, Title } from "../components/Overlays";
import { Sfx } from "../components/Sfx";
import { DollarIcon, DotIcon, G, HouseIcon, MoneyStack, PersonIcon, BeerIcon, Coin, shade } from "../assets";
import { fmtDE, rand, useCountUp, usePop, useProgress, useScene } from "../lib/anim";
import { BRAND, FONT_DISPLAY, FONT_TEXT, LINE } from "../lib/theme";
import { Backdrop } from "./locations";

type Cue = number | string;
type DataSpec = {
  kind: "dots" | "bars" | "podium" | "scale" | "money";
  title?: string;
  /** dots: Raster aus total Punkten, davon filled farbig. */
  dots?: { total: number; filled: number; icon?: "dot" | "person" | "dollar" | "beer"; cols?: number; unit?: string; at?: Cue; color?: string; label?: string };
  bars?: { label: string; value: number; display?: string; color?: string; at?: Cue }[];
  podium?: { label: string; value: string; color?: string; at?: Cue; icon?: string }[];
  scale?: { left: { label: string; value: number; display: string }; right: { label: string; value: number; display: string }; at?: Cue };
  money?: { label: string; n: number; display?: string; at?: Cue }[];
  unit?: string;
  chips?: { text: string; at?: Cue; top?: number; left?: number; color?: string; fg?: string }[];
};

const useCue = () => { const { at } = useScene(); return (c?: Cue, fb = 0) => (typeof c === "number" ? c : at(c, fb)); };

/** --- Punkte-Raster: 1 Punkt = Menge --- */
const Dots: React.FC<{ d: NonNullable<DataSpec["dots"]> }> = ({ d }) => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const start = cue(d.at, 6);
  const cols = d.cols ?? 20;
  const rows = Math.ceil(d.total / cols);
  const cell = Math.min(860 / cols, 800 / rows);
  const x0 = (1080 - 150 - cols * cell) / 2 + 60;
  const y0 = 640;
  const filledNow = Math.round(useCountUp(0, d.filled, start, 40));
  const Icon: React.FC<any> = d.icon === "person" ? PersonIcon : d.icon === "dollar" ? DollarIcon : d.icon === "beer" ? BeerIcon : DotIcon;
  const color = d.color ?? BRAND.signature;
  return (
    <g>
      {Array.from({ length: d.total }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const on = i < filledNow;
        const pop = on ? Math.min(1, Math.max(0, 1 - (i - filledNow + 8) / 8)) : 0;
        return (
          <g key={i} transform={`translate(${x0 + c * cell + cell / 2} ${y0 + r * cell + cell * 0.9})`} opacity={on ? 1 : 0.2}>
            <Icon s={(cell / 44) * (on ? 1 + 0.18 * (1 - pop) : 1)} color={on ? color : "#8FA0C8"} />
          </g>
        );
      })}
    </g>
  );
};

/** --- Balken --- */
const Bars: React.FC<{ bars: NonNullable<DataSpec["bars"]> }> = ({ bars }) => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <g>
      {bars.map((b, i) => {
        const st = cue(b.at, 8 + i * 14);
        const p = interpolate(frame, [st, st + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const e = 1 - Math.pow(1 - p, 3);
        const rowH = Math.min(290, 720 / bars.length);
        const y = 560 + i * (rowH + 30);
        const w = (760 * b.value) / max * e;
        const col = b.color ?? [BRAND.signature, "#FF6B6B", "#4FB3C8", "#8BD17C"][i % 4];
        return (
          <g key={i}>
            <rect x="60" y={y} width="840" height={rowH} rx="22" fill="#0E1330" opacity=".6" stroke={LINE} strokeWidth="4" />
            <rect x="64" y={y + 4} width={Math.max(0, w - 8)} height={rowH - 8} rx="18" fill={col} stroke={LINE} strokeWidth="4" />
            <text x="92" y={y + Math.min(78, rowH * 0.3)} fontFamily={FONT_DISPLAY} fontSize={Math.min(54, rowH * 0.22)} fill="#fff" stroke={LINE} strokeWidth="9" paintOrder="stroke">{b.label}</text>
            <text x="880" y={y + rowH - Math.min(46, rowH * 0.2)} textAnchor="end" fontFamily={FONT_DISPLAY} fontSize={Math.min(110, rowH * 0.42)} fill="#fff" stroke={LINE} strokeWidth="12" paintOrder="stroke" opacity={e}>{b.display ?? fmtDE(b.value * e)}</text>
          </g>
        );
      })}
    </g>
  );
};

/** --- Podium --- */
const Podium: React.FC<{ items: NonNullable<DataSpec["podium"]> }> = ({ items }) => {
  const cue = useCue();
  const order = [1, 0, 2]; // 2. | 1. | 3.
  const hs = [700, 520, 400]; // Platz 1, 2, 3
  const cols = [BRAND.signature, "#C9CED6", "#D9A06A"];
  return (
    <g>
      {order.map((idx, pos) => {
        const it = items[idx];
        if (!it) return null;
        const st = cue(it.at, 10 + pos * 12);
        const p = usePop(st, 12);
        const x = 50 + pos * 300;
        const h = hs[idx] * Math.min(1, p);
        const y = 1500;
        return (
          <g key={idx}>
            <rect x={x} y={y - h} width="280" height={h} rx="14" fill={cols[idx]} stroke={LINE} strokeWidth="5" />
            <text x={x + 140} y={y - h + 150} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="190" fill={LINE} opacity={p}>{idx + 1}</text>
            <g opacity={Math.min(1, p * 2)} transform={`translate(${x + 140} ${y - h - 30}) scale(${Math.min(1, p)})`}>
              <text y="-86" textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="84" fill="#fff" stroke={LINE} strokeWidth="12" paintOrder="stroke">{it.value}</text>
              <text y="-14" textAnchor="middle" fontFamily={FONT_TEXT} fontWeight="900" fontSize="46" fill="#fff" stroke={LINE} strokeWidth="8" paintOrder="stroke">{it.label}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

/** --- Waage --- */
const Scale: React.FC<{ s: NonNullable<DataSpec["scale"]> }> = ({ s }) => {
  const cue = useCue();
  const st = cue(s.at, 14);
  const p = useProgress(st, 26, (t) => 1 - Math.pow(1 - t, 3) * Math.cos(t * 9) * 0.6);
  const diff = (s.left.value - s.right.value) / Math.max(s.left.value, s.right.value);
  const tilt = -diff * 14 * p; // links schwerer → links runter
  const pop = usePop(st - 6);
  const pan = (x: number, side: "l" | "r", it: typeof s.left) => {
    const dy = side === "l" ? Math.sin((tilt * Math.PI) / 180) * 300 * -1 : Math.sin((tilt * Math.PI) / 180) * 300;
    return (
      <g transform={`translate(${x} ${dy})`}>
        <path d={`M0 0 L-130 230 M0 0 L130 230`} stroke={LINE} strokeWidth="8" />
        <path d="M-170 230 H170 L140 270 H-140Z" fill="#C9CED6" stroke={LINE} strokeWidth="5" />
        <g transform="translate(0 226)">{side === "l" ? <MoneyStack n={5} s={1.3} /> : <HouseIcon s={2.6} />}</g>
        <text y="360" textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="78" fill="#fff" stroke={LINE} strokeWidth="14" paintOrder="stroke">{it.display}</text>
        <text y="420" textAnchor="middle" fontFamily={FONT_TEXT} fontWeight="900" fontSize="42" fill="#fff" stroke={LINE} strokeWidth="9" paintOrder="stroke">{it.label}</text>
      </g>
    );
  };
  return (
    <g transform={`translate(540 590) scale(${1.0 * Math.min(1.04, pop)})`}>
      <path d="M0 -40 V820" stroke={LINE} strokeWidth="14" />
      <path d="M0 -40 V820" stroke="#C9CED6" strokeWidth="8" />
      <rect x="-190" y="800" width="380" height="40" rx="12" fill="#C9CED6" stroke={LINE} strokeWidth="5" />
      <g transform={`rotate(${tilt})`}>
        <rect x="-340" y="-16" width="680" height="32" rx="14" fill={BRAND.signature} stroke={LINE} strokeWidth="5" />
        {pan(-340, "l", s.left)}
        {pan(340, "r", s.right)}
      </g>
      <circle cx="0" cy="0" r="24" fill="#fff" stroke={LINE} strokeWidth="5" />
    </g>
  );
};

/** --- Geldstapel (Beschriftung sitzt über dem Stapel, Stapel wächst) --- */
const Money: React.FC<{ items: NonNullable<DataSpec["money"]> }> = ({ items }) => {
  const cue = useCue();
  const w = 880 / items.length;
  const base = 1400;
  const sc = (w / 124) * 0.88;
  const maxN = Math.max(...items.map((i) => i.n));
  const layer = Math.min(58, 760 / maxN);
  return (
    <g>
      <rect x="0" y={base} width="1080" height="14" fill="#fff" opacity=".15" />
      {items.map((it, i) => {
        const st = cue(it.at, 8 + i * 14);
        const p = usePop(st, 12);
        const cx = 40 + w * i + w / 2;
        const top = base - it.n * layer * Math.min(1, p);
        return (
          <g key={i}>
            <g transform={`translate(${cx} ${base})`}>
              {Array.from({ length: it.n }, (_, k) => {
                const kp = Math.max(0, Math.min(1, p * it.n - k));
                return <g key={k} transform={`translate(${(rand(k + i * 7) - 0.5) * 12} ${-k * layer * kp - (1 - kp) * 340})`} opacity={kp}><MoneyStack n={1} s={sc} /></g>;
              })}
            </g>
            <g opacity={Math.min(1, p * 2)}>
              <text x={cx} y={top - 100} textAnchor="middle" fontFamily={FONT_DISPLAY} fontSize="104" fill="#fff" stroke={LINE} strokeWidth="18" paintOrder="stroke">{it.display}</text>
              <text x={cx} y={top - 40} textAnchor="middle" fontFamily={FONT_TEXT} fontWeight="900" fontSize="50" fill={BRAND.signature} stroke={LINE} strokeWidth="10" paintOrder="stroke">{it.label}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

export const DataScene: React.FC<{ s: DataSpec }> = ({ s }) => {
  const cue = useCue();
  return (
    <>
      <Camera push={0.045}>
        <Layer depth={0.4}><Backdrop /></Layer>
        <Layer depth={1}>
          {s.kind === "dots" && s.dots && <Dots d={s.dots} />}
          {s.kind === "bars" && s.bars && <Bars bars={s.bars} />}
          {s.kind === "podium" && s.podium && <Podium items={s.podium} />}
          {s.kind === "scale" && s.scale && <Scale s={s.scale} />}
          {s.kind === "money" && s.money && <Money items={s.money} />}
        </Layer>
      </Camera>
      {s.title && <Title text={s.title} />}
      {(s.chips ?? []).map((c, i) => <Chip key={i} text={c.text} at={c.at} top={c.top ?? 1000 + i * 100} left={c.left ?? 70} color={c.color} fg={c.fg} />)}
      {s.kind === "dots" && s.dots?.unit && <Chip text={s.dots.unit} at={s.dots.at} top={530} />}
      {s.kind === "dots" && s.dots?.label && (
        <div style={{ position: "absolute", left: 60, right: 150, top: 1465, textAlign: "center", fontFamily: FONT_DISPLAY, fontSize: 84, color: BRAND.signature, WebkitTextStroke: `12px ${BRAND.ink}`, paintOrder: "stroke fill" }}>{s.dots.label}</div>
      )}
    </>
  );
};
