import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, 'docs');

function listMarkdownFiles(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.')) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...listMarkdownFiles(full));
        else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
    }
    return out;
}

function extractLinks(content) {
    const links = [];
    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
        links.push(match[1].trim());
    }
    return links;
}

function sanitize(link) {
    return link.split('#')[0].split('?')[0].trim();
}

function resolveDocTarget(sourceFile, link) {
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:')) {
        return null;
    }

    const cleaned = sanitize(link);
    if (!cleaned) return null;

    if (cleaned.startsWith('/')) {
        const withoutSlash = cleaned.slice(1);
        if (withoutSlash.endsWith('.md')) return path.join(docsRoot, withoutSlash);

        const directMd = path.join(docsRoot, `${withoutSlash}.md`);
        const indexMd = path.join(docsRoot, withoutSlash, 'index.md');
        if (fs.existsSync(directMd)) return directMd;
        return indexMd;
    }

    const sourceDir = path.dirname(sourceFile);
    const absolute = path.resolve(sourceDir, cleaned);

    if (cleaned.endsWith('.md')) return absolute;

    const asMd = `${absolute}.md`;
    if (fs.existsSync(asMd)) return asMd;
    return path.join(absolute, 'index.md');
}

const markdownFiles = listMarkdownFiles(docsRoot);
const errors = [];

for (const file of markdownFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const links = extractLinks(content);

    for (const link of links) {
        const target = resolveDocTarget(file, link);
        if (!target) continue;
        if (!fs.existsSync(target)) {
            errors.push(`${path.relative(repoRoot, file)} -> ${link} (missing: ${path.relative(repoRoot, target)})`);
        }
    }
}

if (errors.length > 0) {
    console.error('Broken documentation links found:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
}

console.log(`Documentation links OK (${markdownFiles.length} markdown files checked).`);
