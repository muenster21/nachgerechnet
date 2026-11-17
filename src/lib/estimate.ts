import type { SceneSpec, Word } from "./types";

/** Geschätztes Wort-Timing (nur für Vorschau/Kontaktbogen, bevor die echte Stimme existiert). ca. 2,6 Wörter/s. */
export function estimateWords(scenes: Pick<SceneSpec, "text">[]): Word[] {
  const words: Word[] = [];
  let t = 0.25;
  scenes.forEach((sc, scene) => {
    for (const raw of sc.text.split(/\s+/).filter(Boolean)) {
      const len = Math.max(0.16, 0.08 + raw.replace(/[^\p{L}\p{N}]/gu, "").length * 0.047);
      words.push({ text: raw, start: +t.toFixed(3), end: +(t + len).toFixed(3), scene });
      t += len + 0.06;
      if (/[.!?:]$/.test(raw)) t += 0.26;
      else if (/[,;]$/.test(raw)) t += 0.14;
    }
    t += 0.2;
  });
  return words;
}
