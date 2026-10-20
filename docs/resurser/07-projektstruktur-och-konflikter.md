# Projektstruktur och konflikter

I kursen bygger ni **vertikala stories**: varje story går genom hela stacken, från gränssnitt till databas. Det är rätt sätt att arbeta, eftersom ni då har något fungerande att visa varje sprint.

Men det får en konsekvens för Git. Om en person bara gör frontend och en annan bara backend rör de sällan samma filer. När alla bygger hela funktioner rör alla hela kodbasen. Då blir det viktigt **var** i koden ni krockar och **när**.

Den här filen handlar om hur projektstruktur, planering och gemensamt grundarbete kan göra konflikterna färre och mindre.

## Var konflikterna uppstår

Varje vertikal story behöver nästan alltid ändra på några gemensamma ställen. Det är där konflikterna uppstår. Vi kallar dem **knutpunkter**.

| Knutpunkt | Varför alla rör den |
|---|---|
| Routern i frontend (t.ex. `App.jsx`) | Varje ny sida ska läggas till |
| Huvudfilen i backend (t.ex. `server.js`, en `Application`-klass) | Varje ny route eller controller ska kopplas in |
| Databasschemat och migreringar | Nya tabeller och kolumner |
| Gemensamma modeller eller typer | Flera stories använder samma data |
| Navigering och layout | Nya länkar i menyn |
| `package.json`, `pom.xml` och lockfiler | Nya bibliotek |
| Global CSS | Ny stil som påverkar allt |

> **Sysslo:** Lina tar "Lägga till syssla" och Jonas tar "Tilldela syssla" samma dag. Båda behöver ändra tabellen `chore`, lägga till en route i backend och lägga till något i frontend. De krockar på tre ställen.

## Fyra risker

### 1. Krockar i knutpunkterna

Den vanligaste typen. Två personer lägger till var sin rad på samma ställe i samma fil.

### 2. Databasändringar parallellt

Den farligaste typen. Två personer ändrar schemat samma dag. Ibland blir det ingen konflikt i Git alls, men ändringarna fungerar inte tillsammans. Det märks först när någon startar appen.

### 3. Dubbelarbete

Två personer bygger var sin variant av samma sak: ett eget sätt att anropa API:t, egen formulärvalidering, egen felhantering. Det blir ingen konflikt, men koden spretar och blir svårare att förstå och ändra.

### 4. Beroenden mellan stories

"Tilldela syssla" kräver att det finns sysslor och medlemmar. Om båda startas samtidigt blir någon sittande och väntande, eller bygger något provisoriskt som sedan krockar med den riktiga lösningen.

## Projektstruktur

### Strukturera efter funktion, inte efter lager

Det här är den viktigaste åtgärden.

```
Efter lager                          Efter funktion
(alla rör samma mappar)              (varje story har sin mapp)

src/                                 src/
  components/                          features/
    ChoreList.jsx                        chores/
    ChoreForm.jsx                          ChoreList.jsx
    MemberList.jsx                         ChoreForm.jsx
  api/                                     choresApi.js
    api.js         ← alla rör den          members/
  pages/                                   MemberList.jsx
    ...                                    membersApi.js
                                       shared/
                                         apiClient.js
                                         Layout.jsx
```

När ni strukturerar efter funktion hamnar det mesta av en story i en egen mapp. Två stories om olika saker rör nästan inte samma filer.

Samma tanke gäller backend:

```
Node/Express                         Spring Boot
routes/                              chores/
  chores.js                            ChoreController.java
  members.js                           ChoreService.java
server.js   ← bara en rad per route    ChoreRepository.java
                                     members/
                                       ...
```

### Gör knutpunkterna små

Om varje ny route bara är **en rad** i `App.jsx` eller `server.js` blir konflikterna där små och enkla att lösa. Oftast ska båda raderna vara kvar.

```js
// server.js — en rad per resurs
app.use('/api/chores', choresRouter);
app.use('/api/members', membersRouter);
```

Lägg logiken i funktionens egna filer, inte i knutpunkten.

### Samma formatering för alla

Om en person sparar filer med andra inställningar än de andra (tabbar mot mellanslag, olika radlängd) kan hela filer formateras om. Då blir varje ändring en konflikt.

- Lägg in ett formateringsverktyg i skelettet, t.ex. Prettier för JavaScript.
- Lägg till en `.editorconfig` i repot.
- Alla använder samma inställningar.

### Beroenden i skelettet

Lägg in de bibliotek ni vet att ni kommer att behöva redan i skelettet. Då blir det färre ändringar i `package.json` och `pom.xml` senare.

Om det ändå blir en konflikt i en lockfil (`package-lock.json`): **lös den inte för hand.** Ta versionen från `main` och kör `npm install` igen, så skapas en ny lockfil som innehåller både dina och andras bibliotek.

### AI och stora ändringar

AI-verktyg skriver ofta om mer än det som behövdes: formaterar om hela filen, byter namn, flyttar saker. Då blir diffen stor och konflikterna onödigt många.

- Be verktyget göra så små ändringar som möjligt.
- Läs alltid diffen innan du committar. Ändrades något du inte bad om?

## Planering

### Ordna backloggen efter beroenden

Stories som andra bygger på ska ligga först och bli klara först. Datamodellen för sysslor och att skapa ett hushåll behövs innan man kan tilldela sysslor.

### Fråga i sprint planning: vilka filer rör den här?

När ni fördelar stories, gå igenom vilka knutpunkter varje story rör.

- Rör två stories samma knutpunkt? Gör dem efter varandra, eller låt samma person ta båda.
- Ändrar två stories databasschemat? Gör dem **inte** parallellt.

### En person i taget ändrar schemat

Antingen äger någon schemat under en sprint, eller så säger den som ska ändra det till på standupen:

> "Jag lägger till kolumnen `assigned_to` i `chore` idag. Vänta med schemaändringar tills min PR är mergad."

### Färre parallella spår i början

Fyra personer på fyra stories första dagen ger flest konflikter, eftersom strukturen inte är på plats än. Två par på två stories går ofta snabbare totalt.

## Hur mycket man gör tillsammans innan man delar upp

Det är en balans.

- **För lite tillsammans:** fyra personer bygger på fyra olika sätt. Koden spretar, och det blir konflikter i allt som borde ha varit gemensamt.
- **För mycket tillsammans:** det blir vattenfall i lager. Först all databas, sedan alla endpoints, sedan all frontend. Ni har inget att visa förrän allt är klart.

**Tumregel: gör tillsammans det som alla andra kommer att kopiera.** Bygg inte funktioner tillsammans, bygg mönstret.

### Gemensamt grundarbete

Det här bör finnas innan ni delar upp arbetet:

| Vad | Varför |
|---|---|
| **Projektskelett** med mappstruktur och start med ett kommando | Alla börjar från samma grund |
| **Konventioner**: namngivning, formatering, branch-namn | Koden ser ut som om den skrivits av ett team |
| **Databasschemat för MVP:n**, i stort sett klart | Färre parallella schemaändringar |
| **Delade byggstenar**: API-klient, layout, navigering, felhantering | Ingen bygger sin egen variant |

### Den första storyn tillsammans

Bygg den första vertikala storyn **tillsammans**. Antingen sitter en vid tangentbordet medan resten tittar, föreslår och diskuterar (det kallas mobbprogrammering), eller så delar ni upp er i två par.

Välj en story som rör alla lager men som inte är för stor.

> **Sysslo:** Teamet bygger "Se listan med sysslor" tillsammans under första dagarna i sprint 1. När den är klar finns det ett mönster för allt: så här ser en komponent ut, så här anropar vi API:t, så här ser en route ut, så här läser vi från databasen, så här hanterar vi fel.

Den storyn blir mallen för alla andra. När ni sedan delar upp er bygger alla på samma sätt, och konflikterna blir små eftersom alla vet var saker ska ligga.

### Konflikterna minskar med tiden

Konflikterna är som flest i början av ett projekt, när strukturen inte finns än. De blir färre när mönstret är satt och alla vet var saker hör hemma. En extra dag på gemensamt grundarbete tjänar ni ofta in under första sprinten.

## Sammanfattning

| Risk | Vad ni kan göra |
|---|---|
| Krockar i knutpunkter | Struktur efter funktion, små knutpunkter |
| Parallella databasändringar | Schemat klart tidigt, en i taget ändrar det |
| Dubbelarbete | Gemensamma byggstenar, första storyn tillsammans |
| Beroenden mellan stories | Ordna backloggen efter beroenden |
| Formatering ger stora diffar | Samma formateringsverktyg för alla |
| AI skriver om för mycket | Be om små ändringar, läs diffen |

## Frågor att reflektera över

- Vilka filer i ert projekt tror ni blir knutpunkter? Kan ni göra dem mindre?
- Hur är ert projektskelett strukturerat, efter lager eller efter funktion? Vad betyder det för konflikterna?
- Vilken story skulle passa att bygga tillsammans först? Varför just den?
- Vad behöver vara gemensamt innan ni delar upp er, och vad kan ni vänta med?
- Vad är skillnaden mellan att bygga mönstret tillsammans och att bygga i lager?
