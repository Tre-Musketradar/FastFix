# Arbetsflöde

## Grenar

```
feature/<namn>  ──PR──▶  staging  ──PR──▶  main
```

- `main`: stabil version. Direkt push är **aldrig** tillåten.
- `staging`: integration och testning. Alla ändringar hamnar här först.
- `feature/*`, `fix/*`, `docs/*`: arbetsgrenar som skapas från `staging`.

## Regler

1. Skapa din gren från `staging`: `git checkout staging && git pull && git checkout -b feature/min-andring`
2. Öppna en PR mot `staging`. CI (frontend: lint, typkontroll, tester, bygge; backend: `mvnw verify`) måste gå igenom.
3. När `staging` är stabil öppnas en PR `staging → main`.
4. CI avvisar alla PR:er mot `main` som inte kommer från `staging`.
5. Dokumentation skrivs på svenska. Commit-meddelanden och PR:er skrivs på engelska.

## Från issue till Klart

1. Ta en issue från "Att göra" på [boarden](https://github.com/orgs/Tre-Musketradar/projects/3), sätt dig som ansvarig och flytta kortet till "Pågår".
2. Skapa en gren från `staging`, gärna med issuenumret i namnet: `feature/6-logga-in`.
3. Öppna en PR mot `staging` med PR-mallen. Skriv `Closes #6` så stängs issuen när PR:en mergas. Flytta kortet till "Granskas".
4. Gå igenom Definition of Done i PR-mallen innan du ber om granskning.
5. Granskaren godkänner med **Files changed → Review changes → Approve**. En vanlig kommentar räknas inte som godkännande.
6. När PR:en mergas flyttas kortet till "Klart" automatiskt.

Nya stories och buggar skapas med issuemallarna "User story" och "Bugg".

## Kommandon

```bash
docker compose up --build   # startar allt

cd frontend
npm install
npm run dev        # utvecklingsserver
npm run lint       # ESLint
npm run typecheck  # tsc
npm test           # Vitest
npm run format     # Prettier
npm run build      # produktionsbygge

cd backend
./mvnw verify      # bygge och tester (kräver databasen: docker compose up db)
```
