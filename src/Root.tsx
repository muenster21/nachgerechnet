import React from "react";
import { Composition, staticFile } from "remotion";
import { NachgerechnetVideo } from "./Video";
import type { VideoSpec } from "./lib/types";
import { SHOWCASE } from "./demo/showcase";

/** `Video`: lädt assets/_build/<slug>/spec.json (erzeugt von scripts/prepare.mjs).  `Showcase`: Musterszenen für Qualitätsprüfung. */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Video"
      component={NachgerechnetVideo as any}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={30 * 60}
      defaultProps={{ slug: "demo", spec: null as VideoSpec | null }}
      calculateMetadata={async ({ props }: any) => {
        const res = await fetch(staticFile(`_build/${props.slug}/spec.json`));
        const spec: VideoSpec = await res.json();
        const end = spec.words[spec.words.length - 1].end + (spec.video.tail_seconds ?? 1);
        return { durationInFrames: Math.ceil(end * spec.video.fps), props: { ...props, spec } };
      }}
    />
    <Composition
      id="Showcase"
      component={NachgerechnetVideo as any}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={Math.ceil((SHOWCASE.words[SHOWCASE.words.length - 1].end + 1) * 30)}
      defaultProps={{ spec: SHOWCASE }}
    />
  </>
);
