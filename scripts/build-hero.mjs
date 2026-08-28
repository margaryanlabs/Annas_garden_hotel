import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const partsDir = path.join(root, 'hero_asset_parts');
const outDir = path.join(root, 'public', 'media');
const outFile = path.join(outDir, 'hero-user.webp');
const EXPECTED_BYTES = 68302;
const EXPECTED_SHA256 = '80dcd5e3e1a3e248b8147f80b9c9ae56cfb26f29afcdf7102c4fd00949ee9e74';

const parts = [
  'part-01.txt','part-02.txt','part-03.txt','part-04.txt','part-05.txt','part-06.txt','part-07.txt','part-08.txt',
  'fix-09-00.txt','fix-09-01.txt','fix-09-02.txt','fix-09-03-00.txt','fix-09-03-01.txt','fix-09-03-02.txt','fix-09-03-03.txt',
  'part-10.txt','part-11.txt','part-12.txt',
];

for (const name of parts) {
  if (!fs.existsSync(path.join(partsDir, name))) throw new Error(`Hero chunk missing: ${name}`);
}

const encoded = parts.map((name) => fs.readFileSync(path.join(partsDir, name), 'utf8').trim()).join('');
const buffer = Buffer.from(encoded, 'base64');
const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

if (buffer.subarray(0, 4).toString('ascii') !== 'RIFF' || buffer.subarray(8, 12).toString('ascii') !== 'WEBP') {
  throw new Error('Decoded hero is not a valid WebP');
}
if (buffer.length !== EXPECTED_BYTES || sha256 !== EXPECTED_SHA256) {
  throw new Error(`Hero integrity check failed: ${buffer.length} bytes, sha256 ${sha256}`);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, buffer);
console.log(`Exact hero verified and rebuilt: ${buffer.length} bytes, sha256 ${sha256}`);
