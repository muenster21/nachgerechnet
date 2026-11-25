# nachgerechnet: Kurzregeln für jede Sitzung

**Zuerst `UEBERGABE.md` lesen.** Dort stehen alle Regeln, Stimme, Ablauf, Videoliste und offene Punkte. Vor dem Ende jeder Sitzung `UEBERGABE.md` und `output/<slug>/STATUS.md` aktualisieren, dann committen und pushen.

Das Wichtigste in Kürze:
- Hook = schockierte Frage mit `[shocked]`. Antwort und Urteil erst am Ende. Video immer über 60 s, die Mitte straff. Keine Musik.
- Ende: „Folg mir für die nächste Rechnung. Was soll ich als Nächstes durchrechnen?“ (Snippet `output/_snippets/end2.mp3`)
- Thema muss echten Mehrwert haben, also nichts, was die Serie selbst auflöst.
- Text vor dem Vertonen vom Agenten `skript-pruefer` prüfen und vom Nutzer freigeben lassen. Kontaktbogen vor dem Render zeigen, außer der Nutzer sagt „ohne mich zu fragen“.
- Stimme Markus: voice_id `IeQubAjK1ujbppIdhJw4`, Modell `eleven_v4` über den ElevenLabs-Connector.
- Agenten: `rechercheur` (Recherche), `skript-pruefer` (Logik und Regeln), `bild-pruefer` (Kontaktbogen und Stichproben).
- Keine API-Keys, kein Referenzvideo und keine privaten Daten ins Repo (es ist öffentlich). Die private E-Mail-Adresse des Nutzers nie verwenden.
- Antworten auf Deutsch, in einfacher Sprache.
