# Veckoplan: sprint 2

Sprint 2 pågår måndag 2026-11-02 till söndag 2026-11-08. Samma rytm som i [sprint 1](../sprint-1/veckoplan.md), men nu med review och retro först på måndagen. Allt bygger på lärarens [`01-sprintrytmen.md`](../../resurser/01-sprintrytmen.md) och [`03-infor-review.md`](../../resurser/03-infor-review.md).

| Roll | Vem |
|---|---|
| Product Owner (PO) | Jose Muñoz |
| Scrum Master (SM) | Ermias Demessie |
| Utvecklare | Alla tre, även PO och SM |

## Måndag 2026-11-02: mötena

SM håller tiden. Totalt ungefär 1,5 timme.

| Tid | Punkt | Leds av | Resultat |
|---|---|---|---|
| 20 min | Review av sprint 1 med läraren | PO | Del 2 i [sprint-1/review.md](../sprint-1/review.md): feedback och ändringar i backloggen |
| 15–20 min | Retro av sprint 1 | SM (Ermias) | Ifylld [sprint-1/retro.md](../sprint-1/retro.md) med 2–3 åtgärder |
| 30–45 min | Planning av sprint 2 | PO | Ifylld [planning.md](planning.md): roller, sprintmål, kapacitet, kort, ansvariga |

Efter mötet:

- PO sätter fältet **Sprint** till "Sprint 2" på de valda korten och flyttar dem till **Att göra**. #6 och #9 flyttas till "Sprint 2" (de fortsätter).
- PO gör en PR med de ifyllda filerna (review del 2, retro, planning).
- Martin och Ermias börjar granska story 1 i ordning: #47 → #48 → #50 → #49 → #51 → #52 → #53 → #54 → #55 → #56.

## Veckan

| Dag | Vad |
|---|---|
| **Tisdag** | Standup. Granska först (story 1, sedan andra öppna PR:er), sedan bygga. Jose löser konflikter efter varje merge |
| **Onsdag** | Standup. Lektion och avstämning med läraren. Story 1 ska vara mergad, så att #11–#13 kan testas med riktig inloggning |
| **Torsdag** | Standup. Bygga och granska. Den som blir klar granskar innan nästa kort |
| **Fredag** | Standup. Det som ska visas är mergat i `staging`. Release-PR `staging → main`. Börja med del 1 i [review.md](review.md) |
| **Söndag kväll** | Del 1 i `review.md` är klar. Demot är testat från en uppdaterad `main`, med testdata inläst |
| **Måndag 2026-11-09** | Review av sprint 2 → retro → planning av sprint 3 |

## Checklista för Scrum Master

Varje dag tisdag–fredag:

- [ ] Leder standupen (max 15 minuter). Var och en säger: igår, idag, hinder och **vilka filer** man ska ändra.
- [ ] Loggar den direkt efteråt i [standup.md](standup.md) i den här mappen (inte i `sprint-mall/`). Bara SM (Ermias) skriver i filen.
- [ ] Går igenom öppna PR:er: finns det någon som väntar på granskning? Vem tar den?
- [ ] Ser till att någon tar hand om varje hinder efter standupen.

Fredag:

- [ ] Committar standup-loggen i en egen gren och PR (t.ex. `docs/standup-sprint-2`).
- [ ] Ser till att release-PR:en `staging → main` görs.
- [ ] Påminner om del 1 i `review.md` och att boarden stämmer.

Måndag 2026-11-09:

- [ ] Håller tiden på review, retro och planning.
- [ ] Leder retron och fyller i [retro.md](retro.md). Börja med att följa upp åtgärderna från sprint 1.

## Vad alla gör

- Granskar först, bygger sedan (åtgärd från retron i sprint 1).
- Öppnar PR:en så fort ett litet steg är klart. En PR ska gå att granska på 10–15 minuter.
- Flyttar sitt kort på boarden: Att göra → Pågår → Granskas. Klart sker automatiskt med `Closes #`.
- Uppdaterar grenen från `staging` varje dag (`git pull origin staging`).
- Säger på standupen vilka filer man ska ändra.
- Ber om hjälp i Slack efter en timme som man suttit fast.

## Filerna för sprint 2

| Fil | När | Vem |
|---|---|---|
| [veckoplan.md](veckoplan.md) | Det här dokumentet | Alla läser |
| [planning.md](planning.md) | Måndag 2026-11-02 | PO leder, alla bidrar |
| [standup.md](standup.md) | Tisdag–fredag | Bara SM |
| [review.md](review.md) | Del 1 senast söndag 2026-11-08, del 2 måndag 2026-11-09 | Alla |
| [retro.md](retro.md) | Måndag 2026-11-09 | SM leder, alla bidrar |
