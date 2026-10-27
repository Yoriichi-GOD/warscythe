# Getting started

[Back to README](../README.md)

## Prerequisites

Use Node.js 22.12+ and npm (Vite declares `^20.19.0 || >=22.12.0`). A development Supabase project is needed for authenticated workflows. Android builds additionally require Android Studio, a compatible Android SDK/JDK and the native project setup.

## Web development

1. Run `npm ci` from the repository root using the committed lockfile.
2. Copy [`.env.example`](../.env.example) to `.env.local`. In PowerShell: `Copy-Item .env.example .env.local`.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for a **development** project. The browser uses the anon/publishable client credential; never put a service-role key in a `VITE_*` variable.
4. Configure `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` only when intentionally enabling analytics for that environment.
5. Run `npm run dev` and open the URL Vite prints. Restart Vite after changing environment variables.

Missing Supabase settings produce placeholder configuration. This is not a fully functional offline backend. Do not use production credentials to test destructive actions.

## Backend boundary

The [schema](../supabase/schema.sql), [migrations](../supabase/migrations) and [edge functions](../supabase/functions) are starting points for a backend review, not a verified one-command bootstrap. Reconcile schema history, policies, RPCs, auth redirect URLs and storage before applying them to a new development project. Do not blindly apply historical SQL to production.

Payment functions require server-side provider configuration and secrets. Local frontend startup does not establish that checkout, webhooks or purchases work. No shared demo credentials are provided here.

## Commands and side effects

| Command | Purpose and boundary |
| --- | --- |
| `npm run dev` | Local Vite development server |
| `npm run lint` | Repository ESLint checks; not an integration test |
| `npm run build` | Runs the asset optimizer **before** Vite; may change generated/local assets |
| `npm run preview` | Serves an already-built frontend locally |
| `npm run verify:cdn` | Checks remote artwork availability; requires network access |
| `npm run android:sync` | Builds and prepares assets, then changes the native project through Capacitor sync |
| `npm run android:apk` | Windows Gradle debug build; requires the Android toolchain |

See [package.json](../package.json) for the authoritative scripts. Avoid asset optimization and native sync in a dirty checkout unless those changes are intended. No deployment command is needed for local review.

## Troubleshooting

**Slow or missing artwork:** some assets are local and others resolve to remote storage. Inspect the browser Network panel for failed requests and image sizes; localhost does not make a remote image local. See [asset routing](../src/utils/assetResolver.js).

**Sign-in or sync fails:** verify the development project URL, auth redirect configuration, database policies and required RPCs. Preserve the error message; do not treat a successful page load as successful persistence.

**Old visuals after a change:** inspect service-worker and cache state in a disposable browser profile. Do not clear a user's stored task data merely to troubleshoot artwork.
