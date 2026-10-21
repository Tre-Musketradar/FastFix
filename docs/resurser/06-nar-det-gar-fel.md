# När det går fel

Ett uppslag för vanliga problem. Leta upp det som stämmer, läs **hela** avsnittet, och gör sedan.

## Innan du gör något

1. **Stanna.** Kör inte kommandon du hittat på nätet utan att förstå dem.
2. **Kör `git status`.** Läs vad det står. Git säger ofta vad du kan göra.
3. **Läs felmeddelandet.** Kopiera det om du behöver fråga någon.
4. **Fråga** om du är osäker. Hellre en fråga för mycket än ett försvunnet arbete.

Tre saker du **aldrig** ska göra i panik:

- `git push --force` på en branch som andra använder
- ta bort projektmappen och klona om, utan att först ha sparat dina ändringar någon annanstans
- `git reset --hard` om du har ändringar som inte är committade

## Innehåll

- [Jag har committat i main av misstag](#jag-har-committat-i-main-av-misstag)
- [Jag har ändrat i main, men inte committat](#jag-har-ändrat-i-main-men-inte-committat)
- [Jag har ändrat i fel branch](#jag-har-ändrat-i-fel-branch)
- [Push nekas](#push-nekas)
- ["You have divergent branches" när jag pullar](#you-have-divergent-branches-när-jag-pullar)
- [Jag har committat fel filer](#jag-har-committat-fel-filer)
- [Jag har råkat committa node_modules](#jag-har-råkat-committa-node_modules)
- [Jag har pushat ett lösenord eller en nyckel](#jag-har-pushat-ett-lösenord-eller-en-nyckel)
- [Fel commit-meddelande](#fel-commit-meddelande)
- [Något trasigt har kommit in i main](#något-trasigt-har-kommit-in-i-main)
- [Min branch ligger långt efter main](#min-branch-ligger-långt-efter-main)
- [Jag har tappat bort mina ändringar](#jag-har-tappat-bort-mina-ändringar)
- [Jag sitter mitt i en merge och vill ut](#jag-sitter-mitt-i-en-merge-och-vill-ut)
- [Det står "detached HEAD"](#det-står-detached-head)
- [Min pull request innehåller ändringar som inte är mina](#min-pull-request-innehåller-ändringar-som-inte-är-mina)
- [Fel namn på branchen](#fel-namn-på-branchen)

---

### Jag har committat i main av misstag

**Vad har hänt:** du glömde skapa en branch och committade direkt i din lokala `main`. Pushen nekas, eftersom `main` är skyddad.

**Gör så här:**

```bash
git switch -c feature/<nr>-<beskrivning>   # en ny branch med dina commits
git switch main
git reset --hard origin/main                # main blir som på GitHub igen
git switch feature/<nr>-<beskrivning>       # fortsätt här
```

Den nya branchen tar med sig dina commits. Sedan återställs `main` till hur den ser ut på GitHub.

**Gör inte:** försök tvinga igenom pushen till `main`.

---

### Jag har ändrat i main, men inte committat

**Vad har hänt:** du har börjat jobba utan att skapa en branch.

**Gör så här:**

```bash
git switch -c feature/<nr>-<beskrivning>
```

Ändringar som inte är committade följer med till den nya branchen. Committa där.

---

### Jag har ändrat i fel branch

**Vad har hänt:** du har jobbat i en annan branch än den du trodde, och inte committat än.

**Gör så här:**

```bash
git stash                     # lägg undan ändringarna
git switch <rätt branch>
git stash pop                 # ta fram dem igen
```

Om du redan har committat i fel branch: se [Min pull request innehåller ändringar som inte är mina](#min-pull-request-innehåller-ändringar-som-inte-är-mina).

---

### Push nekas

**Felmeddelandet innehåller "rejected" och "fetch first" eller "non-fast-forward".**

**Vad har hänt:** någon annan har pushat till samma branch sedan du hämtade den senast. Du måste ta in deras ändringar först.

**Gör så här:**

```bash
git pull
# lös eventuella konflikter
git push
```

**Gör inte:** `git push --force`. Då skriver du över den andras commits.

**Felmeddelandet nämner "protected branch" eller att en pull request krävs.**

**Vad har hänt:** du försöker pusha till `main`. Det ska inte gå. Se [Jag har committat i main av misstag](#jag-har-committat-i-main-av-misstag).

---

### "You have divergent branches" när jag pullar

**Vad har hänt:** både du och någon annan har committat i samma branch, och Git vill veta hur ni vill slå ihop det.

**Gör så här:** kör det här en gång, så gäller det framåt:

```bash
git config --global pull.rebase false
git pull
```

---

### Jag har committat fel filer

**Inte pushat än:**

```bash
git reset --soft HEAD~1
```

Commiten ångras, men ändringarna finns kvar och är stagade. Ta bort det som inte skulle med med `git restore --staged <fil>`, och committa igen.

**Redan pushat:** ta bort filerna i en ny commit. Om filen innehåller en hemlighet: se [Jag har pushat ett lösenord eller en nyckel](#jag-har-pushat-ett-lösenord-eller-en-nyckel).

---

### Jag har råkat committa node_modules

**Vad har hänt:** `node_modules` saknades i `.gitignore`, eller filen saknades helt.

**Gör så här:**

1. Lägg till `node_modules/` i `.gitignore`.
2. Ta bort mappen från Git, men inte från din dator:
   ```bash
   git rm -r --cached node_modules
   git commit -m "Ta bort node_modules från repot"
   ```

Samma sak gäller `target/`, `dist/`, `build/` och liknande.

---

### Jag har pushat ett lösenord eller en nyckel

**Vad har hänt:** en `.env`-fil eller en nyckel i koden har hamnat på GitHub. Den finns kvar i historiken även om du tar bort filen.

**Gör så här, i den här ordningen:**

1. **Byt ut lösenordet eller nyckeln direkt**, där den kommer ifrån. Räkna med att den gamla har läckt. Det är det viktigaste steget.
2. Ta bort filen från Git men inte från din dator, och se till att den ignoreras:
   ```bash
   echo ".env" >> .gitignore
   git rm --cached .env
   git commit -m "Ta bort .env från repot"
   ```
3. Lägg en `.env.example` i repot med alla variabler men utan riktiga värden.
4. Säg till teamet, och läraren om det gäller något riktigt konto.

**Gör inte:** tro att det räcker att ta bort filen. Den finns kvar i historiken.

---

### Fel commit-meddelande

**Inte pushat än:**

```bash
git commit --amend -m "Rätt meddelande"
```

**Redan pushat:** låt det vara. Att ändra pushade commits skapar mer problem än det löser.

---

### Något trasigt har kommit in i main

**Vad har hänt:** en pull request har mergats, och nu fungerar inte appen.

**Gör så här:**

1. **Säg till i teamet direkt.** Att laga `main` går före allt annat.
2. Om felet är litet och lätt att hitta: rätta det i en ny branch och en pull request.
3. Om felet är svårt: ångra hela pull requesten med en **revert**, också den via en pull request.
   - Enklast: öppna den mergade pull requesten på GitHub och klicka på **Revert**. Det skapar en ny pull request som tar bort ändringarna.
   - Eller i terminalen, från en ny branch:
     ```bash
     git switch main
     git pull
     git switch -c fix/revert-<nr>
     git revert <commit-id>        # vid squash merge
     git revert -m 1 <commit-id>   # vid merge commit
     git push -u origin fix/revert-<nr>
     ```

**Gör inte:** `git reset` på `main`. Det skriver om historiken för alla.

Ta upp det på retron: varför kom det in? Behöver DoD eller granskningen ändras?

---

### Min branch ligger långt efter main

**Vad har hänt:** du har jobbat länge i din branch, och mycket har hänt i `main`.

**Gör så här:**

```bash
git switch main
git pull
git switch <din branch>
git merge main
```

Räkna med konflikter. Se `05-konflikter-forebygga-och-losa.md`, avsnittet om konflikter i många filer.

Nästa gång: ta in `main` varje dag.

---

### Jag har tappat bort mina ändringar

**Har du committat dem?** Då finns de kvar.

```bash
git reflog
```

Hitta commiten i listan, och hämta tillbaka den:

```bash
git switch -c raddning <commit-id>
```

**Har du lagt undan dem med `git stash`?**

```bash
git stash list
git stash pop
```

**Har du aldrig committat dem, och kört `git reset --hard` eller `git restore`?** Då finns de inte i Git. Men editorn kan ha en egen historik:

- **VS Code:** högerklicka på filen → **Open Timeline**.
- **IntelliJ:** högerklicka på filen → **Local History → Show History**.

Lärdom: committa ofta, och pusha innan du går hem.

---

### Jag sitter mitt i en merge och vill ut

**Vad har hänt:** `git status` säger "You have unmerged paths" eller liknande, och du vet inte hur du ska fortsätta.

**Gör så här:**

- Vill du avbryta och komma tillbaka till hur det var: `git merge --abort`
- Vill du slutföra: lös konflikterna, `git add` på filerna, `git commit`.

---

### Det står "detached HEAD"

**Vad har hänt:** du har bytt till en enskild commit i stället för en branch, t.ex. genom att klicka på en gammal commit i ett grafiskt verktyg.

**Gör så här:**

- Har du inte ändrat något: `git switch main`
- Har du committat något som du vill behålla:
  ```bash
  git switch -c <nytt branch-namn>
  ```

---

### Min pull request innehåller ändringar som inte är mina

**Vad har hänt:** du skapade din branch från någon annans branch i stället för från `main`, eller från en gammal `main`.

**Gör så här:** skapa en ny branch från en uppdaterad `main`, och flytta över bara dina commits.

```bash
git log --oneline              # skriv upp id:t på dina commits
git switch main
git pull
git switch -c feature/<nr>-<beskrivning>-ny
git cherry-pick <id1> <id2>    # dina commits, äldst först
git push -u origin feature/<nr>-<beskrivning>-ny
```

Öppna en ny pull request, och stäng den gamla.

---

### Fel namn på branchen

**Inte pushat än:**

```bash
git branch -m <nytt namn>
```

**Redan pushat:**

```bash
git branch -m <nytt namn>
git push -u origin <nytt namn>
git push origin --delete <gammalt namn>
```

Om det finns en öppen pull request för den gamla branchen: stäng den och öppna en ny.

---

## Ingenting hjälper

1. Kopiera dina ändrade filer till en mapp **utanför** projektet.
2. Fråga någon i teamet, eller läraren.
3. Som sista utväg: klona repot på nytt i en ny mapp, skapa en ny branch, och kopiera tillbaka dina filer.
