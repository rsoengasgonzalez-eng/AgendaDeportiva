import { copyFile, cp, mkdir, rm } from 'node:fs/promises';
import { accessSync, constants } from 'node:fs';

for (const required of ['wrangler.jsonc', 'index.html', 'src/app.js', 'src/styles.css', 'public']) {
  accessSync(required, constants.R_OK);
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await copyFile('index.html', 'dist/index.html');
await copyFile('src/app.js', 'dist/app.js');
await copyFile('src/styles.css', 'dist/styles.css');
await cp('public', 'dist', { recursive: true });

console.log('✓ dist created for Cloudflare Workers Static Assets');
