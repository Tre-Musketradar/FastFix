# Att diskutera på gruppmötet

Förslag som gruppen behöver ta ställning till inför läxan till pass 4 (onsdag 2026-10-21) och sprint planning måndag 2026-10-26. Inget här gäller förrän vi är överens. Det vi bestämmer flyttas sedan till rätt dokument (gruppkontraktet, beslutsloggen eller CONTRIBUTING), och punkten stryks här.

## 1. Läxan till pass 4: vad saknas?

Från [`resurser/Laxa/00-läxa_2.md`](resurser/Laxa/00-läxa_2.md):

| Uppgift | Status | Vad som saknas |
|---|---|---|
| `main` är skyddad | ✅ Klart | |
| PR-mallen stämmer med DoD | ❌ | Mallen saknar DoD-punkt 3 (granskad och godkänd) och 7 (kortet i Klart) |
| Projektskelettet startar hos alla | ⚠️ Delvis | Läxan kräver en **testendpoint**: frontend anropar backend, och backend läser från databasen. Nu svarar backend 401 på allt |
| Alla har öppnat en PR | ⚠️ | Martin har inte öppnat någon PR än |
| Alla har granskat en annans PR | ✅ Klart | |
| "Kod och kvalitet" i gruppkontraktet | ⚠️ Delvis | Se punkt 2 nedan |
| Minst ett nytt beslut i beslutsloggen | ✅ Klart (#6, #7) | Läraren föreslår också merge-strategi och grennamn, se punkt 3 |
| Databasschemat klart (senast måndag) | ✅ Klart | |

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

**Förslag:** bygg story 1 (Logga in med roll) tillsammans under de första dagarna i Sprint 1.

## 7. Inloggning (U1): tre öppna frågor

Måste vara bestämt innan story 1 börjar. Beslutet skrivs in i beslutsloggen som #8.

| Fråga | Förslag | Alternativ |
|---|---|---|
| Var sparar frontend token? | `localStorage` och skickas som `Authorization: Bearer` | httpOnly-cookie (säkrare mot XSS, men krångligare med CORS och CSRF) |
| Hur kontrollerar backend token? | Spring OAuth2 Resource Server med HS256 (redan installerat) | `jjwt` och ett eget filter |
| Hur skapas användarna? | Testanvändare via Flyway `V2__seed.sql`, en per roll | En endpoint för registrering |

## 8. Om två nya personer börjar i gruppen

- **Introduktion:** de läser [introduktionen](introduktion.md) och startar projektet enligt README.
- **Åtkomst:** inbjudan till organisationen Tre-Musketradar och boarden.
- **Gruppkontraktet:** de läser det och skriver under. Avsnittet om beslut säger "vi är tre, så det blir alltid en majoritet" och behöver skrivas om. Vad gäller om det blir lika vid en omröstning, till exempel när någon är borta?
- **Fokusområden:** projektförslaget har tre (användare och säkerhet, ärenden i API:t, frontend). Hur fördelar vi med fem?
- **Scrum Master** roterar varje vecka. Ny ordning med fem personer?
- **Första uppgift:** en liten PR (till exempel sitt namn i README och gruppkontraktet) och en granskning, precis som läxan kräver av alla.
- **README:** lägg till dem i tabellen "Teamet".

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-20 | Första versionen |
