# Definition of Done

## Vad är Definition of Done?

Definition of Done (DoD) är teamets gemensamma lista över vad som måste vara uppfyllt för att **vilken story som helst** ska räknas som klar.

Acceptanskriterierna säger vad som gäller för en specifik story. DoD säger vad som gäller för alla.

## Problemet DoD löser

Fråga fyra utvecklare om en story är klar och du får fyra svar:

- Lina: "Den är klar, det funkar på min dator."
- Jonas: "Klar, men jag har inte pushat än."
- Sara: "Klar, men någon behöver granska den."
- Amir: "Klar och mergad, men jag har inte testat den mot acceptanskriterierna."

Alla säger "klar", men de menar olika saker. På reviewn visar det sig att hälften inte fungerar. DoD gör att "klar" betyder samma sak för alla.

## Acceptanskriterier och DoD

| | Acceptanskriterier | Definition of Done |
|---|---|---|
| **Gäller** | En specifik story | Alla stories |
| **Beskriver** | Vad användaren ska kunna göra | Vilken kvalitet arbetet ska hålla |
| **Exempel** | "Man kan inte spara en syssla utan namn." | "Koden är granskad av minst en annan i teamet." |
| **Skrivs** | Per story, inför sprinten | En gång, revideras i retron |

En story är klar när **både** acceptanskriterierna och DoD är uppfyllda.

## Exempel: Sysslos DoD, version 1

> En story är klar när:
>
> 1. Alla acceptanskriterier är uppfyllda och testade för hand.
> 2. Koden ligger i `main` via en pull request.
> 3. Pull requesten är granskad och godkänd av minst en annan i teamet.
> 4. Applikationen startar och körs utan fel efter mergen.
> 5. Det finns inga `console.log`, utkommenterad kod eller TODO kvar i ändringen.
> 6. Kortet på boarden är flyttat till "Klart".
> 7. README eller `docs/` är uppdaterad om ändringen påverkar hur man startar eller använder projektet.

Lägg märke till att listan är kort och att varje punkt går att kontrollera med ja eller nej.

## DoD växer över tid

Börja enkelt. En DoD med 20 punkter som ingen följer är sämre än en med 6 som alla följer. Lägg till punkter när retron visar att något behövs.

**Sysslo, efter sprint 2:** Två gånger har en story mergats som sedan förstörde något annat. I retron lägger teamet till:

> 8. Det finns minst ett test för den nya backend-logiken, och alla tester går igenom.

**Sysslo, efter sprint 4:** Läraren påpekade på reviewn att appen var svår att använda på mobilen. Teamet lägger till:

> 9. Vyn är kontrollerad i mobilbredd.

Varje gång ni ändrar DoD: skriv i retron *varför* ni ändrade den. Det är bra underlag för den individuella reflektionen.

## Var används DoD?

- **När man skapar en PR:** gå igenom listan innan du ber om granskning.
- **När man granskar en PR:** granskaren kontrollerar mot listan.
- **Inför review:** bara stories som uppfyller DoD får visas som klara.
- **I retron:** behöver DoD ändras?

Tips: lägg in DoD som en checklista i PR-mallen. Då påminns ni varje gång. Det tittar vi på i pass 3.

## Vanliga misstag

**För ambitiös från början**
"100 % testtäckning" eller "fullständig dokumentation" låter bra, men blir inte av. Då slutar teamet bry sig om DoD helt.

**För vag**
"Koden ska vara bra" går inte att kontrollera. Vad betyder "bra"?

**Glömd efter sprint 1**
DoD är inte ett dokument man skriver för att läraren vill det. Den ska användas varje gång något blir klart.

**Bara en person som bryr sig**
Hela teamet ska känna till och stå bakom DoD. Gå igenom den tillsammans när ni skriver den.

## Frågor att kunna svara på

- Vad är skillnaden mellan acceptanskriterier och Definition of Done?
- Varför är det bättre att börja med en kort DoD?
- Ge ett exempel på när en retro kan leda till en ändring i DoD.
- Hur hänger DoD ihop med kodgranskning?
