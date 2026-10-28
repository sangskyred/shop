import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const extensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.mdx']);
const skippedDirectories = new Set(['node_modules', '.next', '.git']);
const checkOnly = process.argv.includes('--check');
const changedFiles = [];

const walk = (directory) => {
	for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
		if (entry.isDirectory() && skippedDirectories.has(entry.name)) {
			continue;
		}

		const filePath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			walk(filePath);
			continue;
		}

		if (!entry.isFile() || !extensions.has(path.extname(entry.name))) {
			continue;
		}

		const source = readFileSync(filePath, 'utf8');
		const normalized = source.normalize('NFC');
		if (source === normalized) {
			continue;
		}

		changedFiles.push(path.relative(root, filePath).split(path.sep).join('/'));
		if (!checkOnly) {
			writeFileSync(filePath, normalized, 'utf8');
		}
	}
};

walk(root);

for (const file of changedFiles) {
	console.log(`${checkOnly ? 'not NFC' : 'normalized'}: ${file}`);
}

if (checkOnly && changedFiles.length > 0) {
	console.error(`Found ${changedFiles.length} file(s) with non-NFC text.`);
	process.exitCode = 1;
} else if (!checkOnly) {
	console.log(`NFC normalization complete. ${changedFiles.length} file(s) updated.`);
} else {
	console.log('NFC check passed.');
}
