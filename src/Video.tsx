import React, { useEffect, useMemo, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useVideoConfig } from "remotion";
import { SceneFrame } from "./components/SceneFrame";
import { Subtitles } from "./components/Subtitles";
import { SceneCtx, VideoCtx, makeTiming } from "./lib/anim";
import { FONT_DISPLAY, FONT_TEXT } from "./lib/theme";
import type { VideoSpec } from "./lib/types";
import { SCENES } from "./scenes";

/** Schriften einmal laden (lokal aus assets/fonts) */
function useFonts() {
  const [handle] = useState(() => delayRender("Fonts"));
  useEffect(() => {
    const faces = [
      new FontFace(FONT_DISPLAY, `url(${staticFile("fonts/Anton-Regular.ttf")})`),
      new FontFace(FONT_TEXT, `url(${staticFile("fonts/Nunito.ttf")})`, { weight: "200 1000" }),
    ];
    Promise.all(faces.map((f) => f.load().then((x) => document.fonts.add(x)))).then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
}

const OVERLAP = 8; // Frames Übergang

export const NachgerechnetVideo: React.FC<{ spec: VideoSpec | null }> = ({ spec }) => {
  useFonts();
  const { fps } = useVideoConfig();
  const timing = useMemo(() => (spec ? makeTiming(spec) : null), [spec]);
  if (!spec || !timing) return null;
  return (
    <VideoCtx.Provider value={spec}>
      <AbsoluteFill style={{ background: "#14102A", overflow: "hidden" }}>
        {spec.scenes.map((sc, i) => {
          const real = Math.round(timing.sceneStart(i) * fps);
          const end = Math.round(timing.sceneEnd(i) * fps);
          const overlap = i === 0 ? 0 : OVERLAP;
          const from = Math.max(0, real - overlap);
          const dur = end - from;
          const Comp = SCENES[sc.type] ?? SCENES.location;
          return (
            <Sequence key={sc.id} from={from} durationInFrames={Math.max(1, dur)} name={`${i + 1} ${sc.id}`}>
              <SceneCtx.Provider
                value={{
                  index: i, duration: end - real, overlap,
                  start: real - from,
                  at: (needle, fb = 0) => timing.atWord(i, needle, fb) + overlap,
                }}
              >
                <SceneFrame transition={sc.transition ?? (i % 3 === 1 ? "zoom" : i % 3 === 2 ? "slide" : "wipe")}>
                  <Comp s={sc} />
                </SceneFrame>
              </SceneCtx.Provider>
            </Sequence>
          );
        })}
        <Subtitles />
        {spec.audio && <Audio src={staticFile(spec.audio)} />}
      </AbsoluteFill>
    </VideoCtx.Provider>
  );
};
