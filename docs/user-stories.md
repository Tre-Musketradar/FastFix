# Backlog: user stories (utkast)

Första versionen av backloggen för Felanmälan. Ska gås igenom av hela teamet innan korten läggs in i GitHub Projects.

- Listan är **ordnad**: det som står först görs först.
- **Prioritet** enligt MoSCoW. Must = MVP.
- **Storlek** i klädstorlekar: S, M, L. En XL delas upp innan den tas in i en sprint.
- Alla stories är **vertikala**: de går genom frontend, backend och databas.

## Översikt

| # | Typ | Kort | Prioritet | Storlek | Epic |
|---|-----|------|-----------|---------|------|
| U1 | Undersökning | Inloggning med JWT | — | max ½ dag | Inloggning |
| T1 | Teknisk | Projektskelett | Must | M | — |
| 1 | Story | Logga in med roll | Must | L | Inloggning |
| 2 | Story | Lägga till fastighet | Must | M | Fastigheter |
| 3 | Story | Lägga till lägenheter | Must | M | Fastigheter |
| 4 | Story | Lägga till hyresgäst | Must | M | Fastigheter |
| 5 | Story | Skapa felanmälan | Must | M | Ärenden |
| 6 | Story | Ange huvudnyckel | Must | S | Ärenden |
| 7 | Story | Se mina ärenden (hyresgäst) | Must | M | Ärenden |
| 8 | Story | Se alla öppna ärenden (förvaltare) | Must | S | Ärendeflöde |
| 9 | Story | Tilldela tekniker | Must | M | Ärendeflöde |
| 10 | Story | Se tilldelade ärenden (tekniker) | Must | S | Ärendeflöde |
| 11 | Story | Ändra status | Must | M | Ärendeflöde |
| 12 | Story | Se ärendets historik | Must | S | Ärendeflöde |
| 13 | Story | Stänga ärende | Must | S | Ärendeflöde |
| 14 | Story | Kommentera ärende | Should | M | Kommunikation |
| 15 | Story | Filtrera och söka ärenden | Should | M | Ärendeflöde |
| 16 | Story | Översikt för förvaltaren | Should | M | Översikt |
| 17 | Story | Ändra och ta bort fastigheter och lägenheter | Should | M | Fastigheter |
| 18 | Story | Bifoga bild | Should | L | Kommunikation |
| T2 | Teknisk | Deploy | Should | M | — |
| 19 | Story | Prioritet med SLA | Could | M | Ärendeflöde |
| 20 | Story | E-postnotis vid statusändring | Could | M | Kommunikation |
| 21 | Story | Statistik: snittid till åtgärd | Could | S | Översikt |

Det som medvetet är bortvalt står under [Won't](#wont-inte-nu) längst ner.

## Undersökningar och tekniska uppgifter

### U1 — Inloggning med JWT (undersökning) (Jose)

**Fråga:** Hur sätter vi upp Spring Security med JWT och roller, och hur skickar och sparar frontend token?
**Tidsgräns:** Max en halv dag.
**Resultat:** Ett beslut i beslutsloggen (t.ex. var token sparas och hur länge den gäller). Storyn "Logga in med roll" kan behöva delas upp.

### T1 — Projektskelett (Jose)

**Uppgift:** Sätta upp React, Spring Boot och PostgreSQL så att allt startar enligt README.
**Varför:** Alla stories i sprint 1 bygger på det.
**Klart när:** Alla i teamet kan klona repot och starta appen enligt README.

### T2 — Deploy

**Uppgift:** Publicera appen på internet: databasen i en gratis molndatabas (t.ex. Neon eller Supabase), backend och frontend på en gratis hosting (t.ex. Render).
**Varför:** Reviewn i sprint 5 ska visa hela systemet live, och läraren ska kunna testa appen utan att starta den själv.
**Klart när:**
- Appen går att nå via en publik adress och man kan logga in med alla tre rollerna.
- Flyway skapar tabellerna i molndatabasen.
- Lösenord och `JWT_SECRET` ligger som miljövariabler hos hostingtjänsten, inte i repot.
- README beskriver var appen finns och hur man deployar en ny version.

Valet av tjänster skrivs in i [beslutsloggen](beslutslogg.md). Automatisk deploy när `main` uppdateras (CD) är Could och görs bara om tid finns.

## Must (MVP)

### 1. Logga in med roll — L (Jose)

> Som hyresgäst, tekniker eller förvaltare vill jag logga in så att jag ser det som gäller min roll.

- [ ] Det finns ett formulär med e-post och lösenord.
- [ ] Efter inloggning visas startsidan för min roll.
- [ ] Fel e-post eller lösenord ger ett felmeddelande som inte avslöjar vilket av dem som var fel.
- [ ] Jag är fortfarande inloggad om jag laddar om sidan.
- [ ] Jag kan logga ut, och då når jag inte längre sidorna som kräver inloggning.

### 2. Lägga till fastighet — M

> Som förvaltare vill jag lägga till en fastighet så att jag kan registrera lägenheterna i den.

- [ ] Det finns ett formulär med namn och adress.
- [ ] Man kan inte spara utan namn eller adress. Ett felmeddelande visas.
- [ ] Den nya fastigheten syns direkt i listan över fastigheter.
- [ ] Hyresgäster och tekniker kan inte se eller använda sidan.

### 3. Lägga till lägenheter — M

> Som förvaltare vill jag lägga till lägenheter i en fastighet så att fel kan kopplas till rätt lägenhet.

- [ ] På fastighetens sida kan jag lägga till en lägenhet med nummer och våning.
- [ ] Man kan inte spara utan lägenhetsnummer. Ett felmeddelande visas.
- [ ] Två lägenheter i samma fastighet kan inte ha samma nummer.
- [ ] Den nya lägenheten syns direkt i fastighetens lista.

### 4. Lägga till hyresgäst — M

> Som förvaltare vill jag lägga till en hyresgäst i en lägenhet så att hen kan logga in och anmäla fel.

- [ ] Jag kan ange namn, e-post och lägenhet för hyresgästen.
- [ ] En e-postadress kan bara användas av en användare. Annars visas ett felmeddelande.
- [ ] Hyresgästen kan logga in och ser sin lägenhet.
- [ ] En lägenhet som redan har en hyresgäst går inte att välja.

### 5. Skapa felanmälan — M

> Som hyresgäst vill jag skapa en felanmälan så att felet i min lägenhet blir åtgärdat.

- [ ] **Givet** att jag är inloggad **när** jag fyller i kategori, rum och beskrivning och skickar **så** skapas ärendet med status "Ny".
- [ ] Ärendet kopplas automatiskt till min lägenhet.
- [ ] Ärendet syns direkt i listan "Mina ärenden".
- [ ] Saknas beskrivning visas ett tydligt felmeddelande och inget sparas.

### 6. Ange huvudnyckel — S

> Som hyresgäst vill jag ange om huvudnyckel får användas så att teknikern kan komma in när jag inte är hemma.

- [ ] Valet Ja/Nej är obligatoriskt när ärendet skapas och har inget förval.
- [ ] Valet syns tydligt för teknikern på ärendet.

### 7. Se mina ärenden (hyresgäst) — M

> Som hyresgäst vill jag se mina felanmälningar och deras status så att jag slipper ringa och fråga.

- [ ] Listan visar kategori, datum och status för varje ärende.
- [ ] Nyaste ärendet visas först. filterar från först till äldst
- [ ] Jag ser bara ärenden för min egen lägenhet.
- [ ] Om jag inte har några ärenden visas ett meddelande om det i stället för en tom lista.
- [ ] Klickar jag på ett ärende öppnas detaljvyn. (modal)

### 8. Se alla öppna ärenden (förvaltare) — S

> Som förvaltare vill jag se alla ärenden som inte är stängda så att jag har överblick över vad som behöver göras.

- [ ] Listan visar fastighet, lägenhet, kategori, status och tilldelad tekniker.
- [ ] Ärenden med status "Ny" syns tydligt så att de inte glöms bort.
- [ ] Stängda ärenden visas inte. (ska egna sida till stänga ärende)

### 9. Tilldela tekniker — M

> Som förvaltare vill jag tilldela ett ärende till en tekniker så att rätt person tar hand om det.

- [ ] Bara förvaltare kan tilldela.
- [ ] Jag väljer tekniker från en lista med alla tekniker.
- [ ] Status ändras automatiskt till "Tilldelad".
- [ ] Ärendet syns i teknikerns lista.

### 10. Se tilldelade ärenden (tekniker) — S

> Som tekniker vill jag se de ärenden som är tilldelade mig så att jag vet vad jag ska göra.

- [ ] Listan visar adress, lägenhet, kategori, status och om huvudnyckel får användas.
- [ ] Jag ser bara ärenden som är tilldelade mig.
- [ ] Åtgärdade och stängda ärenden visas inte.

### 11. Ändra status — M

> Som tekniker vill jag ändra status på ett ärende så att hyresgästen vet hur det går.

- [ ] Jag kan ändra status mellan "Pågår", "Väntar" och "Åtgärdad".
- [ ] Jag kan bara ändra ärenden som är tilldelade mig.
- [ ] Hyresgästen ser den nya statusen när sidan laddas om.

### 12. Se ärendets historik — S

> Som hyresgäst vill jag se ärendets historik så att jag vet vad som har hänt och när.

- [ ] Varje statusändring visas med tid och vem som ändrade.
- [ ] Historiken visas i tidsordning, äldst först.
- [ ] Tekniker och förvaltare ser samma historik på ärendet.

### 13. Stänga ärende — S

> Som förvaltare vill jag stänga ett åtgärdat ärende så att listan över öppna ärenden bara visar det som återstår.

- [ ] Bara ärenden med status "Åtgärdad" kan stängas.
- [ ] Ett stängt ärende försvinner från listan över öppna ärenden.
- [ ] Hyresgästen ser att ärendet är stängt.

## Should

### 14. Kommentera ärende — M

> Som hyresgäst eller tekniker vill jag skriva kommentarer på ett ärende så att vi kan kommunicera utan att ringa.

- [ ] Kommentarer visas med namn och tid, äldst först.
- [ ] En tom kommentar går inte att skicka.
- [ ] Bara hyresgästen, den tilldelade teknikern och förvaltare kan se och skriva kommentarer på ärendet.

### 15. Filtrera och söka ärenden — M

> Som förvaltare vill jag filtrera och söka bland ärenden så att jag snabbt hittar det jag letar efter.

- [ ] Jag kan filtrera på status, kategori och fastighet.
- [ ] Jag kan söka på text i beskrivningen.
- [ ] Om inget matchar visas ett meddelande om det.

### 16. Översikt för förvaltaren — M

> Som förvaltare vill jag se en översikt över alla ärenden så att jag ser var det behövs insatser.

- [ ] Översikten visar antal ärenden per status.
- [ ] Översikten visar antal öppna ärenden per fastighet.
- [ ] Klickar jag på en siffra visas motsvarande ärenden.

### 17. Ändra och ta bort fastigheter och lägenheter — M

> Som förvaltare vill jag ändra eller ta bort fastigheter och lägenheter så att uppgifterna stämmer.

- [ ] Jag kan ändra namn och adress på en fastighet och nummer och våning på en lägenhet.
- [ ] Innan något tas bort måste jag bekräfta.
- [ ] En lägenhet med öppna ärenden kan inte tas bort. Ett felmeddelande förklarar varför.

### 18. Bifoga bild — L

> Som hyresgäst vill jag bifoga en bild när jag anmäler ett fel så att teknikern förstår problemet innan besöket.

- [ ] Jag kan bifoga en bild (JPG eller PNG) när jag skapar ärendet.
- [ ] För stora filer (över 5 MB) eller fel filtyp ger ett felmeddelande.
- [ ] Bilden visas på ärendet för teknikern och förvaltaren.

## Could (om tid finns)

### 19. Prioritet med SLA — M

> Som förvaltare vill jag sätta prioritet på ett ärende så att akuta fel, som en vattenläcka, åtgärdas först.

- [ ] Jag kan sätta prioritet Akut, Hög, Normal eller Låg på ett ärende. Nya ärenden får Normal.
- [ ] Varje prioritet har en tidsgräns (t.ex. Akut inom 4 timmar).
- [ ] Ärenden som passerat tidsgränsen markeras tydligt i listan.
- [ ] Hyresgäster och tekniker kan se prioriteten men inte ändra den.

### 20. E-postnotis vid statusändring — M

> Som hyresgäst vill jag få ett mejl när status på mitt ärende ändras så att jag inte behöver logga in för att se hur det går.

- [ ] När status ändras skickas ett mejl till hyresgästen som skapade ärendet.
- [ ] Mejlet innehåller ärendets nummer, den nya statusen och en länk till ärendet.
- [ ] Om mejlet inte kan skickas sparas statusändringen ändå.

### 21. Statistik: snittid till åtgärd — S

> Som förvaltare vill jag se hur lång tid det i snitt tar att åtgärda ett ärende så att jag kan följa upp teknikernas arbete.

- [ ] Översikten visar snittiden från "Ny" till "Åtgärdad" för de senaste 30 dagarna.
- [ ] Snittiden kan visas per kategori.
- [ ] Om det inte finns några åtgärdade ärenden visas ett meddelande i stället för en siffra.

Bygger på historiken i story 12 och översikten i story 16.

## Won't (inte nu)

Medvetet bortvalt i det här projektet. Skrivs inte som stories och får ingen storlek, eftersom de inte ska byggas. Kommer en av dem upp igen tas den upp med hela teamet och skrivs in i [beslutsloggen](beslutslogg.md).

| Funktion | Varför inte nu |
|----------|----------------|
| Mobilapp | Webbappen ska i stället fungera i mobilbredd (360 px). |
| SMS-notiser | Kostar pengar per meddelande. E-post (story 20) räcker. |
| Chatt i realtid mellan hyresgäst och tekniker | Kräver websockets. Kommentarer (story 14) löser samma behov. |
| Tidsbokning av besök i en kalender | Stort område för sig, inte kärnan i felanmälan. |
| Fakturering av reparationer | Hör till ekonomisystemet, inte till felanmälan. |
| Integration med befintliga fastighetssystem | Vi har inget riktigt system att integrera med. |

## Icke-funktionella krav

| Krav | Var det hamnar |
|------|----------------|
| Alla vyer fungerar i mobilbredd (360 px) utan att man behöver scrolla i sidled. | Förslag till DoD |
| Alla knappar och fält går att nå med tangentbordet och har en etikett. | Förslag till DoD |
| Inga lösenord eller nycklar ligger i repot. `.env` finns i `.gitignore`. | T1 och beslutsloggen |
| En användare kan aldrig se eller ändra ärenden som inte hör till hen. | Acceptanskriterier i 7, 10, 11 och 14 |

## Att diskutera i teamet

- **Storlekar:** referensstoryn är "Skapa felanmälan" = M. Stämmer resten jämfört med den?
- **Story 17** var CRUD i projektförslagets Must-lista. Här är den flyttad till Should, eftersom MVP-demon fungerar utan att man kan ändra eller ta bort. Håller alla med?
- **Story 4:** registrerar sig hyresgäster själva, eller skapas de av förvaltaren? Utkastet utgår från förvaltaren.
