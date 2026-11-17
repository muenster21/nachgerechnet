import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

/** Spielt einen Sound-Effekt ab Frame `at` (relativ zur umgebenden Sequence). Dateien: assets/sfx/<name>.wav */
export const Sfx: React.FC<{ name: "pop" | "tick" | "receipt" | "stamp" | "whoosh" | "cash" | "ding"; at: number; volume?: number }> = ({ name, at, volume = 0.6 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
