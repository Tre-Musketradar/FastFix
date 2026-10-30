# Plan: story 1 Logga in med roll (#6)

**Skriven:** 2026-10-30 av Jose (Product Owner sprint 1)
**Issues:** U1 [#9](https://github.com/Tre-Musketradar/FastFix/issues/9) (undersökningen) och story 1 [#6](https://github.com/Tre-Musketradar/FastFix/issues/6)
**Beslut:** [#8 i beslutsloggen](../../beslutslogg.md#8-inloggning-med-jwt)

Den här planen delar upp story 1 i små uppgifter som vi kan göra parallellt eller i par. Vi bygger storyn tillsammans eftersom alla andra stories bygger på den.

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

## Uppgifter

Ansvariga är ett förslag. Vi bestämmer dem på standupen.

### Backend

| # | Uppgift | Förslag | Klart när |
|---|---|---|---|
| B1 | `V2__seed.sql`: tre användare (`forvaltare@`, `tekniker@`, `hyresgast@felanmalan.se`, lösenord `test1234`), fastigheten Solrosen och lägenhet 1001 med hyresgästen. Samma namn och BCrypt-hash som i `db/testdata.sql` | Jose | `docker compose up` på en tom databas ger tre användare |
| B2 | `User`-entitet (roll som PostgreSQL-enum, se beslut #7) och `UserRepository.findByEmail` | Jose | Test: hittar användaren från V2 |
| B3 | `SecurityConfig`: `PasswordEncoder` (BCrypt), `JwtEncoder` och `JwtDecoder` med `JWT_SECRET`, rollen från claimet `role` blir `ROLE_…`, stateless, CSRF av (vi använder inga cookies). Öppna: `/api/auth/login`, `/api/ping`, `/actuator/health`, Swagger | Jose + Ermias | Utan token: 401. Med token: 200 |
| B4 | `AuthService` + `AuthController`: `POST /api/auth/login` och `GET /api/auth/me` enligt kontraktet | Ermias | Testerna nedan går igenom |
| B5 | Tester (`@SpringBootTest` + MockMvc): rätt inloggning ger token med rätt roll; fel lösenord och okänd e-post ger samma 401-svar; `/me` utan token ger 401, med token 200 | Ermias | `./mvnw verify` grönt |

### Frontend

| # | Uppgift | Förslag | Klart när |
|---|---|---|---|
| F1 | `src/types/` (`User`, `Role`) och `src/api/client.ts`: en liten `fetch`-funktion som lägger till `Authorization` och loggar ut vid 401 | Martin | Används av alla anrop |
| F2 | `src/auth/AuthContext.tsx`: `user`, `login()`, `logout()`. Läser token från `localStorage` när appen startar och frågar `/api/auth/me` | Martin | Inloggad efter omladdning (kriterium 4) |
| F3 | `LoginPage` på `/login` enligt [mockupen](../../bilder/mockups/utkast/mockup-1-logga-in.png): React Hook Form + Zod (beslut #6), felmeddelandet "Fel e-post eller lösenord" | Martin | Kriterium 1 och 3 |
| F4 | React Router: `RequireAuth` (skickar till `/login` om man inte är inloggad), en enkel `Layout` med namnet och knappen Logga ut, och en startsida per roll på `/tickets` (bara rubrik tills sprint 2: "Mina ärenden", "Mina uppdrag", "Öppna ärenden"). Ersätter Vite-startsidan i `App.tsx`. `PingStatus` får ligga kvar på inloggningssidan | Jose | Kriterium 2 och 5 |
| F5 | Tester (Vitest + Testing Library + `msw`): felmeddelande vid fel lösenord; rätt startsida efter inloggning; skyddad sida skickar till `/login`; inloggad efter "omladdning" (token finns i `localStorage`); utloggning tar bort token | Martin + Jose | `npm test` grönt |

### Övrigt

| # | Uppgift | Förslag |
|---|---|---|
| Ö1 | Beslut #8 i beslutsloggen (görs i samma PR som den här planen, stänger U1 #9) | Jose |
| Ö2 | `db/testdata.sql` börjar med `TRUNCATE`, så den fungerar även efter V2. Kontrollera att den fortfarande går att köra | Ermias |
| Ö3 | README och `databas-och-docker.md`: att de tre inloggningarna nu finns direkt efter `docker compose up` | Jose |

## Ordning

```
1. Kontraktet (ovan) ─┬─▶ B1 → B2 → B3 → B4 → B5 ──┐
                      │                            ├─▶ 3. Testa ihop utan msw ─▶ PR:ar ─▶ Klart
                      └─▶ F1 → F2 → F3 → F4 → F5 ──┘
```

1. **Kontraktet** är bestämt i den här planen. Ändras det säger vi till på standupen.
2. **Backend och frontend parallellt.** Frontend använder `msw` tills backend är klar.
3. **Testa ihop:** stäng av `msw`, starta allt med `docker compose up --build` och logga in med alla tre rollerna.

## Grenar och PR:er

Två PR:er mot `staging`, så att de blir lagom stora att granska:

| PR | Gren | Innehåll | I PR-texten |
|---|---|---|---|
| 1 | `feature/6-inloggning-backend` | B1–B5, Ö2 | `Part of #6` |
| 2 | `feature/6-inloggning-frontend` | F1–F5, Ö3 | `Closes #6` |

Den gamla grenen `4-logga-in-med-roll-l` används inte (den har bara en gammal commit som redan finns i `staging`) och kan tas bort.

Som vanligt: en annan person granskar och godkänner (Review changes → Approve), och CI ska vara grönt. Se [Definition of Done](../../definition-of-done.md).

## Testa för hand (till PR 2 och reviewn)

1. `docker compose up --build`, öppna http://localhost:5173. Du hamnar på inloggningen.
2. Logga in som `hyresgast@felanmalan.se` / `test1234`. Du ser "Mina ärenden" och ditt namn.
3. Ladda om sidan (F5). Du är fortfarande inloggad.
4. Logga ut. Gå till http://localhost:5173/tickets. Du skickas till inloggningen.
5. Logga in med fel lösenord, och sedan med en e-post som inte finns. Båda ger "Fel e-post eller lösenord".
6. Gör samma sak med `tekniker@` och `forvaltare@`. Varje roll får sin egen startsida.

## Risker

- **Ingen av oss har gjort det förut.** Därför den här planen och par-programmering på B3, som är den svåraste delen. Fastnar någon mer än en timme: säg till direkt i Slack.
- **Sprinten tar slut.** Sprint 1 slutar söndag 2026-11-01. Blir storyn inte klar visar vi det som är klart på reviewn och tar med resten till sprint 2 på planningen 2026-11-02.
- **Testanvändarna i V2 har ett känt lösenord.** Innan deploy (T2) måste de tas bort eller få nya lösenord.
- **Token i `localStorage`** kan läsas av skadlig JavaScript (XSS). React skyddar mot det mesta, och vi använder aldrig `dangerouslySetInnerHTML`.
- **Utloggning är bara i frontend.** En token som har kopierats gäller tills den går ut (8 timmar). Det räcker för det här projektet.
- **#11 Lägga till fastighet (Martin) väntar på den här storyn.** Martin kan börja med frontend för #11 mot `msw` när F1–F2 är klara.
