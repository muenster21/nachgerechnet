#!/usr/bin/env node
// Bündelt output/<slug>/scenes.json + Stil + Wort-Timing zu assets/_build/<slug>/spec.json und schreibt script.md.
//   node scripts/prepare.mjs <slug> --estimate                      (geschätztes Timing, nur für Kontaktbogen)
//   node scripts/prepare.mjs <slug> --words transcript-words.json --audio audio.mp3 [--tempo 1.0]   (echte Stimme)
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib.mjs";

const args = process.argv.slice(2);
const slug = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i > 0 ? args[i + 1] : d; };
const dir = path.join(ROOT, "output", slug);
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "config.json"), "utf8"));
const sc = JSON.parse(fs.readFileSync(path.join(dir, "scenes.json"), "utf8"));
const style = JSON.parse(fs.readFileSync(path.join(ROOT, "styles", `${sc.series}.json`), "utf8"));
const build = path.join(ROOT, "assets/_build", slug);
fs.mkdirSync(build, { recursive: true });

const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
let words, audio = null, estimated = false;

if (args.includes("--estimate")) {
  estimated = true;
  words = [];
  let t = 0.25;
  sc.scenes.forEach((s, scene) => {
    for (const raw of s.text.split(/\s+/).filter(Boolean)) {
      const len = Math.max(0.16, 0.08 + raw.replace(/[^\p{L}\p{N}]/gu, "").length * 0.047);
      words.push({ text: raw, start: +t.toFixed(3), end: +(t + len).toFixed(3), scene });
      t += len + 0.06;
      if (/[.!?:]$/.test(raw)) t += 0.26; else if (/[,;]$/.test(raw)) t += 0.14;
    }
    t += 0.2;
  });
} else {
  const tempo = Number(opt("--tempo", 1));
  let tw = JSON.parse(fs.readFileSync(path.resolve(dir, opt("--words")), "utf8"));
  tw = (Array.isArray(tw) ? tw : tw.words).filter((w) => (w.type ?? "word") === "word");
  // Regieanweisungen [ ... ] überspringen (auch mehrteilige)
  let inTag = false;
  tw = tw.filter((w) => { const s = w.text.trim(); const a = s.startsWith("["), b = s.endsWith("]"); if (inTag) { if (b) inTag = false; return false; } if (a) { if (!b) inTag = true; return false; } return true; });
  const script = sc.scenes.flatMap((s, i) => s.text.split(/\s+/).filter(Boolean).map((text) => ({ text, scene: i })));
  if (script.length !== tw.length) console.warn(`WARNUNG: Skript ${script.length} Wörter, Transkript ${tw.length}`);
  let mism = 0;
  words = script.map((w, i) => {
    const t = tw[Math.min(i, tw.length - 1)];
    if (norm(t.text) !== norm(w.text)) { mism++; console.warn(`  Abweichung #${i}: Skript „${w.text}“ vs. gesprochen „${t.text}“`); }
    return { text: w.text, start: +(t.start / tempo).toFixed(3), end: +(t.end / tempo).toFixed(3), scene: w.scene };
  });
  console.log(`Abgleich: ${words.length} Wörter, ${mism} Abweichungen`);
  const a = opt("--audio");
  if (a) { audio = `_build/${slug}/audio.mp3`; fs.copyFileSync(path.resolve(dir, a), path.join(build, "audio.mp3")); }
}

const spec = {
  slug, title: sc.title, brand: cfg.brand, channel: cfg.channel_name, video: cfg.video, style, audio,
  scenes: sc.scenes.map(({ tts, ...s }) => s), words,
};
fs.writeFileSync(path.join(build, "spec.json"), JSON.stringify(spec));

// script.md
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
let md = `# Skript: ${sc.title}\n\nSerie: ${style.series} · Timing: ${estimated ? "GESCHÄTZT (noch keine Stimme)" : "aus ElevenLabs-Zeitstempeln"}\n\n`;
let total = 0;
sc.scenes.forEach((s, i) => {
  const t0 = words.find((w) => w.scene === i)?.start ?? 0;
  total += s.text.split(/\s+/).length;
  md += `## ${i + 1}. ${s.id}  (${fmt(t0)})  ·  Szene: \`${s.type}${s.kind ? "/" + s.kind : ""}\`\n\n> ${s.text}\n\n${s.note ? `*Bild:* ${s.note}\n\n` : ""}`;
});
const dur = words.at(-1).end;
md += `---\n**${total} Wörter · ca. ${Math.round(dur)} Sekunden${estimated ? " (geschätzt)" : ""}**\n`;
fs.writeFileSync(path.join(dir, "script.md"), md);
console.log(`OK: assets/_build/${slug}/spec.json · script.md (${total} Wörter, ${dur.toFixed(1)} s${estimated ? ", geschätzt" : ""})`);
