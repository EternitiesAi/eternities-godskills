import {createHash} from 'node:crypto';
import {readFile, writeFile, lstat} from 'node:fs/promises';
import {resolve, relative, dirname, join, isAbsolute, sep} from 'node:path';
import {isDeepStrictEqual} from 'node:util';
import {verifyProduct} from './product.mjs';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const check=(condition,message)=>{if(!condition)throw new Error(message);};
const crcTable=Array.from({length:256},(_,n)=>{
  for(let bit=0;bit<8;bit++)n=n&1?0xedb88320^(n>>>1):n>>>1;
  return n>>>0;
});
function crc32(bytes){
  let value=0xffffffff;
  for(const byte of bytes)value=crcTable[(value^byte)&255]^(value>>>8);
  return (value^0xffffffff)>>>0;
}
async function noLinks(path){
  for(let current=resolve(path);;current=dirname(current)){
    try{check(!(await lstat(current)).isSymbolicLink(),'Linked archive output path rejected');}
    catch(error){if(error.code!=='ENOENT')throw error;}
    if(dirname(current)===current)break;
  }
}

// Format reference: https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
// ZIP32, stored entries, UTF-8 names and a fixed 1980 timestamp. No self-extraction
// code, compression dependency, checkout path or wall-clock value is added.
function zip(entries){
  check(entries.length<=65535,'Too many files for ZIP32');
  const local=[],central=[];let offset=0;
  for(const [path,bytes] of entries){
    const name=Buffer.from('godskills/'+path,'utf8'),crc=crc32(bytes);
    check(name.length<=65535&&bytes.length<=0xffffffff,'File exceeds ZIP32 limits');
    const header=Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50);header.writeUInt16LE(20,4);
    header.writeUInt16LE(0x800,6);header.writeUInt16LE(0x21,12);
    header.writeUInt32LE(crc,14);header.writeUInt32LE(bytes.length,18);
    header.writeUInt32LE(bytes.length,22);header.writeUInt16LE(name.length,26);
    const record=Buffer.alloc(46);
    record.writeUInt32LE(0x02014b50);record.writeUInt16LE(0x314,4);
    record.writeUInt16LE(20,6);record.writeUInt16LE(0x800,8);
    record.writeUInt16LE(0x21,14);record.writeUInt32LE(crc,16);
    record.writeUInt32LE(bytes.length,20);record.writeUInt32LE(bytes.length,24);
    record.writeUInt16LE(name.length,28);
    record.writeUInt32LE((0o100644<<16)>>>0,38);record.writeUInt32LE(offset,42);
    local.push(header,name,bytes);central.push(record,name);
    offset+=header.length+name.length+bytes.length;
    check(offset<=0xffffffff,'Archive exceeds ZIP32 limits');
  }
  const directory=Buffer.concat(central),end=Buffer.alloc(22);
  check(directory.length+offset+22<=0xffffffff,'Archive exceeds ZIP32 limits');
  end.writeUInt32LE(0x06054b50);end.writeUInt16LE(entries.length,8);
  end.writeUInt16LE(entries.length,10);end.writeUInt32LE(directory.length,12);
  end.writeUInt32LE(offset,16);
  return Buffer.concat([...local,directory,end]);
}

export async function exportProduct(pack,output){
  check(typeof output==='string'&&isAbsolute(output),'Archive output must be an absolute path');
  pack=resolve(pack);output=resolve(output);
  const rel=relative(pack,output);
  check(rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel),'Archive output must be outside the source pack');
  await noLinks(output);
  check((await lstat(dirname(output))).isDirectory(),'Archive parent must be an existing directory');
  const release=await verifyProduct(pack),entries=[];
  for(const path of [...Object.keys(release.files),'release.json'].sort()){
    const bytes=await readFile(join(pack,path));
    if(path==='release.json'){
      let captured;
      try{captured=JSON.parse(bytes.toString('utf8'));}
      catch{throw new Error('Captured release manifest changed during export');}
      check(isDeepStrictEqual(captured,release),'Captured release manifest changed during export');
    }else check(hash(bytes)===release.files[path],'Source changed during export');
    entries.push([path,bytes]);
  }
  const after=await verifyProduct(pack);
  check(isDeepStrictEqual(after,release),'Source release manifest changed during export');
  const bytes=zip(entries);
  await writeFile(output,bytes,{flag:'wx'});
  return {schema:'eternities-godskills-export-v1',status:'exported',releaseId:release.releaseId,
    skillCount:release.skillCount,fileCount:entries.length,archiveSha256:hash(bytes),
    archiveBytes:bytes.length,output,format:'zip32-stored-v1'};
}
