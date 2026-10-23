# Inför review

Varje måndag har ni en sprint review med läraren, ungefär 20 minuter. Ni visar vad ni har byggt under sprinten och får feedback. Läraren är er kund.

Den här filen handlar om vad ni behöver ha förberett.

## Upplägg

| Del | Tid |
|---|---|
| Sprintmål och vad som blev klart | 2 min |
| Demo av fungerande mjukvara | 10 min |
| Feedback och frågor | 8 min |

## Förbered senast söndag kväll

### 1. Fyll i del 1 av review.md

I `docs/sprintar/sprint-N/review.md`:

- Sprintmålet, och om ni nådde det
- Vad som blev klart
- Vad som inte blev klart, och varför
- Demoplanen
- Frågor ni vill ha svar på

### 2. Visa bara det som är klart

Bara kort som uppfyller **både** acceptanskriterierna och er Definition of Done visas som klara. Allt annat redovisas under "Blev inte klart".

Att något inte blev klart är inget misslyckande, men det ska förklaras. Vad hände? Vad händer med kortet nu?

### 3. Demot körs från main

Demot visar det som finns i `main`, inte det som ligger i någons branch. Det som inte är mergat är inte klart.

- Hämta senaste `main` på datorn ni ska visa från.
- Starta appen och **gå igenom hela demot innan måndag**. Det är vanligt att något har gått sönder i sista mergen.
- Ha lite testdata i databasen, så att det inte är tomt.

### 4. Visa en användares väg, inte kort för kort

Berätta det som en användare som använder appen, inte som en lista med funktioner.

> **Sysslo:** "Sara flyttar in i en korridor och skapar hushållet 'Korridor 4B'. Hon lägger till disken och dammsugningen. Här ser ni listan, och här ser ni att sysslorna finns kvar när vi laddar om."

### 5. Uppdatera boarden

Korten ska stå där de faktiskt är. Klara kort i Klart, resten där de är.

### 6. Bestäm vem som gör vad

- Vem visar? Gärna flera, men bestäm ordningen i förväg.
- Vem antecknar feedbacken? Det ska in i del 2 av `review.md`.

## Efter reviewn

- Fyll i del 2 av `review.md`: feedbacken och vad den betyder för backloggen.
- Ändra i backloggen om det behövs. Nya kort, ändrad prioritet.
- Sedan går ni direkt till retron och sprint planning.

## Checklista inför review

- [ ] Del 1 av `review.md` är ifylld
- [ ] Allt som visas som klart uppfyller acceptanskriterierna och DoD
- [ ] Demot är testat från en uppdaterad `main`
- [ ] Det finns testdata i databasen
- [ ] Boarden stämmer
- [ ] Ni vet vem som visar och vem som antecknar
