# Konflikter: förebygga och lösa

Grunderna om merge-konflikter finns i `04-merge-konflikter.md` från pass 3. Den här filen är en praktisk sammanfattning: hur ni undviker dem, och hur ni löser de vanligaste sorterna när de ändå händer.

## Förebygga

De flesta konflikter går att undvika, och det mesta handlar inte om Git.

| Gör så här | Varför |
|---|---|
| **Ta in `main` i din branch varje dag** | Små konflikter varje dag i stället för en stor i slutet |
| **Små, kortlivade branches** | Färre ändringar som kan krocka |
| **Säg på standupen vad du ska ändra** | Då vet de andra att de ska vänta eller prata med dig |
| **Fråga i sprint planning: vilka filer rör korten?** | Kort som rör samma sak görs inte parallellt |
| **Databasschemat ändras av en person i taget** | De farligaste konflikterna syns inte ens i Git |
| **Struktur efter funktion i koden** | Varje kort hamnar mest i sin egen mapp |
| **Samma formatering för alla** | Annars kan en sparad fil ändra hela filen |
| **Bara Scrum Master skriver i standup-loggen** | Annars blir det konflikt i den varje dag |

Se också `07-projektstruktur-och-konflikter.md` från pass 3.

## Lösa: grundmetoden

Oavsett vilken sorts konflikt det är:

1. **Stanna.** Gissa inte.
2. **Kör `git status`.** Vilka filer gäller det?
3. **Förstå båda versionerna.** Vad ville du göra? Vad ville den andra göra?
4. **Fråga** den som skrev den andra ändringen om du är osäker.
5. **Lös** konflikten och ta bort alla markeringar.
6. **Starta appen och testa.** En konflikt som är löst i texten kan ändå ge en trasig app.
7. **Avsluta:** `git add` på filerna, `git commit`, `git push`.

Om det blir för rörigt: `git merge --abort` tar dig tillbaka till hur det var innan.

## Spelbok: vanliga sorters konflikter

### Båda har lagt till rader på samma ställe

**Typiskt:** två nya routes i routern, två nya importer, två nya länkar i menyn.

```js
<<<<<<< HEAD
app.use('/api/chores', choresRouter);
=======
app.use('/api/members', membersRouter);
>>>>>>> main
```

**Lösning:** nästan alltid ska **båda** vara kvar. Ta bort markeringarna och behåll båda raderna.

```js
app.use('/api/chores', choresRouter);
app.use('/api/members', membersRouter);
```

### Båda har ändrat samma kod på olika sätt

**Typiskt:** två personer har ändrat samma funktion eller komponent.

**Lösning:** här måste någon bestämma. Prata med den andra personen. Ibland ska båda ändringarna kombineras, ibland ska den ena vinna. Testa noga efteråt.

### package-lock.json

**Typiskt:** två personer har lagt till var sitt bibliotek. Lockfilen är genererad och full av konflikter som är omöjliga att lösa för hand.

**Lösning:** lös inte lockfilen för hand. Lös först `package.json`, och generera sedan om lockfilen.

1. Lös konflikten i `package.json` för hand. Oftast ska båda biblioteken vara kvar.
2. Ta versionen av lockfilen från `main`, och installera om:
   ```bash
   git checkout --theirs package-lock.json
   npm install
   git add package.json package-lock.json
   git commit
   ```
   När du mergar in `main` i din branch betyder `--theirs` versionen från `main`. `npm install` lägger sedan till ditt bibliotek i den.

För Maven och `pom.xml` finns ingen lockfil. Lös `pom.xml` för hand, oftast genom att behålla båda beroendena.

### Databasschemat och migreringar

**Typiskt:** två personer har ändrat schemat samma dag.

Det här är den farligaste sorten, eftersom Git ibland **inte** ser någon konflikt. Två migreringsfiler med olika namn mergas utan problem, men kanske inte fungerar tillsammans. Eller så har de samma nummer.

**Lösning:**

1. Efter varje merge som rör schemat: **återskapa databasen lokalt från början** och kör alla migreringar. Fungerar det?
2. Om två migreringar har samma nummer eller fel ordning: döp om den ena, så att ordningen blir rätt.
3. Om ni har en enda schemafil (`schema.sql`) och båda har ändrat samma tabell: lös konflikten som vanlig kod, och återskapa databasen.

**Förebygg:** en person i taget ändrar schemat. Säg till på standupen.

### Formatering

**Typiskt:** konflikten gäller nästan varje rad i filen, fast ingen har ändrat så mycket. Någon har sparat filen med andra inställningar: tabbar i stället för mellanslag, andra radbrytningar.

**Lösning:**

1. Avbryt: `git merge --abort`.
2. Kör samma formateringsverktyg på filen i din branch, t.ex. Prettier. Committa.
3. Kontrollera att `main` också är formaterad med samma inställningar. Om inte: formatera den via en egen pull request.
4. Merga igen. Nu ska konflikten vara mycket mindre.

**Förebygg:** samma formateringsverktyg och inställningar för alla, från början.

### En fil är borttagen i den ena, ändrad i den andra

**Typiskt:** `git status` säger "deleted by us" eller "deleted by them".

**Lösning:** bestäm om filen ska finnas kvar.

- Ska vara kvar: `git add <fil>`
- Ska bort: `git rm <fil>`

Fråga den som tog bort filen varför, innan du bestämmer.

### Konflikt i dokumentation

**Typiskt:** två personer har skrivit i samma fil i `docs/`.

**Lösning:** behåll oftast båda. Det är text, och det är sällan den ena som ska vinna.

### "This branch has conflicts" på GitHub

**Typiskt:** din pull request kan inte mergas, eftersom `main` har ändrats sedan du skapade branchen.

**Lösning:** lös konflikten **lokalt**, inte i GitHubs webbredigerare. Då kan du testa att appen fungerar innan du pushar.

```bash
git switch main
git pull
git switch <din branch>
git merge main
# lös konflikten, testa
git add <filer>
git commit
git push
```

Pull requesten uppdateras av sig själv.

### Konflikter i många filer

**Typiskt:** en branch som har levt i en vecka, och nu krockar med allt.

**Lösning:**

1. Avbryt: `git merge --abort`.
2. Sätt er tillsammans med de som ändrat i samma filer.
3. Om det är för mycket: skapa en ny branch från `main` och gör om dina ändringar där, en sak i taget. Det går ofta fortare än man tror, eftersom du vet vad du ska göra.

**Förebygg:** kortare branches, och ta in `main` varje dag.

## I VS Code och IntelliJ

Båda verktygen visar konflikter med knappar för att välja version. Se övning 2 i pass 3. Kom ihåg:

- **Current** (VS Code) och **Yours** (IntelliJ) är branchen du står i.
- **Incoming** (VS Code) och **Theirs** (IntelliJ) är det du mergar in.
- Läs alltid resultatet efteråt, och starta appen.

## Frågor att reflektera över

- Vilken sorts konflikt tror ni är vanligast i ert projekt? Varför?
- Varför är konflikter i databasschemat farligare än andra?
- Varför ska man lösa konflikter lokalt i stället för på GitHub?
