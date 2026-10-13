import {readFile, lstat} from 'node:fs/promises';
import {join, dirname, resolve} from 'node:path';
import {createHash} from 'node:crypto';

const check=(ok,message)=>{if(!ok)throw new Error(message);};
const idPattern=/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const cmp=(a,b)=>a<b?-1:a>b?1:0;
const envelope=schema=>({schema,authority:'none',activation:'none',selection:{state:'review-required',basis:'explicit-metadata-navigation'}});
const brief=skill=>({id:skill.id,category:skill.category,summary:skill.summary,
  entrypoint:skill.entrypoint,entrypointSha256:skill.entrypointSha256,
  maturity:skill.maturity,taskTypes:[...skill.taskTypes],antiTriggers:[...skill.antiTriggers],
  related:[...skill.related],...(skill.specializes?{specializes:skill.specializes}:{})});

function checkCatalog(catalog){
  check(catalog?.schema==='eternities-godskills-catalog-v1'&&Array.isArray(catalog.skills),'Invalid catalog');
}

// Browsing organizes publisher metadata. It does not infer task intent or need.
export function browseCatalog(catalog,{category,limit,offset}={}){
  checkCatalog(catalog);
  const result=envelope('eternities-godskills-browse-v1');
  if(category!==undefined){
    check(typeof category==='string'&&idPattern.test(category),'Invalid category');
    limit??=5;offset??=0;
    check(Number.isInteger(limit)&&limit>=1&&limit<=20,'Limit must be an integer from 1 to 20');
    check(Number.isSafeInteger(offset)&&offset>=0,'Offset must be a nonnegative safe integer');
    const skills=catalog.skills.filter(skill=>skill.category===category).sort((a,b)=>cmp(a.id,b.id));
    check(skills.length>0,`Unknown category: ${category}`);
    check(offset<skills.length,'Offset is outside this category');
    const page=skills.slice(offset,offset+limit),nextOffset=offset+page.length<skills.length?offset+page.length:null;
    return {...result,category,skillCount:skills.length,offset,limit,nextOffset,skills:page.map(brief)};
  }
  check(limit===undefined&&offset===undefined,'Pagination requires a category');
  const counts=new Map();
  for(const skill of catalog.skills)counts.set(skill.category,(counts.get(skill.category)??0)+1);
  return {...result,skillCount:catalog.skills.length,categories:[...counts].sort(([a],[b])=>cmp(a,b)).map(([category,skillCount])=>({category,skillCount}))};
}

// The CLI supplies a freshly verified pack/catalog. Library callers must do
// the same. Recheck the selected bytes at read time; never take a caller path.
export async function inspectSkill(root,catalog,id){
  checkCatalog(catalog);
  check(typeof id==='string'&&idPattern.test(id),'Invalid skill ID');
  const skill=catalog.skills.find(item=>item.id===id);
  check(skill,`Unknown skill ID: ${id}`);
  check(skill.entrypoint===`skills/${id}/SKILL.md`&&/^[a-f0-9]{64}$/.test(skill.entrypointSha256),'Invalid skill entrypoint');
  const file=join(resolve(root),'skills',id,'SKILL.md');
  for(let current=file;;current=dirname(current)){
    const stat=await lstat(current);
    check(!stat.isSymbolicLink(), 'Linked inspection path rejected');
    if(current===file)check(stat.isFile(),'Skill entrypoint is not a regular file');
    if(dirname(current)===current)break;
  }
  const bytes=await readFile(file);
  check(createHash('sha256').update(bytes).digest('hex')===skill.entrypointSha256,'Skill entrypoint changed after validation');
  return {...envelope('eternities-godskills-inspection-v1'),skill:brief(skill),
    content:bytes.toString('utf8'),resources:skill.resources.map(resource=>({...resource})),
    guidance:'Read the complete entrypoint, check task fit, and open only needed references. Related IDs are suggestions; nothing is selected or activated.'};
}
