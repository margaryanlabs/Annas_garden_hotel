import fs from 'node:fs';
import path from 'node:path';

const pairs = [
  ['public/images/hero-final.webp.b64.txt', 'public/images/hero-final.webp'],
];

for (const [src, dest] of pairs) {
  if (!fs.existsSync(src)) continue;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const b64 = fs.readFileSync(src, 'utf8').trim();
  fs.writeFileSync(dest, Buffer.from(b64, 'base64'));
}
