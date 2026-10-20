# Projektmetoder: vattenfall, Kanban och Scrum

Det finns många sätt att driva ett mjukvaruprojekt. Här jämför vi tre vanliga. Ingen är "rätt" i alla lägen. Poängen är att förstå när vilken passar.

## Vattenfall

Projektet delas in i faser som görs efter varandra. Varje fas ska vara klar innan nästa börjar.

```
Krav → Design → Implementation → Test → Leverans → Underhåll
```

**Styrkor**
- Tydlig plan, budget och tidslinje från början
- Lätt att följa upp: vilken fas är vi i?
- Passar när kraven är stabila och kända

**Svagheter**
- Kunden ser inget fungerande förrän sent
- Fel i kraven upptäcks ofta först i testfasen, när det är dyrt att ändra
- Svårt att hantera ändrade krav

**Passar för:** projekt där kraven är kända och inte ändras, eller där regelverk kräver omfattande planering i förväg (t.ex. delar av medicinteknik, byggprojekt, myndighetsupphandlingar).

## Kanban

Kanban kommer från Toyotas produktion. Arbetet visualiseras på en tavla med kolumner, och varje uppgift flyttas genom kolumnerna.

```
Att göra → Pågår → Granskas → Klart
```

**Grundprinciper**
- **Visualisera arbetet** på en tavla
- **Begränsa pågående arbete** (WIP-gräns, *work in progress*): t.ex. max tre uppgifter i "Pågår" samtidigt
- **Fokusera på flödet:** få saker hela vägen till "Klart" snarare än att starta nya

**Styrkor**
- Enkelt att börja med
- Flexibelt: nya uppgifter kan prioriteras in när som helst
- Gör flaskhalsar synliga

**Svagheter**
- Inga fasta tidpunkter för planering eller reflektion. Det måste man själv se till att få till.
- Inga definierade roller

**Passar för:** löpande arbete där uppgifter dyker upp hela tiden, t.ex. support, drift och underhåll.

## Scrum

Arbetet delas in i **sprintar** med fast längd (ofta 1–4 veckor). Varje sprint har samma rutiner: planering i början, daglig avstämning, och demo plus reflektion i slutet. Teamet har definierade roller.

Mer om Scrum i `04-scrum-översikt.md`.

**Styrkor**
- Täta återkopplingar: kunden ser resultat varje sprint
- Inbyggd reflektion och förbättring (retrospektiv)
- Tydlig struktur och tydliga roller

**Svagheter**
- Kräver disciplin att hålla rutinerna
- Kan kännas tungt för mycket små team eller rent underhållsarbete
- Sprintmålet kan bli ett hinder om något brådskande dyker upp mitt i sprinten

**Passar för:** produktutveckling där kraven är osäkra och ändras, och där man vill ha regelbunden feedback.

## Jämförelse

| | Vattenfall | Kanban | Scrum |
|---|---|---|---|
| Planering | Allt i förväg | Löpande | Inför varje sprint |
| Leverans | En gång, i slutet | Löpande | Efter varje sprint |
| Ändrade krav | Svårt | Lätt | Mellan sprintar |
| Roller | Projektledare m.fl. | Inga krav | Product Owner, Scrum Master, Developers |
| Feedback från kund | Sent | Löpande | Varje sprint |
| Reflektion | Ofta i slutet | Ingen fast rutin | Retrospektiv varje sprint |

## I verkligheten

De flesta företag kör inte någon metod helt "enligt boken". Vanligt är:

- **Scrum med Kanban-tavla:** sprintar och ceremonier, men arbetet visualiseras på en Kanban-tavla. Det är ungefär vad ni kommer göra.
- **Scrumban:** en blandning, där man t.ex. har en Kanban-tavla och flöde men behåller retrospektiven.
- **Vattenfall på övergripande nivå, agilt inuti:** projektet har en budget och tidsplan, men teamen arbetar agilt inom den.

## Frågor att kunna svara på

- Varför är det dyrt att upptäcka ett fel i kraven sent i ett vattenfallsprojekt?
- Vad är en WIP-gräns och varför är den användbar?
- Vilken metod skulle du välja för ett supportteam? För en ny app? Varför?
- Vad är skillnaden mellan Kanban och Scrum när det gäller planering?
