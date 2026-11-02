# Retrospektiv: sprint 1

<!--
  INSTRUKTION
  Direkt efter reviewn, ungefär 15–20 minuter. Scrum Master leder.
  1. Följ upp förra retrons åtgärder: blev de av? Hjälpte de?
  2. Alla skriver tyst i 3 minuter: vad gick bra, vad gick mindre bra. Sedan går ni igenom det tillsammans.
  3. Välj högst 2–3 åtgärder. Varje åtgärd ska vara konkret och ha en ansvarig.
  4. Behöver Definition of Done eller gruppkontraktet ändras?
  Retron handlar om HUR ni har jobbat, inte om vad ni byggt. Det tas på reviewn.
  Skriv ärligt. Det här är bra underlag för er individuella reflektion.
-->

**Datum:** måndag 2026-11-02, direkt efter reviewn
**Deltagare:** Jose Muñoz, Martin Friis, Ermias Demessie
**Leds av:** Ermias Demessie (Scrum Master)

## Förra retrons åtgärder

> **Exempel:**
>
> | Åtgärd | Blev den av? | Hjälpte den? |
> |---|---|---|
> | PR:er granskas inom 24 timmar | Ja, nästan alltid | Ja, mycket färre PR:er som låg och väntade |

Första sprinten, ingen tidigare retro.

<!--
  Punkterna nedan är FÖRSLAG från Jose, som underlag för Scrum Master.
  Stryk det ni inte håller med om och lägg till era egna punkter på mötet.
-->

## Vad gick bra?

> **Exempel:**
> - Standupen tog aldrig mer än 10 minuter.
> - Lina och Jonas parprogrammerade API-kopplingen och båda förstår den nu.

- Story 1 delades upp i sju små PR:er enligt lärarens råd, var och en med egna tester. CI är grönt på alla.
- Besluten (JWT, mappar efter funktion) skrevs in i beslutsloggen innan koden byggdes, så alla kan följa mönstret.
- Testdatan och instruktionsboken gör att alla kan starta projektet och logga in på samma sätt.

## Vad gick mindre bra?

> **Exempel:**
> - PR:er låg ogranskade i upp till två dagar.
> - Vi tog in för mycket. Två stories blev inte klara.
> - Ingen visste att Amir satt fast med Docker förrän torsdag.

- Ingen PR blev granskad under sprinten. Tio PR:er väntar, så inget kort blev klart enligt DoD.
- PR:erna öppnades i slutet av veckan, så det fanns ingen tid kvar att granska.
- Planeringen fylldes aldrig i och fältet Sprint sattes inte på boarden. Det är oklart vad vi lovade.
- Standupen hölls inte alla dagar, och loggen kom först efter sprinten.
- #11–#13 väntade på inloggningen. Vi bröt inte beroendet, t.ex. med `msw` i frontend.

## Åtgärder till nästa sprint

<!-- Högst 2–3. Konkreta, med ansvarig. "Bli bättre på att kommunicera" är inte en åtgärd. -->

> **Exempel:**
>
> | Åtgärd | Ansvarig |
> |---|---|
> | PR:er granskas inom 24 timmar. | Amir påminner på standupen |
> | Den som sitter fast mer än en timme säger till i Discord. | Alla |
> | Vi tar in en story mindre än förra sprinten. | Sara (PO) |

| Åtgärd | Ansvarig |
|---|---|
| Granskning först: varje dag efter standupen granskar vi öppna PR:er innan vi bygger vidare (enligt gruppkontraktet, före kl. 12) | Scrum Master påminner på standupen |
| Öppna PR:en så fort ett litet steg är klart, inte i slutet av veckan. Högst en dag mellan "Pågår" och "Granskas" | Alla |
| Planeringen fylls i och mergas på måndagen, och fältet Sprint sätts på korten samma dag | Product Owner |

## Ändringar i Definition of Done eller gruppkontrakt

<!-- Om ni ändrar något: uppdatera dokumentet och skriv här vad och varför. -->

> **Exempel:** Ny punkt i gruppkontraktet: "Pull requests granskas inom 24 timmar."

-
