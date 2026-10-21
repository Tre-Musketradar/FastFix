# Fastfix — Felanmälan

> Felanmälan samlar alla fel i en fastighet på ett ställe. Hyresgästen anmäler, förvaltaren fördelar, teknikern åtgärdar, och alla ser status hela vägen.

Projekt i kursen **Producera och leverera mjukvara**. Repot innehåller frontend, backend och databas, och allt startar med ett kommando.

**Status:** Sprint 0 — uppstart och planering.

## Teamet

| Namn | GitHub |
|---|---|
| Jose Muñoz | [@JoseMunozO](https://github.com/JoseMunozO) |
| Martin Friis | [@MarFri8](https://github.com/MarFri8) |
| Ermias Demessie | [@EDebuger](https://github.com/EDebuger) |

## Roller

| Roll | Kan |
|------|-----|
| **Hyresgäst** | Skapa felanmälan, välja kategori och rum, ange om huvudnyckel får användas, följa status |
| **Tekniker** | Se tilldelade ärenden, ändra status, markera ärendet som åtgärdat |
| **Förvaltare** | Hantera fastigheter, lägenheter och användare, tilldela ärenden, stänga ärenden |

## Teknik

| Del | Teknik |
|-----|--------|
| Frontend (`frontend/`) | React 19, TypeScript, Vite, Tailwind CSS, ESLint |
| Backend (`backend/`) | Spring Boot (Java 21, Maven), Spring Security + JWT, Spring Data JPA, Flyway |
| Databas | PostgreSQL 17 |
| Lokal miljö | Docker Compose |
| CI | GitHub Actions: ett jobb för frontend, ett för backend |

Valen motiveras i [beslutsloggen](docs/beslutslogg.md).

## Kom igång

Krav: [Docker Desktop](https://www.docker.com/products/docker-desktop/) och Git.

```bash
git clone https://github.com/Tre-Musketradar/FastFix.git
cd FastFix
git checkout staging
cp .env.example .env
docker compose up --build
```

| Tjänst | Adress |
|--------|--------|
| Frontend | http://localhost:5173 |
| Backend (API) | http://localhost:8080/api |
| PostgreSQL | `localhost:5432` |
| Swagger UI | http://localhost:8080/swagger-ui.html (öppen när inloggningen är klar, U1) |
| Adminer (se databasen) | http://localhost:8081 (system PostgreSQL, uppgifter från `.env`) |

Stoppa med `Ctrl+C`. Nollställ databasen med `docker compose down -v`.

### Uppdatera efter `git pull`

När någon har lagt till ett bibliotek räcker det att köra det här (kopiera och klistra in från projektets rotmapp):

```bash
git checkout staging && git pull
docker compose up --build -V
```

`-V` behövs: utan den återanvänder Docker den gamla `node_modules` och frontend hittar inte de nya biblioteken. Kör också `cd frontend && npm ci` om du kör Vite lokalt eller vill att editorn ska hitta typerna. IntelliJ hämtar backendens bibliotek själv (eller klicka på "Reload Maven Project").

### Jobba med en del i taget

```bash
# Jobbar med backend: databas i Docker, backend i IntelliJ
docker compose up db

# Jobbar med frontend: databas och backend i Docker, Vite lokalt
docker compose up db backend
cd frontend && npm install && npm run dev
```

### Kontroller före PR

```bash
cd frontend && npm run lint && npm run typecheck && npm test && npm run build
cd backend && ./mvnw verify
```

Samma kontroller körs i CI.

## Arbetsflöde

```
feature/<namn>  ──PR──▶  staging  ──PR──▶  main
```

- Skapa alltid din gren från `staging`.
- Direkt push till `main` och `staging` är blockerad.
- Varje PR granskas av minst en annan person och CI måste vara grönt.
- Dokumentation skrivs på svenska, commit-meddelanden och PR:er på engelska.

Mer information i [CONTRIBUTING.md](docs/CONTRIBUTING.md) och [uppstart.md](docs/uppstart.md).

## Dokumentation

| Dokument | Innehåll |
|----------|----------|
| [Introduktion](docs/introduktion.md) | **Börja här om du är ny:** vad vi bygger, hur vi jobbar, teknik och beslut |
| [Att diskutera](docs/att-diskutera.md) | Förslag som gruppen ska ta ställning till |
| [Gruppkontrakt](docs/gruppkontrakt.md) | Hur vi samarbetar |
| [Definition of Done](docs/definition-of-done.md) | När en story räknas som klar |
| [MVP](docs/mvp.md) | Vad som ingår i första versionen |
| [Databasschema](docs/databasschema.md) | Tabeller och relationer |
| [Beslutslogg](docs/beslutslogg.md) | Viktiga beslut och varför |
| [Sprintar](docs/sprintar/) | Planning, standups, review och retro per sprint |
| [Individuella reflektioner](docs/reflektioner/) | En per person, lämnas in vecka 8 |
| [Projektförslag](docs/projektforslag.md) | Bakgrund, roller, MoSCoW och risker |
| [User stories](docs/user-stories.md) | Ordnad backlog med acceptanskriterier, prioritet och storlek |
| [Frontendplan](docs/frontend-plan.md) | Vyer per roll, mappstruktur och plan per sprint |
| [Uppstart](docs/uppstart.md) | Hur repot sattes upp |

## Board

[Felanmälan i GitHub Projects](https://github.com/orgs/Tre-Musketradar/projects/3)
