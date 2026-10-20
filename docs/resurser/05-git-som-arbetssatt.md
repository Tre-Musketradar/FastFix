# Git som arbetssätt

De andra filerna handlar om hur Git fungerar. Den här handlar om hur man **arbetar** med Git tillsammans.

Kommandona är ganska lätta att lära sig. Det svåra med Git i team är vanorna, kommunikationen och omdömet: när man ska committa, hur man skriver så att andra förstår, hur man undviker att stå i vägen för varandra, och hur man gör när något går fel.

## 1. Git är kommunikation

Allt du skriver i Git läses av någon annan: teamet idag, läraren vid rättning, och du själv om tre veckor.

- **Commit-meddelanden** berättar vad som ändrats och varför.
- **Branch-namn** berättar vad någon jobbar med.
- **PR-beskrivningar** berättar vad granskaren ska titta på och hur man testar.
- **Granskningskommentarer** är ett samtal om koden.

Historiken är projektets dagbok. Med bra meddelanden kan man med `git log` förstå hur projektet har vuxit fram och varför en rad ser ut som den gör. Med "fix", "ändringar" och "asdf" går det inte.

> **Sysslo:** Tre veckor in i projektet förstår ingen varför datum sparas som text i stället för som datum. `git log` på filen visar commiten "Spara datum som text, PostgreSQL-tiden blev fel i olika tidszoner". Problemet är redan löst, och nu vet alla varför.

## 2. Små steg, ofta

Det här är samma tanke som i agilt arbete: små steg och snabb återkoppling, men på kodnivå.

- **Små commits.** En commit ska göra en sak. Committa när något fungerar, inte när dagen är slut.
- **Kortlivade branches.** Timmar eller dagar, inte veckor.
- **Små PR:er.** Lätta att granska och snabba att få in.
- **Integrera ofta.** Hämta in `main` till din branch varje dag, och få in din kod i `main` så snart den är klar.

Ju längre du väntar, desto större blir allt: konflikterna, granskningen och risken att du byggt på något som andra redan ändrat.

## 3. main ska alltid fungera

`main` är gemensam mark. Alla bygger vidare på den. Om `main` är trasig kan ingen i teamet jobba.

Därför:

- Ingen pushar direkt till `main`.
- All kod kommer in via PR, efter granskning.
- Starta appen och testa innan du ber om granskning.
- Om `main` ändå går sönder: säg till direkt och rätta det före allt annat.

## 4. En arbetsdag med Git

Så här kan en vanlig dag se ut. Det är inte regler, men en bra rytm att börja med.

**När du börjar**

```bash
git switch main
git pull                       # hämta det andra gjort sedan igår
git switch feature/4-lagg-till-syssla
git merge main                 # ta in det i din branch
```

Eller, om du börjar på ett nytt kort: skapa en ny branch från den uppdaterade `main`.

**Medan du jobbar**

- Committa när du fått något att fungera, även om det är litet.
- Kör `git status` och `git diff` innan du committar, så att du vet vad som följer med.
- Om du blir avbruten mitt i något: committa det som fungerar, eller använd `git stash` för att lägga undan ändringarna tillfälligt.

**Innan du öppnar en PR**

- Hämta in senaste `main` och lös eventuella konflikter.
- Starta appen och testa mot acceptanskriterierna.
- **Läs din egen diff** på GitHub under "Files changed". Du hittar ofta saker själv: en kvarglömd `console.log`, en fil som inte skulle med.
- Gå igenom DoD-checklistan.

**När du slutar för dagen**

- **Pusha** det du har, även om det inte är klart. Då är det säkerhetskopierat, och teamet kan se vad du jobbar med.
- Om något är halvfärdigt: skriv det i commit-meddelandet eller på kortet, så vet du var du var imorgon.

## 5. Konflikter handlar om samordning

De flesta merge-konflikter beror inte på att någon gjort fel i Git. De beror på att två personer ändrat samma sak utan att veta om varandra.

Därför löses de lika mycket utanför Git:

- **På standupen:** "Jag ska ändra i navigeringen idag."
- **I sprint planning:** dela upp stories så att de inte rör samma filer samtidigt.
- **Genom att prata:** om du ser att någon annan har en öppen PR i samma fil, prata med dem innan du börjar.

> **Sysslo:** Lina och Jonas lägger båda till en ny route i `App.jsx` samma dag och får en konflikt. Nästa sprint säger Amir på standupen att han ska ändra routingen, och de andra väntar till hans PR är mergad.

## 6. Granskning är samarbete, inte kontroll

Kodgranskning handlar inte om att godkänna eller underkänna någon. Det handlar om att teamet tillsammans ansvarar för koden.

- **Gemensamt ägande.** Det är "vår kod", inte "Linas fil". Alla får läsa, föreslå ändringar i och rätta all kod.
- **Granskning är arbete.** Det räknas, och det ska synas på standupen: "Igår granskade jag Saras PR."
- **Granska snabbt.** En PR som ligger i två dagar blockerar den som skrev den. Bestäm i gruppkontraktet hur snabbt ni granskar.
- **Granska för att lära.** Du lär dig mycket av att läsa andras kod, även om du inte hittar några fel.
- **Tonen spelar roll.** Skriv så som du själv vill få kommentarer. Se `03-pull-requests-och-kodgranskning.md`.

## 7. Att våga

Många som är nya i Git är rädda för att förstöra något. Då undviker de branches, väntar med att pulla och committar sällan. Det leder till precis de problem de var rädda för.

Det är bra att veta att **nästan allt i Git går att ångra.**

| Om du … | … kan du |
|---|---|
| committat med fel meddelande | `git commit --amend` (innan du pushat) |
| committat något som inte skulle med | `git revert <commit>` skapar en ny commit som tar bort ändringen |
| hamnat mitt i en merge som blev rörig | `git merge --abort` |
| ändrat i en fil och vill tillbaka | `git restore <fil>` |
| tappat bort något du committat | `git reflog` visar allt du gjort, även det som "försvunnit" |

Det finns bara några få saker som faktiskt är farliga:

- **`git push --force` till en delad branch,** särskilt `main`. Det kan radera andras commits. Branch protection förhindrar det på `main`.
- **Att committa lösenord eller nycklar.** De finns kvar i historiken även om du tar bort filen. Nyckeln måste bytas ut.
- **`git reset --hard` med ändringar du inte committat.** De är borta.

Om du är osäker: **stanna och fråga** innan du kör något du inte förstår. Det är bättre att fråga än att klistra in ett kommando från nätet.

## 8. Git och AI

AI-verktyg kan skriva kod, föreslå commit-meddelanden och granska PR:er. Det är bra hjälp, men:

- **Kod i din PR är din kod**, oavsett vem eller vad som skrev den. Du ska kunna förklara den när någon granskar.
- **Granska AI-genererad kod lika noga som annan kod.** Den ser ofta rätt ut men kan innehålla fel, onödig komplexitet eller saker som inte passar resten av projektet.
- **Ett commit-meddelande som AI skrivit** ska ändå stämma med vad ändringen faktiskt gör.
- **AI-granskning ersätter inte granskning av en person i teamet.** Ett av syftena med granskning är att någon mer förstår koden.

## 9. Git och Scrum

Git är där arbetet på boarden faktiskt händer.

```
Kort på boarden  →  Branch  →  Commits  →  PR med "Closes #"  →  Granskning  →  Merge  →  Kortet i Klart
```

- **En branch per kort** gör det lätt att se vad som pågår.
- **PR:en** är där acceptanskriterierna och DoD kontrolleras.
- **"Closes #"** gör att boarden uppdateras av sig själv.
- **På reviewn** visar ni det som finns i `main`, inte det som ligger i någons branch.
- **I retron** är Git-flödet ofta något att prata om: Låg PR:er och väntade? Blev det många konflikter? Varför?

## Sammanfattning

| Princip | I praktiken |
|---|---|
| Git är kommunikation | Tydliga commit-meddelanden, branch-namn och PR-beskrivningar |
| Små steg, ofta | Små commits, kortlivade branches, små PR:er |
| main ska alltid fungera | All kod via PR, testa innan granskning |
| Konflikter är samordning | Säg vad du ändrar, dela upp arbetet |
| Granskning är samarbete | Gemensamt ägande, granska snabbt, var vänlig |
| Våga | Nästan allt går att ångra. Fråga när du är osäker. |
| AI är hjälp, inte ansvar | Du äger koden du lägger i en PR |

## Frågor att reflektera över

- Vilka av principerna ovan tror du blir svårast för ditt team att följa? Varför?
- Hur märks det i ett projekt om commit-meddelandena är dåliga?
- Varför leder långlivade branches till problem, både tekniskt och i teamet?
- Vad betyder "gemensamt ägande" av koden? Vad är alternativet, och vad händer då?
- Har du någon gång undvikit något i Git för att du var rädd att förstöra? Vad hade du behövt veta?
