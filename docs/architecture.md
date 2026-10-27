# Architecture

[Back to README](../README.md)

## Request and state flow

```text
React screens
  → Zustand store
    → Local persistence
    → Sync layer
      → Supabase Auth / Postgres RPCs

Screens also load local/remote art.
Capacitor supplies native integrations.
Edge functions handle payment requests.
```

- **Interface:** React 19, Vite 8, CSS/Tailwind tooling and Framer Motion. Start with [App](../src/App.jsx) and [pages](../src/pages).
- **State and progression:** Zustand 5 and application reward logic. See the [store](../src/store/useWarscytheStore.js) and [progression projection](../src/store/progressionProjection.js).
- **Persistence:** Supabase client, Postgres schema and synchronization RPCs. See the [client](../src/lib/supabase.js), [sync layer](../src/store/syncV2.js) and [migrations](../supabase/migrations).
- **Payments:** Supabase edge functions and Razorpay integration. See [functions](../supabase/functions).
- **Analytics:** [PostHog client](../src/lib/ph.js).
- **Native shell:** Capacitor 8; see [package scripts](../package.json).
- **Web hosting configuration:** [Vercel configuration](../vercel.json).

These are source-observed integrations, not certification that each external service is currently operational.

## Product map

[Operations](../src/pages/Operations.jsx) handles finite tasks. [Rituals](../src/pages/Rituals.jsx) handles recurring actions. [Ledger](../src/pages/Ledger.jsx) presents accumulated history. [Fitness](../src/pages/Fitness.jsx) covers training, while [Social](../src/pages/Social.jsx) implements the Legion area. [Forge](../src/pages/Forge.jsx) presents customization and progression.

## Assets and local previews

The [asset resolver](../src/utils/assetResolver.js) chooses local or remote paths. Some remote artwork remains PNG-backed while the local checkout is being migrated to WebP. Do not infer CDN availability from the existence of a local image.

The development [Test Realm](../src/components/dev/TestRealm.jsx) supplies synthetic state for visual inspection. It is not evidence of real users, successful purchases or backend persistence. Use it only in a disposable development profile. Local Fitness V2 work can be ahead of the committed source; do not treat screenshots from that work as a released capability.

## Change boundaries

Keep presentation changes separate from product changes. Asset generation, database migrations, native sync and deployment have separate side effects and verification requirements. The release freeze remains in force; a documentation update does not approve deployment.
