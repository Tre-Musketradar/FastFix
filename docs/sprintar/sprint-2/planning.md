# Sprint planning: sprint 2

<!--
  Förberett av Jose före mötet (2026-11-02). Det som står här är ett förslag:
  gå igenom det på mötet efter retron, ändra det ni inte håller med om och fyll i det som är tomt.
-->

**Datum:** måndag 2026-11-02
**Deltagare:** Jose Muñoz, Martin Friis, Ermias Demessie
**Product Owner denna sprint:** Jose Muñoz
**Scrum Master denna sprint:** Ermias Demessie

## Sprintmål

> Förslag: Inloggningen är mergad, och förvaltaren kan lägga till fastigheter och lägenheter och koppla en hyresgäst till en lägenhet.

## Kapacitet

<!-- Är någon borta eller har mindre tid den här veckan? Fråga alla på mötet. -->

- Jose:
- Martin:
- Ermias:

## Från förra retron

<!-- Förslag från retro.md i sprint 1. Ändra om retron beslutar något annat. -->

- Granskning först: varje dag efter standupen granskar vi öppna PR:er innan vi bygger vidare. Scrum Master påminner.
- PR:en öppnas så fort ett litet steg är klart, inte i slutet av veckan.
- Planeringen fylls i och mergas i dag, och fältet Sprint sätts på korten.

## Valda stories

| Issue | Story | Storlek | Ansvarig | Kommentar |
|---|---|---|---|---|
| #9 | U1: Inloggning med JWT | – | Jose | Bara granskning: PR #47 |
| #6 | 1 Logga in med roll | L | Jose | Byggd i sprint 1. Kvar: granskning och merge av PR #48, #50, #49, #51–#56 i den ordningen. Martin och Ermias granskar (10–15 min per PR) |
| #11 | 2 Lägga till fastighet | M | Martin | Fortsätter grenen `feature/lägg-till-fastighet`. Följer mönstret från #6 (`features/properties`, paketet `property`) |
| #12 | 3 Lägga till lägenheter | M | Jose | Efter #11, samma del av koden. Kan börja med frontend och `msw` medan #11 granskas |
| #13 | 4 Lägga till hyresgäst | M | Ermias | Efter #6 (tabellen `users`) och #12 (`apartments.tenant_id`) |

**Reserv om allt ovan blir klart:** #14 Skapa felanmälan (M).

**Totalt:** 0 S, 3 M + granskning av L (#6). Sprint 1 blev inget kort klart, så vi tar inte in mer än det här.

## Vilka filer rör korten?

| Ställe | Kort | Hur vi undviker krockar |
|---|---|---|
| `App.tsx` (routes), `shared/Layout.tsx` (menyn) | #11, #12, #13 | Var och en lägger bara till sin egen rad. Uppdatera grenen från `staging` varje dag |
| `backend/.../property/`, `frontend/src/features/properties/` | #11, #12 | Efter varandra. #12 börjar på backend först när #11 är mergad |
| `backend/.../tenant/`, `user/`, `frontend/src/features/tenants/` | #13 | Bara #13 |
| `SecurityConfig` | – | Behövs inte ändras. Behörighet per roll sätts med `@PreAuthorize("hasRole('MANAGER')")` i controllern |
| Flyway-migrationer | – | Alla tabeller finns redan i `V1`. Den som behöver en ny migration säger det på standupen och tar nästa nummer (`V3`) |

## Risker och osäkerheter

- Granskningen av story 1 tar tid från de nya korten. Därför granskar vi först, varje dag.
- #11–#13 hänger ihop i en kedja (fastighet → lägenhet → hyresgäst). Blir #11 sen blir allt sent. Frontend kan börja med `msw` under tiden.
- Konflikter i tabellerna "Ändringar" när story 1-PR:erna mergas. Jose löser dem efter varje merge.
