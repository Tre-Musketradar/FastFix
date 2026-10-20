# Branches

## Varför branches?

Tänk dig att alla fyra i Sysslo-teamet committar direkt till samma ställe. Lina har halva formuläret klart när hon pushar, och då slutar appen fungera för Jonas. Amir provar en idé som inte blev bra, men den ligger redan i allas kod.

En **branch** är en egen spårlinje där du kan jobba utan att störa någon annan. När arbetet är klart och granskat slås det ihop med `main`.

```
main     ●───●───────────●───────●
              \         /       /
lina           ●───●───●       /
                \             /
jonas            ●───●───●───●
```

## main är gemensam mark

I ert projekt gäller:

- **`main` ska alltid fungera.** Den som klonar repot ska kunna starta appen.
- **Ingen jobbar direkt i `main`.** Allt arbete sker i branches.
- **Kod kommer in i `main` via pull requests**, efter granskning.

Det sista tvingas fram med branch protection. Se `03-pull-requests-och-kodgranskning.md`.

## En branch per kort

Varje kort på boarden får en egen branch. När kortet är klart mergas branchen och tas bort.

```
Kort #4: Lägga till en syssla  →  branch: feature/4-lagg-till-syssla
```

Det gör det lätt att se vad en branch innehåller och vilken PR som hör till vilket kort.

## Namngivning

Bestäm en namngivning i teamet och skriv in den i gruppkontraktet. Ett vanligt mönster är `typ/nummer-kort-beskrivning`:

| Typ | Används för | Exempel |
|---|---|---|
| `feature/` | User stories | `feature/4-lagg-till-syssla` |
| `fix/` | Buggar | `fix/15-datum-forsvinner` |
| `chore/` | Tekniska uppgifter, uppsättning | `chore/projektskelett` |
| `docs/` | Dokumentation | `docs/sprint-1-retro` |

Undvik å, ä och ö i branch-namn. Det fungerar oftast, men kan ställa till det i vissa verktyg.

## Kommandon

```bash
git switch main                      # gå till main
git pull                             # hämta senaste main
git switch -c feature/4-lagg-till-syssla   # skapa ny branch och gå till den

# ... jobba, committa ...

git push -u origin feature/4-lagg-till-syssla   # första push: koppla till GitHub
git push                             # senare pushar

git branch                           # lista dina lokala branches
git switch <namn>                    # byt branch
git branch -d <namn>                 # ta bort en lokal branch som är mergad
```

`git switch` är det nyare kommandot för att byta branch. Äldre instruktioner använder `git checkout`, som också fungerar.

**Skapa alltid nya branches från en uppdaterad `main`.** Annars börjar du från gammal kod och får konflikter senare.

## Håll branchen uppdaterad

Medan du jobbar mergar andra sina PR:er till `main`. Ju längre din branch lever, desto mer skiljer den sig från `main`, och desto större blir konflikterna när den ska in.

Hämta in ändringar från `main` till din branch regelbundet, till exempel varje morgon:

```bash
git switch main
git pull
git switch feature/4-lagg-till-syssla
git merge main
```

Uppstår en konflikt är den liten, eftersom bara en dags ändringar har kommit in. Se `04-merge-konflikter.md`.

## Kortlivade branches

En bra branch lever i **några timmar till några dagar**, inte en hel sprint.

| Kortlivad branch | Långlivad branch |
|---|---|
| Liten PR, snabb att granska | Stor PR som ingen orkar granska ordentligt |
| Små konflikter, om några | Stora konflikter |
| Ändringen kommer snabbt till alla | Andra bygger vidare på gammal kod |

Om en branch växer sig stor är storyn troligen för stor. Dela upp den.

## Efter merge

När en PR är mergad:

- Ta bort branchen på GitHub (det finns en knapp i PR:en, och en inställning för att göra det automatiskt).
- Ta bort den lokalt: `git branch -d <namn>`.
- Gå tillbaka till `main`, kör `git pull`, och skapa nästa branch därifrån.

## Frågor att kunna svara på

- Varför ska ingen jobba direkt i `main`?
- Varför ska en ny branch skapas från en uppdaterad `main`?
- Vad händer om en branch lever i två veckor?
- Hur hänger branches ihop med korten på boarden?
