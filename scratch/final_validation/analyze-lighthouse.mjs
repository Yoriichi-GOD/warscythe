import fs from 'node:fs';
import path from 'node:path';

const [previousPath, currentPath, outputPath] = process.argv.slice(2);
if (!previousPath || !currentPath || !outputPath) {
  console.error('Usage: node analyze-lighthouse.mjs previous.json current.json output.json');
  process.exit(2);
}

const read = file => JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
const previous = read(previousPath);
const current = read(currentPath);

const numeric = (report, auditId) => report.audits?.[auditId]?.numericValue ?? null;
const score = report => report.categories?.performance?.score ?? null;
const resourceSummary = report => Object.fromEntries(
  (report.audits?.['resource-summary']?.details?.items || [])
    .map(item => [item.resourceType, {
      requestCount: item.requestCount,
      transferSize: item.transferSize,
    }])
);
const diagnostics = report => report.audits?.diagnostics?.details?.items?.[0] || {};
const opportunity = (report, auditId) => {
  const audit = report.audits?.[auditId] || {};
  return {
    score: audit.score,
    numericValue: audit.numericValue ?? null,
    numericUnit: audit.numericUnit ?? null,
    savingsMs: audit.details?.overallSavingsMs ?? null,
    savingsBytes: audit.details?.overallSavingsBytes ?? null,
    items: (audit.details?.items || []).slice(0, 12),
  };
};
const metric = (id, label, unit) => ({
  id,
  label,
  unit,
  previous: numeric(previous, id),
  current: numeric(current, id),
});

const result = {
  generatedAt: new Date().toISOString(),
  inputs: {
    previous: path.resolve(previousPath),
    current: path.resolve(currentPath),
    previousFetchTime: previous.fetchTime,
    currentFetchTime: current.fetchTime,
  },
  performanceScore: {
    previous: score(previous),
    current: score(current),
  },
  metrics: [
    metric('first-contentful-paint', 'First Contentful Paint', 'ms'),
    metric('largest-contentful-paint', 'Largest Contentful Paint', 'ms'),
    metric('speed-index', 'Speed Index', 'ms'),
    metric('total-blocking-time', 'Total Blocking Time', 'ms'),
    metric('cumulative-layout-shift', 'Cumulative Layout Shift', 'score'),
    metric('interactive', 'Time to Interactive', 'ms'),
  ],
  diagnostics: {
    previous: diagnostics(previous),
    current: diagnostics(current),
  },
  resources: {
    previous: resourceSummary(previous),
    current: resourceSummary(current),
  },
  lcpElement: {
    previous: previous.audits?.['largest-contentful-paint-element']?.details?.items || [],
    current: current.audits?.['largest-contentful-paint-element']?.details?.items || [],
  },
  networkDependencyTree: {
    previous: previous.audits?.['network-dependency-tree']?.details || null,
    current: current.audits?.['network-dependency-tree']?.details || null,
  },
  opportunities: Object.fromEntries([
    'render-blocking-resources',
    'unused-javascript',
    'unused-css-rules',
    'modern-image-formats',
    'uses-responsive-images',
    'uses-optimized-images',
    'offscreen-images',
    'unminified-javascript',
    'unminified-css',
    'uses-long-cache-ttl',
    'font-display',
    'third-party-summary',
    'mainthread-work-breakdown',
    'bootup-time',
  ].map(id => [id, {
    previous: opportunity(previous, id),
    current: opportunity(current, id),
  }])),
};

for (const entry of result.metrics) {
  entry.absoluteChange = entry.current == null || entry.previous == null
    ? null
    : entry.current - entry.previous;
  entry.percentageChange = entry.absoluteChange == null || entry.previous === 0
    ? null
    : (entry.absoluteChange / entry.previous) * 100;
}
result.performanceScore.absoluteChange =
  result.performanceScore.current - result.performanceScore.previous;
result.performanceScore.percentageChange =
  (result.performanceScore.absoluteChange / result.performanceScore.previous) * 100;

fs.writeFileSync(path.resolve(outputPath), JSON.stringify(result, null, 2));
console.log(`Wrote ${path.resolve(outputPath)}`);
