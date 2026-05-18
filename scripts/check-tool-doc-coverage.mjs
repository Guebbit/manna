import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const toolsDir = path.join(repoRoot, 'packages', 'tools');
const docsToolsDir = path.join(repoRoot, 'docs', 'packages', 'tools');

const toolFiles = fs
    .readdirSync(toolsDir)
    .filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'));

const ids = new Set();
for (const file of toolFiles) {
    const fullPath = path.join(toolsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');

    for (const match of content.matchAll(/\bid\s*:\s*'([a-z_]+)'/g)) {
        ids.add(match[1]);
    }
    for (const match of content.matchAll(/\bname\s*:\s*'([a-z_]+)'/g)) {
        ids.add(match[1]);
    }
}

const ignored = new Set([
    'mydb_query' // sample ID from comments in base-db-tool docs
]);

const missing = [];
for (const id of [...ids].sort()) {
    if (ignored.has(id)) continue;
    const expectedFile = `${id.replaceAll('_', '-')}.md`;
    const expectedPath = path.join(docsToolsDir, expectedFile);
    if (!fs.existsSync(expectedPath)) {
        missing.push({ id, expectedFile });
    }
}

if (missing.length > 0) {
    console.error('Missing tool documentation pages:');
    for (const item of missing) {
        console.error(`- ${item.id} -> docs/packages/tools/${item.expectedFile}`);
    }
    process.exit(1);
}

console.log(`Tool docs coverage OK (${ids.size} tool IDs checked).`);
