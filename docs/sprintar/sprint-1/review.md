# Sprint review: sprint 1

<!--
  INSTRUKTION
  Del 1 fylls i INNAN reviewn, senast söndag kväll. Det är ert manus.
  Del 2 fylls i UNDER eller DIREKT EFTER reviewn.

  Reviewn med läraren är ungefär 20 minuter:
  - Sprintmål och vad som blev klart (2 min)
  - Demo av fungerande mjukvara (10 min)
  - Feedback och frågor (8 min)

  Visa bara stories som uppfyller Definition of Done. Halvfärdigt redovisas under "Blev inte klart".
  Demot ska köras på riktigt, inte med skärmdumpar. Testa det innan.
-->

**Datum:** måndag 2026-11-02 (del 1 klar senast söndag 2026-11-01 kväll)
**Deltagare:** Jose Muñoz, Martin Friis, Ermias Demessie

## Del 1: Förberedelse

### Sprintmål

> En användare kan logga in med sin roll, och förvaltaren kan lägga till fastigheter och lägenheter som sparas i databasen.

(Förslaget från [planning.md](planning.md). Planeringen fylldes aldrig i, så målet bekräftades inte formellt.)

**Uppnåddes sprintmålet?** Nej. Inloggningen är byggd och testad men inte mergad. Fastigheter och lägenheter är påbörjade.

### Blev klart

Inget kort uppfyller Definition of Done: inget är granskat och mergat i `staging`/`main`.

| Issue | Story | Visas av |
|---|---|---|
| – | – | – |

### Blev inte klart

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| #9 | U1: Inloggning med JWT | Beslut #8 skrivet (PR #47), väntar på granskning | Granskas och mergas först i sprint 2 |
| #6 | 1 Logga in med roll | Byggd i sju små PR:er (#49, #51–#56) med 25 backendtester och 24 frontendtester, CI grönt och manuellt test av alla acceptanskriterier. Ingen PR är granskad: vi planerade inte in tid för granskning, och de flesta PR:erna öppnades i slutet av veckan (2026-10-30 till 2026-11-01) | Granskas och mergas i ordning i sprint 2. Inget nytt arbete, bara granskning och små konflikter |
| #11 | 2 Lägga till fastighet | Påbörjad (gren `feature/lägg-till-fastighet`: entitet och repository). Väntade på inloggningen, eftersom en fastighet behöver en förvaltare | Fortsätter i sprint 2 |
| #13 | 4 Lägga till hyresgäst | Påbörjad enligt standupen, ingen kod pushad | Fortsätter i sprint 2, efter #12 |
| #12 | 3 Lägga till lägenheter | Inte påbörjad (ingen ansvarig) | Tas in i sprint 2 |

Klart men utanför storyerna: projektstrukturen (beslut #9, PR #50, godkänd), mockups för omröstning (PR #45, godkänd), testdata och instruktionsbok (PR #44, mergad).

### Demoplan

Inget är mergat, så det finns inget att visa från `main`. Vi visar inloggningen från grenen `feature/6-skyddade-sidor` som **pågående arbete**, inte som klart:

1. Förvaltaren Maria (`forvaltare@felanmalan.se`, `test1234`) loggar in och hamnar på "Öppna ärenden" med sitt namn och sin roll i menyn.
2. Hon laddar om sidan: hon är fortfarande inloggad. Hon loggar ut och kommer tillbaka till inloggningen.
3. Fel lösenord ger "Fel e-post eller lösenord". Tomma fält ger ett tydligt felmeddelande.
4. Hyresgästen Anna och teknikern Ali loggar in och får var sin startsida ("Mina ärenden", "Mina uppdrag").
5. Utan inloggning skickas man från `/tickets` till inloggningen, och API:t svarar 401.

Visas av: Jose. Antecknar feedback: <!-- bestäm på mötet -->

Starta från projektroten: `git switch feature/6-skyddade-sidor && docker compose up --build -V`.

### Frågor till läraren

- Sju små PR:er för en L-story, staplade på varandra: är det rätt storlek, eller hellre färre?
- Hur hinner vi granska när alla bygger? Ska granskning vara ett eget kort eller en fast tid varje dag?
- Får vi visa pågående arbete från en gren på reviewn, eller ska det alltid vara `main`?

## Del 2: Efter reviewn

### Feedback

> **Exempel:** Läraren frågade hur man vet vem som ska göra nästa disk. I deras kollektiv turas man om varje vecka i stället för att tilldela.

-
-

### Ändringar i backloggen

<!-- Nya stories, ändrad prioritet, stories som tagits bort. Länka issues. -->

> **Exempel:** Ny story #15 "Turordning per vecka" som Must. "Tilldela en syssla" (#5) sänks till Should.

-
