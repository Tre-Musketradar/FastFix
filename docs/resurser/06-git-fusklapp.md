# Git-fusklapp

Snabbreferens. Förklaringar finns i de andra filerna.

## Varje dag

| Vad | Kommando |
|---|---|
| Vad har ändrats? | `git status` |
| Hämta senaste main | `git switch main` → `git pull` |
| Ny branch från main | `git switch -c feature/4-kort-beskrivning` |
| Byt branch | `git switch <namn>` |
| Ta in main i min branch | `git merge main` (stå i din branch, efter att ha pullat main) |
| Välj vad som ska committas | `git add <fil>` eller `git add .` |
| Committa | `git commit -m "Lägg till formulär för ny syssla"` |
| Första push av ny branch | `git push -u origin <branch>` |
| Push | `git push` |
| Hämta en kollegas branch | `git fetch` → `git switch <branch>` |

## Titta

| Vad | Kommando |
|---|---|
| Historik, kort | `git log --oneline` |
| Historik som graf | `git log --oneline --graph --all` |
| Ändringar som inte är stagade | `git diff` |
| Ändringar som är stagade | `git diff --staged` |
| Vem ändrade varje rad? | `git blame <fil>` |
| Historik för en fil | `git log --oneline <fil>` |
| Lokala branches | `git branch` |
| Alla branches, även på GitHub | `git branch -a` |

## Ångra

| Situation | Kommando |
|---|---|
| Kasta ändringar i en fil (inte committade) | `git restore <fil>` |
| Ta bort en fil från staging | `git restore --staged <fil>` |
| Ändra senaste commit-meddelandet (ej pushat) | `git commit --amend -m "Nytt meddelande"` |
| Ångra en commit som redan är pushad | `git revert <commit-id>` |
| Lägga undan ändringar tillfälligt | `git stash` → senare `git stash pop` |
| Avbryta en merge | `git merge --abort` |
| Hitta "försvunna" commits | `git reflog` |

## Konflikt

```bash
git status                 # vilka filer?
# öppna filen, välj version, ta bort <<<<<<< ======= >>>>>>>
# starta appen och testa
git add <fil>
git commit
git push
```

## Städa efter merge

```bash
git switch main
git pull
git branch -d <branch-som-är-mergad>
```

## Farligt, var försiktig

| Kommando | Varför |
|---|---|
| `git push --force` | Kan skriva över andras commits. Aldrig på delade branches. |
| `git reset --hard` | Tar bort ändringar som inte är committade. De går inte att få tillbaka. |
| `git add .` utan att kolla | Kan få med `.env` eller andra filer som inte ska med. Kör `git status` först. |

## Branch-namn

| Typ | Exempel |
|---|---|
| User story | `feature/4-lagg-till-syssla` |
| Bugg | `fix/15-datum-forsvinner` |
| Teknisk uppgift | `chore/projektskelett` |
| Dokumentation | `docs/sprint-1-retro` |

## Commit-meddelanden

- Imperativ: "Lägg till", "Rätta", "Ta bort"
- Kort första rad, under 70 tecken
- Beskriv vad ändringen gör, inte vad du gjorde idag

## Pull request

- [ ] Branchen är uppdaterad med `main`
- [ ] Appen startar och acceptanskriterierna är testade
- [ ] Jag har läst min egen diff
- [ ] `Closes #<nummer>` i beskrivningen
- [ ] DoD-checklistan är ifylld
- [ ] Granskare är vald
