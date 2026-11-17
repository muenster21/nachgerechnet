#!/usr/bin/env node
// Standbilder je Szene + Kontaktbogen.   node scripts/stills.mjs <slug|showcase> [--at 0.35,0.9]
// Ergebnis: output/<slug>/stills/NN-<id>-<pct>.png und output/<slug>/contact_sheet.png
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { ROOT, loadSpec, sceneTimes } from "./lib.mjs";

const slug = process.argv[2] ?? "showcase";
const ai = process.argv.indexOf("--at");
const fractions = ai > 0 ? process.argv[ai + 1].split(",").map(Number) : [0.6];
const only = process.argv.indexOf("--only") > 0 ? process.argv[process.argv.indexOf("--only") + 1].split(",") : null;
const spec = await loadSpec(slug);
const fps = spec.video.fps;
const outDir = path.join(ROOT, "output", slug);
const stills = path.join(outDir, "stills");
fs.mkdirSync(stills, { recursive: true });
for (const f of fs.readdirSync(stills)) fs.unlinkSync(path.join(stills, f));

const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index.ts"), publicDir: path.join(ROOT, "assets") });
const id = slug === "showcase" ? "Showcase" : "Video";
const inputProps = slug === "showcase" ? {} : { slug };
const comp = await selectComposition({ serveUrl, id, inputProps });
const times = sceneTimes(spec);
const files = [];
for (const [i, t] of times.entries()) {
  if (only && !only.includes(t.id)) continue;
  for (const fr of fractions) {
    const frame = Math.min(comp.durationInFrames - 1, Math.round((t.start + (t.end - t.start) * fr) * fps));
    const out = path.join(stills, `${String(i + 1).padStart(2, "0")}-${t.id}-${Math.round(fr * 100)}.png`);
    await renderStill({ composition: comp, serveUrl, output: out, frame, inputProps });
    files.push(out);
    console.log(`✓ ${path.basename(out)}  (${(frame / fps).toFixed(1)} s)`);
  }
}
// Kontaktbogen: letzter Anteil je Szene (oder einziger)
const sheetFiles = files.filter((f) => f.endsWith(`-${Math.round(fractions.at(-1) * 100)}.png`));
const cols = Math.min(7, sheetFiles.length);
const rows = Math.ceil(sheetFiles.length / cols);
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-pattern_type", "glob", "-i", path.join(stills, `*-${Math.round(fractions.at(-1) * 100)}.png`), "-vf", `scale=300:-1,tile=${cols}x${rows}:padding=8:color=0x1c1830`, "-frames:v", "1", path.join(outDir, "contact_sheet.png")]);
console.log(`Kontaktbogen: output/${slug}/contact_sheet.png  (${comp.durationInFrames / fps} s Gesamtlänge)`);
