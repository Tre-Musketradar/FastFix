# Introduktion till projektet

Den här sidan är för dig som är ny i gruppen. Den sammanfattar vad vi bygger, hur vi jobbar, vilken teknik vi använder och vilka beslut vi redan har tagit. Varje avsnitt länkar till dokumentet med alla detaljer.

## Vad vi bygger

**Felanmälan** är en webbapp för fastighetsbolag. I dag anmäls fel via telefon, mejl eller lappar i trapphuset. Ärenden glöms bort, hyresgästen vet inte om någon har sett anmälan och förvaltaren saknar överblick.

I appen samlas alla felanmälningar på ett ställe:

1. **Hyresgästen** anmäler ett fel i sin lägenhet, till exempel en läckande kran. Hen väljer kategori och rum och anger om huvudnyckeln får användas.
2. **Förvaltaren** ser alla öppna ärenden och tilldelar ärendet till en tekniker.
3. **Teknikern** ser sina ärenden, ändrar status medan hen jobbar och markerar ärendet som åtgärdat.
4. **Förvaltaren** stänger ärendet.

Alla kan följa ärendet hela vägen. Varje statusändring sparas, så att man ser historiken.

```
Ny → Tilldelad → Pågår → Väntar (material/hyresgäst) → Åtgärdad → Stängd
```

Kategorier: VVS, El, Vitvaror, Ventilation, Lås och dörrar, Övrigt. Prioritet: Akut, Hög, Normal, Låg.

Mer: [MVP](mvp.md) (vad som ingår i första versionen) och [projektförslaget](projektforslag.md).

## Hur vi jobbar

Vi jobbar med **Scrum** i sprintar à en vecka.

| Vecka | Vad |
|---|---|
| 1–2 | Sprint 0: uppstart, planering och projektskelett |
| 3–7 | Sprint 1–5 (Sprint 1 börjar måndag 2026-10-26) |
| 8 | Leverans och individuella reflektioner |

**Varje måndag:** review av förra sprinten → retro → planering av nästa sprint. Anteckningarna sparas i [`docs/sprintar/`](sprintar/).

**Boarden:** allt arbete finns som kort (issues) på [boarden i GitHub Projects](https://github.com/orgs/Tre-Musketradar/projects/3). Korten går genom kolumnerna Backlog → Att göra → Pågår → Granskas → Klart. Varje kort har en prioritet (MoSCoW: Must, Should, Could, Won't) och en storlek (S, M, L).

**Backloggen:** 21 user stories plus en undersökning (U1) och två tekniska uppgifter (T1, T2). Alla stories är **vertikala**: varje story går genom frontend, backend och databas, så att vi har något som fungerar att visa varje sprint. Se [user stories](user-stories.md).

**När är något klart?** När det uppfyller vår [Definition of Done](definition-of-done.md): acceptanskriterierna är testade, PR:en är granskad och godkänd, CI är grönt, appen startar och kortet ligger i Klart.

**Samarbete:** vi pratar i Slack, svarar inom 24 timmar på vardagar och ger feedback på koden, inte på personen. Allt står i [gruppkontraktet](gruppkontrakt.md).

## Så kommer kod in i projektet

Vi har tre sorters grenar (branches):

```
feature/<namn>  ──PR──▶  staging  ──PR──▶  main
```

- **`main`** är den stabila versionen, den vi visar och lämnar in.
- **`staging`** är där allt samlas och testas först. Det är standardgrenen.
- **Arbetsgrenar** (`feature/...`, `fix/...`, `docs/...`) skapar du från `staging` för varje kort du jobbar med.

Steg för steg:

1. Ta ett kort på boarden, sätt dig som ansvarig och flytta det till "Pågår".
2. Skapa en gren från `staging`, till exempel `feature/6-logga-in`.
3. Jobba och committa. Skriv commit-meddelanden på engelska.
4. Öppna en pull request (PR) mot `staging`. Fyll i mallen och skriv `Closes #6`, så stängs kortet automatiskt när PR:en mergas.
5. En annan person granskar och godkänner med **Review changes → Approve**. En vanlig kommentar räknas inte.
6. CI (GitHub Actions) kör automatiskt lint, typkontroll, tester och bygge. Allt måste vara grönt.
7. PR:en mergas och kortet flyttas till Klart.

Ingen kan pusha direkt till `main` eller `staging`, och ingen kan godkänna sin egen PR. GitHub blockerar det.

Mer: [CONTRIBUTING.md](CONTRIBUTING.md).

## Teknik

### Översikt

```
Webbläsaren                      Server                        Databas
┌─────────────────┐   HTTP/JSON  ┌──────────────────┐   SQL    ┌────────────┐
│ React (frontend)│ ───────────▶ │ Spring Boot (API)│ ───────▶ │ PostgreSQL │
│ port 5173       │ ◀─────────── │ port 8080        │ ◀─────── │ port 5432  │
└─────────────────┘              └──────────────────┘          └────────────┘
```

Allt startar med ett kommando: `docker compose up --build`.

### Frontend (`frontend/`): det användaren ser

| Teknik | Vad det är | Varför vi använder det |
|---|---|---|
| **React 19** | Bibliotek för att bygga gränssnitt av komponenter | Det vanligaste valet, och vi vill öva på det |
| **TypeScript** | JavaScript med typer | Hittar fel innan koden körs |
| **Vite** | Startar utvecklingsservern och bygger appen | Snabbt, och sidan uppdateras direkt när du sparar |
| **Tailwind CSS** | CSS skriven som klasser direkt i komponenterna (`className="p-4 text-lg"`) | Snabbt att bygga enhetliga vyer som fungerar i mobilen, utan egna CSS-filer |
| **React Router** | Kopplar adresser (`/login`, `/tickets/12`) till vyer | Navigering och sidor som bara vissa roller får se |
| **TanStack Query** | Hämtar data från API:t | Sköter laddning, fel och cache, så att vi slipper skriva det i varje vy |
| **React Hook Form + Zod** | Formulär och validering | Reglerna skrivs en gång i ett schema och ger både felmeddelanden och TypeScript-typer |
| **lucide-react, sonner, clsx** | Ikoner, notiser ("Felanmälan skickad") och villkorliga CSS-klasser | Små hjälpbibliotek så att vi slipper bygga det själva |
| **Vitest + Testing Library** | Automatiska tester av komponenter | Fungerar direkt med Vite |
| **msw** | Låtsas-API | Frontend kan byggas och testas innan backend-endpointen finns |
| **ESLint + Prettier** | Kodregler och automatisk formatering | Alla skriver och formaterar koden på samma sätt, så att det blir färre konflikter |

### Backend (`backend/`): logiken och API:t

| Teknik | Vad det är | Varför vi använder det |
|---|---|---|
| **Java 21 + Spring Boot** | Ramverk för webbtjänster i Java | Stabilt och vanligt i arbetslivet, och vi vill öva på Java |
| **Maven** | Bygger projektet och hämtar bibliotek (`pom.xml`) | Standard för Spring Boot. Kör med `./mvnw` |
| **Spring Security + JWT** | Inloggning och behörigheter | Starkt stöd för roller. Efter inloggningen får användaren en token (JWT) som skickas med varje anrop |
| **Spring Data JPA (Hibernate)** | Läser och skriver i databasen med Java-klasser i stället för SQL | Mindre kod för vanliga databasoperationer |
| **Flyway** | Skapar och ändrar tabellerna med SQL-filer (`V1__init.sql`, `V2__...`) | Alla har exakt samma databas, och varje ändring av schemat finns i Git |
| **Bean Validation** | Validerar data som kommer in (`@NotBlank`, `@Email`) | Backend litar aldrig på frontend |
| **springdoc (Swagger UI)** | Dokumentation av API:t där man kan testa endpoints | Frontend ser vilka endpoints som finns och hur de anropas |
| **Actuator** | `/actuator/health` visar om backend och databasen fungerar | Behövs vid deploy (T2) |
| **Testcontainers** | Startar en riktig PostgreSQL i Docker under testerna | Integrationstester mot samma sorts databas som i produktion |

### Databas och miljö

| Teknik | Vad det är | Varför vi använder det |
|---|---|---|
| **PostgreSQL 17** | Relationsdatabas | Har inbyggda enums (status, kategori, roll) och gratis molndatabaser för deploy |
| **Docker Compose** | Startar databas, backend, frontend och Adminer i containrar | Samma versioner för alla. Du behöver bara Docker Desktop och Git |
| **Adminer** | Visar databasen i webbläsaren (http://localhost:8081) | Se tabeller och data utan att installera något |
| **GitHub Actions (CI)** | Kör kontrollerna automatiskt på varje PR | Det som mergas fungerar alltid |

Databasen har sju tabeller: `users`, `properties`, `apartments`, `tickets`, `status_history`, `comments` och `attachments`. Se [databasschemat](databasschema.md).

## Beslut vi har tagit

Alla beslut, med alternativ och motivering, finns i [beslutsloggen](beslutslogg.md). Kort sammanfattning:

| # | Beslut | I korthet |
|---|---|---|
| 1 | React + Spring Boot + PostgreSQL | Spring Security passar tre roller med olika behörigheter, och vi vill öva på Java och React |
| 2 | Ett repo för allt | En story är en gren och en PR, även när den rör både frontend och backend |
| 3 | PostgreSQL | Enums, och gratis hosting som behåller data (det gör inte SQLite) |
| 4 | Docker Compose | Samma miljö för alla, ett kommando för att starta |
| 5 | Tailwind CSS och ESLint | Snabb och enhetlig stil, samma kodregler för alla |
| 6 | React Hook Form + Zod | Ett schema för både validering och typer |
| 7 | Bibliotek | Allt installeras från början, så att ingen behöver lägga till dem mitt i en story |

**Inte bestämt än** (undersökning U1, före story 1): var frontend sparar inloggningens token, hur backend kontrollerar den och hur testanvändarna skapas. Se också [att diskutera](att-diskutera.md).

## Var står vi nu?

- **Klart:** projektskelettet (allt startar med Docker), CI, skyddade grenar, boarden med hela backloggen, Definition of Done, gruppkontraktet, databasschemat och biblioteken.
- **Nästa:** läxan till pass 4 och sprint planning för Sprint 1 måndag 2026-10-26. Första storyn är "Logga in med roll" (#6), som bygger på undersökningen U1 (#9).

## Kom igång

1. Installera [Docker Desktop](https://www.docker.com/products/docker-desktop/) och Git.
2. Be någon i gruppen bjuda in dig till organisationen **Tre-Musketradar** på GitHub.
3. Följ "Kom igång" i [README](../README.md). Efter tre kommandon körs appen på http://localhost:5173.
4. Läs [gruppkontraktet](gruppkontrakt.md) och skriv under med ditt namn och datum (via en PR, så övar du flödet direkt).
5. Läs lärarens material i [`docs/resurser/`](resurser/). Börja med `05-git-som-arbetssatt.md`.

## Ordlista

| Ord | Betyder |
|---|---|
| **Story** | En funktion beskriven från användarens håll: "Som hyresgäst vill jag …" |
| **Acceptanskriterier** | Punkterna som avgör om en story fungerar |
| **MoSCoW** | Prioritering: Must (MVP), Should, Could, Won't |
| **MVP** | Minsta versionen som löser problemet |
| **PR (pull request)** | En förfrågan om att få in en gren i `staging` eller `main`, där koden granskas |
| **CI** | Automatiska kontroller som körs på varje PR |
| **DoD** | Definition of Done: vad som gäller för att något ska räknas som klart |
| **Endpoint** | En adress i API:t, till exempel `POST /api/tickets` |
| **JWT** | En token som visar vem du är och vilken roll du har, och som skickas med varje anrop |
| **Migration** | En SQL-fil som Flyway kör för att skapa eller ändra tabeller |

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-20 | Första versionen |
