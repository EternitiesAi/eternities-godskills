import fs from 'node:fs';
const manifest=new URL('../release.json',import.meta.url);
const release=JSON.parse(fs.readFileSync(manifest));

console.log(JSON.stringify({releaseId:release.releaseId,skillCount:93}));
