import fs from 'node:fs';
const manifest = new URL('../release.json', import.meta.url);
const release = JSON.parse(fs.readFileSync(manifest));
release.fixtureChanged = true; fs.writeFileSync(manifest, JSON.stringify(release));
console.log(JSON.stringify({releaseId:release.releaseId,skillCount:93}));
