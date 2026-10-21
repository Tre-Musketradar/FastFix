# Git-rutiner

De flesta problem med Git i team beror inte på att man inte kan kommandona. De beror på vanor: att man glömmer att hämta senaste `main`, att en branch lever för länge, att ingen granskar, att två personer ändrar samma sak utan att veta om varandra.

Den här filen samlar rutinerna som checklistor. Mer om varför finns i `05-git-som-arbetssatt.md` från pass 3.

## Dina rutiner

### När du börjar

- [ ] Hämta senaste `main`
  ```bash
  git switch main
  git pull
  ```
- [ ] Fortsätter du på en branch: ta in `main` i den
  ```bash
  git switch <din branch>
  git merge main
  ```
- [ ] Börjar du på ett nytt kort: skapa en ny branch från den uppdaterade `main`
  ```bash
  git switch -c feature/<nr>-<kort-beskrivning>
  ```

### Medan du jobbar

- [ ] Kör `git status` ofta. Vet vilken branch du står i.
- [ ] Committa när något fungerar, även om det är litet.
- [ ] Kör `git diff` innan du committar. Vet vad som följer med.
- [ ] Ska du ändra något gemensamt, som routern, databasschemat eller en delad komponent? Säg till i teamets kanal först.

### Innan du öppnar en pull request

- [ ] Ta in senaste `main` i din branch och lös eventuella konflikter.
- [ ] Starta appen. Testa mot acceptanskriterierna.
- [ ] Läs din egen diff på GitHub under **Files changed**. Kvarglömd `console.log`? En fil som inte skulle med?
- [ ] Skriv `Closes #<nr>` i beskrivningen.
- [ ] Gå igenom DoD-checklistan.
- [ ] Välj en granskare.

### När din pull request är mergad

- [ ] Ta bort branchen, på GitHub och lokalt.
  ```bash
  git switch main
  git pull
  git branch -d <din branch>
  ```
- [ ] Kontrollera att kortet har flyttats till Klart.
- [ ] Börja nästa kort från den uppdaterade `main`.

### När du slutar för dagen

- [ ] Pusha det du har, även om det inte är klart. Då är det säkerhetskopierat, och teamet ser vad du jobbar med.
- [ ] Står det något halvfärdigt? Skriv det i kortet, så vet du var du var imorgon.

## Teamets rutiner

Skriv in det här i gruppkontraktet, så att alla vet vad som gäller.

| Rutin | Förslag |
|---|---|
| **Granskning** | En pull request granskas inom en arbetsdag. Säg till på standupen om du väntar på granskning. |
| **Storlek** | En pull request ska gå att granska på 10–15 minuter. Större? Dela upp kortet. |
| **Branch-namn** | `feature/`, `fix/`, `chore/`, `docs/` följt av kortets nummer och en kort beskrivning |
| **Vem mergar** | Den som skrev koden, efter godkännande |
| **Merge-sätt** | Bestäm ett, t.ex. Squash and merge, och skriv det i beslutsloggen |
| **Gemensamma filer** | Säg på standupen vad du ska ändra. Databasschemat ändras av en person i taget. |
| **Standup-loggen** | Scrum Master loggar. Ingen annan skriver i `standup.md`. |
| **Dokumentation** | Ändringar i `docs/` går via pull request, precis som kod |
| **Trasig main** | Den som upptäcker det säger till direkt. Att laga `main` går före allt annat. |

## Varje måndag

Efter sprint planning:

- [ ] Alla hämtar senaste `main`.
- [ ] Sprintmappen (`docs/sprintar/sprint-N/`) skapas via en pull request.
- [ ] Gamla branches som är mergade tas bort.
- [ ] Finns det öppna pull requests från förra sprinten? Granska och merga, eller stäng dem.

## Tecken på att rutinerna inte fungerar

Ta upp det på retron om ni märker något av det här:

- Pull requests ligger och väntar i mer än en dag.
- Ni får konflikter flera gånger i veckan.
- `main` går sönder.
- Någon har en branch som är äldre än en vecka.
- Ingen vet vad de andra håller på med.

## Frågor att reflektera över

- Vilken av rutinerna ovan tror du blir svårast för dig personligen? Varför?
- Vilken av teamets rutiner är viktigast för just er grupp?
- Vad gör ni om en pull request har legat ogranskad i två dagar?
