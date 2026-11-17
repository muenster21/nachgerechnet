---
description: Fertiges Hochkant-Video (60–90 s, Erzählerstimme aus dem Off) zu den Finanzen einer Serienfigur. Aufruf: /video <Serie> "<Frage>"
argument-hint: <Serie> "<Frage>"
---

Erzeuge ein Video für den Kanal nachgerechnet. Argumente: `$ARGUMENTS` (erstes Wort = Serie, Rest = Frage). Lies zuerst `STYLE_BIBLE.md` und `README.md`. Slug: kurz, klein, Bindestriche (z. B. `himym-wohnung`). Ausgabe in `output/<slug>/`.

Zielgruppe 18–30, Serienfans ohne Finanzwissen. Ton: locker, witzig, wie ein Kumpel, der zufällig BWL studiert. **Es gibt keine Erzählerfigur:** der Erzähler ist nur die Stimme; die Szene zeigt immer, worüber gerade gesprochen wird, mit den Serienfiguren als Darstellern.

## 1. Recherche → `output/<slug>/research.md`
- Serien-Fakten aus Fandom-Wikis mit Staffel/Folge. WebFetch auf Fandom liefert oft HTTP 402 → MediaWiki-API: `curl -sS -A "Mozilla/5.0" "https://<wiki>.fandom.com/api.php?action=parse&page=<Seite>&prop=wikitext&format=json&formatversion=2"`.
- Echte Daten: Mieten (Stadtteil + Jahr), Gehälter (BLS OES / Destatis), Inflation (BLS CPI-API), Wechselkurse (EZB-API). Seiten, die automatische Abrufe blocken (z. B. bls.gov), im eingebauten Browser lesen.
- Strikt trennen: **Serien-Fakt / echte Daten / Schätzung (mit Herleitung)**, jeweils mit Link und Stand. Nie Fakten oder Zahlen erfinden.

## 2. Skript → `scenes.json`, `script.md`, `hooks.txt`
- 150–220 Wörter, gesprochene Sprache, kurze Sätze, Zahlen gerundet, Schätzungen benennen.
- Aufbau: Hook (2 s) → was die Serie zeigt → reale Kosten → Verdienst der Figuren → Rechnung → Urteil → Twist/Erklärung → „Welche Serie soll ich als Nächstes durchrechnen?“.
- Anspielung auf die Erzählweise der Serie erlaubt, keine längeren Originalzitate.
- `hooks.txt`: 3 Varianten, stärkste („GEWÄHLT“) kommt ins Video.
- `scenes.json`: pro Szene `id`, `text`, `highlights`, `type` (`location|fact|receipt|data|compare|map|verdict|end`) + Props; Vorlage: `src/demo/showcase.ts`. Mind. 5 verschiedene Szenentypen, spätestens alle 2–3 s neue Bewegung (Szene ≈ ein Satz). Figuren, Posen, Requisiten, Chips an Wörter koppeln (`at: "Wort"`).
- `script.md` mit Markierung, welche Szene zu welchem Satz gehört.

## 3. Kontaktbogen (Pflicht, danach STOPP und dem Nutzer Skript + Bogen zeigen)
`node scripts/prepare.mjs <slug> --estimate` → `node scripts/stills.mjs <slug> --at 0.5,0.92`
Ehrlich gegen die Referenz prüfen (B10): bildfüllend? leere Flächen? Clipart-Wirkung? Text in der Sicherheitszone (oben 250, unten 400, rechts 150)? Zeigt jede Szene, wovon gesprochen wird? Jede Zahl gegen research.md. Mängel beheben, neu rendern.

## 4. Stimme (erst nach OK des Nutzers)
Stimme: Voice-ID aus `config.json`, Modell `eleven_v4`, lebendig erzählt (Regieanweisungen wie [curious], [pause] im Feld `tts` je Szene; nur Tags und Satzzeichen ergänzen). Ohne API-Key über den verbundenen ElevenLabs-Connector: `creative_generate_speech` → MP3 laden → `creative_transcribe_audio` (eleven_scribe_v1) für Wort-Zeitstempel → `node scripts/prepare.mjs <slug> --words transcript-words.json --audio audio.mp3`.

## 5. Render
`node scripts/render.mjs <slug>`; Stichproben im fertigen Video prüfen (Sync, Ton, Sicherheitszone). `caption.txt`: Caption + 3–5 Hashtags + Hinweis „Stimme KI-generiert“.

## Abschluss
Kurze Liste der Serien-Fakten und Zahlen zum Gegenchecken (mit Quelle).
