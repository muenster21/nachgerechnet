# Übergabe: nachgerechnet

**Diese Datei ist das Gedächtnis des Projekts.** Jede neue Sitzung liest sie zuerst. Wer etwas entscheidet, ändert oder fertigstellt, trägt es hier ein, bevor die Sitzung endet. So bleiben Regeln, Stimme, Look und Stand gleich, auch wenn eine Sitzung nichts vom Verlauf früherer Sitzungen weiß.

Stand: 26.11.2026

Zusammenspiel der Dateien:
- `CLAUDE.md`: Kurzregeln (werden automatisch geladen)
- `UEBERGABE.md`: alles Wichtige im Detail
- `STYLE_BIBLE.md`: Look
- `output/<slug>/STATUS.md`: Stand und Entscheidungen je Video

---

## 1. Kanal
- TikTok, deutsch, Marke **„nachgerechnet“**. Das Konto heißt noch **@allwissendde** (alter Account). Der Nutzer benennt es um, sobald TikTok das erlaubt, und meldet dann den neuen Namen. Dann `config.json` → `channel_name` ändern (einzige Quelle für Wasserzeichen und Endcard) und den Hashtag in neuen Captions anpassen. Bereits gepostete Videos bleiben unverändert.
- Idee: Ein Video rechnet etwas aus einer Serie nach und prüft, ob es in echt möglich wäre. Zielgruppe 18–34, Serienfans ohne Finanzwissen. Der Ton ist locker, wie ein Kumpel, der zufällig BWL studiert.
- Bio-Vorschlag (flexibel, falls es später über Serien hinausgeht): „Wäre das in echt möglich? Ich rechne es nach 🧮 Schreib mir, was ich prüfen soll!“ Danach kommen Filme, Promis, Alltag.

## 2. Feste Regeln des Nutzers (nicht ohne Rückfrage ändern)
1. **Mehrwert:** Jedes Thema rechnet etwas nach, das die Serie **nicht** selbst auflöst (Realismus-Check, Physik, Recht, echte Preise). Ideen aus Kommentaren aufgreifen und verkomplizierende Teile bewusst weglassen (das im Video sagen).
2. **Hook = schockierte Frage** mit `[shocked]`, in Sekunde 0–2, z. B. „So lange müssten Sam und Dean in den Knast?!“. Er verrät **keine** Antwort, auch nicht über Chips.
3. **Antwort und Urteil erst am Ende.** Supernatural Teil 2 verriet die Antwort vorne, dadurch gab es keinen Grund dranzubleiben.
4. **Länge:** immer über 1 Minute (Creator Rewards), Mitte straff. Die Mitte verliert laut Analyse am meisten. Ziel sind etwa 62–70 s.
5. **Ende, freundlich betont:** „Folg mir für die nächste Rechnung. Was soll ich als Nächstes durchrechnen?“ Fertige Vertonung: `output/_snippets/end2.mp3` + `end2.json`.
6. **Keine Musik.** Caption mit 3–5 Hashtags und dem Hinweis „Stimme KI-generiert“.
7. **Freigaben:** Den Text vor dem Vertonen freigeben lassen, den Kontaktbogen vor dem finalen Render. Nur wenn der Nutzer ausdrücklich „ohne mich zu fragen“ sagt, autonom arbeiten.
8. **Logik vor dem Vertonen prüfen** (Agent `skript-pruefer`). Grund: Das GoT-Video brauchte drei Fassungen.
9. **Nach jedem Schritt committen und pushen** (Branch `feat/style-bible-und-pipeline`). API-Keys und Referenzvideo kommen nie ins Repo. Die private E-Mail-Adresse des Nutzers wird nie verwendet.
11. **Nur zeitlose Serien** (Entscheidung 26.11.2026): Serien, die bis heute viel geschaut werden, gern passend zur Jahreszeit (Supernatural im Herbst, wenn es draußen dunkler wird; Weihnachtsfolgen im Dezember). Keine Serien, deren Hype vorbei ist. Deshalb wurden Prison Break und Haus des Geldes 2 verworfen.
12. **Hook mit schockierender Zahl im Bild plus Frage** (Vorschlag nach Analyse 26.11., noch nicht vom Nutzer bestätigt): z. B. „2.000 Ziegen im Jahr?!“. Das eigentliche Ergebnis bzw. Urteil kommt weiterhin erst am Ende.
13. Fremde, unversionierte Ordner im Projekt (`design-lab/`, `fonts/`, `nachgerechnet/`, `previews/`, `render.py`, `serien-video/`, `templates/`, `topics.json`) nicht anfassen.

## 3. Ablauf eines Videos (`/video <Serie> "<Frage>"`)
Jedes Video in einer **neuen Sitzung** starten. Das spart Kontext, und die Sitzung liest nur diese Datei.

1. **Recherche**: Agent `rechercheur` schreibt `output/<slug>/research.md`.
2. **Skript**: `scenes.json`, `script.md`, `hooks.txt` → Agent `skript-pruefer` → Fehler beheben → **Text dem Nutzer zur Freigabe zeigen**.
3. **Kontaktbogen**: `node scripts/prepare.mjs <slug> --estimate` → `node scripts/stills.mjs <slug> --at 0.5,0.92` → Agent `bild-pruefer` → beheben → Bogen zeigen.
4. **Stimme** (erst nach OK) über den ElevenLabs-Connector, siehe Abschnitt 4.
5. **Render**: `node scripts/prepare.mjs <slug> --words transcript-words.json --audio audio.mp3` → `node scripts/render.mjs <slug>` → `bild-pruefer` mit Stichproben → `cover.png` und `caption.txt` erstellen.
6. **Übergabe**: `output/<slug>/STATUS.md` fertig ausfüllen und die Videotabelle unten (Abschnitt 7) ergänzen. Danach committen und pushen.

## 4. Stimme (ElevenLabs-Connector, kein API-Key nötig)
- Sprecher **Markus**, `voice_id IeQubAjK1ujbppIdhJw4`, Modell **`eleven_v4`**, `generations_count 1`. Die Werte stehen auch in `config.json`.
- Werkzeuge per ToolSearch laden: `creative_generate_speech` (gibt `flow_id` und Node-ID zurück) → `creative_get_flow_run_status` (liefert `content_url`; zum Warten `sleep 60` im Hintergrund) → MP3 per curl als `audio.mp3` speichern → `creative_transcribe_audio` (Modell `eleven_scribe_v1`, `connect_from` = Speech-Node-ID) → `words_download_url` per curl als `transcript-words.json` speichern.
- Regieanweisungen im Text: `[shocked]` (Hook), `[curious]`, `[pause]`. Sonst nur Satzzeichen ergänzen, keine Wörter ändern.
- Kosten: etwa 1.450 Credits für 83 s. Neue Vertonung nur nach Textfreigabe.
- **Teile austauschen ohne komplette Neuvertonung:** Den neuen Satz einzeln vertonen (Snippets liegen in `output/_snippets/`: `hook-*`, `q-*`, `end2`), mit ffmpeg einsetzen und die Zeitstempel in `transcript-words.json` verschieben. Alte Dateien als `*.v1.*`, `*.v2.*` usw. sichern.
- Nach der Transkription: Wörter mit dem Text abgleichen (Ziel 0 Abweichungen). `at`-Wörter in `scenes.json` müssen genau einem gesprochenen Wort entsprechen.

## 5. Technik (Kurzfassung, Details in README.md)
- Remotion (React), 1080×1920, 30 fps. Sicherheitszone: oben 250, unten 400, rechts 150 px.
- Szenentypen: location, fact, receipt, data, compare, map, verdict, end. Mindestens 5 verschiedene pro Video, etwa alle 2–3 s eine neue Bewegung.
- Stage: `actors` (who, x, y, h, enter, keys[at, pose, expr], flip) und `items` (asset, x, y, s, at, anim, props, move{to, at, dur}). Chips: {text, at, top, left, size, color, fg}.
- Figuren: `src/characters/looks.ts`. Requisiten: `src/assets/*.tsx` und `registry.ts`. Orte: `src/scenes/locations.tsx`. Serienfarben: `styles/<serie>.json`.
- Bekannte Stolperfallen: Unterzeile des Urteils bei `top: 890` (sonst überdeckt sie den Stempel); Startnummern mit dem Prop `flip` gegen Spiegelung schützen; lange Kassenbonzeilen laufen über; in zsh Globs quotieren (`--include='*.ts'`).
- `output/` ist per `.gitignore` ausgeschlossen (große Videos, Audio). **Darum stehen Stand und Entscheidungen jedes Videos in `output/<slug>/STATUS.md` und zusätzlich kurz in Abschnitt 7.** Das Repo ist öffentlich: keine privaten Daten in versionierte Dateien.

## 6. Was wir gelernt haben
- **Analyse 19.11.:** Etwa 50 % springen in den ersten 5 s ab, kaum Follower.
- **Analyse 23.11.:**
  - Mit Ergebnis-Hook blieben nach 5 s noch 59–63 %.
  - Supernatural 1 hatte 52K Aufrufe, Charlie 30K, Breaking Bad 4,1K, Supernatural 2 3,1K.
  - Kanal: 134 Follower, 98,8K Aufrufe in 7 Tagen, 735 Profilaufrufe.
  - Die Mitte verliert stark (bei 30 s sind noch 30–35 % dabei), nur 3 % sehen bis zum Ende.
- **Analyse 26.11.** (7 Tage: 108K Aufrufe, davon ~66K allein am 19.11.; 149 Follower, seit 23.11. nur +15):

  | Video | Aufrufe | nach 2 s | nach 5 s | nach 30 s | Ø Sehdauer | ganz gesehen | neue Follower |
  |---|---|---|---|---|---|---|---|
  | Roadtrip (Referenz) | 53K | – | ~50 % | – | 32,4 s | 6,5 % | 107 |
  | SN Knast | 3,9K | – | 63 % (23.11.) | – | 24,0 s | 2,8 % | 6 |
  | Penny | 1,3K | 68 % | 47 % | 28 % | 21,8 s | 3,6 % | 2 |
  | Professor | 1,3K | 60 % | 44 % | 26 % | 19,2 s | 3,1 % | 2 |
  | Squid Game | 0,7K | 67 % | 53 % | 26 % | 19,3 s | 2,5 % | 1 |
  | GoT | 0,7K | 62 % | **31 %** | 12 % | 11,7 s | 1,7 % | 1 |

  Folgerungen:
  - Der 19.11. war ein Ausreißer; 1K Aufrufe sind der normale Sockel.
  - Neue Videos werden kürzer angesehen (19–22 s statt 32 s).
  - Frage-Hooks ohne sichtbare Zahl halten nach 5 s schlechter als die Ergebnis-Hooks vom 23.11. (44–53 % statt 59–63 %).
  - Beim GoT-Video brach der Einstieg ein: „So viele Ziegen?!“ ohne Zahl im Bild, Tippfehler „Ziehen“ in der Caption, Thema ohne Fanbase-Bezug für Nicht-Kenner.
  - Vier Videos in drei Tagen.
- Danach hat der Nutzer die Hook-Regel festgelegt: Frage statt Antwort (Regel 2/3).
- Videos mit eigener Rechnung (Roadtrip, Fässer) laufen gut. TikTok hat Videos wegen Originalität geboostet.
- **Fehler, die nicht wieder passieren dürfen:**
  - Ersatztier, weil es dafür Daten gab (Schaf statt Ziege).
  - Einen Einzelfall-Fakt aufs Ganze angewendet (dreifacher Schadenersatz).
  - Schlusssatz widerspricht der Rechnung.
  - Annahme nicht ausgesprochen.
  - Schildrechnung mit gerundeten Werten geht nicht auf.

## 7. Videos (Serien-Format)
Spalte „Gepostet“: Datum und Aufrufe laut TikTok Studio (Stand 26.11.2026). Zusätzlich gepostet: ein HIMYM-Video „Ted, Marshall & Co. sitzen fast jeden Abend …“ (17./18.11.). Die privaten „Folge 1–7 Die Reise“ (Weltall) stammen vom alten Konto.

| Slug | Serie | Thema / Hook | Länge | Gepostet |
|---|---|---|---|---|
| spn-roadtrip | Supernatural | Wer zahlt Sam und Deans Roadtrip? | 81,1 s | ja 19.11. (53K) |
| taahm-charlie | Two and a Half Men | Was kostet Charlies Leben pro Jahr? | 76,2 s | ja 18.11. (30K) |
| bb-faesser | Breaking Bad | Passen 11 Mio. $ in ein Fass? Welche Scheine bräuchte Walt? | 83,7 s | ja 20.11. (4,1K) |
| spn-knast | Supernatural 2 | Wie lange müssten Sam und Dean in den Knast? | 71,8 s | ja 22.11. (3,9K) |
| dexter-boot | Dexter | Reicht das Gehalt für Wohnung am Wasser und Boot? | 75,9 s | ja 19.11. (5,8K) |
| himym-vodka | HIMYM | Was kostet Barneys Drink-Plan? | 79,4 s | ja 17.11. (2,1K) |
| himym-wohnung | HIMYM | Ted und Marshalls Wohnung | – (nur Kontaktbogen) | nein |
| tbbt-penny | The Big Bang Theory | Kann Penny sich Pasadena leisten? (Frage-Hook per Snippet q-tbbt) | 68,2 s | ja 23.11. (1,3K) |
| sg-leben | Squid Game | Was ist ein Leben wert? (Frage-Hook q-sg) | 62,7 s | ja 24.11. (0,7K) |
| mh-druck | Haus des Geldes 1 | Geht der Plan des Professors auf? (q-mh) | 66,2 s | ja 23.11. (1,3K) |
| pb-tattoo | Prison Break | Tattoo in 3 Wochen weglasern? (q-pb) | 61,2 s | verworfen 26.11. (nicht zeitlos) |
| mh-gold | Haus des Geldes 2 | 90 Tonnen Gold: Wie viel ist das? | 65,4 s | verworfen 26.11. (nicht zeitlos) |
| got-drache | Game of Thrones | So viele Ziegen frisst ein Drache?! Kosten pro Jahr | 84,7 s | ja 25.11. (0,7K) |

Bei tbbt-penny, sg-leben, mh-druck und pb-tattoo wurde der Hook nachträglich per Audio-Splice durch eine Frage ersetzt. Ihre `hooks.txt` zeigt noch den alten Hook.

**got-drache** ist die dritte Fassung (`*.v1.*` = Schafe, `*.v2.*` = falsche Logik; nur `video.mp4` hochladen). Die Rechnung:
- Elefantengroßer Drogon: rund 5,8 Ziegen pro Tag, 2.111 im Jahr.
- Bei 3 Drachen rund 6.300 Ziegen, bei 200 € je Ziege rund 1,3 Mio. € pro Jahr.
- Nur bei ständiger Selbstbedienung mit dreifacher Entschädigung: rund 3,8 Mio. €.

Unsicher bleibt der Ziegenpreis (Hofladenpreis eines einzelnen Hofs) und der Kalorienwert (nur über eine Zweitquelle belegt). Optional: Den Wal-Teil (etwa 67–73 s) per Schnitt entfernen.

Ältere Ordner im **Slide-Format** (`air-berlin`, `check24`, `discounter`, `doener`, `kinoticket`, `lego-*`, `netflix-*`, `ryanair`, `schlecker`, `vinted`) gehören zu einem früheren Erklär-Format (Übersicht in `output/GEGENCHECK.md`).

## 8. Offen
- Neuer Kanalname (siehe Abschnitt 1).
- Kooperations-Mediamappe: bauen, sobald neuer Name, Kooperations-E-Mail (nicht die private) sowie Follower- und Aufrufzahlen da sind. Werbung muss gekennzeichnet werden. Preise nicht öffentlich nennen (interne Orientierung: Integration etwa 10–25 € pro 1.000 erwartete Aufrufe, eigenes Erklärvideo ab etwa 400–1.000 €).
- Monetarisierung: Creator Rewards ab 10.000 Follower. Finanzguru-Partnerprogramm erst mit mehr Reichweite.
- Themenideen (Vorschläge 26.11., noch nicht entschieden):
  - HIMYM: Wie lange dauert Teds Geschichte wirklich?
  - HIMYM: Marshalls Jura-Kredit
  - HIMYM: Barneys Anzüge
  - Gilmore Girls: Kaffeekonsum
  - Stranger Things: Joyces Lichterketten
  - Friends: Rechnung im Central Perk
  - Grey's Anatomy: Katastrophen-Schadenersatz
  - The Office: Kosten von Jims Streichen
  - Suits: Strafe für Mike Ross in Deutschland
  - Bereits gemacht bei HIMYM: Barneys Drink-Plan, Abende in der Bar, Wohnung (nur Kontaktbogen).
