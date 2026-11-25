# nachgerechnet

Animierte Hochkant-Videos (1080×1920, 30 fps, 60–90 s) mit Erzählerstimme aus dem Off, die die Finanzen von Film- und Serienfiguren nachrechnen. Gebaut mit Remotion (React). Regeln und Look: **[STYLE_BIBLE.md](STYLE_BIBLE.md)**. Stand, Regeln des Nutzers und Videoliste: **[UEBERGABE.md](UEBERGABE.md)**. Agenten: `.claude/agents/` (rechercheur, skript-pruefer, bild-pruefer).

## Neues Video starten
In Claude Code, im Projektordner:

```
/video HIMYM "Wie konnten sich Ted und Marshall die Wohnung in Manhattan leisten?"
```

Der Command (`.claude/commands/video.md`) führt durch: Recherche → Skript → Szenen → Kontaktbogen (STOPP zur Abnahme) → Stimme → Render.

## Ordner
| Pfad | Inhalt |
|---|---|
| `reference/` | Referenzvideo (nicht im Repo) |
| `assets/fonts`, `assets/sfx` | Schriften (Anton, Nunito), selbst synthetisierte Sound-Effekte |
| `assets/_build/<slug>/` | pro Video erzeugte Daten und Audio (nicht im Repo) |
| `styles/<serie>.json` | Palette, Figuren und Schauplätze je Serie |
| `src/characters/` | Figuren-Rig (`Rig.tsx`: 12 Posen, 6 Ausdrücke, 7 Mundformen, Idle) und Looks (`looks.ts`) |
| `src/assets/` | Asset-Bibliothek: Objekte, Möbel, Gebäude, Icons (`registry.ts` = Namen für JSON) |
| `src/scenes/` | Szenentypen: Schauplatz, Fakt, Rechnung, Daten (Punkte/Balken/Podium/Waage/Geld), Vergleich, Karte/Grundriss, Urteil, Endcard |
| `src/components/` | Untertitel, Kamera (Push-in + Parallaxe), Übergänge, Overlays, Sounds |
| `src/demo/showcase.ts` | Musterszenen für die Qualitätsprüfung |
| `output/<slug>/` | `video.mp4`, `script.md`, `hooks.txt`, `research.md`, `contact_sheet.png`, `caption.txt` (nicht im Repo) |

## Befehle
```bash
npm install                                   # einmalig
node scripts/stills.mjs showcase --at 0.9     # Musterszenen + Kontaktbogen (output/showcase/)
node scripts/stills.mjs <slug> --at 0.5,0.92  # Standbilder + Kontaktbogen eines Videos
node scripts/render.mjs <slug>                # finales Video (+ Lautstärke normalisieren)
node scripts/render.mjs <slug> --range 300-380  # Testausschnitt
npm run studio                                # Remotion Studio (Vorschau im Browser)
```

## Figur/Szene ergänzen
- **Neue Figur:** Eintrag in `src/characters/looks.ts` (Farben, Frisur, Outfit) und in `styles/<serie>.json`.
- **Neues Requisit/Möbel:** Komponente in `src/assets/*.tsx`, Name in `src/assets/registry.ts`.
- **Neuer Schauplatz:** `src/scenes/locations.tsx` (drei Ebenen Back/Mid/Fore, Farben aus `styles/<serie>.json`).

## Keys
`.env.example` nach `.env` kopieren: `ELEVENLABS_API_KEY`, `PEXELS_API_KEY`. `.env` ist per `.gitignore` ausgeschlossen.
