/** Look einer Figur (Farben, Frisur, Outfit). Neue Figuren = neuer Eintrag. */
export type Look = {
  skin: string;
  skinShade: string;
  hair: { color: string; style: "ted" | "marshall" | "plain" | "bald" | "barney" | "long" };
  top: { kind: "blazer" | "sweater" | "plaid" | "tee"; color: string; accent: string; shirt?: string };
  tie?: string;
  pants: string;
  shoes: string;
  /** Körperbreite (Standard 124) und Höhenfaktor */
  bodyW: number;
  heightScale: number;
  sleeves: "long" | "short";
  stubble?: boolean;
  mustache?: string;
  brows: string;
};

/** Karikaturen im eigenen Zeichenstil: erkennbar an Frisur, Gesicht und Outfit. */
export const LOOKS: Record<string, Look> = {
  ted: {
    skin: "#F1BC92",
    skinShade: "#E2A275",
    hair: { color: "#3B2418", style: "ted" },
    top: { kind: "blazer", color: "#5A4636", accent: "#3F3026", shirt: "#B9D3EA" },
    pants: "#2D3550",
    shoes: "#3A2A20",
    bodyW: 120,
    heightScale: 1,
    sleeves: "long",
    stubble: true,
    brows: "#2A1810",
  },
  marshall: {
    skin: "#F0B890",
    skinShade: "#DE9E72",
    hair: { color: "#7A4A26", style: "marshall" },
    top: { kind: "plaid", color: "#4E7FB0", accent: "#2F5A86", shirt: "#F4F1E8" },
    pants: "#4A4F66",
    shoes: "#4B3426",
    bodyW: 144,
    heightScale: 1.14,
    sleeves: "long",
    stubble: true,
    brows: "#4A2A14",
  },
  barkeeper: {
    skin: "#E3A77C",
    skinShade: "#CF9167",
    hair: { color: "#2A1A12", style: "bald" },
    top: { kind: "tee", color: "#F4F0E4", accent: "#2F6B4B" },
    pants: "#2A2A3A",
    shoes: "#2A2018",
    bodyW: 134,
    heightScale: 1.02,
    sleeves: "short",
    mustache: "#2A1A12",
    brows: "#2A1A12",
  },
  barney: {
    skin: "#EDB48A",
    skinShade: "#DB9A70",
    hair: { color: "#2B1B12", style: "barney" },
    top: { kind: "blazer", color: "#23232E", accent: "#15151D", shirt: "#F4F0E8" },
    tie: "#3A6EA5",
    pants: "#23232E",
    shoes: "#15151D",
    bodyW: 126,
    heightScale: 1.0,
    sleeves: "long",
    brows: "#1F130C",
  },
  claudia: {
    skin: "#F3C9A5",
    skinShade: "#E4AD86",
    hair: { color: "#5A331C", style: "long" },
    top: { kind: "sweater", color: "#3FA37F", accent: "#2C7A5C" },
    pants: "#2E2A3A",
    shoes: "#7A2E3A",
    bodyW: 108,
    heightScale: 0.96,
    sleeves: "short",
    brows: "#3A2012",
  },
};
