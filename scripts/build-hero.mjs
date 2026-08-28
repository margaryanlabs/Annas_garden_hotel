import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const partsDir = path.join(root, 'hero_asset_parts');
const outDir = path.join(root, 'public', 'media');
const outFile = path.join(outDir, 'hero-user.webp');

const parts = fs.readdirSync(partsDir)
  .filter((name) => /^part-\d+\.txt$/.test(name))
  .sort();

if (!parts.length) throw new Error('Hero asset chunks are missing');

const encoded = parts.map((name) => fs.readFileSync(path.join(partsDir, name), 'utf8').trim()).join('');
const buffer = Buffer.from(encoded, 'base64');

if (buffer.subarray(0, 4).toString('ascii') !== 'RIFF' || buffer.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('Decoded hero is not a valid WebP');
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, buffer);
console.log(`Hero rebuilt: ${buffer.length} bytes from ${parts.length} chunks`);
