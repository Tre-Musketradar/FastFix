# User stories

## Vad är en user story?

En user story beskriver en funktion **ur användarens perspektiv**. Den säger vem som vill något, vad de vill och varför. Den beskriver *inte* hur det ska byggas tekniskt.

### Formatet

```
Som [typ av användare]
vill jag [göra något]
så att [jag får ett värde av det]
```

**Exempel**

> Som hushållsmedlem
> vill jag kunna markera en syssla som gjord
> så att de andra ser att den är klar.

Alla tre delar är viktiga:

- **Som …** tvingar er att tänka på vem funktionen är till för.
- **vill jag …** beskriver vad användaren vill kunna göra.
- **så att …** förklarar varför. Den delen hoppar många över, men den hjälper er att prioritera och att förstå när en lösning är tillräckligt bra.

## De tre C:na

En user story är mer än en mening på ett kort:

- **Card:** själva texten, kort och enkel
- **Conversation:** diskussionen i teamet om vad storyn egentligen betyder
- **Confirmation:** hur ni vet att den är klar, alltså acceptanskriterierna (pass 2)

## INVEST: kännetecken på en bra story

| | Betyder | Fråga er |
|---|---|---|
| **I**ndependent | Oberoende | Kan den byggas utan att vänta på en annan story? |
| **N**egotiable | Förhandlingsbar | Är det en beskrivning av ett behov, inte en färdig specifikation? |
| **V**aluable | Värdefull | Får användaren något av den? |
| **E**stimable | Går att uppskatta | Förstår vi den tillräckligt för att bedöma storleken? |
| **S**mall | Liten | Kan den bli klar på några dagar? |
| **T**estable | Testbar | Går det att avgöra om den är klar? |

Alla stories behöver inte uppfylla allt perfekt, men om en story bryter mot flera är det ett tecken på att den bör skrivas om.

## Bra och dåliga exempel

**För stor**

> Som användare vill jag kunna hantera sysslor.

Vad betyder "hantera"? Skapa, ändra, ta bort, tilldela, markera som klar? Det här är flera stories. Dela upp den.

**Tekniskt formulerad**

> Som utvecklare vill jag skapa en tabell för sysslor i databasen.

Det här är en uppgift, inte en user story. Användaren bryr sig inte om tabeller. Tabellen behövs för att bygga en story, t.ex. "lägga till en syssla", och hör hemma som en uppgift under den storyn.

**Utan värde**

> Som användare vill jag ha en blå knapp.

Varför? Vad ska knappen göra? Om det finns ett verkligt behov bakom, skriv storyn utifrån det behovet.

**Bra**

> Som hushållsmedlem vill jag se vilka sysslor som är tilldelade mig så att jag vet vad jag ska göra.

Tydlig användare, tydligt mål, tydligt värde, och liten nog att byggas på kort tid.

## Var konkreta med användaren

Om alla stories börjar med "Som användare" har ni troligen inte tänkt igenom vilka användarna är. Finns det olika roller i appen?

- "Som **hushållsmedlem** vill jag …"
- "Som **den som skapat hushållet** vill jag …"
- "Som **ny medlem** vill jag …"

## Vertikala stories

Varje story ska helst gå **genom alla lager**: frontend, backend och databas. Då är den något användaren faktiskt kan använda när den är klar.

| Horisontell (undvik) | Vertikal (bra) |
|---|---|
| Bygg alla API-endpoints | Lägga till en syssla (formulär, endpoint, sparas i databasen) |
| Gör all frontend | Se listan med sysslor (vy, endpoint, hämtas från databasen) |

Med horisontella stories har ni ingenting som fungerar förrän allt är klart. Med vertikala har ni något att visa varje sprint.

## Epics

En **epic** är en stor story som behöver delas upp i flera mindre. Använd epics för att gruppera stories som hör ihop.

**Epic:** Sysslor

- Som hushållsmedlem vill jag lägga till en syssla så att den inte glöms bort.
- Som hushållsmedlem vill jag tilldela en syssla till någon så att det är tydligt vem som ska göra den.
- Som hushållsmedlem vill jag markera en syssla som gjord så att de andra ser att den är klar.

## Tekniska uppgifter som inte är stories

Vissa saker måste göras men ger inget direkt värde för användaren, t.ex. att sätta upp projektet eller konfigurera databasen. De kan läggas som egna uppgifter på boarden. Håll dem få och kopplade till de stories de möjliggör.

## Hur många stories?

Till onsdag: **10–15 stories** som täcker er MVP och lite till. Backloggen kommer att växa och förändras under projektets gång. Det är normalt.

## Frågor att kunna svara på

- Varför är "så att"-delen av en user story viktig?
- Vad är skillnaden mellan en user story och en teknisk uppgift?
- Varför är vertikala stories bättre än horisontella?
- Ge ett exempel på en för stor story och dela upp den.
