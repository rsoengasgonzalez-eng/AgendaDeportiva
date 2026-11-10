import { cp, mkdir, rm, copyFile, readdir } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

// Cloudflare Pages publishes dist/. Keep every browser asset at its root.
await copyFile('index.html', 'dist/index.html');
await copyFile('index.html', 'dist/404.html');
await copyFile('src/app.js', 'dist/app.js');
await copyFile('src/styles.css', 'dist/styles.css');
await cp('public', 'dist', { recursive: true });

// Also keep root-level assets working for dashboard/direct-upload previews.
await copyFile('src/app.js', 'app.js');
await copyFile('src/styles.css', 'styles.css');
for (const entry of await readdir('public', { withFileTypes: true })) {
  if (entry.isFile()) await copyFile(`public/${entry.name}`, entry.name);
}

console.log('✓ Cloudflare Pages build complete: dist/');
