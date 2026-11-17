import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useScene } from "../lib/anim";
import { BRAND } from "../lib/theme";
import { Sfx } from "./Sfx";

export type Transition = "wipe" | "zoom" | "slide" | "cut";

/** Szenen-Übergänge (keine Standard-Überblendung): Wischen, Zoom-durch, Schieben. Die neue Szene läuft über die vorige. */
export const SceneFrame: React.FC<{ transition?: Transition; children: React.ReactNode }> = ({ transition = "wipe", children }) => {
  const frame = useCurrentFrame();
  const { overlap } = useScene();
  const t = overlap > 0 ? Math.max(0, Math.min(1, frame / overlap)) : 1;
  const e = Easing.out(Easing.cubic)(t);
  const active = overlap > 0 && t < 1 && transition !== "cut";

  const style: React.CSSProperties = { position: "absolute", inset: 0, overflow: "hidden" };
  let band: React.ReactNode = null;

  if (active && transition === "wipe") {
    const skew = 22;
    const x = interpolate(e, [0, 1], [-skew, 100 + skew]);
    style.clipPath = `polygon(0 0, ${x + skew}% 0, ${x}% 100%, 0 100%)`;
    band = (
      <div style={{ position: "absolute", inset: 0, zIndex: 90, pointerEvents: "none", background: BRAND.signature, clipPath: `polygon(${x + skew - 5}% 0, ${x + skew + 1}% 0, ${x + 1}% 100%, ${x - 5}% 100%)` }} />
    );
  } else if (active && transition === "zoom") {
    style.transform = `scale(${interpolate(e, [0, 1], [1.6, 1])})`;
    style.opacity = interpolate(t, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
    style.filter = `blur(${(1 - e) * 10}px)`;
  } else if (active && transition === "slide") {
    style.transform = `translateX(${(1 - e) * 1080}px)`;
    style.boxShadow = "-30px 0 60px rgba(0,0,0,.35)";
  }
  return (
    <>
      <div style={style}>{children}</div>
      {band}
      {overlap > 0 && transition !== "cut" && <Sfx name="whoosh" at={0} volume={0.35} />}
    </>
  );
};
