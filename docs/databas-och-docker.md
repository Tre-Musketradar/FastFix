# Databas och Docker: instruktionsbok

Hur du kör projektet med Docker, hur databasen fungerar, hur du läser in testdata och hur du loggar in, både i appen och i databasen. Kör alla kommandon från projektets rotmapp.

## 1. Hämta det senaste

```bash
git switch staging
git pull
docker compose up --build -V
```

- `--build` bygger om backend och frontend med den nya koden.
- `-V` behövs när någon har lagt till ett bibliotek. Annars hittar frontend inte de nya biblioteken.

**Fungerar allt?** Startsidan http://localhost:5173 ska visa `Backend: ok · Databas: PostgreSQL 17… · Användare: …`. Står det "Backend svarar inte" har backend inte startat än. Vänta en stund och ladda om.

## 2. Docker i vardagen

| Vad | Kommando |
|---|---|
| Starta | `docker compose up` (lägg till `--build` efter `git pull`) |
| Starta i bakgrunden | `docker compose up -d` (du får tillbaka terminalen) |
| Se loggar | `docker compose logs -f backend` (eller `frontend`, `db`) |
| Stoppa | `Ctrl+C`, eller `docker compose stop` om du startade med `-d` |
| Se vad som körs | `docker compose ps` |
| Starta om en del | `docker compose restart backend` |
| Nollställa databasen helt | `docker compose down -v` ⚠️ raderar all data. Nästa `docker compose up` skapar tabellerna igen från noll |

### Tjänsterna

| Tjänst | Adress | Vad det är |
|---|---|---|
| `frontend` | http://localhost:5173 | React-appen |
| `backend` | http://localhost:8080 | Spring Boot-API:t |
| `db` | `localhost:5432` | PostgreSQL 17 |
| `adminer` | http://localhost:8081 | Visar databasen i webbläsaren |

### Vanliga problem

| Problem | Lösning |
|---|---|
| "port is already allocated" | Något annat använder porten, t.ex. en PostgreSQL som du har installerat på datorn (5432). Stoppa den, eller stäng det andra programmet |
| Frontend hittar inte ett bibliotek | `docker compose up --build -V` |
| Disken full eller konstiga byggfel | `docker system prune` och bygg igen |
| Backend startar inte efter en ny migration | Läs `docker compose logs backend`. Har någon ändrat en mergad migration? Fråga i Slack. Sista utvägen: `docker compose down -v` |

## 3. Hur databasen fungerar

Databasen är PostgreSQL 17 och körs i en egen container (`db`). Datan sparas i en Docker-volym (`db-data`), så den finns kvar när du stoppar och startar igen. Den försvinner bara med `docker compose down -v`.

### Flyway skapar tabellerna

Tabellerna skapas av **Flyway**, inte för hand. När backend startar kör Flyway SQL-filerna i `backend/src/main/resources/db/migration/` (`V1__init.sql`, senare `V2__...` osv.) i ordning, och var och en bara en gång. Flyway sparar vilka filer som är körda i tabellen `flyway_schema_history`. Därför har alla exakt samma tabeller.

Regler:

- **Ändra schemat** genom att skapa en **ny** fil, t.ex. `V3__lagg_till_rum.sql`.
- **Ändra aldrig en migration som redan är mergad.** Då startar inte backend hos de andra.
- Säg på standupen att du gör en migration, så att två inte tar samma nummer.
- Ändras schemat ska [`db/testdata.sql`](../db/testdata.sql) uppdateras i samma PR.

### Tabellerna

| Tabell | Innehåll |
|---|---|
| `users` | Alla användare. Rollen är `TENANT` (hyresgäst), `TECHNICIAN` (tekniker) eller `MANAGER` (förvaltare). Lösenordet sparas som BCrypt-hash, aldrig i klartext |
| `properties` | Fastigheter. Varje fastighet har en förvaltare (`owner_id`) |
| `apartments` | Lägenheter i en fastighet. `tenant_id` är hyresgästen, `NULL` betyder ledig. En hyresgäst kan bara ha en lägenhet |
| `tickets` | Felanmälningar. Kopplade till lägenhet, den som skapade dem (`created_by`) och tilldelad tekniker (`assigned_to`) |
| `status_history` | Varje statusändring på ett ärende, med vem och när. `old_status` är `NULL` när ärendet skapades |
| `comments` | Kommentarer på ärenden |
| `attachments` | Bilder på ärenden (används först i story 18) |

Statusflödet: Ny (`NEW`) → Tilldelad (`ASSIGNED`) → Pågår (`IN_PROGRESS`) → Väntar (`WAITING`) → Åtgärdad (`RESOLVED`) → Stängd (`CLOSED`).

Hela schemat med diagram: [databasschema.md](databasschema.md).

## 4. Testdata

[`db/testdata.sql`](../db/testdata.sql) fyller databasen med påhittade men realistiska data. Läs in den när databasen är igång:

```bash
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /db/testdata.sql'
```

Det ska sluta med `COMMIT`. Startsidan visar sedan `Användare: 16`.

⚠️ Filen **tömmer alla tabeller först**. Det du har skapat själv försvinner. Kör den igen när du vill börja om från samma data.

Mappen `db/` monteras i databascontainern (se `docker-compose.yml`), därför fungerar kommandot likadant på Mac, Windows och Linux. Filen körs aldrig automatiskt och används bara i utveckling.

### Innehåll

| Vad | Antal | Detaljer |
|---|---|---|
| Förvaltare | 2 | Maria Lindqvist (Solrosen och Björken), Johan Berg (Eken) |
| Tekniker | 3 | Ali Hassan, Sofia Nilsson, Erik Johansson |
| Hyresgäster | 11 | Nils Holm har ingen lägenhet (för story 4, Lägga till hyresgäst) |
| Fastigheter | 3 | Solrosen (Stockholm), Björken (Uppsala), Eken (Göteborg) |
| Lägenheter | 13 | 3 är lediga |
| Ärenden | 16 | Alla statusar, kategorier och prioriteter, med och utan huvudnyckel |
| Statushistorik | 56 rader | Varje ärende har hela sin väg, gjord av rätt roll |
| Kommentarer | 11 | Från hyresgäst, tekniker och förvaltare |

Tiderna räknas från när filen läses in, så listorna ser alltid aktuella ut.

## 5. Logga in i appen

Inloggningen kommer med story 1 (Logga in med roll). Tills dess svarar backend 401 på allt utom `/api/ping`.

Alla användare i testdatan har lösenordet **`test1234`**. En per roll:

| Roll | E-post | Namn |
|---|---|---|
| Förvaltare | `forvaltare@felanmalan.se` | Maria Lindqvist |
| Tekniker | `tekniker@felanmalan.se` | Ali Hassan |
| Hyresgäst | `hyresgast@felanmalan.se` | Anna Karlsson, Solrosen lgh 1001 |

Fler att testa med, t.ex. att en förvaltare bara ser sina fastigheter eller att en tekniker bara ser sina ärenden:

| Roll | E-post |
|---|---|
| Förvaltare (Eken) | `johan.berg@felanmalan.se` |
| Tekniker | `sofia.nilsson@felanmalan.se`, `erik.johansson@felanmalan.se` |
| Hyresgäst utan lägenhet | `nils.holm@example.com` |

Alla e-postadresser finns i `db/testdata.sql`.

## 6. Titta i databasen: tre sätt

Uppgifterna finns i din `.env`. Om du inte har ändrat något:

| Fält | Värde |
|---|---|
| Databas | `felanmalan` |
| Användare | `felanmalan` |
| Lösenord | `byt-mig` |

### a) Adminer i webbläsaren (enklast)

Öppna http://localhost:8081 och fyll i:

| Fält | Värde |
|---|---|
| System | `PostgreSQL` |
| Server | `db` |
| Användarnamn, lösenord, databas | Från `.env` |

Där kan du bläddra i tabellerna, se data och köra SQL.

### b) psql i terminalen

```bash
docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

| Kommando | Gör |
|---|---|
| `\dt` | Listar tabellerna |
| `\d tickets` | Visar en tabell |
| `SELECT * FROM users;` | Visar alla användare |
| `\q` | Avslutar |

### c) IntelliJ, DBeaver eller ett annat databasverktyg

| Fält | Värde |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Databas, användare, lösenord | Från `.env` |

Får du "role felanmalan does not exist" har du en annan PostgreSQL installerad på datorn som tar porten. Stoppa den (Mac: `brew services stop postgresql`) eller använd Adminer.

## 7. Java (JDK)

Kör du allt i Docker behöver du ingen JDK. Ska du köra backend eller tester i IntelliJ behöver du JDK 21 (Eclipse Temurin). Se "Behöver jag installera Java (JDK)?" i [README](../README.md).

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-26 | Första versionen |
