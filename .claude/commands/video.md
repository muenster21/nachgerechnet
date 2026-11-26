---
description: Fertiges Hochkant-Video (60–90 s, Erzählerstimme aus dem Off) zu den Finanzen einer Serienfigur. Aufruf: /video <Serie> "<Frage>"
argument-hint: <Serie> "<Frage>"
---

Erzeuge ein Video für den Kanal nachgerechnet. Argumente: `$ARGUMENTS` (erstes Wort = Serie, Rest = Frage). Lies zuerst `UEBERGABE.md`, dann `STYLE_BIBLE.md` und `README.md`. Starte jedes Video in einer neuen Sitzung. Lege sofort `output/<slug>/STATUS.md` nach `scripts/STATUS.vorlage.md` an und aktualisiere es nach **jedem** Schritt (Stand, Entscheidungen des Nutzers mit Datum, freigegebener Text, Zahlen, IDs). Slug: kurz, klein, Bindestriche (z. B. `himym-wohnung`). Ausgabe in `output/<slug>/`.

Zielgruppe 18–30, Serienfans ohne Finanzwissen. Ton: locker, witzig, wie ein Kumpel, der zufällig BWL studiert. **Es gibt keine Erzählerfigur:** der Erzähler ist nur die Stimme; die Szene zeigt immer, worüber gerade gesprochen wird, mit den Serienfiguren als Darstellern.

## 1. Recherche → `output/<slug>/research.md`
Übergib die Recherche an den Agenten **`rechercheur`** (Serie, Frage, Slug). Nimm nur seine Zusammenfassung in diese Sitzung und lies `research.md` bei Bedarf gezielt. Die Regeln unten gelten für ihn und für Nachrecherchen.
- Serien-Fakten aus Fandom-Wikis mit Staffel/Folge. WebFetch auf Fandom liefert oft HTTP 402 → MediaWiki-API: `curl -sS -A "Mozilla/5.0" "https://<wiki>.fandom.com/api.php?action=parse&page=<Seite>&prop=wikitext&format=json&formatversion=2"`.
- Echte Daten: Mieten (Stadtteil + Jahr), Gehälter (BLS OES / Destatis), Inflation (BLS CPI-API), Wechselkurse (EZB-API). Seiten, die automatische Abrufe blocken (z. B. bls.gov), im eingebauten Browser lesen.
- Strikt trennen: **Serien-Fakt / echte Daten / Schätzung (mit Herleitung)**, jeweils mit Link und Stand. Nie Fakten oder Zahlen erfinden.

## 2. Skript → `scenes.json`, `script.md`, `hooks.txt`
- 150–220 Wörter, gesprochene Sprache, kurze Sätze, Zahlen gerundet, Schätzungen benennen.
- Aufbau: Hook als schockierte Frage mit `[shocked]` (0–2 s, verrät nichts, keine Ergebnis-Chips) → was die Serie zeigt → reale Zahlen → Rechnung (Annahmen aussprechen) → Urteil (erst hier die Antwort) → „Folg mir für die nächste Rechnung. Was soll ich als Nächstes durchrechnen?“ (vorhandenes Snippet `output/_snippets/end2.mp3` nutzbar).
- Länge: sicher über 60 s, Ziel 62–70 s, Mitte straff.
- Anspielung auf die Erzählweise der Serie erlaubt, keine längeren Originalzitate.
- `hooks.txt`: 3 Varianten, stärkste („GEWÄHLT“) kommt ins Video.
- `scenes.json`: pro Szene `id`, `text`, `highlights`, `type` (`location|fact|receipt|data|compare|map|verdict|end`) + Props; Vorlage: `src/demo/showcase.ts`. Mind. 5 verschiedene Szenentypen, spätestens alle 2–3 s neue Bewegung (Szene ≈ ein Satz). Figuren, Posen, Requisiten, Chips an Wörter koppeln (`at: "Wort"`).
- `script.md` mit Markierung, welche Szene zu welchem Satz gehört.

## 2b. Skript-Prüfung (Pflicht)
Agent **`skript-pruefer`** mit dem Slug starten. Jeden Fund beheben oder begründet verwerfen und bei größeren Änderungen erneut prüfen lassen. Danach den gesprochenen Text **dem Nutzer zur Freigabe zeigen**, außer er hat „ohne mich zu fragen“ gesagt. Ergebnis und Freigabe in `STATUS.md` eintragen.

## 3. Kontaktbogen (Pflicht, danach STOPP und dem Nutzer Skript + Bogen zeigen)
`node scripts/prepare.mjs <slug> --estimate` → `node scripts/stills.mjs <slug> --at 0.5,0.92`
Agent **`bild-pruefer`** mit dem Slug starten und seine Funde beheben. Zusätzlich selbst ehrlich gegen die Referenz prüfen (B10): bildfüllend? leere Flächen? Clipart-Wirkung? Text in der Sicherheitszone (oben 250, unten 400, rechts 150)? Zeigt jede Szene, wovon gesprochen wird? Jede Zahl gegen research.md. Mängel beheben, neu rendern.

## 4. Stimme (erst nach OK des Nutzers)
Details und IDs: `UEBERGABE.md` Abschnitt 4. Danach Transkript gegen Text abgleichen (Ziel 0 Abweichungen) und Flow-/Node-IDs, Dauer und Credits in `STATUS.md` eintragen.
Stimme: Voice-ID aus `config.json`, Modell `eleven_v4`, lebendig erzählt (Regieanweisungen wie [curious], [pause] im Feld `tts` je Szene; nur Tags und Satzzeichen ergänzen). Ohne API-Key über den verbundenen ElevenLabs-Connector: `creative_generate_speech` → MP3 laden → `creative_transcribe_audio` (eleven_scribe_v1) für Wort-Zeitstempel → `node scripts/prepare.mjs <slug> --words transcript-words.json --audio audio.mp3`.

## 5. Render
`node scripts/render.mjs <slug>`; Stichproben im fertigen Video vom Agenten **`bild-pruefer`** prüfen lassen und selbst Sync und Ton prüfen. `cover.png` erstellen. `caption.txt`: Caption + 3–5 Hashtags + Hinweis „Stimme KI-generiert“.

## 5b. Werbung prüfen (nur wenn die Affiliate-Pipeline vorhanden ist)
Pfad: `$NACHGERECHNET_AFFILIATE`, sonst `~/Desktop/Claude/Motion/affiliate-strategie/pipeline/affiliate.py`. Fehlt die Datei, diesen Schritt überspringen.
- `python3 <pfad> vorschlag <slug>`. Bei „Kein Programm passt“ oder einem nicht freigeschalteten Programm: Video ohne Werbung, weiter mit `check`.
- Passt ein freigeschaltetes Programm: **erst den Nutzer fragen**, ob das Video Werbung bekommt. Nur nach seinem OK `python3 <pfad> anwenden <slug> <programm>`. Nie von sich aus Werbung einbauen und nie Finanzprodukte (Bank, Depot, Kreditkarte) bewerben.
- Immer `python3 <pfad> check <slug>`. Bei „FEHLER“ beheben oder ohne Werbung posten. Die Upload-Checkliste aus der Ausgabe dem Nutzer zeigen.
- In `STATUS.md` eintragen: Werbung ja/nein, Programm, welche Caption-Datei hochgeladen wird (`caption.txt` oder `caption.werbung.txt`), Ergebnis von `check`.
- Affiliate-Links und Partnerdaten stehen nur in `output/` (nicht versioniert) und nie in Dateien, die committet werden.

## 6. Übergabe (Pflicht, auch wenn die Sitzung abbricht oder nur ein Teil fertig ist)
- `output/<slug>/STATUS.md` vollständig: Stand, alle Nutzerentscheidungen, freigegebener Text, Kernrechnung, Unsicherheiten, Prüfergebnisse, IDs, welche Datei hochgeladen wird, Sicherungen.
- `UEBERGABE.md`: Zeile in der Videotabelle (Abschnitt 7) anlegen oder aktualisieren. Neue Regeln oder Lehren des Nutzers in Abschnitt 2 bzw. 6 eintragen, neue Stolperfallen in Abschnitt 5, offene Punkte in Abschnitt 8. Stand-Datum anpassen.
- Committen und pushen.

## Abschluss
Kurze Liste der Serien-Fakten und Zahlen zum Gegenchecken (mit Quelle).
