import fs from 'node:fs/promises'; export async function verifyProduct(root) { return JSON.parse(await fs.readFile(root+'/release.json','utf8')); }
