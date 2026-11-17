import config from "../../config.json";

/** Feste Markenfarben (Kanal) – ändern über config.json → brand */
export const BRAND = config.brand as { signature: string; ink: string; stamp: string; paper: string };

export const FONT_DISPLAY = "Anton"; // Untertitel, Zahlen, Stempel
export const FONT_TEXT = "Nunito"; // Karten, Labels, Bon-Text

/** Sicherheitszonen (px) – Hintergründe laufen trotzdem bis zum Rand */
export const SAFE = { top: 250, bottom: 400, right: 150, left: 60 };

/** Linienlogik: überall dünne dunkle Kontur */
export const LINE = BRAND.ink;
export const LW = 4;

export const W = 1080;
export const H = 1920;
