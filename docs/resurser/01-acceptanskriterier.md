# Acceptanskriterier

## Vad är acceptanskriterier?

Acceptanskriterier (AK) är de villkor som måste vara uppfyllda för att en **specifik user story** ska räknas som klar. De beskriver vad användaren ska kunna göra och vad som ska hända, så konkret att det går att testa.

Kom ihåg de tre C:na från pass 1: Card, Conversation, **Confirmation**. Acceptanskriterierna är confirmation. Det är där teamet bestämmer vad storyn faktiskt betyder.

## Varför behövs de?

Utan acceptanskriterier tolkar alla storyn på sitt eget sätt.

> Som hushållsmedlem vill jag lägga till en syssla så att den inte glöms bort.

Frågor som dyker upp direkt:

- Vad måste en syssla innehålla? Bara ett namn? Ett datum?
- Vad händer om man lämnar namnet tomt?
- Syns den nya sysslan direkt, eller måste man ladda om sidan?
- Kan man lägga till samma syssla två gånger?

Om Lina bygger formuläret och Jonas bygger API:t utan att ha svarat på de här frågorna tillsammans, passar delarna inte ihop. Acceptanskriterierna tvingar fram svaren **innan** någon börjar koda.

Acceptanskriterierna avgör också diskussionen på reviewn. Frågan är inte "är det här bra nog?" utan "är kriterierna uppfyllda?".

## Två sätt att skriva dem

### 1. Checklista

Enkel och snabb. Räcker för de flesta stories.

> **Story:** Som hushållsmedlem vill jag lägga till en syssla så att den inte glöms bort.
>
> **Acceptanskriterier**
> - [ ] Det finns ett formulär med fältet "Namn" och ett valfritt fält "Senast klar"
> - [ ] Man kan inte spara en syssla utan namn. Ett felmeddelande visas.
> - [ ] Den nya sysslan syns i listan direkt, utan att sidan laddas om
> - [ ] Sysslan finns kvar efter att sidan laddats om (den är sparad i databasen)

### 2. Given / When / Then

Mer strukturerat. Bra när en story har flera olika fall eller när det är viktigt vad som gäller *innan* något händer.

```
Givet att   [utgångsläge]
när         [användaren gör något]
så          [ska det här hända]
```

> **Story:** Som hushållsmedlem vill jag markera en syssla som gjord så att de andra ser att den är klar.
>
> **AK 1**
> Givet att jag har en syssla tilldelad mig
> när jag klickar på "Klar"
> så markeras sysslan som gjord och flyttas till listan "Klara".
>
> **AK 2**
> Givet att en syssla är tilldelad någon annan
> när jag tittar på den
> så kan jag inte markera den som klar.

Ni väljer själva vilket format ni använder. Det viktiga är att kriterierna går att testa.

## Kännetecken på bra acceptanskriterier

| Bra | Varför |
|---|---|
| **Testbara** | Man kan avgöra med ja eller nej om de är uppfyllda. |
| **Ur användarens perspektiv** | De beskriver vad som händer, inte hur det är byggt. |
| **Konkreta** | "Ett felmeddelande visas", inte "bra felhantering". |
| **Lagom många** | 3–6 per story. Fler än så är ofta ett tecken på att storyn är för stor. |

## Vanliga misstag

**För vaga**

> - Formuläret ska vara användarvänligt.

Hur testar man det? Skriv i stället vad som gör det användarvänligt: "Fältet för namn är markerat när formuläret öppnas", "Det går att spara med Enter".

**Tekniska**

> - Det finns en POST-endpoint på `/api/chores`.
> - Sysslan sparas i tabellen `chores`.

Det är hur det ska byggas, inte vad användaren ska kunna göra. Sådant hör hemma i uppgifterna under storyn, eller i DoD om det gäller alla stories. Undantag: om en story bara handlar om ett API är det rimligt att kriterierna beskriver API:ts beteende.

**Upprepar DoD**

> - Koden är granskad.
> - Det finns inga fel i konsolen.

Det gäller alla stories, inte just den här. Det hör hemma i Definition of Done. Se `02-definition-of-done.md`.

**Saknar felfall**

De flesta skriver bara "det lyckade fallet". Fråga er alltid: vad händer om användaren gör fel? Vad händer om något saknas?

## Vem skriver dem?

Product Owner ansvarar för att de finns, men de skrivs bäst **tillsammans**. Det är ofta i diskussionen om acceptanskriterierna som teamet upptäcker att de tolkat storyn olika, eller att storyn är större än de trodde.

## När skrivs de?

- **Innan** storyn tas in i en sprint. En story utan acceptanskriterier ska inte plockas in i sprint planning.
- Stories långt ner i backloggen behöver inga acceptanskriterier än. De kan ändras eller försvinna innan ni kommer dit.

## Frågor att kunna svara på

- Vad är skillnaden mellan en user story och dess acceptanskriterier?
- Varför är det viktigt att acceptanskriterierna är testbara?
- Skriv acceptanskriterier för en story i ert projekt, i båda formaten.
- Vad är skillnaden mellan acceptanskriterier och Definition of Done? (Se `02-definition-of-done.md`.)
