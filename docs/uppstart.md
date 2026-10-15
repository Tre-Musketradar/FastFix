# Uppstart — Felanmälan

Guide för att sätta upp projektets slutliga repo i gruppens GitHub-organisation: ett repo med frontend, backend och databas som startar med **ett kommando**.

## Teknikval

| Del | Val |
|-----|-----|
| Repo | Ett repo (monorepo) med `frontend/`, `backend/` och `docs/` |
| Frontend | React + TypeScript + Vite, ESLint, Tailwind CSS |
| Backend | Spring Boot (Java 21, Maven), Spring Security + JWT, Spring Data JPA, Flyway |
| Databas | PostgreSQL 17 |
| Lokal miljö | Docker Compose: `docker compose up` startar allt |
| CI | GitHub Actions: ett jobb för frontend, ett för backend |

## Beslut (till beslutsloggen)

### 1. Ett repo i stället för två

- Kursen utgår från **ett** repo skapat från mallen, med **en** board och `docs/`.
- Stories ska vara **vertikala** (frontend, backend och databas). Med ett repo blir en story en gren och en PR som granskas i sin helhet. Med två repon delas varje story upp i två PR:er som måste samordnas.
- Projektskelettet ska starta med ett kommando. Det är enkelt med en `docker-compose.yml` i roten.
- Alla ska kunna förklara hela koden. Det är lättare när allt finns på ett ställe.

### 2. PostgreSQL i stället för MySQL eller SQLite

- **Mot MySQL:** båda fungerar, men PostgreSQL har inbyggda enums (status, kategori, prioritet) som passar vårt databasschema, och det finns gratis molndatabaser (Neon, Supabase) för deploy.
- **Mot SQLite:** inget att installera och bra för tester, men:
  - Gratis hosting (Render, Railway) har tillfällig disk, så SQLite-filen och all data försvinner vid varje omstart eller deploy.
  - Hibernate har inget officiellt stöd för SQLite. Man måste använda en dialekt från communityn.
  - SQLite saknar enums. Det skulle kräva text och `CHECK`-villkor.
- Bekvämligheten med SQLite får vi ändå: `docker compose up` startar PostgreSQL utan att någon installerar det själv.

### 3. Spring Boot som backend

- Valt i projektförslaget. Starkt stöd för roller och behörigheter med Spring Security.
- Risk: Spring Security + JWT tar tid att sätta upp. Hanteras med undersökningen U1 (max en halv dag) innan storyn "Logga in med roll".

### 4. Docker Compose för lokal miljö

- Samma versioner av PostgreSQL, Java och Node för alla, oavsett dator.
- Den som bara jobbar med frontend behöver inte installera Java, och tvärtom.

### 5. Tailwind CSS och ESLint i frontend

- Tailwind: snabbt att bygga konsekventa vyer och att få dem att fungera i mobilbredd (360 px), utan egna CSS-filer per komponent.
- ESLint: samma kodregler för alla, kontrolleras automatiskt i CI.

## Struktur

```
felanmalan/
├── frontend/                 React + Vite + Tailwind
│   ├── src/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── eslint.config.js
│   ├── vite.config.ts
│   └── package.json
├── backend/                  Spring Boot
│   ├── src/main/java/…/
│   │   ├── auth/             inloggning, JWT, säkerhetskonfiguration
│   │   ├── user/
│   │   ├── property/         fastigheter och lägenheter
│   │   ├── ticket/           ärenden, status, historik
│   │   └── common/           felhantering, gemensamma klasser
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── db/migration/     Flyway: V1__init.sql, V2__…
│   ├── Dockerfile
│   └── pom.xml
├── docs/                     från kursens mall + vår dokumentation
├── .github/
│   ├── workflows/ci.yml
│   └── ISSUE_TEMPLATE/ …     från kursens mall
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Kom igång (för alla i teamet)

Krav: [Docker Desktop](https://www.docker.com/products/docker-desktop/) och Git.

```bash
git clone <repo-url>
cd felanmalan
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

Det går snabbare att köra den del man jobbar med direkt på datorn och resten i Docker:

```bash
# Jobbar med backend: databas i Docker, backend i IntelliJ
docker compose up db

# Jobbar med frontend: databas och backend i Docker, Vite lokalt
docker compose up db backend
cd frontend && npm install && npm run dev
```

## Filer

### `docker-compose.yml`

```yaml
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      retries: 10

  backend:
    build: ./backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/${POSTGRES_DB}
      SPRING_DATASOURCE_USERNAME: ${POSTGRES_USER}
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    environment:
      API_PROXY_TARGET: http://backend:8080
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  db-data:
```

### `.env.example`

Kopieras till `.env`, som aldrig checkas in.

```bash
POSTGRES_DB=felanmalan
POSTGRES_USER=felanmalan
POSTGRES_PASSWORD=byt-mig
JWT_SECRET=byt-mig-till-en-lang-slumpad-strang-pa-minst-32-tecken
```

### `backend/Dockerfile`

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### `backend/src/main/resources/application.yml`

Standardvärdena gäller när backend körs i IntelliJ. I Docker skrivs de över av miljövariablerna.

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/felanmalan}
    username: ${SPRING_DATASOURCE_USERNAME:felanmalan}
    password: ${SPRING_DATASOURCE_PASSWORD:byt-mig}
  jpa:
    hibernate:
      ddl-auto: validate   # tabellerna skapas av Flyway, inte av Hibernate
    open-in-view: false

app:
  jwt-secret: ${JWT_SECRET:endast-for-lokal-utveckling-minst-32-tecken}
```

### `frontend/Dockerfile`

Utvecklingsserver med hot reload.

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

`frontend/.dockerignore`:

```
node_modules
dist
```

### `frontend/vite.config.ts`

Proxyn gör att frontend anropar `/api/...` och Vite skickar vidare till backend. Då behövs ingen CORS-konfiguration under utveckling.

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': process.env.API_PROXY_TARGET ?? 'http://localhost:8080',
    },
  },
})
```

Om hot reload inte fungerar i Docker på Windows eller macOS: lägg till `watch: { usePolling: true }` under `server`.

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [staging, main]
  pull_request:
    branches: [staging, main]

jobs:
  frontend:
    name: Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build

  backend:
    name: Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    services:
      db:
        image: postgres:17-alpine
        env:
          POSTGRES_DB: felanmalan
          POSTGRES_USER: felanmalan
          POSTGRES_PASSWORD: ci
        ports:
          - 5432:5432
        options: >-
          --health-cmd "pg_isready -U felanmalan"
          --health-interval 5s
          --health-retries 10
    env:
      SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/felanmalan
      SPRING_DATASOURCE_USERNAME: felanmalan
      SPRING_DATASOURCE_PASSWORD: ci
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 21
          cache: maven
      - run: ./mvnw -B verify

  enforce-staging:
    name: PR mot main måste komma från staging
    if: github.event_name == 'pull_request' && github.base_ref == 'main'
    runs-on: ubuntu-latest
    steps:
      - name: Kontrollera källgren
        run: |
          if [ "${{ github.head_ref }}" != "staging" ]; then
            echo "::error::PR:er mot main får endast komma från 'staging' (nuvarande källgren: ${{ github.head_ref }})"
            exit 1
          fi
```

## Steg för steg (Sprint 0)

### 1. Organisation och repo

1. Skapa organisationen (gratisplanen) och bjud in alla i gruppen.
2. Skapa repot från kursens mall med organisationen som ägare.
3. **Publikt eller privat?** På gratisplanen fungerar skyddade grenar bara i **publika** repon. Väljer ni privat repo måste läraren få läsbehörighet, och regeln "allt via `staging`" går inte att tvinga fram tekniskt.
4. Ge alla rollen **Write** under *Settings → Collaborators and teams*.

### 2. Grenar och skydd

1. Skapa grenen `staging` från `main` och gör den till standardgren.
2. Skydda `main` och `staging`: kräv pull request, kräv godkännande från minst en person, kräv att CI går igenom, ingen force push.
3. På `main` krävs dessutom kontrollen "PR mot main måste komma från staging".

### 3. Frontend

1. Flytta koden från det nuvarande basrepot (`JoseMunozO/Fastfix`) till `frontend/`.
2. Lägg till Tailwind:
   ```bash
   cd frontend
   npm install tailwindcss @tailwindcss/vite
   ```
   Lägg till plugin i `vite.config.ts` (se ovan) och ersätt innehållet i `src/index.css` med:
   ```css
   @import "tailwindcss";
   ```
3. Lägg till `Dockerfile` och `.dockerignore`.
4. Slå ihop vår dokumentation (projektförslag, user stories, frontendplan, DoD) med mallens `docs/`. Mallens struktur gäller där de krockar.

### 4. Backend

1. Skapa projektet på [start.spring.io](https://start.spring.io/):
   - Maven, Java 21, senaste stabila Spring Boot
   - Group: `se.felanmalan`, Artifact: `backend`
   - Beroenden: Spring Web, Spring Data JPA, PostgreSQL Driver, Flyway Migration, Validation, Spring Security, Spring Boot DevTools
2. Packa upp i `backend/`.
3. Lägg till `Dockerfile` och `application.yml` (se ovan).
4. Skapa `db/migration/V1__init.sql` utifrån databasschemat i projektförslaget.
5. JWT-biblioteket väljs i undersökningen U1.

### 5. Rot

1. Lägg till `docker-compose.yml`, `.env.example` och `ci.yml` (se ovan).
2. `.gitignore` i roten ska innehålla minst:
   ```
   .env
   node_modules
   dist
   target
   .idea
   ```
3. Uppdatera `README.md` med "Kom igång" från den här guiden.

### 6. Klart när (T1)

- [ ] Alla i teamet kan klona repot och köra `docker compose up --build`.
- [ ] Frontend visas på http://localhost:5173.
- [ ] Backend svarar på http://localhost:8080 och Flyway har skapat tabellerna.
- [ ] CI är grönt för både frontend och backend.
- [ ] `main` och `staging` är skyddade.
