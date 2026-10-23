## Vad gör den här pull requesten?

<!-- Kort beskrivning av ändringen. -->

Closes #<!-- issuenummer, t.ex. Closes #4. Då stängs issuen och kortet flyttas till Klart när PR:en mergas. -->

## Hur testar man den?

<!--
  Steg för granskaren. Utgå från acceptanskriterierna.
  Exempel:
  1. Starta appen med `docker compose up --build` och logga in som hyresgäst.
  2. Skicka en felanmälan utan beskrivning: ett felmeddelande ska visas.
  3. Skicka en felanmälan med beskrivning: den ska synas direkt i listan med status Ny.
-->

1.
2.

## Definition of Done

<!--
  Samma punkter, i samma ordning, som i docs/definition-of-done.md.
  Ändras DoD ska den här listan ändras i samma PR.
  Punkt 3 och 7 kan bara bockas av av granskaren eller efter mergen.
-->

- [ ] 1. Alla acceptanskriterier är uppfyllda och testade för hand
- [ ] 2. PR:en går mot `staging` och CI är grönt
- [ ] 3. Granskad och godkänd av minst en annan i teamet (Review changes → Approve)
- [ ] 4. Applikationen startar och körs utan fel (`docker compose up --build`)
- [ ] 5. Inga `console.log`, utkommenterad kod eller TODO kvar i ändringen
- [ ] 6. README eller `docs/` är uppdaterad om ändringen påverkar hur man startar eller använder projektet
- [ ] 7. Kortet på boarden flyttas till "Klart" efter mergen (sker automatiskt med `Closes #`)

## Till granskaren

<!-- Något särskilt du vill att granskaren tittar på? Något du är osäker på? -->
