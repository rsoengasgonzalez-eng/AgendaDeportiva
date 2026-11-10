import { cp, mkdir, rm, copyFile } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await copyFile('index.html','dist/index.html');
await copyFile('src/app.js','dist/app.js');
await copyFile('src/styles.css','dist/styles.css');
await cp('public','dist',{recursive:true});
console.log('✓ Build complete: dist/');
