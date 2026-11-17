import React from "react";
import { Chip, Dim, FactCardUI, HookText } from "../components/Overlays";
import { CompareScene } from "./CompareScene";
import { DataScene } from "./DataScene";
import { EndScene } from "./EndScene";
import { MapScene } from "./MapScene";
import { ReceiptScene } from "./ReceiptScene";
import { Stage } from "./Stage";
import { VerdictScene } from "./VerdictScene";

/** Schauplatz: bildfüllender Ort, Figuren agieren darin; optional Hook-Text und Chips. */
const LocationScene: React.FC<{ s: any }> = ({ s }) => (
  <>
    <Stage spec={s.stage ?? {}} />
    {s.hook && <HookText {...s.hook} />}
    {(s.chips ?? []).map((c: any, i: number) => <Chip key={i} {...c} />)}
  </>
);

/** Fakt-Karte über dem Schauplatz (Schauplatz bleibt sichtbar, leicht abgedunkelt). */
const FactScene: React.FC<{ s: any }> = ({ s }) => (
  <>
    {s.stage && <Stage spec={s.stage} />}
    <Dim amount={0.42} />
    <FactCardUI {...s.fact} />
  </>
);

export const SCENES: Record<string, React.FC<{ s: any }>> = {
  location: LocationScene,
  fact: FactScene,
  receipt: ReceiptScene as any,
  data: DataScene as any,
  compare: CompareScene as any,
  map: MapScene as any,
  verdict: VerdictScene as any,
  end: EndScene as any,
};
