# Veckoplan: sprint 1

Sprint 1 pågår måndag 2026-10-26 till söndag 2026-11-01. Vi har lite erfarenhet av Scrum, så här står steg för steg vad som händer och vem som gör vad. Allt bygger på lärarens [`01-sprintrytmen.md`](../../resurser/01-sprintrytmen.md) och [`02-sprint-planning.md`](../../resurser/02-sprint-planning.md).

| Roll | Vem |
|---|---|
| Product Owner (PO) | Jose Muñoz |
| Scrum Master (SM) | Ermias Demessie |
| Utvecklare | Alla, även PO och SM |

**Kanske två till:** Benjamin och Leo bestämmer måndag 2026-10-26, efter ett möte med läraren, om de går med i gruppen. Planeringen har plats för dem (se nedan).

## Före mötet (senast söndag 2026-10-25)

Alla:

- [ ] `git switch main && git pull && docker compose up --build -V`. Startsidan ska visa "Backend: ok" (när PR #40 är mergad och har kommit till `main`). Fungerar det inte: säg till i Slack.
- [ ] Läs [`01-sprintrytmen.md`](../../resurser/01-sprintrytmen.md), [`02-sprint-planning.md`](../../resurser/02-sprint-planning.md) och [`03-infor-review.md`](../../resurser/03-infor-review.md). Läs [`04-git-rutiner.md`](../../resurser/04-git-rutiner.md) och [`05-konflikter-forebygga-och-losa.md`](../../resurser/05-konflikter-forebygga-och-losa.md) ordentligt.
- [ ] Läs [planning.md](planning.md) (förslaget) och [att diskutera](../../att-diskutera.md).

PO (Jose): korten #9, #6, #11, #12, #13 och #14 är redo (acceptanskriterier och storlek). Det är ungefär dubbelt så mycket som vi tror att vi hinner.

## Måndag 2026-10-26: mötet

Första veckan finns ingen review eller retro, bara planning. SM håller tiden.

| Tid | Punkt | Leds av | Resultat |
|---|---|---|---|
| 5 min | Läxorna: är allt klart? (tabellerna i [att diskutera](../../att-diskutera.md), punkt 1) | SM | Det som saknas får en ansvarig |
| 10 min | Gruppkontraktet: tid och plats för standup (punkt 11), PR-storlek och grennamn (punkt 2) | SM | Texten till kontraktet. SM gör PR:en samma dag |
| 30 min | Sprint planning: sprintmål, kapacitet, kort, ansvariga, vilka filer korten rör | PO | Ifylld [planning.md](planning.md) |
| 10 min | U1: de tre frågorna om inloggningen (punkt 7) | Jose | Beslut #8 i beslutsloggen |
| 5 min | Mappstrukturen och merge-strategin (punkt 3) | PO | Beslut i beslutsloggen, eller "bestäms när vi bygger #6" |

Efter mötet:

- PO sätter fältet **Sprint** till "Sprint 1" på de valda korten och flyttar dem till **Att göra**. Korten som inte togs in ligger kvar i Backlog.
- PO gör en PR med den ifyllda `planning.md`.
- Vi börjar bygga #6 tillsammans.

## Om Benjamin och Leo går med

Samma dag, med hjälp av någon i gruppen:

- [ ] Bjuds in till organisationen **Tre-Musketradar** på GitHub (Ermias är admin) och till Slack.
- [ ] Läser [introduktionen](../../introduktion.md). Där står vad vi bygger, hur vi jobbar och vilken teknik vi använder.
- [ ] Startar projektet enligt [README](../../../README.md). Startsidan ska visa "Backend: ok".
- [ ] Skriver under [gruppkontraktet](../../gruppkontrakt.md) i en egen gren och PR. Det blir deras första PR, och så övar de flödet.
- [ ] Läggs till i `planning.md` (kapacitet och kort) och i teamtabellen i README.

I sprint 1 tar de ett kort tillsammans eller i par med någon av oss, gärna #12 eller #13. Rollerna PO och SM ändras inte den här sprinten.

## Veckan

| Dag | Vad |
|---|---|
| **Måndag** | Mötet. Sedan #6 tillsammans: en vid tangentbordet, de andra tittar och föreslår. Eller två par: ett på backend (endpoint, JWT, testanvändare i `V2`), ett på frontend (inloggningssida, routern, skyddade sidor) |
| **Tisdag** | Standup. #6 blir klar och mergas. Nu finns mönstret: så ser en komponent, ett API-anrop, en endpoint och en migration ut |
| **Onsdag** | Standup. Lektion och avstämning med läraren. Var och en börjar på sitt kort (#11, sedan #12). Följ mönstret från #6 |
| **Torsdag** | Standup. Bygga och granska. Den som blir klar granskar öppna PR:er innan nästa kort |
| **Fredag** | Standup. Det som ska visas måste vara mergat i `staging`. Release-PR `staging → main` (merge commit). Börja med del 1 i [review.md](review.md) |
| **Söndag kväll** | Del 1 i `review.md` är klar. Demot är testat från en uppdaterad `main` |
| **Måndag 2026-11-02** | Review med läraren (ca 20 min) → retro (15–20 min) → planning för sprint 2 |

## Vad Product Owner gör

- Ser till att korten överst i backloggen är redo inför varje planning: acceptanskriterier, storlek, inga XL.
- Leder sprint planning och fyller i `planning.md`.
- Svarar på frågor om vad en story betyder. Är något oklart i acceptanskriterierna bestämmer PO, och skriver in det i issuen.
- Bestämmer vad som är viktigast om tiden inte räcker. Sprintmålet går först.
- Inför sprint 2: lägger nya kort från reviewns feedback i backloggen.

## Vad Scrum Master gör

- **Varje dag tisdag–fredag:** leder standupen (max 15 minuter) och loggar den direkt efteråt i [standup.md](standup.md). Bara SM skriver i filen. Committa loggen i en egen gren och PR, gärna en gång i veckan på fredag.
- Frågar "vad hindrar dig?" och ser till att någon tar hand om hindret efter standupen.
- Påminner om PR:er som väntar på granskning (gruppkontraktet: samma dag före kl. 12, annars nästa vardag).
- Ser till att release-PR:en `staging → main` görs på fredag.
- **Måndag:** håller tiden på review, retro och planning, och leder retron (fyll i [retro.md](retro.md)).

## Vad alla gör

- Flyttar sitt kort på boarden: Att göra → Pågår (när man börjar) → Granskas (när PR:en är öppen). Klart sker automatiskt med `Closes #`.
- En gren och en PR per kort. Grenen skapas från `staging`. Uppdatera grenen från `staging` varje dag (`git pull origin staging`).
- Säger på standupen vilka filer man ska ändra.
- Ber om hjälp i Slack efter en timme som man suttit fast.
- Skriver egna anteckningar till den individuella reflektionen (en rad om dagen räcker).

## Filerna för sprint 1

| Fil | När | Vem |
|---|---|---|
| [veckoplan.md](veckoplan.md) | Det här dokumentet | Alla läser |
| [planning.md](planning.md) | Måndag 2026-10-26 | PO leder, alla bidrar |
| [standup.md](standup.md) | Tisdag–fredag | Bara SM |
| [review.md](review.md) | Del 1 senast söndag 2026-11-01, del 2 måndag 2026-11-02 | Alla |
| [retro.md](retro.md) | Måndag 2026-11-02 | SM leder, alla bidrar |
