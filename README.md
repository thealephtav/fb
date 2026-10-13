# Aleph

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file with the required runtime variables:

```bash
AUTH_SECRET=KpGFTTndG+6bcCsje+Vmb8ZuyWdGM7ZG+A8KrS7tO+k=
EMAIL_SERVER=smtp://localhost:1025
EMAIL_FROM=hello@aleph.local
DATABASE_URL=postgres://postgres:postgres@localhost:5432/aleph
```

> `AUTH_SECRET` alone is not enough to boot this app. `EMAIL_SERVER`, `EMAIL_FROM`, and a reachable `DATABASE_URL` are also required by `auth.ts` and `lib/db.ts`.

3. Start Postgres and MailHog/Mailpit locally (or point to existing services), then run the app:

```bash
npm run dev
```

4. Build check with the same env vars loaded:

```bash
npm run build
```

## Verify the 3-photo profile carousel

After the app is running against a real database, make sure a profile has values for `pfp`, `pfp2`, and `pfp3` in the `users` table, then open `/<handle>`.

Expected behavior:

- Large rectangular profile photos.
- Instagram-style top progress indicator.
- Arrow and dot navigation.
- Keyboard arrow-key navigation.
- Swipe navigation on touch devices.

## Useful commands

```bash
npm run lint
npx tsc --noEmit
```
