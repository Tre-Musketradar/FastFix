# GitHub: repo och board

Här sätter ni upp de två saker som hela projektet kommer att leva i:

- **Repot:** koden och all dokumentation i `docs/`
- **Boarden:** backloggen och sprintarna i GitHub Projects

GitHubs gränssnitt ändras ibland, så knappar och menyer kan heta lite annorlunda än här. Fråga om du inte hittar något.

## 1. Skapa en organisation

En organisation gör det enklare för hela gruppen att äga repot och boarden tillsammans, i stället för att allt ligger på en persons konto.

1. Klicka på din profilbild uppe till höger, välj **Your organizations** och sedan **New organization**.
2. Välj den kostnadsfria planen.
3. Ge den ett namn, t.ex. `sysslo-team`.
4. Bjud in alla i gruppen som medlemmar.

## 2. Skapa repot från mallen

1. Gå till kursens mallrepo: `[länk till mallrepot]`.
2. Klicka på **Use this template** och välj **Create a new repository**.
3. Välj er organisation som ägare.
4. Ge repot ett namn, t.ex. `sysslo`.
5. Välj om det ska vara publikt eller privat. Om det är privat: se till att läraren får läsbehörighet.

Nu har ni mappen `docs/` med alla mallar, och mappen `.github/` med mallar för issues och pull requests.

### Behörigheter

Under **Settings → Collaborators and teams** i repot: ge alla i gruppen rollen **Write** eller högre. Utan det kan de inte pusha eller skapa branches.

## 3. Skapa boarden

1. Gå till organisationens sida och klicka på fliken **Projects**.
2. Klicka på **New project**.
3. Välj mallen **Board** (eller **Team planning** om den finns).
4. Ge projektet ett namn, t.ex. `Sysslo`.

### Koppla boarden till repot

I projektets inställningar (**…** uppe till höger → **Settings**): koppla repot under **Linked repositories**. Då kan ni lägga till issues från repot direkt på boarden.

### Kolumner

Boarden har en kolumn per värde i fältet **Status**. Ställ in följande:

| Kolumn | Betyder |
|---|---|
| **Backlog** | Prioriterade stories som inte är med i nuvarande sprint |
| **Att göra** | Med i sprinten, inte påbörjad |
| **Pågår** | Någon jobbar på den |
| **Granskas** | Det finns en pull request som väntar på granskning |
| **Klart** | Uppfyller acceptanskriterierna och DoD |

### Egna fält

Lägg till följande fält under projektets inställningar (**Custom fields**):

| Fält | Typ | Värden |
|---|---|---|
| **Prioritet** | Single select | Must, Should, Could, Won't |
| **Storlek** | Single select | S, M, L |
| **Sprint** | Iteration | Längd 1 vecka, start måndagen vecka 3 |

### Två vyer

Det är praktiskt att ha två vyer av samma projekt:

- **Backlog (tabellvy):** alla stories i en lista. Här ordnar ni prioriteringen genom att dra raderna i rätt ordning.
- **Sprint (boardvy):** filtrera på nuvarande sprint. Det är den här ni tittar på vid daily standup.

Skapa en ny vy med **+ New view** bredvid den befintliga fliken.

### Automatisering

Under **Workflows** i projektets meny finns färdiga automatiseringar. Slå på åtminstone:

- **Item closed:** flytta till "Klart" när en issue stängs
- **Pull request merged:** flytta till "Klart" när en PR mergas
- **Auto-add to project:** lägg automatiskt till nya issues från repot

## 4. Lägg in era user stories

1. Gå till repot, fliken **Issues**, och klicka på **New issue**.
2. Välj mallen **User story**.
3. Fyll i storyn och acceptanskriterierna.
4. Kontrollera att den hamnar på boarden (om automatiseringen är på sker det av sig själv).
5. Sätt prioritet och storlek på boarden.

### Epics

Om ni vill gruppera stories kan ni skapa en label per epic, t.ex. `epic: sysslor` och `epic: hushåll`. Labels skapas under **Issues → Labels**.

## 5. Kontrollera att allt fungerar

Låt **varje person** i gruppen:

- skapa en issue med mallen
- flytta ett kort mellan två kolumner
- se både backlog- och sprintvyn

Om någon inte kan göra något av det saknas behörighet. Fixa det nu, inte på måndag.

## Vad händer härnäst?

- **Pass 3:** branches, pull requests och kodgranskning. Ni kopplar PR:er till issues med "Closes #12", så att kortet flyttas till "Klart" när PR:en mergas.
- **Pass 4:** hur boarden används i sprint planning, daily standup och review.
