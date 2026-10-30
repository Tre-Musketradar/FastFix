# Projektstruktur

Var koden ligger i `frontend/` och `backend/`, och vilka filer alla rör (knutpunkterna). Beslutet och varför står i [beslut #9](beslutslogg.md#9-mappar-efter-funktion).

## Grundregel: en mapp per funktion

Koden delas upp efter **funktion** (vad appen gör), inte efter lager (komponenter, API, sidor). Funktionerna följer epicerna på boarden. En story ska nästan bara röra sin egen mapp, så att två personer som gör olika stories inte krockar i Git. Så rekommenderar läraren i [07-projektstruktur-och-konflikter](resurser/07-projektstruktur-och-konflikter.md).

**Rollerna** (hyresgäst, tekniker, förvaltare) är ingen egen mapp. Samma funktion används ofta av flera roller, t.ex. ärenden. Skillnaderna ligger i funktionens mapp: en egen komponent per roll när vyerna är olika (t.ex. ärendelistan), och behörigheten kontrolleras alltid i backend.

## Funktionerna

| Funktion | Epic | Stories | Frontend | Backend |
|---|---|---|---|---|
| Inloggning | Inloggning | 1 | `features/auth/` | `auth/`, `user/` |
| Fastigheter och lägenheter | Fastigheter | 2, 3, 17 | `features/properties/` | `property/` |
| Hyresgäster | Fastigheter | 4 | `features/tenants/` | `tenant/` |
| Ärenden | Ärenden, Ärendeflöde, Kommunikation | 5–15, 18–20 | `features/tickets/` | `ticket/` |
| Översikt | Översikt | 16, 21 | `features/dashboard/` | `dashboard/` |
| Testendpoint | – | – | `features/ping/` | `ping/` |

Blir en mapp för stor (t.ex. `tickets/`) kan den få undermappar, t.ex. `tickets/comments/`. Det bestämmer den som gör storyn, och det nämns på standupen.

## Frontend

```
frontend/src/
  features/
    auth/          AuthContext, LoginPage, RequireAuth, authApi
    properties/    fastigheter och lägenheter
    tenants/       hyresgäster
    tickets/       listor per roll, ny felanmälan, detalj, historik, kommentarer
    dashboard/     översikt (Bör)
    ping/          PingStatus (testendpointen)
  shared/          apiClient, Layout, typer och komponenter som flera funktioner använder
  App.tsx          routes, en rad per sida
  main.tsx         startar appen
```

En funktionsmapp innehåller allt för funktionen: sidor, komponenter, API-anrop (`<funktion>Api.ts`), `msw`-handlers för tester och typer som bara den använder. Exempel för ärenden:

```
features/tickets/
  TenantTicketsPage.tsx       Mina ärenden (hyresgäst)
  TechnicianTicketsPage.tsx   Mina uppdrag (tekniker)
  ManagerTicketsPage.tsx      Öppna ärenden (förvaltare)
  NewTicketPage.tsx
  TicketDetailPage.tsx
  StatusHistory.tsx
  ticketsApi.ts
  ticketsHandlers.ts          msw
  TicketDetailPage.test.tsx
```

**`shared/`** är bara för sådant som minst två funktioner använder: `apiClient.ts` (lägger till token, hanterar 401), `Layout.tsx`, `types.ts` (`Role`, `TicketStatus`, `Category`, `Priority`, samma värden som backendens enums) och komponenter som `StatusBadge`. Börjar något i en funktion och behövs sedan i en till flyttas det till `shared/` i en egen liten PR.

## Backend

```
backend/src/main/java/se/felanmalan/
  auth/        AuthController, AuthService, JWT (story 1)
  user/        User, Role, UserRepository
  property/    Property, Apartment, controllers, services, repositories
  tenant/      hyresgäster (story 4)
  ticket/      Ticket, StatusHistory, Comment, Attachment …
  dashboard/   översikt och statistik
  ping/        testendpointen
  config/      SecurityConfig och annan konfiguration
  BackendApplication.java
backend/src/main/resources/db/migration/   Flyway: V1__init.sql, V2__seed.sql …
backend/src/test/java/se/felanmalan/       samma paket som koden
```

Varje paket har sina egna klasser: `XController`, `XService`, `XRepository`, entiteter och DTO:er (som Java-`record`). En `package-info.java` i varje paket beskriver vad det innehåller. Ett paket får använda ett annat (t.ex. `ticket` använder `user`), men en controller anropar aldrig ett annat pakets repository direkt, bara dess service.

## Knutpunkter

Det här är filerna som många stories rör. Håll ändringarna där små, helst en rad.

| Knutpunkt | Regel |
|---|---|
| `frontend/src/App.tsx` | En rad per route. Sidan ligger i funktionens mapp |
| Menyn i `shared/Layout.tsx` | En rad per länk |
| `shared/types.ts` | Bara typer som flera funktioner använder. Enum-värdena ändras bara tillsammans med en migration |
| `config/SecurityConfig.java` | En rad per öppen endpoint. Behörighet per roll skrivs i controllern (`@PreAuthorize`) eller som en rad här |
| Flyway-migrationer | **En person i taget.** Säg till på standupen innan du skapar en ny `V<N>__…sql`, så att två inte tar samma nummer. Ändra aldrig en migration som är mergad. Uppdatera `db/testdata.sql` i samma PR |
| `package.json`, `pom.xml`, lockfiler | De flesta bibliotek finns redan (beslut #7). Konflikt i `package-lock.json`: ta versionen från `staging` och kör `npm install`, lös den inte för hand |

## Namn

- Kod, filer, routes och paket på engelska. All text i gränssnittet på svenska.
- Frontend: komponenter i `PascalCase.tsx`, övriga filer i `camelCase.ts`. Test bredvid filen som `*.test.tsx`.
- Backend: paket i singular och små bokstäver (`ticket`), klasser i `PascalCase`. Testklassen heter som klassen + `Tests`.
- Grenar: `feature/<issue>-<kort-namn>`, t.ex. `feature/6-login-sida`.

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-30 | Första versionen: mappar efter funktion i frontend och backend, knutpunkter och namn |
