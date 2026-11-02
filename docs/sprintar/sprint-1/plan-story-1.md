# Plan: story 1 Logga in med roll (#6)

**Skriven:** 2026-10-30 av Jose (Product Owner sprint 1)
**Issues:** U1 [#9](https://github.com/Tre-Musketradar/FastFix/issues/9) (undersökningen) och story 1 [#6](https://github.com/Tre-Musketradar/FastFix/issues/6)
**Beslut:** [#8 i beslutsloggen](../../beslutslogg.md#8-inloggning-med-jwt)

Den här planen delar upp story 1 i sju små PR:er. U1 och story 1 är Joses: Jose gör alla PR:erna själv, och Martin och Ermias granskar dem. Alla andra stories bygger på inloggningen, så kontraktet och ordningen nedan är viktiga för hela gruppen.

Varför sju PR:er: storyn är stor (L) och vi har inte gjort JWT förut. Lärarens regel är att en PR ska gå att granska på 10–15 minuter och att en branch ska leva några timmar till några dagar ([03-pull-requests-och-kodgranskning](../../resurser/03-pull-requests-och-kodgranskning.md), [02-branches](../../resurser/02-branches.md), [04-git-rutiner](../../resurser/04-git-rutiner.md)). Varje PR nedan gör en sak, har egna tester och lämnar appen fungerande.

## Vad storyn ska klara

Från [user stories](../../user-stories.md#1-logga-in-med-roll--l-jose):

1. Det finns ett formulär med e-post och lösenord.
2. Efter inloggning visas startsidan för min roll.
3. Fel e-post eller lösenord ger ett felmeddelande som inte avslöjar vilket av dem som var fel.
4. Jag är fortfarande inloggad om jag laddar om sidan.
5. Jag kan logga ut, och då når jag inte längre sidorna som kräver inloggning.

## Besluten i korthet (U1)

| Fråga | Beslut |
|---|---|
| Var sparar frontend token? | I `localStorage`. Den skickas i headern `Authorization: Bearer <token>` |
| Hur kontrollerar backend token? | Spring OAuth2 Resource Server (redan installerat), signerat med HS256 och hemligheten `JWT_SECRET` |
| Var kommer användarna ifrån? | Flyway-migrationen `V2__seed.sql`: en användare per roll, lösenord `test1234` |
| Hur länge gäller token? | 8 timmar. Sedan måste man logga in igen (ingen refresh token) |

Varför vi valde så står i [beslut #8](../../beslutslogg.md#8-inloggning-med-jwt).

## Hur det hänger ihop

```
Inloggningssidan ──POST /api/auth/login {email, password}──▶ AuthController
                                                              │ kollar lösenordet (BCrypt)
                 ◀──────── {token, user} ─────────────────────┘ skapar JWT (JwtEncoder)
sparar token i localStorage

Alla andra anrop ──Authorization: Bearer <token>──▶ Spring Security (JwtDecoder)
                                                    kollar signatur och tid,
                                                    rollen blir ROLE_TENANT / ROLE_TECHNICIAN / ROLE_MANAGER
```

## API-kontraktet

Vi bestämmer kontraktet först. Då kan frontend börja direkt med `msw` (låtsas-API) medan backend byggs.

**`POST /api/auth/login`** (öppen)

```json
// Request
{ "email": "forvaltare@felanmalan.se", "password": "test1234" }

// 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": 1, "name": "Maria Lindqvist", "email": "forvaltare@felanmalan.se", "role": "MANAGER" }
}

// 401 Unauthorized, samma svar oavsett om e-posten eller lösenordet är fel
{ "message": "Fel e-post eller lösenord" }
```

**`GET /api/auth/me`** (kräver token): samma `user`-objekt som ovan. Frontend använder det efter omladdning för att kontrollera att token fortfarande gäller.

**Token (JWT)** innehåller: `sub` = användarens id, `email`, `name`, `role` och `exp` (8 timmar).

**Utloggning** sker bara i frontend: token tas bort ur `localStorage`. Backend sparar inga sessioner.

## PR:erna

Varje PR har en egen gren från `staging`, egna tester och en checklista i [Definition of Done](../../definition-of-done.md). Filerna läggs i mapparna för funktionen enligt [projektstruktur.md](../../projektstruktur.md) (beslut #9): inloggningen i `features/auth/` i frontend och i paketen `auth` och `user` i backend. Alla utom den sista skriver `Part of #6` i PR-texten, så att issuen inte stängs för tidigt.

### Backend

| PR | Gren | Innehåll | Tester och klart när |
|---|---|---|---|
| 1 | `feature/6-testanvandare` | `V2__seed.sql`: tre användare (`forvaltare@`, `tekniker@`, `hyresgast@felanmalan.se`, lösenord `test1234`), fastigheten Solrosen och lägenhet 1001 med hyresgästen. Samma namn och BCrypt-hash som i `db/testdata.sql`. Kontrollera att `testdata.sql` fortfarande går att köra (den börjar med `TRUNCATE`). README och `databas-och-docker.md`: inloggningarna finns direkt efter `docker compose up` | `docker compose up` på en tom databas ger tre användare. `./mvnw verify` grönt (Flyway kör V2 i testerna) |
| 2 | `feature/6-user-entitet` | `user/`: `User`-entitet med rollen som PostgreSQL-enum (beslut #7) och `UserRepository.findByEmail` | Test: hittar hyresgästen från V2, ger tomt svar för en okänd e-post |
| 3 | `feature/6-jwt-sakerhet` | `config/SecurityConfig`: `PasswordEncoder` (BCrypt), `JwtEncoder` och `JwtDecoder` med `JWT_SECRET` (HS256, 8 timmar), rollen från claimet `role` blir `ROLE_…`, stateless, CSRF av (vi använder inga cookies). Öppna: `/api/auth/login`, `/api/ping`, `/actuator/health`, Swagger. `auth/`: skapa token och `GET /api/auth/me` | Test: `/api/auth/me` utan token ger 401, med en token som testet skapar 200 och rätt användare. `/api/ping` är fortfarande öppen |
| 4 | `feature/6-login-endpoint` | `auth/`: `AuthService` + `POST /api/auth/login` enligt kontraktet | Test: rätt inloggning ger en token med rätt roll; fel lösenord och okänd e-post ger samma 401-svar |

PR 3 är den svåraste. Blir den större än 10–15 minuters granskning delas den: först `JwtEncoder`/`JwtDecoder` och `SecurityConfig`, sedan `/api/auth/me`.

### Frontend

| PR | Gren | Innehåll | Tester och klart när |
|---|---|---|---|
| 5 | `feature/6-auth-context` | `shared/types.ts` (`User`, `Role`), `shared/apiClient.ts` (en liten `fetch`-funktion som lägger till `Authorization` och tar bort token vid 401), `features/auth/AuthContext.tsx` (`user`, `login()`, `logout()`, läser token från `localStorage` vid start och frågar `/api/auth/me`), `features/auth/authApi.ts` och `msw`-handlers enligt kontraktet (`features/auth/authHandlers.ts`) | Test: `login()` sparar token; med token i `localStorage` blir man inloggad vid start (kriterium 4); `logout()` tar bort token |
| 6 | `feature/6-login-sida` | `features/auth/LoginPage.tsx` på `/login` enligt [mockupen](../../bilder/mockups/utkast/mockup-1-logga-in.png): React Hook Form + Zod (beslut #6), felmeddelandet "Fel e-post eller lösenord". `PingStatus` får ligga kvar på sidan | Test: tomma fält ger valideringsfel; fel lösenord ger felmeddelandet (kriterium 1 och 3) |
| 7 | `feature/6-skyddade-sidor` | React Router: `features/auth/RequireAuth.tsx` (skickar till `/login` om man inte är inloggad), en enkel `shared/Layout.tsx` med namnet och knappen Logga ut, och en startsida per roll på `/tickets` i `features/tickets/` (bara rubrik tills sprint 2: "Mina ärenden", "Mina uppdrag", "Öppna ärenden"). Ersätter Vite-startsidan i `App.tsx`, en rad per route | Test: rätt startsida efter inloggning; skyddad sida skickar till `/login`; utloggning (kriterium 2 och 5). Testet för hand nedan. **`Closes #6`** |

## Ordning

```
Kontraktet ─▶ PR 1 ─▶ PR 2 ─▶ PR 3 ─▶ PR 4 ──────────┐
                 └──▶ PR 5 ─▶ PR 6 ─▶ PR 7 ──────────┴─▶ Testa ihop ─▶ PR 7 mergas ─▶ Klart
```

1. **Kontraktet** är bestämt i den här planen. Ändras det säger Jose till på standupen, eftersom de andra storyerna använder det.
2. **En PR i taget per spår.** Varje PR bygger på den förra, så nästa gren skapas från `staging` när den förra är mergad (läraren: "Bygger ett kort på ett annat? Det första ska bli klart först"). Medan en backend-PR väntar på granskning kan Jose jobba på nästa frontend-PR, eftersom frontend använder `msw`.
3. **Granskning inom en arbetsdag** ([04-git-rutiner](../../resurser/04-git-rutiner.md)). Jose säger till på standupen vilken PR som väntar.
4. **Testa ihop** före PR 7: starta allt med `docker compose up --build` och logga in med alla tre rollerna mot den riktiga backenden.

Den gamla grenen `4-logga-in-med-roll-l` används inte (den har bara en gammal commit som redan finns i `staging`) och kan tas bort.

## Testa för hand (till PR 7 och reviewn)

1. `docker compose up --build`, öppna http://localhost:5173. Du hamnar på inloggningen.
2. Logga in som `hyresgast@felanmalan.se` / `test1234`. Du ser "Mina ärenden" och ditt namn.
3. Ladda om sidan (F5). Du är fortfarande inloggad.
4. Logga ut. Gå till http://localhost:5173/tickets. Du skickas till inloggningen.
5. Logga in med fel lösenord, och sedan med en e-post som inte finns. Båda ger "Fel e-post eller lösenord".
6. Gör samma sak med `tekniker@` och `forvaltare@`. Varje roll får sin egen startsida.

## Risker

- **Jose gör storyn ensam och har inte gjort JWT i Spring förut.** Därför den här planen och de små PR:erna. PR 3 är den svåraste. Fastnar Jose mer än en timme frågar hen i Slack.
- **Sju PR:er behöver sju granskningar.** Väntar en PR mer än en dag tar Jose upp det på standupen.
- **Sprinten tar slut.** Sprint 1 slutar söndag 2026-11-01. De PR:er som är mergade visas på reviewn, och resten tas med till sprint 2 på planningen 2026-11-02.
- **Testanvändarna i V2 har ett känt lösenord.** Innan deploy (T2) måste de tas bort eller få nya lösenord.
- **Token i `localStorage`** kan läsas av skadlig JavaScript (XSS). React skyddar mot det mesta, och vi använder aldrig `dangerouslySetInnerHTML`.
- **Utloggning är bara i frontend.** En token som har kopierats gäller tills den går ut (8 timmar). Det räcker för det här projektet.
- **#11 Lägga till fastighet (Martin) väntar på den här storyn.** Martin kan börja med #11 mot `msw` och kontraktet ovan, och koppla på inloggningen när PR 7 är mergad. Backend för #11 kan använda `ROLE_MANAGER` när PR 3 är mergad.
