// Local Markdown relocation/link inspection, separate from runtime acceptance.
import {readFileSync, existsSync, statSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {resolve, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url)), root=resolve(here,'../../../..');
const base='c4e0fd244bf8b9fe5df3a33f22d076bd53b7812d';
const hash=b=>createHash('sha256').update(b).digest('hex');
const bound=new Map();
function read(path){const b=readFileSync(resolve(root,path));bound.set(path,hash(b));return b.toString('utf8').replace(/\r\n/g,'\n');}
const links=text=>[...text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map(m=>m[1]);
const external=path=>/^[a-z]+:/i.test(path)||path.startsWith('//');
const slug=heading=>heading.toLowerCase().replace(/<[^>]*>/g,'').replace(/[^\p{L}\p{N}_\-\s]/gu,'').replace(/ /g,'-');
const docs=['README.md','docs/history/README-before-cohesive-20261015.md','product/START-HERE.md','product/DISCOVERY.md'];
const results=docs.map(path=>{
 const text=read(path), observations=[];
 for(const link of links(text)){
  if(external(link))continue;
  const [file,fragment]=link.split('#');
  const absolute=file?resolve(root,dirname(path),decodeURIComponent(file)):resolve(root,path);
  const target=relative(root,absolute).replaceAll('\\','/');
  const present=existsSync(absolute);
  let anchor=null;
  if(present&&fragment&&statSync(absolute).isFile()&&target.endsWith('.md')){
   const headings=[...read(target).matchAll(/^#{1,6}\s+(.+)$/gm)].map(m=>slug(m[1].trim()));
   anchor=headings.includes(decodeURIComponent(fragment));
  }
  observations.push({link,target,present,anchor});
 }
 return {path,count:observations.length,issues:observations.filter(x=>!x.present||x.anchor===false),observations};
});
const old=execFileSync('git',['show',base+':README.md'],{cwd:root,windowsHide:true});
const historical=read(docs[1]);
const body=historical.slice(historical.indexOf('# Eternities Godskills'));
function normalized(text,path){
 return text.replace(/\r\n/g,'\n').replace(/(\[[^\]]*\]\()([^)]+)(\))/g,(_,start,link,end)=>{
  if(external(link))return start+link+end;
  const [file,fragment]=link.split('#');
  const target=file?relative(root,resolve(root,dirname(path),file)).replaceAll('\\','/'):path;
  return start+target+(fragment?'#'+fragment:'')+end;
 });
}
const archiveBodyPreserved=normalized(old.toString('utf8'),'README.md')===normalized(body,docs[1]);
const left=normalized(old.toString('utf8'),'README.md'),right=normalized(body,docs[1]);
let firstDifference=0;while(firstDifference<Math.min(left.length,right.length)&&left[firstDifference]===right[firstDifference])firstDifference++;
const difference=archiveBodyPreserved?null:{firstDifference,baselineLength:left.length,archiveLength:right.length,baselineContext:left.slice(Math.max(0,firstDifference-120),firstDifference+240),archiveContext:right.slice(Math.max(0,firstDifference-120),firstDifference+240)};
console.log(JSON.stringify({schema:'review-c-avicenna-docs-v1',base,baselineReadmeSha256:hash(old),
 archiveBodyPreserved,onlyTrailingWhitespaceDifference:left.trimEnd()===right.trimEnd(),difference,normalization:'CRLF to LF and resolving Markdown link destinations; added historical header excluded',
 sources:[...bound].map(([path,sha256])=>({path,sha256})),results,scope:'Local file existence and explicit heading anchors only; no network links or release ZIP contents checked.'}));

