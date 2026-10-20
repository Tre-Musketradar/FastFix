# Git-grunder: repetition

Det här är en repetition av det ni redan har använt. Om allt här känns självklart kan du skumma det. Om något känns oklart: läs ordentligt, för resten av pass 3 bygger på det.

## Vad Git gör

Git sparar **ögonblicksbilder** av ett projekt. Varje ögonblicksbild kallas en **commit**. Med commits kan man:

- gå tillbaka till hur koden såg ut tidigare
- se vem som ändrade vad, när och varför
- jobba parallellt på olika saker och slå ihop dem

Git och GitHub är inte samma sak. **Git** är verktyget som körs på din dator. **GitHub** är en tjänst som lagrar en kopia av repot på nätet och lägger till saker som pull requests, issues och boards.

## Tre platser på din dator

När du jobbar med Git finns dina ändringar på tre platser:

```
Arbetskatalog  →  Staging area  →  Repo (commits)
   (filerna)      (git add)        (git commit)
```

| Plats | Vad det är |
|---|---|
| **Arbetskatalogen** | Filerna som du ser och redigerar. |
| **Staging area** | De ändringar du har valt ut till nästa commit. |
| **Repot** | Alla commits, alltså historiken. |

Staging finns för att du ska kunna välja **vad** som ska ingå i en commit. Har du ändrat i fem filer men bara tre hör ihop, kan du lägga de tre i en commit och resten i en annan.

## Lokalt och på GitHub

```
Din dator                         GitHub
┌──────────────┐   git push  →   ┌──────────────┐
│  lokalt repo │                 │ remote: origin│
└──────────────┘   ←  git pull   └──────────────┘
```

- **Lokalt repo:** kopian på din dator. Det är här du committar.
- **Remote:** kopian på GitHub. Den heter oftast `origin`.
- **`git push`** skickar dina commits till GitHub.
- **`git pull`** hämtar andras commits från GitHub och slår ihop dem med dina.

En commit som bara finns på din dator syns inte för någon annan. Den är inte heller säkerhetskopierad.

## De vanligaste kommandona

```bash
git clone <url>          # kopiera ett repo från GitHub till din dator
git status               # vad har ändrats? vad är stagat?
git add <fil>            # lägg en ändring i staging
git add .                # lägg alla ändringar i staging
git commit -m "Meddelande"  # skapa en commit av det som är stagat
git push                 # skicka dina commits till GitHub
git pull                 # hämta och slå ihop andras commits
git log --oneline        # visa historiken kort
git diff                 # visa ändringar som inte är stagade än
```

**Kör `git status` ofta.** Det är det enklaste sättet att veta vad som händer. Läs vad det står, Git ger ofta tips om vad du kan göra härnäst.

## Ett vanligt flöde

```bash
git pull                          # börja med senaste versionen
# ... redigera filer ...
git status                        # vad har jag ändrat?
git add src/ChoreForm.jsx         # välj vad som ska med
git commit -m "Lägg till formulär för ny syssla"
git push                          # dela med teamet
```

## Bra commit-meddelanden

Ett commit-meddelande ska berätta **vad** ändringen gör, så att någon kan förstå det utan att läsa koden.

| Dåligt | Bra |
|---|---|
| `fix` | `Visa felmeddelande när syssla saknar namn` |
| `ändringar` | `Lägg till endpoint för att hämta sysslor` |
| `asdf` | `Flytta databasinställningar till .env` |
| `fixade grejen Lina sa` | `Rätta datumformat vid ny syssla` |

Tumregler:

- Skriv i imperativ, som en instruktion: "Lägg till", "Rätta", "Ta bort".
- Första raden ska vara kort, under ungefär 70 tecken.
- Behöver du förklara *varför*, skriv det på raderna under.

## Det som inte ska in i Git

Vissa filer ska aldrig committas. De listas i `.gitignore`, som redan finns i ert repo.

- **Beroenden**, som `node_modules/`. De kan alltid installeras igen.
- **Byggfiler**, som `dist/` och `target/`.
- **Hemligheter**: lösenord, API-nycklar, `.env`-filer.

Hemligheter är det viktigaste. En nyckel som har committats finns kvar i historiken även om du tar bort filen senare. Den måste då bytas ut.

Lägg i stället en `.env.example` i repot med alla variabler men utan riktiga värden, så att andra vet vad de behöver fylla i.

## Grafiskt eller terminal?

Ni får gärna använda Git i VS Code, IntelliJ eller GitHub Desktop. Men lär er också grunderna i terminalen. Det är där felmeddelandena är tydligast, och alla instruktioner ni hittar på nätet utgår från den.

## Frågor att kunna svara på

- Vad är skillnaden mellan Git och GitHub?
- Varför finns staging area? Ge ett exempel på när den är användbar.
- Vad är skillnaden mellan en commit och en push?
- Varför ska `.env` inte committas, och vad gör man om det ändå har hänt?
