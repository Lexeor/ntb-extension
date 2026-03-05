#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = resolve(root, 'dist');

if (!existsSync(distDir)) {
  console.error('dist/ not found — run `npm run build` first');
  process.exit(1);
}

const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
const output = resolve(root, `ntb-extension-${version}.zip`);

if (existsSync(output)) rmSync(output);

execSync(`zip -r "${output}" . --exclude "config.json"`, {
  cwd: distDir,
  stdio: 'inherit',
});

console.log(`\nPacked → ntb-extension-${version}.zip`);
