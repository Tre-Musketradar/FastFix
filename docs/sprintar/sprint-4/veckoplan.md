# Veckoplan: sprint 4

Sprint 4 pågick måndag 2026-11-16 till söndag 2026-11-22. Den här filen skrevs i efterhand (2026-11-23) och sammanfattar vad som blev gjort, vad som pågår och vad vi tar med oss till retron.

| Roll | Vem |
|---|---|
| Product Owner (PO) | *(fyll i)* |
| Scrum Master (SM) | *(fyll i)* |
| Utvecklare | Alla tre |

## Klart under sprinten

Fem stories blev klara och stängdes:

| Story | Vad användaren kan nu | PR:er | Vem |
|---|---|---|---|
| #11 Lägga till fastighet | Förvaltaren ser sina fastigheter och lägger till nya | #59, #62 | Martin |
| #12 Lägga till lägenheter | Förvaltaren ser lägenheterna i en fastighet och lägger till nya | #63 | Martin |
| #16 Se mina ärenden (hyresgäst) | Hyresgästen ser sina ärenden, nyaste först, och kan öppna detaljerna | #66, #67 | Jose |
| #17 Se alla öppna ärenden (förvaltare) | Förvaltaren ser alla ärenden som inte är stängda, nya först, med sök och filter på fastighet | #68 | Martin |
| #19 Se tilldelade ärenden (tekniker) | Teknikern ser sina uppdrag med adress, prioritet och om huvudnyckel får användas | #70, #71 | Jose |

## Pull requests som mergades

Tio PR:er med kod och en med dokumentation:

| Datum | PR | Vad | Vem |
|---|---|---|---|
| 2026-11-16 | #59 | Fastigheter: backend och sida (#11) | Martin |
| 2026-11-16 | #62 | Fastigheter: route, meny och tester (#11) | Martin |
| 2026-11-16 | #63 | Lägenheter i en fastighet (#12) | Martin |
| 2026-11-18 | #65 | Lägenheterna flyttade till paketet `property` enligt projektstrukturen, Prettier på frontend | Jose |
| 2026-11-19 | #66 | `Ticket`-entiteten och `GET /api/tickets/mine` (#16) | Jose |
| 2026-11-20 | #67 | Hyresgästens lista och detaljvy (#16) | Jose |
| 2026-11-21 | #68 | Förvaltarens öppna ärenden (#17) | Martin |
| 2026-11-22 | #69 | Testet för öppna ärenden beror inte längre på databasens innehåll | Jose |
| 2026-11-22 | #70 | `GET /api/tickets/assigned` för tekniker (#19) | Jose |
| 2026-11-22 | #71 | Teknikerns lista (#19) | Jose |
| 2026-11-22 | #72 | Gruppkontraktet och beslut #10: möten i Teams, sms när man inte kommer åt datorn | Jose |

Release `staging → main`: **#74** (öppnad 2026-11-23).

## Pågår vid sprintens slut

| Story | Status | Ansvarig | Nästa steg |
|---|---|---|---|
| #18 Tilldela tekniker | PR #73 öppen | Martin | Uppdatera grenen från `staging` (teknikerns lista finns nu från #19) |
| #20 Ändra status | Pågår | Jose | Började efter #19, som nu är mergad |
| #13 Lägga till hyresgäst | Pågår | Ermias | |
| #14 Skapa felanmälan | Att göra | Ermias | Bygger vidare på `ticket/` (`Ticket`, `TicketRepository`, `TicketService`, `TicketController`) |
| #15 Ange huvudnyckel | Att göra | Ermias | Görs tillsammans med #14 (samma formulär) |

## Till retron

Förslag att ta upp. Retron bestämmer vad vi gör.

1. **Tester som beror på vad som finns i databasen.** Några backendtester tog "förvaltarens nyaste fastighet" och föll lokalt med testdatan inläst, även om CI var grönt (där är databasen tom). Lösningen i #69: varje test skapar sina egna användare och sin egen data, och `@Transactional` rullar tillbaka allt.
2. **Två stories byggde samma sak.** #18 och #19 lade båda till en lista för teknikern och samma endpoint (`GET /api/tickets/assigned`). Förslag: på planning skriver vi in beroenden mellan stories i issuen, och på standupen säger vi vilka filer och endpoints vi ska ändra.
3. **PR-titlar och Definition of Done.** Beskrivande titlar på engelska (inte "add feature"), och kryssa i DoD i PR:en (punkt 3 kryssas av granskaren).
4. **Bra:** fem stories klara, många små PR:er som gick att granska snabbt, och alla tre rollerna har nu en egen startsida.
