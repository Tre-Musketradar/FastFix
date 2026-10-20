# Gruppkontrakt

Kontraktet får ändras under kursen. Ändringar tas upp på retron, alla måste vara överens och ändringen skrivs in i tabellen längst ner.

**Grupp:** Tre-Musketradar (Felanmälan)
**Datum:** 2026-10-15

## Tillgänglighet

- Vi har flexibla arbetstider: var och en planerar sina egna timmar.
- Alla är med på kursens schemalagda pass och på våra ceremonier: daily standup, sprint planning, review och retro.
- Vardagar svarar vi på meddelanden i Slack inom 24 timmar.
- Helger är frivilliga. Ingen förväntas svara då.
- Den som vet att den inte kan jobba under en period säger till i Slack i förväg.

## Kommunikation

- Slack används för daglig kontakt, frågor och snabba beslut.
- Frågor om specifik kod tas som kommentarer på pull requesten.
- Vad som görs och vem som gör det syns på boarden i GitHub Projects, inte bara i Slack.
- Vi ger feedback på koden, inte på personen, och förklarar varför.

## Närvaro och frånvaro

- Frånvaro meddelas i Slack innan daily standup samma dag.
- Den som missar daily standup skriver sin rad i sprintens `standup.md` samma dag.
- Den som missar planning, review eller retro läser anteckningarna i `docs/sprintar/` och tar upp frågor i Slack.

## Arbetsfördelning

- Stories fördelas på sprint planning. Den som börjar på en story sätter sig som ansvarig på issuen och flyttar kortet till "Pågår".
- Var och en har ett fokusområde (se [projektförslaget](projektforslag.md#arbetsfördelning)), men tar minst en story per sprint i det andra lagret (frontend eller backend), så att alla kan förklara hela koden.
- Scrum Master roterar varje vecka.
- Den som kört fast i mer än en timme ber om hjälp i Slack.
- Den som blir klar granskar öppna pull requests innan den tar en ny story.

## Beslut

- Mindre beslut tar den som äger storyn.
- Större beslut (stack, arkitektur, ändringar i MVP:n eller databasschemat) tas gemensamt och skrivs in i [beslutsloggen](beslutslogg.md).
- Om vi inte kommer överens röstar vi. Vi är tre, så det blir alltid en majoritet.

## Kod och kvalitet

- Pull requests som öppnas före kl. 12 granskas samma dag. Senare pull requests granskas nästa vardag före kl. 12.
- Ingen mergar sin egen pull request utan att minst en annan i teamet har godkänt den.
- All kod går via en gren och en pull request till `staging`. Ingen pushar direkt till `staging` eller `main` (se [CONTRIBUTING.md](CONTRIBUTING.md)).
- En story är klar först när den uppfyller [Definition of Done](definition-of-done.md).
- Dokumentation skrivs på svenska, commit-meddelanden och pull requests på engelska.

## Om någon inte följer kontraktet

1. Vi tar upp det direkt med personen.
2. Om det fortsätter tar vi upp det på retron.
3. Om det fortfarande inte löser sig tar vi upp det med läraren.

## Underskrifter

Vi har läst kontraktet och är överens om det.

| Namn | Datum |
|---|---|
| Jose Muñoz | 2026-10-16 |
| Martin Friis | 2026-10-16 |
| Ermias Demessie | 2026-10-16 |

## Ändringar

| Datum | Ändring | Varför |
|---|---|---|
| 2026-10-15 | Första versionen | — |
