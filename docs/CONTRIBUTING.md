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
2. Öppna en PR mot `staging`. CI (frontend: lint, typkontroll, bygge; backend: `mvnw verify`) måste gå igenom.
3. När `staging` är stabil öppnas en PR `staging → main`.
4. CI avvisar alla PR:er mot `main` som inte kommer från `staging`.
5. Dokumentation skrivs på svenska. Commit-meddelanden och PR:er skrivs på engelska.

## Kommandon

```bash
docker compose up --build   # startar allt

cd frontend
npm install
npm run dev        # utvecklingsserver
npm run lint       # ESLint
npm run typecheck  # tsc
npm run build      # produktionsbygge

cd backend
./mvnw verify      # bygge och tester (kräver databasen: docker compose up db)
```
