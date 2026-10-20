# Vad hör hemma i backloggen?

## Mer än user stories

Produktbackloggen är en ordnad lista över **allt arbete** som behövs för produkten. Scrum talar inte om user stories utan om *backlog items*, alltså poster i backloggen. User stories är det vanligaste sättet att skriva dem, men inte det enda.

De flesta korten i er backlog ska vara user stories, eftersom det är de som ger användaren något. Men under projektet kommer ni att stöta på arbete som inte passar i formatet "Som … vill jag … så att …". Det ska också in i backloggen. Annars blir det osynligt arbete som ingen planerat tid för.

## Fem sorters arbete

| Typ | Vad det är | Exempel från Sysslo |
|---|---|---|
| **User story** | Något användaren ska kunna göra | Lägga till en syssla |
| **Bugg** | Något som inte fungerar som det ska | Klara sysslor försvinner efter omladdning |
| **Teknisk uppgift** | Något som måste göras men inte syns för användaren | Sätta upp projektskelett och databas |
| **Undersökning** | Något ni måste ta reda på innan ni kan planera | Hur bygger vi en säker inbjudningslänk? |
| **Icke-funktionellt krav** | Hur bra eller under vilka villkor systemet ska fungera | Appen ska gå att använda i mobilbredd |

De fyra första blir kort på boarden. Icke-funktionella krav är speciella: de kan hamna på flera ställen. Mer om det längre ner.

## User stories

Se `06-user-stories.md` från pass 1. Det är huvuddelen av backloggen.

## Buggar

En bugg är något som inte fungerar som acceptanskriterierna säger, eller som slutat fungera.

**Viktigt att skilja på:**

- **Storyn är inte klar än.** Om ni hittar ett fel i en story som ni håller på med i sprinten är det ingen bugg. Storyn är helt enkelt inte klar. Fortsätt jobba med den.
- **Storyn var klar.** Om felet upptäcks efter att storyn mergats och flyttats till "Klart" skapar ni ett nytt kort med bugg-mallen.

**Hur den skrivs:** Använd bugg-mallen i repot. Vad händer, vad borde hända, och hur återskapar man felet?

> **Exempel**
> **Vad händer:** Sysslor som markerats som klara visas som ej klara efter att sidan laddats om.
> **Vad borde hända:** De ska stå kvar som klara (#8, acceptanskriterium 2).
> **Så återskapar man felet:** Markera en syssla som klar. Ladda om sidan.

**Prioritering:** En bugg som gör att appen inte går att använda läggs högst upp. Andra buggar prioriteras som vilket kort som helst. Det är inte alltid viktigare att rätta en liten bugg än att bygga en ny story.

## Tekniska uppgifter

Arbete som måste göras men som användaren inte märker direkt. Till exempel:

- Sätta upp projektskelett och databas
- Konfigurera något bibliotek eller verktyg som flera stories behöver
- **Teknisk skuld:** rätta till en genväg ni tog tidigare

**Fråga er först:** kan det här ingå i en story i stället? Databastabellen för sysslor behövs för att bygga "Lägga till en syssla". Då är den en del av den storyn, inte ett eget kort. Egna kort för tekniska uppgifter är bara motiverade när arbetet behövs för flera stories, eller inte hör till någon.

**Hur den skrivs:** Använd mallen för tekniska uppgifter. Skriv alltid **varför** den behövs och vilka stories den möjliggör.

> **Exempel**
> **Uppgift:** Sätta upp projektskelett med React, Express och PostgreSQL som startar med ett kommando.
> **Varför:** Alla stories i sprint 1 bygger på det.
> **Klart när:** Alla i teamet kan klona repot och starta appen enligt README.

### Teknisk skuld

Ibland tar man en genväg för att hinna klart, till exempel kopierar samma validering till tre formulär. Det är okej, men skriv ner det som ett kort direkt, så att det inte glöms bort.

> **Exempel**
> **Uppgift:** Bryta ut valideringen av sysslor till en gemensam funktion.
> **Varför:** Den finns kopierad på tre ställen och är redan olika på ett av dem.

## Undersökningar (spikes)

När ni inte vet tillräckligt för att estimera en story, eller inte vet vilken lösning ni ska välja, är det första steget att ta reda på det. Det kallas ofta en *spike*.

**Kännetecken:**

- **Tidsbegränsad.** Bestäm i förväg hur lång tid den får ta, t.ex. "max en halv dag". Ni ger den en tidsgräns i stället för en storlek.
- **Resultatet är kunskap, inte färdig kod.** Ni får gärna testa och skriva kod för att lära er, men det är inte den koden som levereras.
- **Den slutar med ett beslut.** Skriv in det i beslutsloggen. Ofta leder den också till att en story skrivs om eller delas upp.

> **Exempel**
> **Fråga:** Hur kan man bjuda in någon till ett hushåll via en länk utan att vem som helst kan gissa sig fram?
> **Tidsgräns:** Max en halv dag.
> **Resultat:** Beslut #3 i beslutsloggen (slumpad länk som går ut efter 7 dagar). Storyn "Bjuda in via länk" delades upp i två.

Undersökningar passar särskilt bra för stories ni bedömt som L för att ni inte gjort något liknande förut.

## Icke-funktionella krav

**Funktionella krav** beskriver *vad* systemet gör: lägga till en syssla, markera den som klar.

**Icke-funktionella krav** beskriver *hur bra* eller *under vilka villkor* systemet ska fungera: hur snabbt, hur säkert, för vem, på vilka enheter.

Användaren märker sällan när ett icke-funktionellt krav är uppfyllt, men märker det direkt när det inte är det.

### Vanliga kategorier

| Kategori | Fråga | Exempel för Sysslo |
|---|---|---|
| **Användbarhet** | Är den lätt att förstå och använda? | En ny användare kan lägga till en syssla utan instruktioner. |
| **Tillgänglighet** | Kan alla använda den? | Alla knappar och fält går att nå med tangentbordet och har en etikett. |
| **Responsivitet** | Fungerar den på olika skärmar? | Alla vyer fungerar i mobilbredd (360 px). |
| **Prestanda** | Är den tillräckligt snabb? | Listan med sysslor visas inom en sekund med 100 sysslor. |
| **Säkerhet** | Är data skyddat? | Lösenord och nycklar ligger aldrig i repot. Inbjudningslänkar går inte att gissa. |
| **Underhållbarhet** | Går koden att förstå och ändra? | Koden följer samma struktur och namngivning, och det finns tester för backend-logiken. |

### Gör dem mätbara

Precis som acceptanskriterier ska icke-funktionella krav gå att svara ja eller nej på.

| Vagt | Mätbart |
|---|---|
| Appen ska vara snabb. | Listan visas inom en sekund med 100 sysslor. |
| Appen ska vara säker. | Inga lösenord eller API-nycklar i repot. `.env` finns i `.gitignore`. |
| Appen ska funka på mobil. | Alla vyer fungerar i 360 px bredd utan att man behöver scrolla i sidled. |

### Var hamnar de?

Det här är det svåra. Ett icke-funktionellt krav kan hamna på tre ställen, beroende på vad det gäller.

| Om kravet … | … lägg det i | Exempel |
|---|---|---|
| gäller **alla** stories | **Definition of Done** | "Vyn fungerar i mobilbredd." |
| gäller **en specifik** story | Storyns **acceptanskriterier** | "Listan visas inom en sekund med 100 sysslor." (på storyn "Se mina sysslor") |
| kräver **eget arbete** | En **teknisk uppgift**, och ett beslut i **beslutsloggen** | "Sätta upp HTTPS" eller "Inbjudningslänkar som inte går att gissa" |

### Lagom mycket

Ni behöver inte krav i alla kategorier. Välj de 2–4 som är viktigast för just er app. En app för att boka tvättstuga har andra viktiga krav än en app som hanterar betalningar.

## Hur prioriteras allt?

**Allt ligger i samma ordnade lista.** Det finns inte en backlog för stories och en annan för buggar. Product Owner ordnar allt tillsammans med teamet, med samma frågor som i `03-prioritering.md`: värde, beroenden, risk och storlek.

Några tumregler:

- En teknisk uppgift eller undersökning ligger **före** de stories den möjliggör.
- En bugg som gör appen oanvändbar ligger **högst upp**.
- De flesta korten ska vara user stories. Om mer än ungefär en fjärdedel av backloggen är tekniska uppgifter tänker ni troligen i lager ("bygg alla endpoints") i stället för vertikalt. Se `06-user-stories.md` om vertikala stories.

## På boarden

### Labels

Använd labels för att visa vilken typ ett kort är. Två av dem finns redan i alla nya repon, och två skapar ni själva under **Issues → Labels → New label**:

| Label | Används för | Finns redan? |
|---|---|---|
| `enhancement` | User stories | Ja |
| `bug` | Buggar | Ja |
| `teknisk` | Tekniska uppgifter och teknisk skuld | Nej, skapa den |
| `undersökning` | Undersökningar (spikes) | Nej, skapa den |

Skriv namnen exakt så. Issue-mallarna sätter rätt label automatiskt, men bara om den finns.

### Issue-mallar

När ni klickar på **New issue** finns det en mall för varje typ: **User story**, **Bugg**, **Teknisk uppgift** och **Undersökning**. Välj rätt mall när ni skapar ett nytt kort.

Undersökningar får en tidsgräns i stället för en storlek. Skriv den i kortet och lämna fältet Storlek tomt på boarden.

### På reviewn

Visa främst stories, eftersom det är där användaren märker något. Nämn kort om ni lagt tid på tekniska uppgifter eller undersökningar, och vad ni kom fram till.

## Vanliga misstag

**Osynligt arbete.** Någon lägger två dagar på att få databasen att fungera, men det finns inget kort för det. På standupen ser det ut som att personen inte gjort något, och sprinten planerades som om de dagarna inte behövdes.

**Allt blir tekniska uppgifter.** "Skapa tabell", "Skapa endpoint", "Skapa formulär". Det är en story uppdelad i lager. Skriv storyn i stället, och låt det tekniska bli deluppgifter.

**Undersökningar utan tidsgräns.** "Undersök inloggning" kan ta hur lång tid som helst. Bestäm i förväg när ni slutar och fattar ett beslut.

**Vaga icke-funktionella krav.** "Appen ska vara snabb" går inte att följa upp.

**Buggar som nya kort mitt i en story.** Om storyn inte är klar är felet en del av storyn, inte en bugg.

## Frågor att kunna svara på

- Varför räcker det inte med user stories i backloggen?
- Vad är skillnaden mellan en bugg och en story som inte är klar?
- När är en teknisk uppgift motiverad som eget kort, och när ska den ingå i en story?
- Vad är en undersökning (spike), och varför ska den ha en tidsgräns?
- Vad är skillnaden mellan funktionella och icke-funktionella krav? Ge exempel från ert projekt.
- Var lägger ni ett icke-funktionellt krav som gäller alla stories? Ett som bara gäller en?
