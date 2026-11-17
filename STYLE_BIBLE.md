# Style Bible: nachgerechnet

Gilt für JEDES Video, egal welche Serie. Pro Serie ändern sich nur Palette, Schauplätze und Requisiten (`styles/<serie>.json`).

Format: 1080×1920, 30 fps, 60–90 s, deutsche Erzählerstimme, gebaut mit Remotion. Kanal: Finanzen von Film- und Serienfiguren nachrechnen. Ton: locker, witzig, wie ein Kumpel, der zufällig BWL studiert.

---

## B0. Referenz-Analyse (`reference/referenz.mp4`, 62,6 s, nicht im Repo)

Das Video eines anderen Creators (Thema Gebäudereinigung, Fakten + Mindestlohn-Rechnung). Es setzt die Qualitätsmarke. Übernommen wird **Machart und Niveau**, nichts Wiedererkennbares: nicht seine Figur, nicht sein Badge, nicht seine Karten-Layouts 1:1.

**Was es gut macht:**
1. **Jede Szene füllt den ganzen Bildschirm.** Raum mit Fenstern, Boden, Pflanze, Schreibtisch; nie ein leeres Feld mit Mini-Element. Selbst Datenszenen (Punkte-Raster auf Dunkelblau) haben einen vollflächigen Hintergrund.
2. **Konsistenter, einfacher Cartoon-Stil.** Flache Vektorformen, durchgehend dünne dunkle Konturen, große Köpfe, ausdrucksstarke Augen/Brauen, immer dieselbe Figur in wechselnden Posen und Räumen. Wirkt gebaut, nicht zusammengesucht.
3. **Alles dient dem gesprochenen Satz.** Gut alle 2 s ein neues Bild (31 Standbilder in 62 s, kaum eins gleicht dem Vorgänger). Requisiten illustrieren Wörter direkt: Uhr „08:00“, Urinale bei „Herrentoilette“, Tassenturm bei „Teeküche“, Vogel am Fenster.
4. **Zahlen werden „anfassbar“.** Ein Raster aus Personen-Icons (1 Icon = Menge), Podium mit Rang 1–3, Zettel „Mindestlohn“ mit Positionen, die nacheinander erscheinen und aufleuchten, Konfetti/Münzen bei der Pointe.
5. **Wiedererkennbares Fakt-System.** Eine „FAKT“-Karte mit großer Zahl, einer Zeile Erklärung und Quellenangabe, dazu ein Kreis-Badge der Hauptfigur unten links, die live reagiert. Untertitel: 1 Wort gleichzeitig, riesig, weiß mit dicker dunkler Kontur, im unteren Drittel.

**Was wir anders machen (eigene Optik):** keine wiederkehrende Hauptfigur, sondern die Serienfiguren als Darsteller; eigene Signaturfarbe, eigenes Fakt-Karten- und Untertitel-Design, Stempel-Urteil als Signatur, eigener Serien-Look pro Video.

---

## B1. Zeichenstil
- Flacher 2D-Vektor-Cartoon, saubere, leicht abgerundete Formen, höchstens dezente Schatten.
- **Einheitliche Linienlogik: durchgehend dünne dunkle Konturen. Nie mischen.**
- Figuren: großer Kopf (ca. ¼ der Körperhöhe), ausdrucksstarke Augen und Augenbrauen, einfache Körper.
- Jede Serienfigur als zerlegbares SVG-Rig: Kopf, Augen, Brauen, mind. 5 Mundformen, Oberkörper, Ober-/Unterarme, Hände, Beine; mind. 6 Gesichtsausdrücke: neutral, freudig, geschockt, skeptisch, genervt, nachdenklich.
- Wiederverwendbare Asset-Bibliothek in `assets/` (Figuren, Möbel, Gebäude, Gegenstände, Geld, Icons). Sie entscheidet, ob es billig wirkt.

## B2. Figuren: die Serienfiguren sind die Darsteller
- Es gibt **keine eigene Erzählerfigur und kein Maskottchen.** Der Erzähler ist nur die Stimme aus dem Off.
- Die Szene zeigt immer, **worüber gerade gesprochen wird**, mit den Serienfiguren als Darstellern. Kaufen sich Ted und Marshall ein Bier, sieht man genau das; wird die Miete gezahlt, sieht man Geld über den Tisch gehen.
- Serienfiguren werden nachgezeichnet, als Cartoon-Karikatur im eigenen Zeichenstil, erkennbar an Frisur, Gesichtszügen und ikonischen Outfits.
- Wer gemeint ist, sagen Stimme und Untertitel.
- Figuren sprechen nicht (keine Lippensynchronität nötig); sie agieren und reagieren mit Pose, Gesichtsausdruck und Requisiten.

## B3. Wiedererkennung des Kanals (ohne Figur)
Was in **jedem** Video gleich ist:
- **Signaturfarbe** (Schlüsselwörter in den Untertiteln, Zahlen, Label-Sticker; Standard Signal-Gelb `#FFD23F`, in `config.json`).
- **Fakt-Karten-Design** (dunkle Karte, versetzter Signatur-Schatten, „FAKT“-Sticker).
- **Untertitel-Design** (B7).
- **Urteil-Stempel** („REALISTISCH“ / „KNAPP“ / „UNMÖGLICH“) mit Sound-Logo.
- **Sound-Logo** (Stempel-Schlag + kurzer Akzent).
- **Hook:** Die Hook-Frage erscheint in den ersten 1,5 s als große Schrift über der Szene (Serienfiguren in Aktion).
- **Endcard (letzte 2 s):** „Welche Serie als Nächstes? 👇“ + Kanalname.

## B4. Ganzer Bildschirm
- Jede Szene bildfüllend bis zum Rand; nie leerer Einfarb-Hintergrund mit kleinem Element in der Mitte.
- 3 Ebenen: Hintergrund (Raum, Stadt, Himmel) · Mittelgrund (Figuren, Möbel) · Vordergrund (angeschnittene Objekte nah an der Kamera, für Tiefe).
- Hauptelement mind. 60 % der Bildhöhe; Zahlen und Fakt-Karten mind. 70 % der Bildbreite.
- Sicherheitszone: oben 250 px, unten 400 px, rechts 150 px frei für Text und wichtige Elemente. Hintergründe laufen trotzdem bis zum Rand.

## B5. Szenentypen (je eine Remotion-Komponente, mind. 5 verschiedene pro Video)
1. **Schauplatz:** bildfüllender Ort, Figur agiert darin
2. **Fakt-Karte:** Label „FAKT“, riesige Zahl, eine Zeile Erklärung, Quelle klein
3. **Rechnung:** Kassenbon oder Tafel, Positionen erscheinen nacheinander, Summe zählt hoch, Minus rot
4. **Datengrafik:** Punkte-Raster, Balken, Podium, Waage, Geldstapel, Mengen zum Anfassen (1 Punkt = 1.000 €)
5. **Vergleich:** Split-Screen, z. B. Gehalt vs. Miete, Balken wachsen gegeneinander
6. **Karte/Grundriss:** Stadtkarte mit Zoom auf den Stadtteil oder Grundriss mit m²
7. **Urteil:** Stempel knallt ins Bild (Schütteln, Blitz, Sound-Logo), die Serienfiguren reagieren darunter

## B6. Bewegung
- Spätestens alle 2–3 s Szenenwechsel oder deutliche neue Bewegung.
- Leichter Kamera-Push-in (100 → 106 %) und Parallaxe zwischen den Ebenen auf jeder Szene.
- Figuren immer mit Idle-Animation (Atmen, Blinzeln alle 2–4 s) und Gesten passend zum Text.
- Animationen sind auf die Wort-Zeitstempel getaktet: Ein Objekt erscheint genau bei dem Wort, das es illustriert.
- Elemente erscheinen mit Federung (Overshoot), Zahlen zählen hoch.
- Übergänge: Wischen, Zoom-durch, Match-Cut auf Objekte; keine Standard-Überblendungen.
- Kleine Effekte bei Pointen: Funkeln, Schweißtropfen, Bewegungslinien.

## B7. Untertitel
- 1–3 Wörter gleichzeitig, groß und fett, mittig im unteren Drittel, weiß mit dunkler Kontur und Schatten.
- Schlüsselwörter und Zahlen in der Signaturfarbe, Wort für Wort synchron, kurzes „Pop“ beim Erscheinen.

## B8. Serien-Look
- Pro Serie eine Palette und Schauplätze in `styles/<serie>.json`, passend zur Stimmung (HIMYM: warme Bar- und Manhattan-Abendtöne).
- Die Serie bestimmt Hintergründe und allgemeine Requisiten. Erzähler, Untertitel, Fakt-Karten und Stempel bleiben immer gleich.
- Keine Logos, Clips, Screenshots, Titelsongs; Nachbildung von Original-Figuren ist erlaubt (B2).

## B9. Ton
- Feste lizenzfreie Sound-Effekte in `assets/sfx/`: Pop, Zählgeräusch, Kassenbon-Druck, Stempel als Sound-Logo.
- Keine Musik im Video (kommt in TikTok dazu).

## B10. Qualitätskontrolle (Pflicht vor jedem finalen Render)
- Aus jeder Szene ein Standbild rendern, als Kontaktbogen speichern (`output/<slug>/contact_sheet.png`) und mit den Referenz-Standbildern vergleichen.
- Ehrlich prüfen: bildfüllend? Leere Flächen? Wirkt etwas wie Clipart oder Platzhalter? Text in der Sicherheitszone? Zeigt jede Szene das, worüber gerade gesprochen wird? Alles, was billiger wirkt als die Referenz, überarbeiten.
- Untertitel und Animationen synchron zur Stimme?
- Jede Zahl gegen `research.md` prüfen.

---

## Pipeline-Regeln

**Recherche (A1):** Serien-Fakten aus Fandom-Wikis mit Staffel/Folge; echte Daten (Mieten Stadtteil+Jahr, Gehälter, Inflation, Wechselkurse) aus offiziellen/seriösen Quellen. Alles in `output/<slug>/research.md` mit Link und Stand, klar getrennt in **Serien-Fakt / echte Daten / Schätzung**. Nie Fakten oder Zahlen erfinden.

**Skript (A2):** 150–220 Wörter, gesprochene Sprache, kurze Sätze, gerundete Zahlen, Schätzungen benennen. Aufbau: Hook (2 s) → was die Serie zeigt → reale Kosten → Verdienst der Figuren → Rechnung → Urteil → Twist/Erklärung → „Welche Serie soll ich als Nächstes durchrechnen?“. Anspielungen auf die Erzählweise erlaubt, keine längeren Originalzitate. 3 Hook-Varianten in `hooks.txt`, `script.md` mit Szenen-Markierungen.

**Stimme (A3):** ElevenLabs, Key aus `.env` (`ELEVENLABS_API_KEY`), Voice-ID in `config.json`, Wort-Zeitstempel für Untertitel und Animationen. Erzählweise lebendig, nicht monoton (`eleven_v4` mit Regieanweisungen).

## Output pro Video
`output/<slug>/`: `video.mp4`, `script.md`, `hooks.txt`, `research.md`, `contact_sheet.png`, `caption.txt` (Caption + 3–5 Hashtags + Hinweis „Stimme KI-generiert“).
