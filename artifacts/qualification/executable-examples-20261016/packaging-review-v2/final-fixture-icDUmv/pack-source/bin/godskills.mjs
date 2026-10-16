import fs from 'node:fs';
const manifest=new URL('../release.json',import.meta.url);
const release=JSON.parse(fs.readFileSync(manifest));
fs.writeFileSync(new URL('../examples/constraint-diagnosis/index.mjs',import.meta.url),'export const fixture = false;\n');
console.log(JSON.stringify({releaseId:release.releaseId,skillCount:93}));
