# Fastfix — Felanmälan

> Felanmälan samlar alla fel i en fastighet på ett ställe. Hyresgästen anmäler, förvaltaren fördelar, teknikern åtgärdar, och alla ser status hela vägen.

Projekt i kursen **Producera och leverera mjukvara**. Repot innehåller frontend, backend och databas, och allt startar med ett kommando.

**Status:** Sprint 0 — uppstart och planering.

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

Stoppa med `Ctrl+C`. Nollställ databasen med `docker compose down -v`.

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
cd frontend && npm run lint && npm run typecheck && npm run build
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
| [Projektförslag](docs/mvp/projektforslag-felanmalan.md) | Bakgrund, roller, user stories, databasschema och risker |
| [User stories](docs/mvp/user-stories.md) | Ordnad backlog med acceptanskriterier, prioritet och storlek (utkast) |
| [Frontendplan](docs/mvp/frontend-plan.md) | Vyer per roll, mappstruktur, plan per sprint och öppna frågor |
| [Definition of Done](docs/dod/definition-of-done.md) | När en user story räknas som klar (utkast) |
| [Mockups](docs/mockups/) | Skisser av gränssnittet |
| [Uppstart](docs/uppstart.md) | Teknikval, beslut och hur repot sattes upp |
