# Coast Infrastructure – Next.js Starter

This scaffold provides a premium, enterprise-style Next.js App Router project for a civil engineering and construction company focused on the Kenyan Coast.

Quick start:

```bash
npm install
npm run dev
```

Admin and deployment
--------------------

- Local testing: create a local environment file `.env.local` with the admin password (this file is ignored by git):

```
ADMIN_PASSWORD=your-secret
```

- Production (Vercel): set `ADMIN_PASSWORD`, `GITHUB_TOKEN`, `GITHUB_REPO`, and optional Cloudinary variables in your Vercel project settings. Do NOT commit secrets to the repo.

- If `GITHUB_TOKEN` and `GITHUB_REPO` are set, the admin will commit changes to `src/data/projects.json` so Vercel auto-deploys the updated site. If not configured, changes write to the local filesystem (useful for VPS deployments).


Content is driven by reusable React data modules in `src/data/content.ts` for a clean, scalable architecture.
