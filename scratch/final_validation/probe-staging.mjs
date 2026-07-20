import pg from 'pg';

const target = process.env.SUPABASE_URL;
const productionRef = process.env.PRODUCTION_PROJECT_REF;
const stagingRef = process.env.STAGING_PROJECT_REF;
const connectionString = process.env.STAGING_DATABASE_URL;

console.log(`TARGET=${target}`);
console.log(`PRODUCTION=https://${productionRef}.supabase.co`);
console.log(`ISOLATION_VERIFIED=${Boolean(
  target
  && stagingRef
  && productionRef
  && stagingRef !== productionRef
  && target.includes(stagingRef)
)}`);

if (!target || !connectionString || !stagingRef || stagingRef === productionRef) {
  console.error('REFUSING_DATABASE_CONNECTION');
  process.exit(2);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15_000,
});

try {
  await client.connect();
  const result = await client.query(`
    select
      count(*) filter (where table_schema = 'public')::int as public_tables,
      count(*) filter (
        where table_schema = 'public' and table_name = 'profiles'
      )::int as profiles_table
    from information_schema.tables
  `);
  console.log(`PUBLIC_TABLES=${result.rows[0].public_tables}`);
  console.log(`PROFILES_TABLE=${result.rows[0].profiles_table}`);
} catch (error) {
  console.log(`PG_UNREACHABLE=${error.message}`);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
