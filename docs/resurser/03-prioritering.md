# Prioritering av backloggen

## Varför prioritera?

Ni kommer inte att hinna bygga allt. Det gör nästan inget team. Frågan är därför inte *om* något blir kvar, utan *vad*.

En prioriterad backlog betyder att det viktigaste alltid byggs först. Om tiden tar slut är det de minst viktiga sakerna som saknas, inte kärnan i appen.

Det är Product Owners ansvar att backloggen är prioriterad, men beslutet fattas bäst tillsammans med teamet.

## Backloggen är en ordnad lista

I Scrum är produktbackloggen **ordnad**: det som ligger överst görs först. Två stories kan inte ha samma plats. Det tvingar fram ett beslut: om ni bara hinner en av dem, vilken?

I GitHub Projects ordnar ni backloggen genom att dra korten i tabellvyn. Se `05-github-repo-och-board.md`.

## MoSCoW

MoSCoW är ett enkelt sätt att sortera stories i fyra grupper:

| | Betyder | I ert projekt |
|---|---|---|
| **Must** | Måste finnas, annars fungerar inte produkten | Er MVP |
| **Should** | Viktigt, men produkten fungerar utan | Det ni vill bygga efter MVP:n |
| **Could** | Trevligt att ha om tid finns | Extra funktioner |
| **Won't** (this time) | Medvetet bortvalt, i alla fall nu | Er "inte i MVP"-lista, delvis |

**Must-listan är er MVP.** Om Must-listan innehåller mycket mer än det ni skrev i MVP-beskrivningen har ni antingen skrivit en för liten MVP eller gjort för mycket till Must.

**Won't är också ett beslut.** Det är lika värdefullt att skriva ner vad ni *inte* ska göra. Då slipper ni ta samma diskussion igen.

## Exempel: Sysslo

| Story | MoSCoW |
|---|---|
| Skapa ett hushåll | Must |
| Lägga till en syssla | Must |
| Tilldela en syssla till någon | Must |
| Markera en syssla som gjord | Must |
| Se vilka sysslor som är mina | Must |
| Bjuda in medlemmar via länk | Should |
| Återkommande sysslor | Should |
| Se historik över vem som gjort vad | Could |
| Poäng och topplista | Could |
| Påminnelser via e-post | Won't |
| Mobilapp | Won't |

Inom Must ordnar teamet sedan stories efter vad som måste finnas först. Man kan inte lägga till sysslor innan det finns ett hushåll att lägga dem i.

## Saker att väga in

När ni ordnar backloggen, fundera på:

- **Värde:** hur mycket får användaren ut av storyn?
- **Beroenden:** måste något annat finnas först?
- **Risk:** är det något ni är osäkra på hur man bygger? Gör det tidigt, så att ni hinner ändra er.
- **Storlek:** en liten story med högt värde är ofta bra att göra tidigt.

### Värde och storlek

| | Liten storlek | Stor storlek |
|---|---|---|
| **Högt värde** | Gör först | Gör, men dela upp om möjligt |
| **Lågt värde** | Gör om det finns tid | Gör troligen inte |

## Prioriteringen ändras

Backloggen är inte fast. Efter varje review kan prioriteringen behöva ändras:

- Läraren (kunden) tycker att något är viktigare än ni trodde.
- Ni upptäcker att något är svårare än väntat.
- En ny story dyker upp.

Kom ihåg Sysslo i pass 1: "vi turas om" blev en ny Must efter första reviewn.

## Frågor att kunna svara på

- Varför är backloggen en ordnad lista och inte bara en hög med stories?
- Vad betyder MoSCoW? Hur hänger Must ihop med MVP?
- Varför kan det vara bra att göra en riskabel story tidigt?
- Vem ansvarar för prioriteringen?
