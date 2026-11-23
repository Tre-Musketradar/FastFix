# Veckoplan: sprint 5

Sprint 5 pågår måndag 2026-11-23 till söndag 2026-11-29. Det är **den sista sprinten** före leveransen vecka 8. Mötena hålls i Microsoft Teams ([beslut #10](../../beslutslogg.md)).

| Roll | Vem |
|---|---|
| Product Owner (PO) | *(fyll i på planning)* |
| Scrum Master (SM) | *(fyll i på planning)* |
| Utvecklare | Alla tre |

## Sprintmål

> **Alla Must-stories (MVP:n) är klara och mergade, plus några Should.** En hyresgäst kan anmäla ett fel, förvaltaren tilldelar en tekniker, teknikern ändrar status och förvaltaren stänger ärendet, och alla ser historiken.

## Måndag 2026-11-23: mötena (Teams)

| Tid | Punkt | Leds av | Resultat |
|---|---|---|---|
| 15 min | Review av sprint 4 | PO | Demo av #11, #12, #16, #17, #19 (se [sprint-4/veckoplan.md](../sprint-4/veckoplan.md)) |
| 15 min | Retro av sprint 4 | SM | 2–3 åtgärder (förslag i [sprint-4/veckoplan.md](../sprint-4/veckoplan.md#till-retron)) |
| 30 min | Planning av sprint 5 | PO | Kort, ansvariga och ordning nedan bekräftade eller ändrade |

Efter mötet sätter PO fältet **Sprint** till "Sprint 5" på korten och flyttar dem till **Att göra**.

## Must: det som saknas för MVP:n

Förslag till ansvariga och ordning. Ändra på planning.

| Ordning | Story | Storlek | Förslag | Beror på | Rör |
|---|---|---|---|---|---|
| 1 | #18 Tilldela tekniker | M | Martin (PR #73) | #19 (klar) | `ticket/` (tilldelning), `ManagerOpenTickets` |
| 2 | #20 Ändra status | M | Jose | #19 (klar) | `ticket/`, `TechnicianTickets` |
| 3 | #22 Stänga ärende | S | Jose | #20 (samma kod för statusbyte) | `ticket/`, förvaltarens lista |
| 4 | #21 Se ärendets historik | S | Martin | #18, #20 (skriver i `status_history`) | `ticket/`, `TicketDetailsModal` |
| 5 | #13 Lägga till hyresgäst | M | Ermias | | `tenant/`, `features/tenants/` |
| 6 | #14 Skapa felanmälan | M | Ermias | `ticket/` (finns) | `ticket/`, `MyTickets` |
| 7 | #15 Ange huvudnyckel | S | Ermias | #14 (samma formulär) | samma som #14 |

**#14 är kärnan i appen:** utan den kan ingen anmäla ett fel. Testdatan har redan hyresgäster med lägenheter, så #14 kan byggas och testas parallellt med #13.

**Samma kod för statusbyten:** #18, #20, #22 och #21 rör alla status och `status_history`. #18 skriver redan i `status_history`. #20 följer samma sätt, så att #21 bara behöver läsa historiken.

## Should: om det finns tid

I den här ordningen, när ens Must-kort är klara eller väntar på granskning:

| Story | Storlek | Kommentar |
|---|---|---|
| #24 Filtrera och söka ärenden | M | Delvis gjort i #17 (sök och filter på fastighet för förvaltaren). Kvar: filter på status och kategori |
| #26 Ändra och ta bort fastigheter och lägenheter | M | Bygger på #11 och #12 |
| #23 Kommentera ärende | M | Tabellen `comments` finns redan i V1 |

#25 (översikt), #27 (bild), #28 (deploy) och Could-korten tas inte med i den här sprinten.

## Veckan

| Dag | Vad |
|---|---|
| **Måndag** | Mötena. Efteråt: release #74 (`staging → main`) granskas och mergas. #73 uppdateras från `staging` |
| **Tisdag** | Standup. #73 (#18) mergad. Alla Must-kort har en gren |
| **Onsdag** | Standup. **Avstämning:** alla Must-kort har en öppen PR (gärna draft). Saknas något tar vi upp det på standupen och hjälps åt eller fördelar om |
| **Torsdag** | Standup. Granska och merga Must. Den som är klar tar ett Should-kort eller granskar |
| **Fredag** | Standup. Allt som ska visas är mergat i `staging`. Release-PR `staging → main`. Testa hela flödet från `main` med testdatan |
| **Söndag kväll** | Demot är testat. Förberedelser för review och leverans |
| **Måndag 2026-11-30** | Review av sprint 5 och retro. Vecka 8: leverans |

## Hela flödet att testa på fredag

1. `hyresgast@felanmalan.se`: skapa en felanmälan med kategori, beskrivning och huvudnyckel Ja/Nej (#14, #15). Den syns direkt i **Mina ärenden** med status **Ny**.
2. `forvaltare@felanmalan.se`: ärendet syns först i **Öppna ärenden**. Tilldela det till Ali Hassan (#18), status blir **Tilldelad**.
3. `tekniker@felanmalan.se`: ärendet syns i **Mina uppdrag** med adress och huvudnyckel. Ändra status till **Pågår** och sedan **Åtgärdad** (#20).
4. `forvaltare@`: stäng ärendet (#22). Det försvinner från öppna ärenden.
5. `hyresgast@`: ärendet visas som **Stängt**, och historiken visar varje statusbyte med tid och vem (#21).
6. `forvaltare@`: lägg till en hyresgäst i en ledig lägenhet (#13). Hyresgästen kan logga in och ser sin lägenhet.

## Vad alla gör

- Granskar först, bygger sedan. En PR ska gå att granska på 10–15 minuter.
- Öppnar PR:en tidigt, gärna som draft, så att andra ser vad som pågår.
- Säger på standupen vilka filer och endpoints man ska ändra (`ticket/` delas av många kort den här veckan).
- Uppdaterar grenen från `staging` varje dag (`git pull origin staging`).
- Backendtester skapar sin egen data, så att de fungerar även med testdatan inläst (se #69).
- Beskrivande PR-titlar på engelska och ifylld Definition of Done.
- Ber om hjälp i Slack (eller med sms) efter en timme som man suttit fast.

## Checklista för Scrum Master

- [ ] Leder standupen tisdag–fredag (max 15 minuter) och loggar den.
- [ ] Onsdag: kollar att alla Must-kort har en öppen PR.
- [ ] Går igenom öppna PR:er varje dag: vem granskar?
- [ ] Fredag: ser till att release-PR:en `staging → main` görs.
- [ ] Måndag 2026-11-30: håller tiden på review och retro.
