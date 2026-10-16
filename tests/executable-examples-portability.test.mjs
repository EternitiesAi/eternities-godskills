import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, cp, mkdir, readFile, access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, dirname, resolve, relative, isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('../product/', import.meta.url));
const lanes=['constraint-diagnosis','onboarding-cohorts','animation-interruptions'];

// Exercises changed cwd and minimal environment, not filesystem access isolation.
// Independent source inspection separately checks the examples' dependency closure.
test('shipped examples execute and test from an unrelated directory with a minimal environment', async()=>{
  const isolated=await mkdtemp(join(tmpdir(),'godskills-executable-examples-'));
  const pack=join(isolated,'portable pack'), cwd=join(isolated,'unrelated cwd');
  await mkdir(cwd);
  await cp(join(root,'examples'),join(pack,'examples'),{recursive:true,errorOnExist:true});
  const env={PATH:'',...(process.platform==='win32'?{SystemRoot:process.env.SystemRoot}: {})};
  for(const lane of lanes){
    const base=join(pack,'examples',lane);
    const demo=spawnSync(process.execPath,[join(base,'demo.mjs')],{cwd,env,encoding:'utf8',timeout:15000,windowsHide:true});
    assert.equal(demo.status,0,`${lane} demo: ${demo.stderr}`);
    assert.equal(demo.stderr,'',`${lane} demo emits unexpected diagnostic`);
    const output=JSON.parse(demo.stdout);
    assert.ok(output && typeof output==='object',`${lane} demo has no structured result`);
    const tests=spawnSync(process.execPath,['--test',join(base,'index.test.mjs')],{cwd,env,encoding:'utf8',timeout:30000,windowsHide:true});
    assert.equal(tests.status,0,`${lane} tests: ${tests.stdout}\n${tests.stderr}`);
  }
});

// Catches missing or incorrect manifest bindings, not merely digest-shaped strings.
test('release manifest binds every public runnable example entrypoint',async()=>{
  const release=JSON.parse(await readFile(join(root,'release.json'),'utf8'));
  for(const lane of lanes)for(const file of ['index.mjs','index.test.mjs','demo.mjs','README.md']){
    const path=`examples/${lane}/${file}`;
    assert.match(release.files[path]??'',/^[a-f0-9]{64}$/,`${path} absent from content manifest`);
    assert.equal(createHash('sha256').update(await readFile(join(root,path))).digest('hex'),release.files[path],`${path} differs from manifest`);
  }
});

// Catches copy-paste links that work only in the development repository.
test('example guide and README links resolve within the standalone pack',async()=>{
  for(const file of ['examples/README.md',...lanes.map(x=>`examples/${x}/README.md`)]){
    const source=await readFile(join(root,file),'utf8');
    for(const match of source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){
      const href=match[1].split('#')[0];
      if(!href||/^https?:/.test(href))continue;
      const target=resolve(dirname(join(root,file)),href),rel=relative(root,target);
      assert.ok(!isAbsolute(rel)&&rel!=='..'&&!rel.startsWith('..\\')&&!rel.startsWith('../'),`${file}: escaping link ${href}`);
      await access(target);
    }
  }
});
