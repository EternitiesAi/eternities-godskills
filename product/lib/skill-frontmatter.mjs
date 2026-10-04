// Deliberately supports portable string metadata, not arbitrary YAML objects,
// tags or aliases. Unsupported forms fail rather than becoming discovery text.
function scalar(lines,index) {
  const value=lines[index].replace(/^[^:]+:[ \t]*/,'').trim();
  if(/^[>|][+-]?(?:\s+#.*)?$/.test(value)){
    const body=[];
    for(let n=index+1;n<lines.length;n++){
      if(lines[n].trim()&&!/^ +\S/.test(lines[n]))break;
      body.push(lines[n]);
    }
    const nonempty=body.filter(x=>x.trim());
    if(!nonempty.length)return null;
    const indent=/^ */.exec(nonempty[0])[0].length;
    if(nonempty.some(x=>/^ */.exec(x)[0].length<indent))return null;
    return body.map(x=>x.slice(indent)).join(value[0]==='>'?' ':'\n').trim();
  }
  const next=lines.slice(index+1).find(x=>x.trim()&&!/^\s*#/.test(x));
  if(next&&/^\s+\S/.test(next))return null;
  if(value.startsWith('"')){
    const quoted=/^("(?:\\.|[^"\\])*")(?:[ \t]+#.*)?$/.exec(value);
    if(!quoted)return null;
    try{return JSON.parse(quoted[1]);}catch{return null;}
  }
  if(value.startsWith("'")){
    const quoted=/^('(?:[^']|'')*')(?:[ \t]+#.*)?$/.exec(value);
    return quoted?quoted[1].slice(1,-1).replaceAll("''","'"):null;
  }
  const plain=value.replace(/[ \t]+#.*$/,'').trim();
  // Reject ambiguous non-string scalars across common host YAML schemas.
  // A numeric-led prose description remains fine; a scalar made only of a
  // number-like token is deliberately unsupported, including dates and times.
  if(!plain||/^[!&*\[\]{}>|#%@`]|^[-?:](?:\s|$)|:(?:\s|$)/u.test(plain)
    ||/^(?:null|true|false|yes|no|on|off|~|[-+]?(?:\d[\d_a-z.:+-]*|\.\d[\d_e+-]*|\.(?:inf|nan)))$/i.test(plain))return null;
  return plain;
}

export function inspectSkillFrontmatter(text,expectedId) {
  const header=/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if(!header)throw Error(`Invalid frontmatter: ${expectedId}`);
  const lines=header[1].split(/\r?\n/),result={};
  // Top-level keys use the supported bare-key subset. Quoted duplicates,
  // merges and unconsumed root content must not override inspected fields in
  // another loader. Indented optional metadata is not interpreted here.
  for(const line of lines){
    if(!line.trim()||/^\s*#/.test(line)||/^ +\S/.test(line))continue;
    if(!/^[A-Za-z][A-Za-z0-9_-]*[ \t]*:/.test(line))
      throw Error(`Unsupported frontmatter key syntax: ${expectedId}`);
  }
  for(const key of ['name','description']){
    const matches=lines.map((line,index)=>new RegExp(`^${key}[ \t]*:`).test(line)?index:-1).filter(index=>index>=0);
    if(matches.length!==1)throw Error(`Ambiguous or missing frontmatter ${key}: ${expectedId}`);
    const value=scalar(lines,matches[0]);
    if(typeof value!=='string'||!value.trim()||value.length>1000)
      throw Error(`Invalid frontmatter ${key}: ${expectedId}`);
    result[key]=value;
  }
  if(result.name!==expectedId)throw Error(`Frontmatter name mismatch: ${expectedId}`);
  return result;
}
