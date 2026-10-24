# Sprint planning: sprint 1

<!--
  Förberedd av Product Owner före mötet (2026-10-24). Det som står här är ett förslag:
  gå igenom det på mötet, ändra det ni inte håller med om och fyll i det som är tomt.
-->

**Datum:** måndag 2026-10-26
**Deltagare:**
**Product Owner denna sprint:** Jose Muñoz
**Scrum Master denna sprint:** Ermias Demessie

## Sprintmål

> Förslag: En användare kan logga in med sin roll, och förvaltaren kan lägga till fastigheter och lägenheter som sparas i databasen.

## Kapacitet

<!-- Är någon borta eller har mindre tid den här veckan? Fråga alla på mötet. -->

- Jose:
- Martin:
- Ermias:
- Benjamin (om hen går med efter mötet med läraren):
- Leo (om hen går med efter mötet med läraren):

## Från förra retron

- Första sprinten, ingen retro än.

## Valda stories

Korten är redo: de har acceptanskriterier och storlek (se [user stories](../../user-stories.md)). Ansvariga som redan står på boarden är ifyllda.

| Issue | Story | Storlek | Ansvarig | Kommentar |
|---|---|---|---|---|
| #9 | U1: Inloggning med JWT | max ½ dag | Jose | Först. Ger beslut #8 i beslutsloggen. Rör inga filer, bara beslut |
| #6 | 1 Logga in med roll | L | Jose | **Byggs tillsammans** (första storyn). Rör `SecurityConfig`, Flyway `V2` (testanvändare), routern och `main.tsx` |
| #11 | 2 Lägga till fastighet | M | Martin | Efter #6: en fastighet behöver en förvaltare (`properties.owner_id`). Rör `properties` |
| #12 | 3 Lägga till lägenheter | M | | Efter #11, samma del av koden. Rör `apartments` |
| #13 | 4 Lägga till hyresgäst | M | | Reserv. Efter #6 och #12. Rör `users` och `apartments.tenant_id` |

Benjamin och Leo kan gå med måndag 2026-10-26, efter mötet med läraren. Går de med tar de hellre ett kort tillsammans eller i par med någon av oss (t.ex. #12 eller #13) än var sitt nytt kort. Den första dagen går till att komma igång (se [veckoplanen](veckoplan.md)).

**Reserv om allt ovan blir klart:** #14 Skapa felanmälan (M).

**Totalt:** 0 S, 3 M, 1 L + U1 (#13 som reserv)

## Vilka filer rör korten?

<!-- Lärarens fråga på planningen. Kort som rör samma ställe görs inte samtidigt. -->

| Ställe | Kort | Hur vi undviker krockar |
|---|---|---|
| `SecurityConfig`, routern, `main.tsx` | #6, sedan alla | #6 byggs först och tillsammans. Efter det lägger var och en bara till sin egen rad |
| Flyway-migrationer | #6 (`V2`) | Alla tabeller finns redan i `V1`. Den som behöver en ny migration säger det på standupen och tar nästa nummer |
| `properties`, `apartments` | #11, #12 | Efter varandra, helst samma person eller i par |
| `users` | #6, #13 | #13 börjar först när #6 är mergad |

## Risker och osäkerheter

- Ingen av oss har byggt inloggning med JWT och Spring Security förut. Därför U1 först och #6 tillsammans.
- Vi har lite erfarenhet av Scrum. Vi följer [veckoplanen](veckoplan.md) och tar hellre in för lite.
- #11–#13 kan inte testas med riktig inloggning förrän #6 är mergad. Frontend kan börja med `msw` (låtsas-API) under tiden.
- Mappstrukturen är inte bestämd ([att diskutera](../../att-diskutera.md), punkt 3). Den bestäms när vi bygger #6, så att alla andra kort följer samma mönster.
