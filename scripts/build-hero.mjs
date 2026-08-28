import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const partsDir = path.join(root, 'hero_asset_parts');
const outDir = path.join(root, 'public', 'media');
const outFile = path.join(outDir, 'hero-user.webp');
const EXPECTED_BYTES = 68302;
const EXPECTED_SHA256 = '80dcd5e3e1a3e248b8147f80b9c9ae56cfb26f29afcdf7102c4fd00949ee9e74';

const parts = fs.readdirSync(partsDir)
  .filter((name) => /^part-\d+\.txt$/.test(name))
  .sort();

if (parts.length !== 12) throw new Error(`Expected 12 hero chunks, found ${parts.length}`);

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
