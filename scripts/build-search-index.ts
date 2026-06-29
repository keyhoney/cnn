import { buildAllSearchIndexes } from '../lib/search-index-builder';

async function main() {
  const paths = await buildAllSearchIndexes();
  console.log(`Generated ${paths.length} search index file(s):`);
  for (const filePath of paths) {
    console.log(`  - ${filePath}`);
  }
}

main().catch((error) => {
  console.error('Failed to build search index:', error);
  process.exit(1);
});
