# Pull requests och kodgranskning

## Vad är en pull request?

En **pull request** (PR) är en förfrågan om att få slå ihop en branch med `main`. Det är en GitHub-funktion, inte en del av Git.

En PR är mer än en knapp. Det är platsen där teamet:

- ser exakt vad som ändrats
- diskuterar ändringen
- kontrollerar att den uppfyller acceptanskriterierna och DoD
- godkänner att den kommer in i `main`

## Flödet

```
1. Skapa branch från main
2. Jobba och committa
3. Pusha branchen
4. Öppna PR på GitHub
5. Någon granskar → kommentarer → du rättar och pushar igen
6. Godkänd → merge till main
7. Kortet flyttas till Klart, branchen tas bort
```

## Öppna en PR

1. Pusha din branch.
2. Gå till repot på GitHub. Där syns ofta en ruta med **Compare & pull request**. Annars: fliken **Pull requests → New pull request**.
3. Kontrollera att det står `base: main` och `compare: <din branch>`.
4. Fyll i PR-mallen. Den fylls i automatiskt med rubrikerna.
5. Välj en eller flera granskare under **Reviewers**.
6. Klicka på **Create pull request**.

### Koppla PR:en till ett kort

Skriv i beskrivningen:

```
Closes #4
```

När PR:en mergas till `main` stängs issue #4 automatiskt, och om automatiseringen på boarden är på flyttas kortet till Klart. Orden `Fixes` och `Resolves` fungerar på samma sätt.

### En bra PR är liten

En PR ska helst handla om **ett** kort och gå att granska på 10–15 minuter. En PR med 40 ändrade filer blir sällan granskad ordentligt, granskaren klickar bara på Approve.

## Kodgranskning

### Varför granska?

- **Hitta fel** innan de hamnar i `main`.
- **Sprida kunskap:** minst två personer förstår varje del av koden. Om Jonas blir sjuk kan någon annan ta över.
- **Lära sig:** av att läsa andras kod, och av att få kommentarer på sin egen.
- **Hålla koden enhetlig** så att den känns skriven av ett team, inte fyra personer.

### Att granska

1. **Läs beskrivningen och kortet.** Vad ska PR:en göra?
2. **Testa den.** Hämta branchen, starta appen och gå igenom acceptanskriterierna.
   ```bash
   git fetch
   git switch feature/4-lagg-till-syssla
   ```
3. **Läs koden** under fliken **Files changed**. Klicka på en rad för att kommentera.
4. **Gå igenom DoD-checklistan** i PR:en.
5. **Lämna din granskning** via **Review changes**:
   - **Comment:** kommentarer utan beslut
   - **Approve:** godkänd, kan mergas
   - **Request changes:** något måste ändras innan merge

### Vad ska man titta efter?

- Gör koden det som kortet säger? Uppfylls acceptanskriterierna?
- Finns det fall som inte hanteras, t.ex. tomma fält eller fel från servern?
- Går koden att förstå? Är namnen på variabler och funktioner tydliga?
- Finns det kvarglömda saker: `console.log`, utkommenterad kod, hemligheter?
- Följer den samma struktur som resten av projektet?

Du behöver inte vara expert för att granska. "Jag förstår inte vad den här funktionen gör" är en värdefull kommentar. Om du inte förstår, gör troligen ingen annan det heller om en månad.

### Hur man skriver kommentarer

Kommentera koden, inte personen. Var konkret, och förklara varför.

| Mindre bra | Bättre |
|---|---|
| "Det här är fel." | "Om namnet är tomt sparas sysslan ändå. Ska vi validera det här eller i backend?" |
| "Varför gjorde du så här?" | "Jag hade tänkt mig X här, eftersom Y. Fanns det ett skäl till att välja Z?" |
| "Dåliga namn." | "`d` och `x` är svåra att förstå. Kanske `dueDate` och `chore`?" |

Det är också bra att skriva när något är bra: "Snyggt löst med valideringen!"

Markera gärna hur viktig en kommentar är. "Måste" för sådant som behöver ändras, "Förslag" för sådant som är valfritt.

### Att få granskning

- Kommentarerna gäller koden, inte dig.
- Svara på varje kommentar: rätta, eller förklara varför du gjort som du gjort.
- Pusha rättelserna till samma branch. PR:en uppdateras automatiskt.
- Be om ny granskning när du är klar.

### AI i kodgranskning

Ni får gärna använda AI-verktyg som stöd, både för att granska andras kod och för att granska er egen innan ni öppnar en PR. Två saker att tänka på:

- AI ersätter inte granskningen från en person i teamet. Poängen med granskning är också att sprida kunskap i teamet.
- Kod som AI har skrivit och som du lägger i en PR är din kod. Du ska kunna förklara den.

## Merge

När PR:en är godkänd kan den mergas. Det finns tre alternativ i GitHub:

| Alternativ | Vad händer | Historiken |
|---|---|---|
| **Create a merge commit** | Alla commits från branchen kommer med, plus en merge-commit | Visar exakt vad som hände, men kan bli rörig |
| **Squash and merge** | Alla commits slås ihop till en enda | En commit per PR. Ren och lätt att läsa |
| **Rebase and merge** | Commits läggs på rad efter `main` | Rak historik, men kräver mer förståelse |

Bestäm i teamet vilket ni använder och skriv in det i beslutsloggen. **Squash and merge** är ett bra val för de flesta team i den här kursen.

Bestäm också vem som mergar. Ett vanligt sätt: den som skrev koden mergar, efter att ha fått godkännande.

## Branch protection

Branch protection är regler i GitHub som gör det omöjligt att gå runt PR-flödet. Utan dem är det lätt att "bara pusha en liten fix" direkt till `main`.

### Sätt upp skydd för main

1. Gå till repots **Settings → Branches** (eller **Rules → Rulesets** i nyare gränssnitt).
2. Lägg till en regel för branchen `main`.
3. Slå på:
   - **Require a pull request before merging**
   - **Required approvals: 1**
   - Gärna **Dismiss stale pull request approvals when new commits are pushed**, så att ändringar efter godkännandet granskas igen
   - **Do not allow bypassing the above settings** (i den klassiska varianten). Annars gäller reglerna inte för administratörer, och den som skapade organisationen är administratör. I rulesets gäller reglerna alla så länge ingen är tillagd under "Bypass list".
4. Spara.

Under **Settings → General** kan ni också slå på **Automatically delete head branches**, så att branches tas bort när PR:en mergas.

### Om det inte går

Branch protection ingår gratis för **publika** repon. För privata repon i en gratis organisation finns funktionen inte. Lösningar:

- Gör repot publikt.
- Ansök om GitHub Education för organisationen (gratis för studenter).
- Om inget av det går: bestäm i gruppkontraktet att ingen pushar till `main`, och håll varandra till det.

### Testa skyddet

```bash
git switch main
echo "test" >> README.md
git commit -am "Test av branch protection"
git push
```

Pushen ska nekas. Ångra sedan commiten lokalt:

```bash
git reset --hard origin/main
```

## Frågor att kunna svara på

- Vad är skillnaden mellan en branch och en pull request?
- Ge tre skäl till att granska kod, utöver att hitta fel.
- Vad gör `Closes #4` i en PR-beskrivning?
- Varför bör en PR vara liten?
- Vad är branch protection, och varför behövs det i ett team?
