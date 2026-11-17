#!/usr/bin/env node
// Finales Video rendern + Lautstärke normalisieren.   node scripts/render.mjs <slug>
import path from "node:path";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { ROOT, loadSpec } from "./lib.mjs";

const slug = process.argv[2];
const ri = process.argv.indexOf("--range");
const frameRange = ri > 0 ? process.argv[ri + 1].split("-").map(Number) : null; // z. B. --range 230-300 (Testausschnitt)
const spec = await loadSpec(slug);
const serveUrl = await bundle({ entryPoint: path.join(ROOT, "src/index.ts"), publicDir: path.join(ROOT, "assets") });
const id = slug === "showcase" ? "Showcase" : "Video";
const inputProps = slug === "showcase" ? {} : { slug };
const comp = await selectComposition({ serveUrl, id, inputProps });
const out = path.join(ROOT, "output", slug);
fs.mkdirSync(out, { recursive: true });
const raw = path.join(out, "video-raw.mp4");
await renderMedia({ composition: comp, serveUrl, codec: "h264", crf: 18, outputLocation: raw, inputProps, ...(frameRange ? { frameRange } : {}), onProgress: ({ progress }) => process.stdout.write(`\r${Math.round(progress * 100)} %`) });
const hasAudio = execFileSync("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=codec_type", "-of", "csv=p=0", raw]).toString().trim() !== "";
if (hasAudio) execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "192k", path.join(out, "video.mp4")]);
else fs.copyFileSync(raw, path.join(out, "video.mp4"));
fs.unlinkSync(raw);
console.log(`\nFertig: output/${slug}/video.mp4`);
