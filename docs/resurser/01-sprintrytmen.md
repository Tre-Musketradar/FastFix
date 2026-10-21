# Sprintrytmen

Från vecka 3 arbetar ni i sprintar på en vecka. Varje sprint ser likadan ut. Det är meningen: när rytmen sitter behöver ni inte tänka på den, och kan lägga kraften på att bygga.

## Kursens sprintar

| Vecka | Måndag |
|---|---|
| 3 | Sprint planning, sprint 1 |
| 4 | Review och retro, sprint 1 → planning, sprint 2 |
| 5 | Review och retro, sprint 2 → planning, sprint 3 |
| 6 | Review och retro, sprint 3 → planning, sprint 4 |
| 7 | Review och retro, sprint 4 → planning, sprint 5 |
| 8 | Review och retro, sprint 5 → redovisning |

## En vecka

| Dag | Vad händer |
|---|---|
| **Måndag** | Review med läraren → retro → sprint planning. Sedan börjar ni bygga. |
| **Tisdag** | Daily standup. Bygga. |
| **Onsdag** | Daily standup. Undervisning och avstämning med läraren. |
| **Torsdag** | Daily standup. Bygga. |
| **Fredag** | Daily standup. Bygga. Förbered reviewn. |

### Måndagens ordning

```
Review (förra sprinten)  →  Retro (förra sprinten)  →  Planning (nästa sprint)
     ca 20 min                 ca 15–20 min                ca 30–45 min
```

Ordningen är viktig. Retron ligger före planeringen, så att det ni bestämmer på retron påverkar nästa sprint direkt. Reviewn ligger först, så att feedbacken från läraren kan påverka både retron och vad ni planerar in.

Håll tiderna. Scrum Master ser till det. Utan tidsgränser tar måndagens möten hela dagen.

## Ceremonierna i korthet

### Sprint review (måndag, med läraren)

Ni visar vad ni har byggt under sprinten och får feedback. Se `03-infor-review.md` för vad ni behöver ha förberett.

### Retrospektiv (måndag, direkt efter reviewn)

Teamet själva. Vad gick bra, vad gick mindre bra, och vad ändrar ni till nästa sprint? Fyll i `retro.md`. Vi går igenom retron mer efter sprint 1, när ni har något att reflektera över.

### Sprint planning (måndag, efter retron)

Ni planerar nästa sprint. Se `02-sprint-planning.md`.

### Daily standup (tisdag–fredag)

Max 15 minuter, samma tid varje dag. Varje person säger kort:

- Vad gjorde jag igår?
- Vad ska jag göra idag?
- Har jag några hinder?

Ett tillägg som är viktigt för Git: **säg vilka filer eller delar av koden du ska ändra.** Då vet de andra om ni riskerar att krocka. Se `05-konflikter-forebygga-och-losa.md`.

Problem löses inte på standupen, utan efteråt med de som berörs.

**Scrum Master loggar standupen** i `standup.md`, en gång per dag, direkt efter mötet. Bara Scrum Master skriver i filen. Om alla skulle skriva sin egen rad i samma fil varje dag skulle ni få en konflikt i den nästan varje dag.

## Mallarna

Varje sprint har en egen mapp i `docs/sprintar/`. Vid sprint planning:

1. Kopiera `docs/sprintar/sprint-mall/` och döp kopian till `sprint-1/`, `sprint-2/` osv.
2. Gör det i en branch och via en pull request, precis som med kod.

| Fil | När | Vem |
|---|---|---|
| `planning.md` | Måndag, under sprint planning | Product Owner leder, alla bidrar |
| `standup.md` | Varje dag efter standup | Scrum Master |
| `review.md` | Del 1 före reviewn, del 2 efter | Hela teamet |
| `retro.md` | Måndag, direkt efter reviewn | Scrum Master leder, alla bidrar |

## Roller

| Roll | Ansvar under sprinten |
|---|---|
| **Product Owner** | Ser till att backloggen är prioriterad och att de översta korten är redo. Leder sprint planning. Svarar på frågor om vad en story betyder. |
| **Scrum Master** | Håller tiden på måndagens möten. Leder standup och loggar den. Leder retron. Frågar "vad hindrar dig?" och ser till att hinder tas om hand. |
| **Developers** | Alla, även PO och SM. Bygger, granskar och testar. |

Ni får gärna byta roller mellan sprintarna. Bestäm i så fall vid sprint planning, och skriv in det i `planning.md`. Att ha provat olika roller ger mer att berätta om i den individuella reflektionen och den muntliga redovisningen.

## Frågor att kunna svara på

- Varför ligger retron före sprint planning?
- Varför ska man säga på standupen vilka delar av koden man ska ändra?
- Varför loggar bara Scrum Master standupen?
