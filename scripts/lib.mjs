import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "esbuild";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Lädt die Video-Spezifikation: "showcase" (aus src/demo/showcase.ts) oder assets/_build/<slug>/spec.json */
export async function loadSpec(slug) {
  if (slug === "showcase") {
    const out = path.join(os.tmpdir(), `showcase-${Date.now()}.mjs`);
    await build({ entryPoints: [path.join(ROOT, "src/demo/showcase.ts")], bundle: true, platform: "node", format: "esm", outfile: out, loader: { ".json": "json" }, logLevel: "silent" });
    const m = await import(pathToFileURL(out).href);
    return m.SHOWCASE;
  }
  return JSON.parse(fs.readFileSync(path.join(ROOT, "assets/_build", slug, "spec.json"), "utf8"));
}

/** Szenen-Zeitgrenzen in Sekunden */
export function sceneTimes(spec) {
  const first = (i) => (spec.words.find((w) => w.scene === i) ?? { start: 0 }).start;
  const end = (i) => (i + 1 < spec.scenes.length ? first(i + 1) : spec.words.at(-1).end + (spec.video.tail_seconds ?? 1));
  return spec.scenes.map((s, i) => ({ id: s.id, start: first(i), end: end(i) }));
}
