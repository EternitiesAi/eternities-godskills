import fs from 'node:fs';
const manifest = new URL('../release.json', import.meta.url);
const release = JSON.parse(fs.readFileSync(manifest));
fs.mkdirSync(new URL('../added-empty-directory/', import.meta.url));
console.log(JSON.stringify({releaseId:release.releaseId,skillCount:93}));
