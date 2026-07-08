# Skillz (Design Request)

A campus talent marketplace connecting students offering gigs/skills with people looking to hire them. Originally exported from Figma Make.

## Stack
- React 18 + Vite 6 + TypeScript
- Tailwind CSS v4 + MUI + Radix UI component primitives
- React Router 7
- Firebase (Auth, Firestore, Storage) for backend data/auth

## Running
- `pnpm run dev` starts the Vite dev server on port 5000 (bound via the "Start application" workflow).
- Build: `pnpm run build` (outputs to `dist`, used by the configured static deployment).

## Environment
Firebase web app config is provided via env vars (set as Replit env vars, not secrets, since they're client-exposed by design):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

These map to the Firebase project's Auth/Firestore/Storage used across `src/lib/firebase.ts`, `src/lib/firestore.ts`, and `src/lib/auth-context.tsx`. The admin panel (`src/app/pages/admin-panel.tsx`) grants access to the email hardcoded as `ADMIN_EMAIL` in `src/lib/firebase.ts`.

Firestore security rules live in `firestore.rules` at the repo root — deploy/update them via the Firebase console or CLI when data access patterns change.

## User preferences
(none recorded yet)
