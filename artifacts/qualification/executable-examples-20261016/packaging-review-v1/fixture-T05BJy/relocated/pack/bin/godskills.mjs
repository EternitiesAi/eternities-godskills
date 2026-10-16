import fs from 'node:fs';
const manifest = new URL('../release.json', import.meta.url);
const release = JSON.parse(fs.readFileSync(manifest));
release.fixtureChanged = true;
fs.writeFileSync(manifest, JSON.stringify(release));
fs.writeFileSync(new URL('../added-during-run.txt', import.meta.url), 'fixture only');
console.log(JSON.stringify({ releaseId: release.releaseId, skillCount: 93 }));
