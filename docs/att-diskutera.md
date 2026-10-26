# Att diskutera på gruppmötet

Förslag som gruppen behöver ta ställning till inför sprint planning måndag 2026-10-26, då Sprint 1 börjar. Inget här gäller förrän vi är överens. Det vi bestämmer flyttas sedan till rätt dokument (gruppkontraktet, beslutsloggen eller CONTRIBUTING), och punkten stryks här.

## 1. Läxorna: vad saknas?

### Läxan till pass 4 ([`00-läxa_2.md`](resurser/Laxa/00-läxa_2.md))

Allt här ska vara klart innan Sprint 1 börjar.

| Uppgift | Status | Vad som saknas |
|---|---|---|
| `main` är skyddad | ✅ Klart | |
| PR-mallen stämmer med DoD | ✅ Klart | Alla sju DoD-punkter finns i mallen, i samma ordning (2026-10-23) |
| Projektskelettet startar hos alla | ✅ Klart | Testendpoint `GET /api/ping`: startsidan anropar backend, som läser från databasen (2026-10-24). Alla behöver fortfarande testa att starta projektet hos sig |
| Alla har öppnat en PR | ⚠️ | Martin har inte öppnat någon PR än |
| Alla har granskat en annans PR | ✅ Klart | |
| "Kod och kvalitet" i gruppkontraktet | ⚠️ Delvis | Se punkt 2 nedan |
| Minst ett nytt beslut i beslutsloggen | ✅ Klart (#6, #7) | Läraren föreslår också merge-strategi och grennamn, se punkt 3 |
| Databasschemat klart (senast måndag) | ✅ Klart | |

### Läxan till måndag 2026-10-26 ([`00-läxa_3.md`](resurser/Laxa/00-läxa_3.md))

Läs först [`01-sprintrytmen.md`](resurser/01-sprintrytmen.md), [`02-sprint-planning.md`](resurser/02-sprint-planning.md) och [`03-infor-review.md`](resurser/03-infor-review.md). Läs sedan [`04-git-rutiner.md`](resurser/04-git-rutiner.md) och [`05-konflikter-forebygga-och-losa.md`](resurser/05-konflikter-forebygga-och-losa.md) ordentligt. Ha [`06-nar-det-gar-fel.md`](resurser/06-nar-det-gar-fel.md) som uppslag.

| Uppgift | Status | Vad som saknas |
|---|---|---|
| Allt från läxan till pass 4 är klart | ⚠️ | Se tabellen ovan |
| Alla kan starta projektet enligt README | ⚠️ | Läxan säger `git switch main && git pull`, men `main` ligger efter `staging` (biblioteken, kursmaterialet, gruppkontraktet). Release-PR `staging → main` öppnad 2026-10-23. Se punkt 9 |
| De översta korten i backloggen är redo | ✅ Klart | Alla stories har acceptanskriterier och storlek, ingen är XL |
| Första storyn att bygga tillsammans är vald | ❌ | Se punkt 6 |
| Product Owner och Scrum Master för Sprint 1 | ❌ | Se punkt 10 |
| Gruppkontraktet säger när vi har standup och vem som loggar | ❌ | Se punkt 11 |

## 2. Gruppkontraktet: "Kod och kvalitet"

Läxan ställer fyra frågor. Vi har svarat på den första (granskning samma dag om PR:en öppnas före kl. 12). Förslag på resten:

### Hur stor får en PR vara?

En PR ska gå att granska ordentligt. Lärarens material säger att en PR helst handlar om **ett** kort och går att granska på 10–15 minuter. Med 40 ändrade filer läser ingen koden, man klickar bara på Approve.

**Förslag:**

> En pull request handlar om ett kort och ska gå att granska på cirka 15 minuter, ungefär 400 ändrade rader eller mindre (genererade filer som `package-lock.json` räknas inte). Blir en story större delar vi upp den i flera PR:er som var och en fungerar för sig.

Exempel på hur story 1 (Logga in med roll) kan delas upp:

1. Backend: endpoint för inloggning och testanvändare
2. Frontend: inloggningssida och AuthContext
3. Skyddade sidor per roll

### Hur namnger vi grenar?

**Förslag:** `typ/issuenummer-kort-beskrivning`, utan å, ä och ö.

| Typ | Används för | Exempel |
|---|---|---|
| `feature/` | User stories | `feature/6-logga-in` |
| `fix/` | Buggar | `fix/40-datum-forsvinner` |
| `chore/` | Tekniska uppgifter och uppsättning | `chore/10-projektskelett` |
| `docs/` | Dokumentation | `docs/sprint-1-retro` |

### Hur skriver vi commit-meddelanden?

**Förslag:**

- På engelska (står redan i kontraktet), i imperativ: "Add login form", inte "Added login form" eller "fixes".
- Första raden är max cirka 70 tecken och säger **vad** som ändrats. Behövs det, skriv **varför** på raderna under.
- En commit gör en sak. Committa när något fungerar, inte när dagen är slut.

### Vem mergar?

**Förslag:** den som skrev koden mergar, efter att ha fått godkännande. Då vet författaren när ändringen kommer in och kan kontrollera att allt fungerar efteråt. Det är också så läraren föreslår.

## 3. Nya beslut till beslutsloggen

### Merge-strategi

GitHub erbjuder tre sätt. Nu är alla tre tillåtna i repot.

| Alternativ | Vad händer |
|---|---|
| Create a merge commit | Alla commits från grenen kommer med, plus en merge-commit |
| **Squash and merge** | Alla commits slås ihop till en enda commit per PR |
| Rebase and merge | Commits läggs på rad efter varandra |

**Förslag:** Squash and merge för PR:er till `staging`, så att varje PR blir en commit och historiken blir lätt att läsa. Läraren rekommenderar det. För `staging → main` använder vi merge commit, annars skiljer sig historiken i `staging` och `main` åt och nästa release-PR får konflikter. Vi stänger av "Rebase and merge" i repot.

### Mappstruktur: efter funktion, inte efter lager

Lärarens material ([`07-projektstruktur-och-konflikter.md`](resurser/07-projektstruktur-och-konflikter.md)) visar att struktur efter funktion ger färre konflikter, eftersom varje story mest rör sin egen mapp.

**Förslag:**

```
frontend/src/                       backend/src/main/java/se/felanmalan/
  features/                           auth/
    auth/                             properties/
    properties/                       tickets/
    tickets/                            TicketController.java
      TicketList.tsx                    TicketService.java
      TicketForm.tsx                    TicketRepository.java
      ticketsApi.ts                     Ticket.java
  shared/                             shared/
    apiClient.ts
    Layout.tsx
```

Det behöver bestämmas innan någon skapar mappstrukturen, eftersom det är svårt att ändra efteråt.

### Grennamn

Se punkt 2. Kan skrivas in som beslut i stället för, eller utöver, gruppkontraktet.

## 4. Tre bibliotek från PR #32

Ermias lade till tre bibliotek i tabellen i beslut #7, men kolumnen "Beslut" är tom.

| Bibliotek | Vad det gör | Förslag |
|---|---|---|
| `react-error-boundary` | Fångar fel i en komponent och visar ett felmeddelande i stället för en tom sida | Ja |
| `react-spinners` | Färdiga laddningsanimationer | Kanske. En enkel spinner går att göra med Tailwind (`animate-spin`) utan nytt bibliotek |
| `react-native-restart` | Startar om en React Native-app | **Nej.** Det är för mobilappar och fungerar inte i en webbapp. Att sidan laddas om när man sparar gör Vite redan |

## 5. Gemensamma konventioner

- **`.editorconfig`:** en fil som säger åt alla editorer (VS Code, IntelliJ) att använda samma indentering och radslut. Tillsammans med Prettier slipper vi att hela filer formateras om och ger konflikter. **Förslag:** lägg till den.
- **Konflikt i `package-lock.json`:** lös den inte för hand. Ta versionen från `staging` och kör `npm install` igen. **Förslag:** skriv in det i CONTRIBUTING.
- **Repoinställningar:** **förslag** att slå på "Automatically delete head branches" (grenen tas bort när PR:en mergas) och "Dismiss stale approvals" (om man pushar efter godkännandet måste det granskas igen).

## 6. Första storyn tillsammans

Läraren föreslår att bygga den första vertikala storyn **tillsammans**, antingen alla vid samma skärm (mobbprogrammering) eller i par. Då blir den mallen för hur alla andra stories byggs: hur en komponent ser ut, hur vi anropar API:t, hur en endpoint ser ut, hur vi hanterar fel.

Läxan till måndag kräver att vi väljer storyn. Den ska gå genom alla lager men inte vara för stor.

**Förslag:** story 1 (Logga in med roll), eftersom alla andra stories behöver inloggning och den sätter mönstret för både frontend och backend. Den är L, så vi kan dela upp den (se punkt 2) eller bygga den i två par: ett par på backend (endpoint, JWT, testanvändare) och ett på frontend (inloggningssida, AuthContext, skyddade sidor).

**Alternativ:** story 2 (Lägga till fastighet), M. Mindre, men då behöver vi en tillfällig lösning för inloggningen.

## 7. Inloggning (U1): tre öppna frågor

Måste vara bestämt innan story 1 börjar. Beslutet skrivs in i beslutsloggen som #8.

| Fråga | Förslag | Alternativ |
|---|---|---|
| Var sparar frontend token? | `localStorage` och skickas som `Authorization: Bearer` | httpOnly-cookie (säkrare mot XSS, men krångligare med CORS och CSRF) |
| Hur kontrollerar backend token? | Spring OAuth2 Resource Server med HS256 (redan installerat) | `jjwt` och ett eget filter |
| Hur skapas användarna? | Testanvändare via Flyway `V2__seed.sql`, en per roll | En endpoint för registrering |

## 8. Om två nya personer börjar i gruppen

Stryks. De två går inte med i gruppen (besked 2026-10-26). Vi fortsätter som tre.

## 9. Hur kommer koden till `main`?

Lärarens material utgår från att alla jobbar mot `main`. Vi jobbar mot `staging` och för över till `main` med en PR `staging → main`. Två saker följer av det:

- **Läxan:** alla ska kunna köra `git switch main && git pull` och starta projektet. Då måste `staging` föras över till `main` före måndag.
- **Reviewn:** demot visar det som finns i `main`. Det som bara finns i `staging` räknas inte som klart.

**Förslag:** en PR `staging → main` varje fredag (och när det behövs inför reviewn), när `staging` fungerar. Scrum Master ser till att den görs. Demot testas från en uppdaterad `main` senast söndag kväll.

## 10. Roller i Sprint 1

| Roll | Ansvar |
|---|---|
| **Product Owner** | Ser till att backloggen är prioriterad och att de översta korten är redo. Leder sprint planning. Svarar på frågor om vad en story betyder. |
| **Scrum Master** | Håller tiden på måndagens möten (review ca 20 min, retro 15–20 min, planning 30–45 min). Leder standup och loggar den. Leder retron. Ser till att hinder tas om hand. |

Alla, även PO och SM, bygger, granskar och testar.

**Att bestämma:** vem som är PO och vem som är SM i Sprint 1. Gruppkontraktet säger att Scrum Master roterar varje vecka. Ska PO också rotera? Läraren tycker att det är bra att prova olika roller, det ger mer att skriva om i reflektionen.

## 11. Daily standup

Läxan kräver att gruppkontraktet säger **när** vi har standup och att **Scrum Master loggar den**.

Enligt läraren: max 15 minuter, samma tid varje dag tisdag–fredag. Var och en säger vad hen gjorde igår, vad hen ska göra idag och om något hindrar. **Säg också vilka filer eller delar av koden du ska ändra**, så att vi inte krockar. Bara Scrum Master skriver i `standup.md`, annars blir det en konflikt i filen nästan varje dag.

**Förslag till gruppkontraktet** (avsnittet "Närvaro och frånvaro"):

> - Daily standup hålls tisdag–fredag kl. ___ i ___ (Slack-huddle / på plats), max 15 minuter.
> - Scrum Master loggar standupen i sprintens `standup.md` direkt efter mötet. Ingen annan skriver i filen.
> - Den som inte kan vara med skriver sin rad (igår, idag, hinder) i Slack före standupen, så tar Scrum Master med den i loggen.

Den sista punkten ersätter "Den som missar daily standup skriver sin rad i sprintens `standup.md` samma dag", som krockar med att bara Scrum Master skriver i filen.

**Att bestämma:** tid och plats.

## 12. Sprint planning måndag: förslag

Läraren säger: ta hellre in för lite än för mycket i Sprint 1, och ha ungefär dubbelt så mycket redo som vi tror att vi hinner.

**Förslag på sprintmål:**

> En användare kan logga in med sin roll, och förvaltaren kan lägga till fastigheter och lägenheter som sparas i databasen.

**Förslag på kort**, i ordning:

| Kort | Storlek | Kommentar |
|---|---|---|
| U1 Inloggning med JWT (#9) | max ½ dag | Före story 1 |
| 1 Logga in med roll (#6) | L | Byggs tillsammans, se punkt 6. Rör `SecurityConfig`, Flyway `V2` (testanvändare), routern |
| 2 Lägga till fastighet (#11) | M | Efter story 1 |
| 3 Lägga till lägenheter (#12) | M | Efter story 2, samma del av koden |
| 4 Lägga till hyresgäst (#13) | M | Reserv. Rör tabellen `users`, samma som story 1 |
| 5 Skapa felanmälan (#14) | M | Reserv |

Lärarens fråga för varje kort: **vilka filer rör det?** Kort som rör samma tabell eller samma knutpunkt (routern, `SecurityConfig`) görs inte samtidigt.

## 13. Fler rutiner från lärarens material

Från [`04-git-rutiner.md`](resurser/04-git-rutiner.md) och [`05-konflikter-forebygga-och-losa.md`](resurser/05-konflikter-forebygga-och-losa.md). **Förslag:** skriv in dem i CONTRIBUTING.

- **Databasschemat ändras av en person i taget.** Säg till på standupen. Efter varje merge som ändrar schemat: nollställ databasen lokalt (`docker compose down -v` och starta igen) och kontrollera att alla migrationer går igenom.
- **Två migrationer med samma nummer** (till exempel två `V3__...`): den som mergar sist döper om sin.
- **Konflikter löses lokalt**, inte i GitHubs webbredigerare, så att man kan testa appen innan man pushar.
- **Trasig `staging` eller `main`:** säg till direkt. Att laga den går före allt annat. Svåra fel ångras med **Revert** på den mergade PR:en.
- **Varje måndag efter planning:** alla hämtar senaste `staging`, sprintmappen skapas via en PR, gamla grenar tas bort och öppna PR:er från förra sprinten granskas eller stängs.
- **Kör en gång:** `git config --global pull.rebase false`, så att `git pull` inte frågar hur grenarna ska slås ihop.

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-20 | Första versionen |
| 2026-10-21 | La till läxan till måndag (`00-läxa_3.md`) och punkt 9–13: `staging → main`, roller, daily standup, förslag till sprint planning och rutiner från lärarens nya material. Uppdaterade punkt 6 |
| 2026-10-23 | PR-mallen stämmer nu med DoD. Release `staging → main` öppnad |
| 2026-10-24 | Testendpointen finns (`/api/ping`) |
| 2026-10-26 | Punkt 8 stryks: de två nya går inte med i gruppen |
