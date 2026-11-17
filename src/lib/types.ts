export type Word = { text: string; start: number; end: number; scene: number };

export type SeriesStyle = {
  series: string;
  slug: string;
  palette: Record<string, string>;
  /** Optional: Namen der Schauplätze → Parameter (Farben/Requisiten) */
  locations?: Record<string, any>;
  /** Figuren dieser Serie: Schlüssel → Look (siehe characters/looks.ts) */
  characters?: Record<string, string>;
};

/** Eine Szene im Skript. `type` wählt die Komponente, der Rest sind deren Props. */
export type SceneSpec = {
  id: string;
  text: string;
  /** Wörter, die in den Untertiteln in Signaturfarbe erscheinen */
  highlights?: string[];
  type: "location" | "fact" | "receipt" | "data" | "compare" | "map" | "verdict" | "end";
  transition?: "wipe" | "zoom" | "slide" | "cut";
  [k: string]: any;
};

export type VideoSpec = {
  slug: string;
  title: string;
  brand: { signature: string; ink: string; stamp: string; paper: string };
  channel: string;
  video: { width: number; height: number; fps: number; safe_top: number; safe_bottom: number; safe_right?: number; tail_seconds?: number };
  style: SeriesStyle;
  scenes: SceneSpec[];
  words: Word[];
  /** Pfad relativ zu assets/ (staticFile) */
  audio: string | null;
};
