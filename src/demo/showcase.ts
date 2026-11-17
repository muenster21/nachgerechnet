import config from "../../config.json";
import himym from "../../styles/himym.json";
import { estimateWords } from "../lib/estimate";
import type { SceneSpec, VideoSpec } from "../lib/types";

/** Musterszenen: jede Szenenart einmal, mit den HIMYM-Figuren. Dient der Qualitätsprüfung (Kontaktbogen). */
const FY = 1560; // Standard-Fußpunkt
const BAR_FY = 1700;

const scenes: SceneSpec[] = [
  {
    id: "schauplatz-wohnung", type: "location",
    text: "Kinder, im Jahr 2005 wohnten zwei Typen Mitte zwanzig in einer Wohnung in Manhattan.",
    highlights: ["2005", "Manhattan"],
    hook: { text: "Wie konnten die sich das leisten?", highlight: ["leisten"], at: 0, until: "Mitte" },
    stage: {
      location: "apartment",
      actors: [
        { who: "ted", x: 330, y: FY, h: 1020, enter: "left", keys: [{ at: 0, pose: "hold", expr: "neutral" }, { at: "wohnten", pose: "sip", expr: "happy" }], hold: [{ hand: "R", asset: "beer" }] },
        { who: "marshall", x: 770, y: FY, h: 1020, flip: true, enter: "right", keys: [{ at: 0, pose: "hips", expr: "skeptical" }, { at: "Manhattan", pose: "shrug", expr: "thinking" }] },
      ],
    },
  },
  {
    id: "schauplatz-bar", type: "location",
    text: "Das Bier kostet vier Dollar und fließt dort praktisch jeden Abend.",
    highlights: ["Bier", "vier"],
    stage: {
      location: "bar",
      actors: [
        { who: "barkeeper", x: 560, y: 1500, h: 760, layer: "behind", enter: "none", keys: [{ at: 0, pose: "idle", expr: "happy" }, { at: "Bier", pose: "give", expr: "happy" }] },
        { who: "ted", x: 250, y: BAR_FY, h: 1020, enter: "left", keys: [{ at: 0, pose: "pay", expr: "neutral" }, { at: "kostet", pose: "hold", expr: "happy" }], hold: [{ hand: "R", asset: "banknote", until: "kostet", s: 0.5 }, { hand: "L", asset: "beer", at: "dort" }] },
        { who: "marshall", x: 840, y: BAR_FY, h: 1020, flip: true, enter: "right", keys: [{ at: 0, pose: "idle", expr: "neutral" }, { at: "jeden", pose: "cheer", expr: "happy" }] },
      ],
      items: [{ asset: "beer", x: 560, y: 1250, at: "Bier", s: 1.0, move: { to: [420, 1250], at: "kostet", dur: 14 }, until: "dort" }],
    },
  },
  {
    id: "fakt", type: "fact",
    text: "Eine Zweizimmerwohnung kostete dort im Schnitt etwa dreitausenddreihundert Dollar.",
    highlights: ["Zweizimmerwohnung", "dreitausenddreihundert"],
    stage: {
      location: "street",
      actors: [
        { who: "ted", x: 300, y: 1640, h: 980, enter: "left", keys: [{ at: 0, pose: "think", expr: "thinking" }] },
        { who: "marshall", x: 790, y: 1640, h: 700, flip: true, enter: "right", keys: [{ at: 0, pose: "idle", expr: "shocked" }] },
      ],
    },
    fact: { value: 3300, prefix: "Ø ", suffix: " $", label: "Miete pro Monat, 2 Zimmer, Upper West Side", source: "MNS Rental Report 2008", at: "Zweizimmerwohnung" },
  },
  {
    id: "rechnung", type: "receipt",
    text: "Ted verdient dreitausendzweihundert netto, und die Miete frisst fast alles davon.",
    highlights: ["verdient", "Miete"],
    stage: { location: "apartment", actors: [{ who: "ted", x: 220, y: FY, h: 820, enter: "none", keys: [{ at: 0, pose: "facepalm", expr: "annoyed" }] }] },
    title: "TEDS MONAT", sub: "geschätzt · 2005",
    lines: [
      { label: "Netto", value: 3200, sign: "+", at: "verdient", unit: "$" },
      { label: "Miete", value: 3000, sign: "-", at: "Miete", unit: "$" },
    ],
    total: { label: "BLEIBT", value: 200, unit: "$", at: "alles" },
  },
  {
    id: "daten-punkte", type: "data",
    text: "Er verdient fünfundfünfzigtausend im Jahr, nötig wären hundertzwanzigtausend Dollar.",
    highlights: ["fünfundfünfzigtausend", "hundertzwanzigtausend"],
    kind: "dots", title: "JAHRESEINKOMMEN",
    dots: { total: 120, filled: 55, cols: 12, icon: "dollar", unit: "1 PUNKT = 1.000 $", label: "55 VON 120", at: "verdient", color: "#6BBF7A" },
  },
  {
    id: "daten-podium", type: "data",
    text: "Das größte Loch im Budget ist klar die Miete, danach kommen Bier und Essen.",
    highlights: ["Miete", "Bier"],
    kind: "podium", title: "DIE GROSSEN POSTEN",
    podium: [{ label: "Miete", value: "3.000 $", at: "Miete" }, { label: "Bier", value: "260 $", at: "Bier" }, { label: "Essen", value: "200 $", at: "Essen" }],
  },
  {
    id: "daten-waage", type: "data",
    text: "Auf der einen Seite das Gehalt, auf der anderen die Miete: Die Waage kippt.",
    highlights: ["Gehalt", "Miete"],
    kind: "scale", title: "GEHALT VS. MIETE",
    scale: { left: { label: "Netto", value: 3200, display: "3.200 $" }, right: { label: "Miete + Leben", value: 5200, display: "5.200 $" }, at: "andere" },
  },
  {
    id: "daten-geld", type: "data",
    text: "Fünf Freunde, fünf Mal Bier: Das läppert sich zu einem ordentlichen Stapel.",
    highlights: ["Bier", "Stapel"],
    kind: "money", title: "BIER PRO JAHR",
    money: [{ label: "pro Kopf", n: 3, display: "3.100 $", at: "Fünf" }, { label: "ganze Gang", n: 6, display: "15.600 $", at: "Stapel" }],
  },
  {
    id: "vergleich", type: "compare",
    text: "Gehalt gegen Miete: Am Ende bleiben ganze zweihundert Dollar übrig.",
    highlights: ["Gehalt", "Miete"],
    title: "TED, JEDEN MONAT",
    left: { label: "NETTO", value: 3200, color: "#2FA36B", icon: "dollar", unit: "$", at: "Gehalt" },
    right: { label: "MIETE", value: 3000, color: "#D9534F", icon: "house", unit: "$", at: "Miete" },
    verdict: "BLEIBEN: 200 $", verdictAt: "bleiben",
  },
  {
    id: "karte", type: "map",
    text: "Die Wohnung liegt auf der Upper West Side, direkt am Central Park.",
    highlights: ["Upper", "West", "Central"],
    kind: "map", title: "MANHATTAN", target: { x: 575, y: 790, label: "Upper West Side" }, zoom: 3, zoomAt: "Upper",
    chips: [{ text: "UPPER WEST SIDE", at: "Upper" }, { text: "AM CENTRAL PARK", at: "Central" }],
  },
  {
    id: "grundriss", type: "map",
    text: "Dazu gehören zwei Schlafzimmer, ein Wohnzimmer und eine kleine Küche.",
    highlights: ["Schlafzimmer", "Wohnzimmer", "Küche"],
    kind: "floorplan", title: "GRUNDRISS",
    rooms: [
      { x: 0, y: 0, w: 12, h: 6, label: "WOHNZIMMER", m2: 28, color: "#F7EBD2", at: "Wohnzimmer" },
      { x: 0, y: 6, w: 6, h: 5, label: "SCHLAFEN 1", m2: 12, color: "#E8D9F5", at: "zwei" },
      { x: 6, y: 6, w: 6, h: 5, label: "SCHLAFEN 2", m2: 10, color: "#D9ECF5", at: "Schlafzimmer" },
      { x: 0, y: 11, w: 12, h: 4, label: "KÜCHE", m2: 9, color: "#F5E6D9", at: "Küche" },
    ],
    total: { label: "CA. 59 M²", at: "Küche" },
  },
  {
    id: "urteil", type: "verdict",
    text: "Urteil: zum Marktpreis ist das für Ted und Marshall völlig unmöglich.",
    verdict: "UNMÖGLICH", at: "unmöglich", calc: "3.000 $ × 40 = 120.000 $", sub: "Ted verdient ca. 55.000 $",
    stage: {
      location: "apartment",
      actors: [
        { who: "ted", x: 300, y: 1620, h: 900, enter: "none", keys: [{ at: 0, pose: "idle", expr: "neutral" }, { at: "unmöglich", pose: "facepalm", expr: "shocked" }] },
        { who: "marshall", x: 790, y: 1620, h: 900, flip: true, enter: "none", keys: [{ at: 0, pose: "idle", expr: "neutral" }, { at: "unmöglich", pose: "cheer", expr: "shocked" }] },
      ],
    },
  },
  {
    id: "ende", type: "end",
    text: "Welche Serie soll ich als Nächstes durchrechnen?",
    stage: { location: "bar", actors: [
      { who: "ted", x: 230, y: BAR_FY, h: 900, enter: "none", keys: [{ at: 0, pose: "wave", expr: "happy" }] },
      { who: "marshall", x: 840, y: BAR_FY, h: 900, flip: true, enter: "none", keys: [{ at: 0, pose: "cheer", expr: "happy" }] },
    ] },
  },
];

export const SHOWCASE: VideoSpec = {
  slug: "showcase",
  title: "Showcase",
  brand: config.brand as any,
  channel: config.channel_name,
  video: { ...(config.video as any), tail_seconds: 1 },
  style: himym as any,
  scenes,
  words: estimateWords(scenes),
  audio: null,
};
