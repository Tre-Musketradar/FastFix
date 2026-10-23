# Merge-konflikter

## Vad är en konflikt?

En konflikt uppstår när Git ska slå ihop två versioner och **samma rader** har ändrats på olika sätt. Git kan inte veta vilken version som är rätt, så det frågar dig.

Om Lina ändrar i `ChoreForm.jsx` och Jonas ändrar i `server.js` slår Git ihop det av sig själv. Om båda ändrar samma rad i `ChoreForm.jsx` blir det en konflikt.

**En konflikt är inget fel.** Det är Git som säger: "Här behöver en människa bestämma." Det är helt normalt i team.

## När uppstår de?

- När du kör `git merge main` i din branch
- När du kör `git pull` och någon annan har pushat till samma branch
- När en PR inte kan mergas på GitHub ("This branch has conflicts that must be resolved")

## Hur en konflikt ser ut

Git markerar konflikten direkt i filen:

```jsx
<<<<<<< HEAD
<button type="submit">Spara syssla</button>
=======
<button type="submit" disabled={!name}>Lägg till</button>
>>>>>>> main
```

| Del | Betyder |
|---|---|
| `<<<<<<< HEAD` | Början på **din** version (den branch du står i) |
| `=======` | Skiljelinjen |
| `>>>>>>> main` | Slutet på den **andra** versionen (det du mergar in) |

## Att lösa en konflikt

1. **Se vilka filer det gäller.**
   ```bash
   git status
   ```
   Filer med konflikter står under "both modified".

2. **Öppna filen och bestäm hur det ska bli.** Du kan välja din version, den andra, eller en kombination. I exemplet ovan kanske båda ändringarna ska med:
   ```jsx
   <button type="submit" disabled={!name}>Spara syssla</button>
   ```

3. **Ta bort alla markeringar**: `<<<<<<<`, `=======` och `>>>>>>>`.

4. **Kontrollera att koden fungerar.** Starta appen. En konflikt som är löst i texten kan fortfarande ge en trasig app.

5. **Markera som löst och committa.**
   ```bash
   git add ChoreForm.jsx
   git commit
   ```
   Git föreslår ett meddelande. Spara det som det är.

6. **Pusha.**

VS Code och IntelliJ visar konflikter med knappar som "Accept Current", "Accept Incoming" och "Accept Both". Det går bra att använda, men läs alltid resultatet efteråt.

## Fråga om du är osäker

Om du inte vet vilken version som är rätt: **fråga den som skrev den andra ändringen.** Att gissa och välja sin egen version är det vanligaste sättet att råka radera någon annans arbete.

## Avbryta

Om det blir rörigt kan du alltid avbryta och börja om:

```bash
git merge --abort
```

Då är allt som innan du försökte merga.

## Förebygga konflikter

De flesta konflikter går att undvika, och nästan inget av det handlar om Git:

| Gör så här | Varför |
|---|---|
| **Små, kortlivade branches** | Färre ändringar, färre krockar |
| **Hämta in `main` till din branch ofta** | Små konflikter varje dag i stället för en stor i slutet |
| **Säg vad du ska ändra på standupen** | "Jag ska ändra i navigeringen idag." Då vet andra att de ska vänta eller prata med dig. |
| **Dela upp stories så att de inte rör samma filer** | Planeras redan i sprint planning |
| **Formatera koden på samma sätt** | Om en person har ett verktyg som formaterar om hela filer blir allt en konflikt. Kom överens om inställningar, t.ex. Prettier. |

Konflikter är oftare ett tecken på att teamet behöver prata mer än ett tecken på att någon gjort fel i Git.

## Frågor att kunna svara på

- Varför kan Git inte lösa alla konflikter själv?
- Vad betyder `<<<<<<<`, `=======` och `>>>>>>>`?
- Varför ska du starta appen efter att ha löst en konflikt?
- Ge tre sätt att undvika konflikter som inte handlar om Git-kommandon.
