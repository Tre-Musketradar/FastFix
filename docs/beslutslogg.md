# Beslutslogg

Större beslut och varför vi tog dem. Nyaste beslutet överst. Ett beslut som ersätts markeras "Ersatt av #N" i stället för att tas bort.

## Mall

Kopiera den här för varje nytt beslut:

```markdown
## #N Rubrik

**Datum:**
**Status:** Gäller / Ersatt av #N

**Bakgrund:** Vad behövde vi bestämma, och varför?

**Alternativ:**
- Alternativ A
- Alternativ B

**Beslut:** Vad valde vi?

**Varför:** Varför valde vi det, och vad valde vi bort?

**Konsekvenser:** Vad betyder beslutet för projektet framåt?
```

---

## #7 Bibliotek för frontend, backend och databas

**Datum:** 2026-10-16
**Status:** Förslag, diskuteras på gruppmötet 2026-10-16

**Bakgrund:** Innan Sprint 1 behöver vi bestämma vilka bibliotek vi använder, så att alla bygger på samma sätt och vi inte lägger till samma sak på olika sätt i olika stories. Listan nedan är ett förslag. Fyll i kolumnen **Beslut** på mötet (Ja / Nej / Senare) och flytta sedan det vi väljer bort till "Varför" längst ner.

Förslag: **Ja** = lägg till i Sprint 1, **Senare** = lägg till när en story behöver det, **Nej** = behövs inte.

### Frontend

| Bibliotek | Vad det löser | Utan det | Förslag | Beslut |
|---|---|---|---|---|
| `react-router` (v7) | Routes enligt frontendplanen (`/login`, `/tickets/:id` …) och skyddade routes per roll | Ingen navigering mellan vyer | Ja | |
| `@tanstack/react-query` | Hämtar data från API:t: laddning, fel, cache och ny hämtning efter till exempel statusbyte | `useEffect` + `useState` i varje vy | Ja | |
| `vitest` + `@testing-library/react` + `jsdom` | Komponenttester, fungerar direkt med Vite | Inga automatiska tester i frontend | Ja | |
| `msw` | Låtsas-API i tester och under utveckling innan backend är klar | Frontend måste vänta på backend | Senare | |
| `lucide-react` | Ikoner (status, kategorier, meny) | Egna SVG-filer | Senare | |
| `sonner` | Notiser som "Felanmälan skickad" | Egen komponent | Senare | |
| `clsx` | Villkorliga Tailwind-klasser, till exempel i `StatusBadge` | Strängar med `?:` | Senare | |
| `prettier` + `prettier-plugin-tailwindcss` | Samma formatering för alla, sorterade Tailwind-klasser | Formatering diskuteras i PR:er | Ja | |
| `openapi-typescript` | TypeScript-typer genereras från backendens OpenAPI | Typerna skrivs för hand och kan hamna i otakt med backend | Senare | |

Föreslås inte: `axios` (en liten `fetch`-funktion som lägger till `Authorization` räcker), Redux/Zustand (React Query och en `AuthContext` räcker), `date-fns`/`dayjs` (`Intl.DateTimeFormat('sv-SE')` räcker), shadcn/ui eller Radix (bara om vi vill ha färdiga dialoger och val-listor).

### Backend

| Bibliotek | Vad det löser | Utan det | Förslag | Beslut |
|---|---|---|---|---|
| `spring-boot-starter-oauth2-resource-server` | Kontrollerar JWT. Väljs i U1, alternativet är `jjwt` och ett eget filter | Vi skriver JWT-kontrollen själva | Ja (beror på U1) | |
| `springdoc-openapi-starter-webmvc-ui` (3.x för Spring Boot 4) | Swagger UI: dokumentation av API:t och ett enkelt sätt att testa endpoints. Behövs för `openapi-typescript` | API:t dokumenteras för hand | Ja | |
| Testcontainers (`spring-boot-testcontainers` + `testcontainers-postgresql`) | Integrationstester mot en riktig PostgreSQL. H2 fungerar inte eftersom schemat använder PostgreSQL-enums | Inga integrationstester mot databasen | Ja | |
| `spring-boot-starter-actuator` | `/actuator/health` för health check vid deploy (T2) och i Docker Compose. Bara `health` exponeras | Ingen health check | Senare (T2) | |
| ArchUnit | Tester som kontrollerar lagren controller → service → repository | Lagren kontrolleras bara i code review | Nej | |

Föreslås inte: Lombok (DTO:er skrivs som Java 21-`record`, och vi slipper ställa in Lombok i allas IDE), MapStruct (med få DTO:er är en egen `toDto()` tydligare).

### Databas

| Verktyg | Vad det löser | Förslag | Beslut |
|---|---|---|---|
| Flyway `V2__seed.sql` (inget nytt beroende) | Testdata: en användare per roll, en fastighet med lägenheter | Ja | |
| `@JdbcTypeCode(SqlTypes.NAMED_ENUM)` i entiteterna (inget nytt beroende) | Hibernate sparar PostgreSQL-enums rätt. Utan det försöker Hibernate spara `varchar` och PostgreSQL säger nej | Ja | |
| Adminer eller pgAdmin i `docker-compose.yml` (bara utveckling) | Se databasen i webbläsaren utan att installera något | Senare | |

**Beslut:** Fylls i efter mötet.

**Varför:** Fylls i efter mötet: vad vi valde, och varför vi valde bort det som fick Nej.

**Konsekvenser:** Fylls i efter mötet. Det vi säger Ja till läggs till i `package.json` eller `pom.xml` i den story som först behöver det, inte allt på en gång.

## #6 React Hook Form och Zod för formulär

**Datum:** 2026-10-16
**Status:** Gäller

**Bakgrund:** Appen har flera formulär med validering: inloggning, ny felanmälan, fastigheter och lägenheter, tilldelning och statusbyte. Vi behövde bestämma hur vi bygger dem i React med TypeScript, så att alla gör på samma sätt.

**Alternativ:**
- React Hook Form + Zod
- TanStack Form
- React 19 utan bibliotek (`<form action>` + `useActionState`)
- Formik

**Beslut:** React Hook Form för formulären och Zod för valideringen, kopplade med `@hookform/resolvers`.

**Varför:**
- **Ett schema för både typer och validering:** med Zod skriver vi reglerna en gång och får TypeScript-typen med `z.infer`. Typerna och valideringen kan därför inte hamna i otakt.
- **Prestanda:** React Hook Form använder okontrollerade fält och renderar inte om hela formuläret vid varje tangenttryckning.
- **Lätt att lära sig:** det är den mest använda lösningen, med bra dokumentation och många exempel. Det hjälper när alla i gruppen inte har använt biblioteket förut.
- **Litet och fungerar med Tailwind:** biblioteket har ingen egen stil, så vi styr utseendet helt med Tailwind (se #5).
- **Mot TanStack Form:** ännu striktare typning, men nyare och med mer kod per formulär. Vinsten är för liten för våra formulär.
- **Mot React 19 utan bibliotek:** inga beroenden, och det räcker för ett enkelt formulär som inloggningen. Men validering per fält, felmeddelanden och fält som beror på varandra (till exempel i formuläret för felanmälan) måste vi då skriva själva i varje formulär.
- **Mot Formik:** underhålls knappt längre, renderar om mer och har sämre stöd för TypeScript.

**Konsekvenser:**
- Frontend får tre nya beroenden: `react-hook-form`, `zod` och `@hookform/resolvers`.
- Varje formulär får ett Zod-schema, och felmeddelandena skrivs på svenska i schemat.
- Valideringen i frontend är bara till för användarens skull. Backend validerar ändå alla anrop med Bean Validation (`@Valid`, `@NotBlank` osv.).

## #5 Tailwind CSS och ESLint i frontend

**Datum:** 2026-10-15
**Status:** Gäller

**Bakgrund:** Vi behövde bestämma hur vi skriver CSS och hur vi håller samma kodstil.

**Alternativ:**
- Vanlig CSS / CSS Modules
- Tailwind CSS

**Beslut:** Tailwind CSS för stil och ESLint för kodregler.

**Varför:** Med Tailwind går det snabbt att bygga konsekventa vyer som fungerar i mobilbredd (360 px), utan egna CSS-filer per komponent. ESLint ger samma kodregler för alla och kontrolleras automatiskt i CI.

**Konsekvenser:** Alla behöver lära sig Tailwinds klasser. Frontendplanen uppdaterades (den föreslog vanlig CSS).

## #4 Docker Compose för lokal miljö

**Datum:** 2026-10-15
**Status:** Gäller

**Bakgrund:** Alla i teamet ska kunna starta projektet på sin egen dator med samma versioner.

**Alternativ:**
- Installera Java, Node och PostgreSQL lokalt
- Docker Compose

**Beslut:** Docker Compose. `docker compose up --build` startar databas, backend och frontend.

**Varför:** Samma versioner av PostgreSQL, Java och Node för alla, oavsett dator. Den som bara jobbar med frontend behöver inte installera Java, och tvärtom.

**Konsekvenser:** Alla behöver Docker Desktop. Den som vill kan köra en del direkt på datorn och resten i Docker (se README).

## #3 PostgreSQL som databas

**Datum:** 2026-10-15
**Status:** Gäller

**Bakgrund:** Vi behövde välja databas för Spring Boot.

**Alternativ:**
- PostgreSQL
- MySQL
- SQLite

**Beslut:** PostgreSQL 17.

**Varför:**
- **Mot MySQL:** båda fungerar, men PostgreSQL har inbyggda enums (status, kategori, prioritet) som passar vårt schema, och det finns gratis molndatabaser (Neon, Supabase) för deploy.
- **Mot SQLite:** gratis hosting (Render, Railway) har tillfällig disk, så filen och all data försvinner vid varje deploy. Hibernate har inget officiellt stöd för SQLite, och SQLite saknar enums.

**Konsekvenser:** Tabellerna skapas med Flyway-migrationer (`backend/src/main/resources/db/migration/`), inte av Hibernate.

## #2 Ett repo för frontend och backend

**Datum:** 2026-10-15
**Status:** Gäller

**Bakgrund:** Frontend började i ett eget repo. Vi behövde bestämma om backend skulle ligga i ett separat repo.

**Alternativ:**
- Två repon (frontend och backend)
- Ett repo med `frontend/`, `backend/` och `docs/`

**Beslut:** Ett repo, skapat utifrån kursens mall.

**Varför:** Kursen utgår från ett repo med en board och `docs/`. Våra stories är vertikala, så med ett repo blir en story en gren och en PR. Det är också lättare för alla att förstå hela koden när allt finns på ett ställe.

**Konsekvenser:** CI har ett jobb för frontend och ett för backend.

## #1 Stack: React, Spring Boot och PostgreSQL

**Datum:** 2026-10-15
**Status:** Gäller

**Bakgrund:** Vi behövde välja teknik innan vi satte upp projektet.

**Alternativ:**
- React + Spring Boot + PostgreSQL
- React + Node/Express + PostgreSQL

**Beslut:** React med TypeScript och Vite i frontend, Spring Boot (Java 21) med Spring Security och JWT i backend, PostgreSQL som databas.

**Varför:** Appen har tre roller med olika behörigheter, och Spring Security har starkt stöd för roller. Vi vill också öva på Java i backend och React i frontend.

**Konsekvenser:** Spring Security med JWT tar tid att sätta upp. Det hanteras med undersökningen U1 (max en halv dag) innan storyn "Logga in med roll".
