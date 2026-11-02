# Omröstning om wireframes och mockups

Meddelandet till gruppen om omröstningen (skickat i Slack 2026-10-28) och en tabell för resultatet. Utkasten beskrivs i [frontendplanen](frontend-plan.md#wireframes-och-mockups).

## Meddelandet

Hej allihop! 👋

Nu finns ett första **utkast** av wireframes och mockups för Felanmälan, och vi behöver rösta om dem innan vi bygger frontend.

**Var hittar jag bilderna?**
https://github.com/Tre-Musketradar/FastFix/blob/docs/mockups/docs/frontend-plan.md#wireframes-och-mockups
Där ser ni alla bilder direkt på GitHub. Det är 8 vyer, och varje vy har en wireframe (struktur, i grått) och en mockup (så ska appen se ut):

1. Logga in
2. Mina ärenden (hyresgäst)
3. Ny felanmälan
4. Ärende och historik
5. Öppna ärenden (förvaltare)
6. Fastigheter (förvaltare)
7. Lägenheter i en fastighet (förvaltare)
8. Hyresgäster (förvaltare)

**Så röstar du**
Svara i tråden med ett av alternativen för varje vy:

- ✅ **Ja**: bra som den är
- ✏️ **Ändra**: skriv kort vad som ska ändras
- ❌ **Nej**: gör om den, och skriv varför

Exempel:

> 1 ✅ · 2 ✅ · 3 ✏️ Rum ska vara ett fritt fält · 4 ✅ · 5 ✏️ Visa skapad-datum · 6 ✅ · 7 ✅ · 8 ✅

Säg också gärna vad du tycker om färgerna och stilen i stort.

**Två frågor som påverkar bilderna**

- Ska **Rum** vara en lista eller ett fritt fält i Ny felanmälan? (öppen fråga 6)
- Ska orsaken till **Väntar** (t.ex. "väntar på material") vara ett eget fält? (öppen fråga 5)

**Efter omröstningen**
Vy med majoritet ✅ blir slutlig. Vy med ✏️ eller ❌ ändras först. De slutliga bilderna läggs i `docs/bilder/mockups/slutliga/` och är det vi bygger efter. Utkasten ligger kvar i `utkast/`.

Rösta senast **[dag]**, tack! 🙏
Granska och godkänn gärna PR #45 också (Review changes → Approve): https://github.com/Tre-Musketradar/FastFix/pull/45

## Resultat

Fylls i när alla har röstat. ✅ Ja, ✏️ Ändra, ❌ Nej.

| Vy | Jose | Martin | Ermias | Beslut | Vad ska ändras |
|---|---|---|---|---|---|
| 1. Logga in | | | | | |
| 2. Mina ärenden (hyresgäst) | | | | | |
| 3. Ny felanmälan | | | | | |
| 4. Ärende och historik | | | | | |
| 5. Öppna ärenden (förvaltare) | | | | | |
| 6. Fastigheter (förvaltare) | | | | | |
| 7. Lägenheter i en fastighet (förvaltare) | | | | | |
| 8. Hyresgäster (förvaltare) | | | | | |

| Fråga | Beslut |
|---|---|
| Rum: lista eller fritt fält (öppen fråga 6) | |
| Orsak till Väntar som eget fält (öppen fråga 5) | |
| Färger och stil | |

## Ändringar

| Datum | Ändring |
|---|---|
| 2026-10-28 | Första versionen: meddelandet och en tom resultattabell |
