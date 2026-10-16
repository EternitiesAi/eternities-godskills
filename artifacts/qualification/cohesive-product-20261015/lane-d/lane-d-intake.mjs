import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const warehouse = 'D:/03-ARSENAL/warehouse';
const operation = `${warehouse}/_operations/godskills-expansion-20261015`;
const lane = 'C:/dev/eternities-godskills/.worktrees/quality-qualification-20261003/artifacts/qualification/cohesive-product-20261015/lane-d';
const digest = b => crypto.createHash('sha256').update(b).digest('hex');
function output(file, value) {
  const target = path.resolve(file);
  if (![operation,lane].some(root => target.startsWith(path.resolve(root)+path.sep))) throw Error('Write outside lane');
  fs.mkdirSync(path.dirname(target), {recursive:true});
  fs.writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value,null,2)+'\n');
}
function identity(remote='') {
  return remote.toLowerCase().replace(/^.*github\.com[:/]/,'').replace(/\.git$/,'').replace(/\/$/,'');
}
function git(cwd,args) {
  const r=spawnSync('git',['-c',`core.hooksPath=${operation}/empty-hooks`,'-c',`init.templateDir=${operation}/empty-template`,'-c','core.fsmonitor=false','-c','core.autocrlf=false','-c','filter.lfs.process=','-c','filter.lfs.smudge=','-c','filter.lfs.required=false',...args],{cwd,encoding:'utf8',timeout:120000,maxBuffer:20*1024*1024,env:{...process.env,GIT_LFS_SKIP_SMUDGE:'1',GIT_TERMINAL_PROMPT:'0',GIT_OPTIONAL_LOCKS:'0'}});
  return {status:r.status,stdout:r.stdout??'',stderr:r.stderr??'',error:r.error?.message??null};
}
const candidates = [
  ['AgentHouse-org/skills','business/sales'],
  ['cloutdesk/agents','business/creator matching'],
  ['ProkStudio/skills','design/games/3D'],
  ['ericzakariasson/skills','games/3D'],
  ['roble3/cc-blender-skill','3D modeling'],
  ['xiaomihu1992/econometrics-skill','science/data'],
  ['ai-analyst-lab/ai-analyst','science/data'],
  ['triggerdotdev/staff-engineering-skills','engineering/agents'],
  ['haowjy/creative-writing-skills','creative writing'],
  ['jtydhr88/screenwriting-skills','creative screenwriting'],
  ['coreyhaines31/marketingskills','existing business comparison'],
  ['K-Dense-AI/scientific-agent-skills','existing science comparison']
];
const mode=process.argv[2];
if(mode==='discover') {
  const indexPath=`${warehouse}/REPOSITORY-INDEX.json`, bytes=fs.readFileSync(indexPath), index=JSON.parse(bytes);
  const configs=[]; const roots=[]; const errors=[];
  let visited=0;
  function walk(dir,depth=0) {
    if(depth>3||visited>=1500) return;
    visited++;
    let entries; try {entries=fs.readdirSync(dir,{withFileTypes:true});} catch(e){errors.push({dir,error:e.message});return;}
    if(entries.some(e=>e.name==='.git')) {
      roots.push(dir);
      const p=path.join(dir,'.git','config');
      if(fs.existsSync(p)){const b=fs.readFileSync(p), m=b.toString().match(/\[remote "origin"\][\s\S]*?\n\s*url\s*=\s*([^\r\n]+)/); if(m)configs.push({path:dir,identity:identity(m[1].trim()),configSha256:digest(b)});}
      return;
    }
    for(const e of entries) if(e.isDirectory()&&!['node_modules','.git','empty-hooks','empty-template'].includes(e.name)) walk(path.join(dir,e.name),depth+1);
  }
  // Identity-keyed probes only. Historical extraction trees are deliberately not crawled.
  const operationDirs=fs.readdirSync(`${warehouse}/_operations`,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>`${warehouse}/_operations/${e.name}`);
  const probeParents=[`${warehouse}/from-stars`,`${warehouse}/catalog-c/agent-skills`,`${warehouse}/catalog-migration/agent-skills`,...operationDirs.flatMap(p=>[p,`${p}/stage`,`${p}/staged`,`${p}/clones`])];
  for(const [requested] of candidates) {
    const stem=requested.replace('/','__');
    for(const parent of probeParents) {
      const target=path.join(parent,stem), config=path.join(target,'.git','config');
      if(fs.existsSync(config)) walk(target,3);
    }
  }
  const results=[];
  for(const [requested,domain] of candidates) {
    const url=`https://api.github.com/repos/${requested}`;
    try {
      const response=await fetch(url,{signal:AbortSignal.timeout(15000),headers:{'User-Agent':'Godskills-bounded-inert-intake','Accept':'application/vnd.github+json'}}), raw=await response.text();
      output(`${operation}/metadata/${requested.replace('/','__')}.json`,raw);
      if(!response.ok){results.push({requested,domain,httpStatus:response.status,error:'metadata unavailable'});continue;}
      const r=JSON.parse(raw), names=[requested,r.full_name].map(identity);
      const hits=index.filter(x=>[x.id,x.full_name,x.canonicalGitHubFullName,x.remote].some(v=>v&&names.includes(identity(v))) || x.githubRepositoryId===r.id);
      const disk=configs.filter(x=>names.includes(x.identity));
      results.push({requested,domain,id:r.id,canonical:r.full_name,url:r.html_url,defaultBranch:r.default_branch,sizeKiB:r.size,license:r.license?.spdx_id??null,archived:r.archived,fork:r.fork,indexHits:hits.map(x=>({path:x.path,head:x.head,id:x.id})),diskHits:disk});
    } catch(e){results.push({requested,domain,error:e.message});}
  }
  output(`${operation}/discovery.json`,{observedAt:new Date().toISOString(),index:{path:indexPath,sha256:digest(bytes),count:index.length,shape:'top-level array',identityFields:['id','full_name','canonicalGitHubFullName','remote','githubRepositoryId'],locationFields:['path','relativePath','duplicatePaths']},diskInventory:{mode:'identity-keyed conventional-location probes',parents:probeParents.length,gitRoots:roots.length,originConfigs:configs.length,visited,completeWarehouseScan:false,errors},results});
  console.log(JSON.stringify(results.map(({requested,canonical,sizeKiB,license,indexHits,diskHits,error})=>({requested,canonical,sizeKiB,license,indexHits:indexHits?.length,diskHits:diskHits?.length,error})),null,2));
} else if(mode==='acquire') {
  const frozen=JSON.parse(fs.readFileSync(`${operation}/cohort.freeze.json`));
  fs.mkdirSync(`${operation}/empty-hooks`,{recursive:true}); fs.mkdirSync(`${operation}/empty-template`,{recursive:true}); fs.mkdirSync(`${operation}/stage`,{recursive:true});
  for(const entry of frozen.members) {
    const target=`${operation}/stage/${entry.canonical.replace('/','__')}`, receipt=`${operation}/receipts/${entry.canonical.replace('/','__')}.json`;
    if(fs.existsSync(receipt)||fs.existsSync(target)) throw Error(`No replay or uncertain clone retry: ${target}`);
    const result={canonical:entry.canonical,requestedOrigin:`https://github.com/${entry.canonical}.git`,target,startedAt:new Date().toISOString()};
    result.clone=git(operation,['clone','--depth','1','--single-branch','--no-tags','--no-recurse-submodules','--no-checkout',result.requestedOrigin,target]);
    output(receipt,result);
    if(result.clone.status!==0){console.log(`${entry.canonical}: CLONE FAILED (preserved)`);continue;}
    const tree=git(target,['ls-tree','-r','-l','HEAD']);
    const objects=tree.stdout.trim().split('\n').filter(Boolean).map(line=>{const m=line.match(/^(\d+) (\w+) ([a-f0-9]+)\s+(\d+|-)\t(.*)$/);if(!m)throw Error(`Cannot parse tree ${line}`);return {mode:m[1],type:m[2],oid:m[3],bytes:m[4]==='-'?0:Number(m[4]),path:m[5]};});
    result.tree={status:tree.status,sha256:digest(Buffer.from(tree.stdout)),files:objects.length,totalBlobBytes:objects.reduce((a,b)=>a+b.bytes,0),largest:objects.toSorted((a,b)=>b.bytes-a.bytes).slice(0,5),submodules:objects.filter(o=>o.type==='commit'),symlinks:objects.filter(o=>o.mode==='120000')};
    output(`${operation}/trees/${entry.canonical.replace('/','__')}.json`,objects);
    if(tree.status!==0||result.tree.totalBlobBytes>100*1024*1024||objects.some(o=>o.bytes>=10*1024*1024)||result.tree.symlinks.length){result.state='held-before-checkout';output(receipt,result);console.log(`${entry.canonical}: HELD`);continue;}
    result.checkout=git(target,['checkout','--detach','HEAD']);
    result.origin=git(target,['remote','get-url','origin']); result.head=git(target,['rev-parse','HEAD']); result.clean=git(target,['status','--porcelain=v1','--untracked-files=all']); result.shallow=git(target,['rev-parse','--is-shallow-repository']);
    result.state=result.checkout.status===0&&result.origin.stdout.trim()===result.requestedOrigin&&result.clean.status===0&&!result.clean.stdout&&result.shallow.stdout.trim()==='true'?'verified-stage':'verification-failed';
    result.finishedAt=new Date().toISOString(); output(receipt,result);
    console.log(`${entry.canonical}: ${result.state} ${result.head.stdout.trim()} ${result.tree.totalBlobBytes} bytes`);
  }
} else throw Error('Use discover or acquire');
