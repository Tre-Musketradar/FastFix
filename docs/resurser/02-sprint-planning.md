# Sprint planning

Sprint planning är mötet där ni bestämmer vad ni ska göra under sprinten och hur. Det hålls varje måndag, efter retron, och tar ungefär 30–45 minuter. Product Owner leder.

Resultatet är:

- ett **sprintmål**
- en **sprintbacklog**: korten ni tar in, med en ansvarig för varje
- en ifylld `planning.md` i sprintens mapp

## Innan mötet: korten ska vara redo

Ett kort är **redo** att tas in i en sprint när:

- det har acceptanskriterier
- det har en storlek (S, M eller L, inte XL)
- teamet förstår det tillräckligt för att börja

Kort som inte är redo tas inte in. Det är Product Owners ansvar att de översta korten i backloggen är redo före mötet. Ha gärna ungefär dubbelt så mycket redo som ni tror att ni hinner.

## Steg för steg

### 1. Börja med retron

Vilka åtgärder bestämde ni på retron? Påverkar någon av dem planeringen? Om ni bestämde "vi tar in mindre den här gången", gör det.

Första sprinten finns ingen retro än. Hoppa över det här steget.

### 2. Kapacitet

Är någon borta eller har mindre tid den här veckan? Skriv det i `planning.md`.

### 3. Sprintmål

Formulera **en mening** om vad sprinten ska ge. Vad ska vara möjligt efter sprinten som inte var det innan?

> **Sysslo, sprint 1:** "En användare kan skapa ett hushåll och se en lista med sysslor som sparas i databasen."

Sprintmålet är inte en lista med stories. Det är det som gör att ni kan prioritera under sprinten: om något tar längre tid än väntat, vad är viktigast för att nå målet?

### 4. Välj kort

Ta kort uppifrån i backloggen, i ordning, tills ni tror att ni har tillräckligt. Bara kort som är redo.

**Hur mycket?** I sprint 1 vet ni inte. Ta hellre in för lite än för mycket. Det går alltid att plocka in mer under sprinten, men halvfärdiga kort på reviewn är sämre än färre klara. Från sprint 2 kan ni titta på hur mycket som faktiskt blev klart sprinten innan.

### 5. Fråga: vilka filer rör de här korten?

Gå igenom de valda korten och fråga för varje: vilka delar av koden kommer det att röra?

- Rör två kort samma ställe, särskilt databasschemat? **Gör dem inte parallellt.** Låt samma person ta båda, eller gör dem efter varandra.
- Bygger ett kort på ett annat? Det första ska bli klart först.

Det här är det bästa sättet att undvika konflikter i Git. Se `05-konflikter-forebygga-och-losa.md`.

### 6. Fördela och dela upp

- Sätt en **ansvarig** på varje kort. Det betyder inte att personen gör allt själv, men att hen ser till att kortet blir klart.
- Dela gärna upp större kort i **uppgifter**, som en checklista i issuen. "Formulär", "endpoint", "tabell", "test".
- Flytta korten till **Att göra** på boarden och sätt fältet **Sprint** till den nya sprinten.

### 7. Fyll i planning.md

Sprintmål, kapacitet, valda kort med storlek och ansvarig, och eventuella risker.

## Sprint 1: den första storyn tillsammans

Första sprinten är speciell. Strukturen i koden finns inte än, och om alla bygger var sin sak från dag ett gör ni det på fyra olika sätt.

Därför: **bygg den första storyn tillsammans.** Välj en story som går genom alla lager men inte är för stor. Bygg den med en vid tangentbordet medan de andra tittar, föreslår och diskuterar, eller i två par.

> **Sysslo:** Teamet bygger "Se listan med sysslor" tillsammans måndag eftermiddag och tisdag. När den är klar finns ett mönster för allt: så här ser en komponent ut, så här anropar vi API:t, så här ser en route ut, så här läser vi från databasen. Från onsdag bygger var och en sina egna kort, på samma sätt.

Den här storyn blir mallen för alla andra. Läs mer i `07-projektstruktur-och-konflikter.md` från pass 3.

## Exempel: Sysslos planning, sprint 1

**Sprintmål:** En användare kan skapa ett hushåll och se en lista med sysslor som sparas i databasen.

**Kapacitet:** Jonas är borta torsdag.

**Roller:** Sara är Product Owner, Amir är Scrum Master.

| Kort | Storlek | Ansvarig | Kommentar |
|---|---|---|---|
| #7 Se listan med sysslor | M | Alla | Byggs tillsammans måndag–tisdag |
| #3 Skapa ett hushåll | M | Sara | Rör tabellen `household` |
| #4 Lägga till en syssla | M | Lina | Rör tabellen `chore`. Efter #7. |
| #9 Byta namn på hushållet | S | Jonas | Efter #3, samma tabell. Jonas tar den när #3 är mergad. |

**Risker:** Ingen har kopplat React till Express förut. Det löses genom att bygga #7 tillsammans.

Lägg märke till att teamet har sett att #3 och #9 rör samma tabell, och att #4 bygger på #7. Det står i kommentarerna.

## Vanliga misstag

**För mycket i sprint 1.** Det tar längre tid än ni tror att komma igång. Hellre tre kort klara än sex halvfärdiga.

**Kort som inte är redo.** "Vi skriver acceptanskriterierna sen" leder till att ni bygger olika saker.

**Alla startar var sitt kort direkt.** Ger flest konflikter och mest spretig kod i början.

**Inget sprintmål.** Då blir sprinten en lista med uppgifter, och ni vet inte vad som är viktigast när tiden inte räcker.

**Planeringen tar hela dagen.** Håll tiden. Det som inte är klart efter 45 minuter tar Product Owner hand om.

## Frågor att kunna svara på

- Vad betyder det att ett kort är redo?
- Varför ska man ta in hellre för lite än för mycket i den första sprinten?
- Varför ska man fråga vilka filer korten rör?
- Varför är det bra att bygga den första storyn tillsammans?
