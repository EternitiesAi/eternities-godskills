import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, cp, readFile, writeFile, readdir, symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {buildProduct} from '../product/lib/product.mjs';

async function fixture() {
  const root=await mkdtemp(join(tmpdir(),'godskills-export-'));
  const pack=join(root,'pack');
  await cp(resolve('product'),pack,{recursive:true});
  await buildProduct(pack);
  return {root,pack};
}
function cli(pack,output) {
  return spawnSync(process.execPath,[join(pack,'bin/godskills.mjs'),'export','--output',output],{encoding:'utf8',env:{SystemRoot:process.env.SystemRoot??'',PATH:''}});
}
// Read the standard ZIP stored-entry wire format independently of the exporter.
function entries(bytes) {
  const result=new Map();let offset=0;
  while(bytes.readUInt32LE(offset)===0x04034b50){
    assert.equal(bytes.readUInt16LE(offset+8),0,'archive must use stored files');
    const size=bytes.readUInt32LE(offset+18),nameSize=bytes.readUInt16LE(offset+26),extraSize=bytes.readUInt16LE(offset+28);
    const name=bytes.subarray(offset+30,offset+30+nameSize).toString('utf8');
    const start=offset+30+nameSize+extraSize;
    assert.ok(!result.has(name),'duplicate ZIP entry');
    result.set(name,bytes.subarray(start,start+size));offset=start+size;
  }
  assert.equal(bytes.readUInt32LE(offset),0x02014b50,'central directory missing');
  assert.equal(bytes.readUInt32LE(bytes.length-22),0x06054b50,'end record missing');
  assert.equal(bytes.readUInt16LE(bytes.length-12),result.size);
  return result;
}

test('export produces the exact standalone pack and a verifiable archive receipt',async()=>{
  const {root,pack}=await fixture();const output=join(root,'godskills.zip');
  const run=cli(pack,output);assert.equal(run.status,0,run.stderr);
  const receipt=JSON.parse(run.stdout), bytes=await readFile(output), unpacked=entries(bytes);
  const release=JSON.parse(await readFile(join(pack,'release.json'),'utf8'));
  assert.equal(receipt.status,'exported');assert.equal(receipt.releaseId,release.releaseId);
  assert.equal(receipt.archiveSha256,createHash('sha256').update(bytes).digest('hex'));
  assert.equal(receipt.fileCount,Object.keys(release.files).length+1);
  assert.deepEqual([...unpacked.keys()],[...Object.keys(release.files),'release.json'].sort().map(x=>'godskills/'+x));
  for(const [name,content] of unpacked)assert.deepEqual(content,await readFile(join(pack,name.slice(10))));
  assert.ok(unpacked.has('godskills/INDEX.md'));assert.ok(unpacked.has('godskills/bin/godskills.mjs'));
});

test('export is byte reproducible across locations and does not overwrite files',async()=>{
  const {root,pack}=await fixture(),other=join(root,'elsewhere');await cp(pack,other,{recursive:true});
  const a=join(root,'a.zip'),b=join(root,'b.zip');
  assert.equal(cli(pack,a).status,0);assert.equal(cli(other,b).status,0);
  assert.deepEqual(await readFile(a),await readFile(b));
  const before=await readFile(a),again=cli(pack,a);assert.notEqual(again.status,0);
  assert.deepEqual(await readFile(a),before);
});

test('export rejects a modified pack before writing any archive',async()=>{
  const {root,pack}=await fixture();await writeFile(join(pack,'README.md'),'modified');
  const output=join(root,'bad.zip'),run=cli(pack,output);assert.notEqual(run.status,0);
  assert.match(run.stderr,/digest|changed/i);assert.ok(!(await readdir(root)).includes('bad.zip'));
});

test('export refuses source-contained, relative and linked output paths',async()=>{
  const {root,pack}=await fixture();
  const contained=cli(pack,join(pack,'self.zip'));assert.notEqual(contained.status,0);assert.match(contained.stderr,/outside/i);
  const relative=cli(pack,'relative.zip');assert.notEqual(relative.status,0);assert.match(relative.stderr,/absolute/i);
  const linked=join(root,'linked');await symlink(pack,linked,process.platform==='win32'?'junction':'dir');
  const redirected=cli(pack,join(linked,'redirected.zip'));assert.notEqual(redirected.status,0);assert.match(redirected.stderr,/link/i);
  assert.ok(!(await readdir(pack)).some(x=>x.endsWith('.zip')));
});

test('a source-contained name beginning with two dots is not a parent path',async()=>{
  const {pack}=await fixture(),run=cli(pack,join(pack,'..archive.zip'));
  assert.notEqual(run.status,0);assert.match(run.stderr,/outside/i);
  assert.ok(!(await readdir(pack)).includes('..archive.zip'));
});

test('export refuses manifest bytes changed during capture even when the source is restored',async()=>{
  for(const [field,value] of [['skillCount',0],['schema','invalid-schema'],['files',{}],['releaseId','0'.repeat(64)]]){
    const {root,pack}=await fixture(),target=join(pack,'release.json');
    const original=await readFile(target,'utf8'),changed=JSON.parse(original);
    changed[field]=value;
    const hook=join(root,'interleave.mjs');
    await writeFile(hook,`import fs from 'node:fs/promises';
import {syncBuiltinESMExports} from 'node:module';
const originalRead=fs.readFile;
const target=${JSON.stringify(target)}, good=${JSON.stringify(original)}, bad=${JSON.stringify(JSON.stringify(changed))};
let manifestReads=0;
fs.readFile=async function(path,...args){
  // The validator reads release.json then inventories it. The third read is
  // the exporter capturing the manifest into its assembled archive.
  if(String(path)===target&&++manifestReads===3){
    await fs.writeFile(target,bad);
    try{return await originalRead.call(this,path,...args);}
    finally{await fs.writeFile(target,good);}
  }
  return originalRead.call(this,path,...args);
};
syncBuiltinESMExports();
`);
    const output=join(root,'interleaved.zip');
    const run=spawnSync(process.execPath,['--import',pathToFileURL(hook).href,join(pack,'bin/godskills.mjs'),'export','--output',output],{encoding:'utf8'});
    if(run.status===0){
      const captured=JSON.parse(entries(await readFile(output)).get('godskills/release.json').toString('utf8'));
      assert.deepEqual(captured[field],value,'interleaving must reach the archived manifest');
    }
    assert.notEqual(run.status,0,field+' tampering must be refused');
    assert.match(run.stderr,/manifest.*changed|changed.*manifest/i);
    assert.ok(!(await readdir(root)).includes('interleaved.zip'));
    assert.equal(await readFile(target,'utf8'),original,'fixture must restore source bytes');
  }
});
