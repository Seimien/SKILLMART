# SkillMart

## What this repo contains
- `skillmart/` — SkillMart frontend (React + Vite)
- `supabase/` — SQL migrations for the backend

## Frontend
See `skillmart/README.md` for:
- local dev (`npm run dev`)
- production build
- Docker instructions (`Dockerfile`, `docker-compose.yml`)

## Merge Docker changes into `main`
If you pulled in the Docker feature branch `blackboxai/docker-containerize`:

```bash
# from your repo root
git checkout main
git fetch origin
git merge origin/blackboxai/docker-containerize
# or: git rebase origin/blackboxai/docker-containerize

git push
```

