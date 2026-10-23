# Estimering med klädstorlekar

## Varför estimera?

Estimering hjälper teamet att svara på två frågor:

1. **Är storyn för stor?** I så fall ska den delas upp innan den tas in i en sprint.
2. **Hur mycket hinner vi den här sprinten?** Utan någon uppfattning om storlek är det lätt att ta in alldeles för mycket.

Estimering handlar inte om att gissa exakt antal timmar. Det går inte, och det behövs inte.

## Klädstorlekar

Vi använder **relativa** storlekar: S, M och L. Man jämför stories med varandra i stället för att räkna timmar.

| Storlek | Kännetecken |
|---|---|
| **S** | Liten och tydlig. Ni vet exakt hur den ska byggas. |
| **M** | Ni vet hur den ska byggas, men den har flera delar (t.ex. formulär, endpoint och databas). |
| **L** | Stor eller osäker. Många delar, eller något ni inte gjort förut. |
| **XL** | För stor. **Dela upp den** innan den får komma in i en sprint. |

Som tumregel: en L ska kunna bli klar under en sprint av en person. Om ni tvekar på det är den troligen en XL.

## Exempel: Sysslo

| Story | Storlek | Varför |
|---|---|---|
| Markera en syssla som gjord | S | En knapp och en uppdatering av ett fält. |
| Lägga till en syssla | M | Formulär, validering, endpoint, databas. |
| Tilldela en syssla till någon | M | Behöver lista medlemmar och spara kopplingen. |
| Bjuda in medlemmar via länk | L | Länkar, säkerhet, nytt inloggningsflöde. Teamet har inte gjort det förut. |
| Hantera hushållet | XL | Skapa, ändra, ta bort, medlemmar, inbjudningar … Dela upp. |

## Så gör ni

1. Välj en story som alla förstår, och bestäm att den är en **M**. Det är er referens.
2. Gå igenom resten av storiesen och jämför: är den här mindre, ungefär lika stor eller större än referensen?
3. Om ni är oense: låt den som sagt minst och den som sagt störst förklara varför. Ofta har någon tänkt på något de andra missat.
4. Ta inte för lång tid på varje. En till två minuter per story räcker.

Det viktigaste med estimeringen är ofta **diskussionen**. Om Lina säger S och Jonas säger L har de troligen förstått storyn olika. Då behöver acceptanskriterierna förtydligas.

## Hur mycket hinner vi?

Det vet ni inte i sprint 1, och det är okej. Gör en gissning och se hur det går.

Efter varje sprint kan ni titta tillbaka: hur många S, M och L blev faktiskt klara? Det är er bästa gissning för nästa sprint. Det kallas ibland *gårdagens väder*: det bästa sättet att förutsäga morgondagen är att titta på vad som hände igår.

Det är bättre att ta in för lite och plocka in mer under sprinten, än att ta in för mycket och ha halvfärdiga stories på reviewn.

## Vanliga misstag

**Att räkna om storlekar till timmar.** "M är 6 timmar" leder tillbaka till exakta tidsuppskattningar som ändå inte stämmer.

**Att låta XL vara kvar.** En XL i en sprint blir nästan alltid halvfärdig.

**Att den som kan mest bestämmer.** Alla i teamet ska vara med. Den som bygger storyn kanske inte är den som är snabbast.

**Att estimera allt i backloggen direkt.** Stories längst ner kan vänta. Estimera det som ligger närmast att göras.

## Frågor att kunna svara på

- Varför estimerar man relativt i stället för i timmar?
- Vad gör ni med en story som är XL?
- Varför är diskussionen ofta viktigare än själva storleken?
- Hur kan ni använda tidigare sprintar för att planera nästa?
