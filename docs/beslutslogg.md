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
