# Warscythe final pre-YC validation execution plan

## Safety baseline

- Initial branch: `main`
- Initial commit: `2c18b60daab63d7752f482921fb66fe98673dd0a`
- Initial working tree: clean
- Validation branch: `codex/final-pre-yc-validation`
- Production Supabase ref: `yrxchjontmgkjaazrybh`
- Isolated validation ref: `pkjuifqkipsjlzxlpfoo`
- Isolation rule: every database runner must reject the production ref and print the
  non-secret target URL before it can mutate data.

## Environment

Use the isolated Supabase snapshot branch because Docker and WSL are unavailable
and the repository does not contain the baseline `profiles` schema required by the
Sync V2 migration. All destructive fixtures will be newly-created validation users
and will be removed by deterministic teardown.

## Tests

1. Apply and rerun the production-intended Sync V2 migration.
2. Execute TC-01 through TC-12 with authenticated clients and direct database
   evidence where required.
3. Execute the additional merge, queue, session, retry, malformed-input, and
   progression cases specified by the release brief.
4. Reproduce confirmed failures before changing production code.
5. Run targeted and neighboring regression tests after each minimal fix.
6. Compare the two supplied Lighthouse JSON reports and map measured changes to
   repository evidence.
7. Walk the critical web experience in a clean browser session.
8. Build and test Android on an emulator with production-equivalent configuration.
9. Increment to versionCode 21 and versionName 2.1.9 only after all P0 gates pass.
10. Generate and verify the signed release AAB using the existing signing setup.

## Fixtures

- Unique validation auth users with a `yc-validation` email marker.
- Independent access tokens for device A and device B.
- Deterministic operation, ritual, workout, reward, and progression UUIDs.
- Resettable legacy, partial-migration, and malformed JSONB profile states.
- Queue sizes of 100, 500, and 2,000 records where practical.

## Expected change area

- `supabase/migrations/20260719_warscythe_sync_v2.sql`
- `src/store/syncV2.js`
- The narrow store/UI path that reconciles authoritative progression, only if the
  live tests confirm the suspected early-ceremony failure.
- New validation and regression tests under `scratch/final_validation/`.
- Android release metadata after the implementation is frozen.
- Final validation report and evidence files.

## Risks and blockers

- The isolated Supabase snapshot must become healthy before destructive testing.
- The checked-in migration depends on baseline schema absent from `schema.sql`.
- Android emulator access and release signing must work with installed local tools.
- Google OAuth cannot be called verified without a testable provider redirect.
- A broad fix will not be attempted if a confirmed bug requires a high-risk refactor.
